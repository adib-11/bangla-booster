-- Create messenger_connections table for Facebook Page integrations
-- This table stores the connection between business owners and their Facebook Pages

CREATE TABLE public.messenger_connections (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  page_id TEXT NOT NULL UNIQUE,
  page_name TEXT NOT NULL,
  page_access_token TEXT NOT NULL,
  connected_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  is_active BOOLEAN NOT NULL DEFAULT true,
  
  -- Ensure one owner can only have one active connection at a time
  CONSTRAINT unique_active_connection_per_owner UNIQUE (owner_id, is_active)
);

-- Create index for faster lookups by page_id (used by webhook)
CREATE INDEX idx_messenger_connections_page_id ON public.messenger_connections(page_id) WHERE is_active = true;

-- Create index for faster lookups by owner_id
CREATE INDEX idx_messenger_connections_owner_id ON public.messenger_connections(owner_id) WHERE is_active = true;

-- Enable Row Level Security
ALTER TABLE public.messenger_connections ENABLE ROW LEVEL SECURITY;

-- RLS Policies for messenger_connections
-- Owners can view their own connections
CREATE POLICY "Owners can view their own messenger connections"
  ON public.messenger_connections FOR SELECT
  USING (auth.uid() = owner_id);

-- Owners can insert their own connections
CREATE POLICY "Owners can insert their own messenger connection"
  ON public.messenger_connections FOR INSERT
  WITH CHECK (auth.uid() = owner_id);

-- Owners can update their own connections
CREATE POLICY "Owners can update their own messenger connection"
  ON public.messenger_connections FOR UPDATE
  USING (auth.uid() = owner_id);

-- Owners can delete their own connections
CREATE POLICY "Owners can delete their own messenger connection"
  ON public.messenger_connections FOR DELETE
  USING (auth.uid() = owner_id);

-- Service role can read all connections (for webhook processing)
CREATE POLICY "Service role can read all messenger connections"
  ON public.messenger_connections FOR SELECT
  TO service_role
  USING (true);

-- Create trigger for updated_at timestamp
CREATE TRIGGER update_messenger_connections_updated_at
  BEFORE UPDATE ON public.messenger_connections
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to get owner_id from page_id (useful for webhook)
CREATE OR REPLACE FUNCTION public.get_owner_by_page_id(fb_page_id TEXT)
RETURNS UUID AS $$
DECLARE
  owner_uuid UUID;
BEGIN
  SELECT owner_id INTO owner_uuid
  FROM public.messenger_connections
  WHERE page_id = fb_page_id AND is_active = true
  LIMIT 1;
  
  RETURN owner_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create function to deactivate old connections when adding a new one
CREATE OR REPLACE FUNCTION public.deactivate_old_messenger_connections()
RETURNS TRIGGER AS $$
BEGIN
  -- Deactivate all other connections for this owner
  UPDATE public.messenger_connections
  SET is_active = false, updated_at = now()
  WHERE owner_id = NEW.owner_id 
    AND id != NEW.id 
    AND is_active = true;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger to auto-deactivate old connections
CREATE TRIGGER deactivate_old_connections_on_insert
  AFTER INSERT ON public.messenger_connections
  FOR EACH ROW
  WHEN (NEW.is_active = true)
  EXECUTE FUNCTION public.deactivate_old_messenger_connections();

-- Add helpful comment
COMMENT ON TABLE public.messenger_connections IS 'Stores Facebook Messenger page connections for AI chatbot integration';
COMMENT ON COLUMN public.messenger_connections.page_access_token IS 'Encrypted Facebook Page Access Token - handle with care';
