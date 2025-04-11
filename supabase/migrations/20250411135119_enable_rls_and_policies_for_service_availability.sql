-- Make sure RLS is enabled on service_availability
ALTER TABLE service_availability ENABLE ROW LEVEL SECURITY;

-- Allow all users to view service_availability
CREATE POLICY service_availability_select_policy ON service_availability
    FOR SELECT
    USING (true);

-- Allow only admins to create service_availability
CREATE POLICY service_availability_insert_policy ON service_availability
    FOR INSERT
    WITH CHECK (
        auth.uid() IN (SELECT id FROM admins)
    );

-- Allow only admins to update service_availability
CREATE POLICY service_availability_update_policy ON service_availability
    FOR UPDATE
    USING (
        auth.uid() IN (SELECT id FROM admins)
    );

-- Allow only admins to delete service_availability
CREATE POLICY service_availability_delete_policy ON service_availability
    FOR DELETE
    USING (
        auth.uid() IN (SELECT id FROM admins)
    );