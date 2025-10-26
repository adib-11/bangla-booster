-- Drop messenger_integrations table and related policies
-- This migration removes all chatbot/messenger integration functionality

-- Drop RLS policies first
DROP POLICY IF EXISTS "Owners can view their own integration" ON public.messenger_integrations;
DROP POLICY IF EXISTS "Owners can insert their own integration" ON public.messenger_integrations;
DROP POLICY IF EXISTS "Owners can update their own integration" ON public.messenger_integrations;

-- Drop the table
DROP TABLE IF EXISTS public.messenger_integrations;
