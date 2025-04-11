-- Drop the existing permissive policy
DROP POLICY IF EXISTS admins_select_policy ON admins;

-- Create a stricter select policy (only authenticated users can query)
CREATE POLICY admins_select_policy ON admins
    FOR SELECT
    USING (auth.role() = 'authenticated');

-- Add policies for other operations if they don't exist
-- Only existing admins can insert new admins
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'admins' AND cmd = 'INSERT') THEN
        CREATE POLICY admins_insert_policy ON admins
            FOR INSERT
            WITH CHECK (
                auth.uid() IN (SELECT id FROM admins)
            );
    END IF;
END $$;

-- Admins can only update their own records or other admins
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'admins' AND cmd = 'UPDATE') THEN
        CREATE POLICY admins_update_policy ON admins
            FOR UPDATE
            USING (
                auth.uid() IN (SELECT id FROM admins) OR auth.uid() = id
            );
    END IF;
END $$;

-- Only admins can delete admin records
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'admins' AND cmd = 'DELETE') THEN
        CREATE POLICY admins_delete_policy ON admins
            FOR DELETE
            USING (
                auth.uid() IN (SELECT id FROM admins)
            );
    END IF;
END $$;