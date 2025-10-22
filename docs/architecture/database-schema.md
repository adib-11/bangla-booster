# Database Schema

```sql
-- Enable UUID extension if not already enabled (common in Supabase)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table for Business Owners
CREATE TABLE owners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    hashed_password TEXT NOT NULL, -- Ensure proper hashing is used by auth library
    business_name TEXT NOT NULL,
    subdomain TEXT UNIQUE NOT NULL,
    facebook_page_id TEXT, -- Store Page ID for linking
    -- Store encrypted token securely; consider a separate secrets manager long-term
    encrypted_facebook_page_token TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Table for Products listed by Owners
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    owner_id UUID NOT NULL REFERENCES owners(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    -- Using TEXT for price based on previous discussion, add CHECK constraint for validation
    price TEXT NOT NULL CHECK (price ~ '^\d+(\.\d{1,2})?$'), -- Simple check for positive number/decimal
    image_url TEXT NOT NULL, -- URL provided by Image Storage service
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for performance
CREATE INDEX idx_owners_subdomain ON owners(subdomain);
CREATE INDEX idx_products_owner_id ON products(owner_id);
CREATE INDEX idx_products_title ON products(title); -- For title search (Story 1.7)

-- Optional: Trigger function to update 'updated_at' timestamps automatically
CREATE OR REPLACE FUNCTION trigger_set_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_timestamp_owners
BEFORE UPDATE ON owners
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

CREATE TRIGGER set_timestamp_products
BEFORE UPDATE ON products
FOR EACH ROW
EXECUTE FUNCTION trigger_set_timestamp();

```

-----
