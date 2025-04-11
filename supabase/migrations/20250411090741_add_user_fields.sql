-- Add additional fields to admins table if needed
ALTER TABLE admins 
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS email TEXT UNIQUE;

-- Create users table to store regular user information 
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    email TEXT UNIQUE,
    phone TEXT,
    preferred_language TEXT DEFAULT 'en',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY users_select_policy ON users
    FOR SELECT
    USING (
        auth.uid() = id OR 
        auth.uid() IN (SELECT id FROM admins)
    );

CREATE POLICY users_insert_policy ON users
    FOR INSERT
    WITH CHECK (
        auth.uid() = id OR 
        auth.uid() IN (SELECT id FROM admins)
    );

CREATE POLICY users_update_policy ON users
    FOR UPDATE
    USING (
        auth.uid() = id OR 
        auth.uid() IN (SELECT id FROM admins)
    );

CREATE POLICY users_delete_policy ON users
    FOR DELETE
    USING (
        auth.uid() = id OR 
        auth.uid() IN (SELECT id FROM admins)
    );