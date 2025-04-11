-- Create extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable Row Level Security
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create services table
CREATE TABLE IF NOT EXISTS services (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    duration INTEGER NOT NULL, -- Duration in minutes
    price DECIMAL(10, 2) NOT NULL,
    image_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    service_id UUID REFERENCES services(id) ON DELETE SET NULL,
    booking_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending', -- pending, confirmed, cancelled, completed
    google_calendar_event_id TEXT,
    guest_name TEXT, -- For non-authenticated users
    guest_email TEXT, -- For non-authenticated users
    guest_phone TEXT, -- For non-authenticated users
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create admin table to hold admin-specific information
CREATE TABLE IF NOT EXISTS admins (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create assets table for file management
CREATE TABLE IF NOT EXISTS assets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    filename TEXT NOT NULL,
    path TEXT NOT NULL,
    size INTEGER NOT NULL,
    mime_type TEXT NOT NULL,
    uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create service availability table
CREATE TABLE IF NOT EXISTS service_availability (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    service_id UUID REFERENCES services(id) ON DELETE CASCADE,
    day_of_week INTEGER NOT NULL, -- 0 = Sunday, 1 = Monday, etc.
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    max_bookings INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(service_id, day_of_week)
);

-- Create Row Level Security policies
-- Bookings: Allow users to view their own bookings
CREATE POLICY bookings_select_policy ON bookings
    FOR SELECT
    USING (
        auth.uid() = user_id OR 
        auth.uid() IN (SELECT id FROM admins)
    );

-- Bookings: Allow users to insert their own bookings
CREATE POLICY bookings_insert_policy ON bookings
    FOR INSERT
    WITH CHECK (
        auth.uid() = user_id OR 
        auth.uid() IN (SELECT id FROM admins) OR
        (guest_name IS NOT NULL AND guest_email IS NOT NULL)
    );

-- Bookings: Allow users to update their own bookings
CREATE POLICY bookings_update_policy ON bookings
    FOR UPDATE
    USING (
        auth.uid() = user_id OR 
        auth.uid() IN (SELECT id FROM admins)
    );

-- Bookings: Allow users to delete their own bookings
CREATE POLICY bookings_delete_policy ON bookings
    FOR DELETE
    USING (
        auth.uid() = user_id OR 
        auth.uid() IN (SELECT id FROM admins)
    );

-- Services: Anyone can view services
CREATE POLICY services_select_policy ON services
    FOR SELECT
    USING (true);

-- Services: Only admins can modify services
CREATE POLICY services_insert_policy ON services
    FOR INSERT
    WITH CHECK (
        auth.uid() IN (SELECT id FROM admins)
    );

CREATE POLICY services_update_policy ON services
    FOR UPDATE
    USING (
        auth.uid() IN (SELECT id FROM admins)
    );

CREATE POLICY services_delete_policy ON services
    FOR DELETE
    USING (
        auth.uid() IN (SELECT id FROM admins)
    );

-- Assets: Only admins can view and manage assets
CREATE POLICY assets_select_policy ON assets
    FOR SELECT
    USING (
        auth.uid() IN (SELECT id FROM admins)
    );

CREATE POLICY assets_insert_policy ON assets
    FOR INSERT
    WITH CHECK (
        auth.uid() IN (SELECT id FROM admins)
    );

CREATE POLICY assets_update_policy ON assets
    FOR UPDATE
    USING (
        auth.uid() IN (SELECT id FROM admins)
    );

CREATE POLICY assets_delete_policy ON assets
    FOR DELETE
    USING (
        auth.uid() IN (SELECT id FROM admins)
    );

-- Enable RLS on all tables
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE admins ENABLE ROW LEVEL SECURITY;
ALTER TABLE assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE service_availability ENABLE ROW LEVEL SECURITY;

-- Insert some sample services
INSERT INTO services (name, description, duration, price, image_url) VALUES
('传统祭拜仪式', '传统的中式祭拜仪式，包括全套礼仪和祭品', 60, 1200.00, '/images/placeholder-memorial.jpg'),
('追思纪念会', '为逝者举办的追思纪念会，可容纳多达50人', 120, 3000.00, '/images/placeholder-hall.jpg'),
('七日祭', '传统七日祭仪式，包含所有仪式环节', 90, 2200.00, '/images/lotus.jpg');

-- Insert service availability for each service
-- Service 1: Available Monday-Friday 9 AM to 5 PM
INSERT INTO service_availability (service_id, day_of_week, start_time, end_time, max_bookings) 
SELECT id, day, '09:00:00', '17:00:00', 3
FROM services, unnest(ARRAY[1,2,3,4,5]) AS day
WHERE name = '传统祭拜仪式';

-- Service 2: Available all week 10 AM to 6 PM
INSERT INTO service_availability (service_id, day_of_week, start_time, end_time, max_bookings) 
SELECT id, day, '10:00:00', '18:00:00', 1
FROM services, unnest(ARRAY[0,1,2,3,4,5,6]) AS day
WHERE name = '追思纪念会';

-- Service 3: Available weekends 8 AM to 8 PM
INSERT INTO service_availability (service_id, day_of_week, start_time, end_time, max_bookings) 
SELECT id, day, '08:00:00', '20:00:00', 2
FROM services, unnest(ARRAY[0,6]) AS day
WHERE name = '七日祭';

-- Create a function to handle booking creation with checks
CREATE OR REPLACE FUNCTION create_booking(
    p_user_id UUID,
    p_service_id UUID,
    p_booking_date DATE,
    p_start_time TIME,
    p_end_time TIME,
    p_guest_name TEXT DEFAULT NULL,
    p_guest_email TEXT DEFAULT NULL,
    p_guest_phone TEXT DEFAULT NULL,
    p_notes TEXT DEFAULT NULL
) RETURNS UUID AS $$
DECLARE
    v_service_duration INTEGER;
    v_day_of_week INTEGER;
    v_service_available BOOLEAN := FALSE;
    v_booking_conflicts INTEGER;
    v_booking_id UUID;
BEGIN
    -- Get day of week (0-6, Sunday is 0)
    v_day_of_week := EXTRACT(DOW FROM p_booking_date);
    
    -- Check if service is available on this day and time
    SELECT EXISTS (
        SELECT 1 FROM service_availability
        WHERE service_id = p_service_id
        AND day_of_week = v_day_of_week
        AND start_time <= p_start_time
        AND end_time >= p_end_time
    ) INTO v_service_available;
    
    IF NOT v_service_available THEN
        RAISE EXCEPTION 'Selected service is not available at this time';
    END IF;
    
    -- Check for booking conflicts
    SELECT COUNT(*)
    FROM bookings
    WHERE service_id = p_service_id
    AND booking_date = p_booking_date
    AND status != 'cancelled'
    AND (
        (start_time <= p_start_time AND end_time > p_start_time) OR
        (start_time < p_end_time AND end_time >= p_end_time) OR
        (start_time >= p_start_time AND end_time <= p_end_time)
    ) INTO v_booking_conflicts;
    
    -- Check max bookings for this service, day, and time
    IF v_booking_conflicts >= (
        SELECT max_bookings 
        FROM service_availability
        WHERE service_id = p_service_id
        AND day_of_week = v_day_of_week
    ) THEN
        RAISE EXCEPTION 'No available slots at this time';
    END IF;
    
    -- Insert the booking
    INSERT INTO bookings (
        user_id,
        service_id,
        booking_date,
        start_time,
        end_time,
        guest_name,
        guest_email,
        guest_phone,
        notes
    ) VALUES (
        p_user_id,
        p_service_id,
        p_booking_date,
        p_start_time,
        p_end_time,
        p_guest_name,
        p_guest_email,
        p_guest_phone,
        p_notes
    ) RETURNING id INTO v_booking_id;
    
    RETURN v_booking_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;