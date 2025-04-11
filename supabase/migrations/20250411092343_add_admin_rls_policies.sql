-- Create RLS policies for admins table

-- Allow anyone to view admin entries (you might want to restrict this)
CREATE POLICY admins_select_policy ON admins
    FOR SELECT
    USING (true);

-- Only existing admins can add new admins
CREATE POLICY admins_insert_policy ON admins
    FOR INSERT
    WITH CHECK (
        auth.uid() IN (SELECT id FROM admins)
    );

-- Admins can update their own records or other admins' records
CREATE POLICY admins_update_policy ON admins
    FOR UPDATE
    USING (
        auth.uid() IN (SELECT id FROM admins) OR auth.uid() = id
    );

-- Only admins can delete admin records
CREATE POLICY admins_delete_policy ON admins
    FOR DELETE
    USING (
        auth.uid() IN (SELECT id FROM admins)
    );