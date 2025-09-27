-- Create a test admin user (this will be temporary for testing)
-- Note: In production, admin users should be created through proper registration flow

-- Insert a test admin role assignment
-- This assumes you'll create an admin user through the signup flow
-- The user_id will need to be updated after creating the actual user

-- Example of how to make a user admin after they sign up:
-- UPDATE user_roles SET role = 'admin' WHERE user_id = 'actual-user-id-here';

-- For now, we'll just ensure the migration completes successfully
SELECT 1 as migration_completed;