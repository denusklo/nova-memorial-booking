-- Table for storing Google OAuth tokens
CREATE TABLE user_google_tokens (
  user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  access_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  expiry_date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security on user_google_tokens
ALTER TABLE user_google_tokens ENABLE ROW LEVEL SECURITY;

-- Allow users to view only their own tokens
CREATE POLICY user_google_tokens_select_policy ON user_google_tokens
    FOR SELECT
    USING (auth.uid() = user_id);

-- Allow users to insert only their own tokens
CREATE POLICY user_google_tokens_insert_policy ON user_google_tokens
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Allow users to update only their own tokens
CREATE POLICY user_google_tokens_update_policy ON user_google_tokens
    FOR UPDATE
    USING (auth.uid() = user_id);

-- Allow users to delete only their own tokens
CREATE POLICY user_google_tokens_delete_policy ON user_google_tokens
    FOR DELETE
    USING (auth.uid() = user_id);

-- Optionally: Grant admin access to all tokens
-- Uncomment if you need admin access to all tokens

CREATE POLICY user_google_tokens_admin_select_policy ON user_google_tokens
    FOR SELECT
    USING (auth.uid() IN (SELECT id FROM admins));

CREATE POLICY user_google_tokens_admin_insert_policy ON user_google_tokens
    FOR INSERT
    WITH CHECK (auth.uid() IN (SELECT id FROM admins));

CREATE POLICY user_google_tokens_admin_update_policy ON user_google_tokens
    FOR UPDATE
    USING (auth.uid() IN (SELECT id FROM admins));

CREATE POLICY user_google_tokens_admin_delete_policy ON user_google_tokens
    FOR DELETE
    USING (auth.uid() IN (SELECT id FROM admins));
