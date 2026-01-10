-- =============================================================================
-- MULTI-TENANT ORGANIZATIONS SYSTEM
-- =============================================================================

-- 1. Create org_role enum
CREATE TYPE public.org_role AS ENUM ('owner', 'admin', 'member', 'viewer');

-- 2. Create organizations table
CREATE TABLE public.organizations (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    name text NOT NULL,
    slug text UNIQUE NOT NULL,
    settings jsonb DEFAULT '{}'::jsonb,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- 3. Create organization_members table
CREATE TABLE public.organization_members (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    org_id uuid NOT NULL REFERENCES public.organizations(id) ON DELETE CASCADE,
    user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role org_role NOT NULL DEFAULT 'member',
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    UNIQUE(org_id, user_id)
);

-- 4. Create indexes
CREATE INDEX idx_org_members_user_id ON public.organization_members(user_id);
CREATE INDEX idx_org_members_org_id ON public.organization_members(org_id);
CREATE INDEX idx_organizations_slug ON public.organizations(slug);

-- 5. Add updated_at trigger for organizations
CREATE TRIGGER update_organizations_updated_at
    BEFORE UPDATE ON public.organizations
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- =============================================================================
-- SECURITY DEFINER FUNCTIONS (to avoid RLS recursion)
-- =============================================================================

-- Check if user is a member of an organization
CREATE OR REPLACE FUNCTION public.is_org_member(_user_id uuid, _org_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.organization_members
        WHERE user_id = _user_id
          AND org_id = _org_id
    )
$$;

-- Check if user is an admin (owner or admin) of an organization
CREATE OR REPLACE FUNCTION public.is_org_admin(_user_id uuid, _org_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT EXISTS (
        SELECT 1
        FROM public.organization_members
        WHERE user_id = _user_id
          AND org_id = _org_id
          AND role IN ('owner', 'admin')
    )
$$;

-- Get all org IDs for a user
CREATE OR REPLACE FUNCTION public.get_user_org_ids(_user_id uuid)
RETURNS SETOF uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
    SELECT org_id
    FROM public.organization_members
    WHERE user_id = _user_id
$$;

-- =============================================================================
-- RLS FOR ORGANIZATIONS
-- =============================================================================

ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;

-- Users can view orgs they belong to
CREATE POLICY "Users can view their organizations"
ON public.organizations
FOR SELECT
USING (
    public.is_org_member(auth.uid(), id)
    OR public.has_role(auth.uid(), 'admin')
);

-- Org admins can update their org
CREATE POLICY "Org admins can update their organization"
ON public.organizations
FOR UPDATE
USING (
    public.is_org_admin(auth.uid(), id)
    OR public.has_role(auth.uid(), 'admin')
);

-- Platform admins can insert organizations
CREATE POLICY "Platform admins can create organizations"
ON public.organizations
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Platform admins can delete organizations
CREATE POLICY "Platform admins can delete organizations"
ON public.organizations
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- =============================================================================
-- RLS FOR ORGANIZATION_MEMBERS
-- =============================================================================

ALTER TABLE public.organization_members ENABLE ROW LEVEL SECURITY;

-- Members can view membership of their orgs
CREATE POLICY "Members can view org membership"
ON public.organization_members
FOR SELECT
USING (
    public.is_org_member(auth.uid(), org_id)
    OR public.has_role(auth.uid(), 'admin')
);

-- Org admins can add members
CREATE POLICY "Org admins can add members"
ON public.organization_members
FOR INSERT
WITH CHECK (
    public.is_org_admin(auth.uid(), org_id)
    OR public.has_role(auth.uid(), 'admin')
);

-- Org admins can update members
CREATE POLICY "Org admins can update members"
ON public.organization_members
FOR UPDATE
USING (
    public.is_org_admin(auth.uid(), org_id)
    OR public.has_role(auth.uid(), 'admin')
);

-- Org admins can remove members
CREATE POLICY "Org admins can remove members"
ON public.organization_members
FOR DELETE
USING (
    public.is_org_admin(auth.uid(), org_id)
    OR public.has_role(auth.uid(), 'admin')
);

-- =============================================================================
-- ADD org_id TO CORE TABLES (nullable initially for migration)
-- =============================================================================

ALTER TABLE public.digital_twins ADD COLUMN org_id uuid REFERENCES public.organizations(id);
ALTER TABLE public.sensors ADD COLUMN org_id uuid REFERENCES public.organizations(id);
ALTER TABLE public.assets ADD COLUMN org_id uuid REFERENCES public.organizations(id);
ALTER TABLE public.events ADD COLUMN org_id uuid REFERENCES public.organizations(id);
ALTER TABLE public.rules ADD COLUMN org_id uuid REFERENCES public.organizations(id);
ALTER TABLE public.scenarios ADD COLUMN org_id uuid REFERENCES public.organizations(id);

-- =============================================================================
-- CREATE DEFAULT ORGANIZATION AND BACKFILL
-- =============================================================================

-- Create the default organization
INSERT INTO public.organizations (id, name, slug, settings)
VALUES (
    'a0000000-0000-0000-0000-000000000001',
    'Default Organization',
    'default',
    '{"isDefault": true}'::jsonb
);

-- Backfill existing data with default org
UPDATE public.digital_twins SET org_id = 'a0000000-0000-0000-0000-000000000001' WHERE org_id IS NULL;
UPDATE public.sensors SET org_id = 'a0000000-0000-0000-0000-000000000001' WHERE org_id IS NULL;
UPDATE public.assets SET org_id = 'a0000000-0000-0000-0000-000000000001' WHERE org_id IS NULL;
UPDATE public.events SET org_id = 'a0000000-0000-0000-0000-000000000001' WHERE org_id IS NULL;
UPDATE public.rules SET org_id = 'a0000000-0000-0000-0000-000000000001' WHERE org_id IS NULL;
UPDATE public.scenarios SET org_id = 'a0000000-0000-0000-0000-000000000001' WHERE org_id IS NULL;

-- Make org_id NOT NULL after backfill
ALTER TABLE public.digital_twins ALTER COLUMN org_id SET NOT NULL;
ALTER TABLE public.sensors ALTER COLUMN org_id SET NOT NULL;
ALTER TABLE public.assets ALTER COLUMN org_id SET NOT NULL;
ALTER TABLE public.events ALTER COLUMN org_id SET NOT NULL;
ALTER TABLE public.rules ALTER COLUMN org_id SET NOT NULL;
ALTER TABLE public.scenarios ALTER COLUMN org_id SET NOT NULL;

-- Add indexes for org_id
CREATE INDEX idx_digital_twins_org_id ON public.digital_twins(org_id);
CREATE INDEX idx_sensors_org_id ON public.sensors(org_id);
CREATE INDEX idx_assets_org_id ON public.assets(org_id);
CREATE INDEX idx_events_org_id ON public.events(org_id);
CREATE INDEX idx_rules_org_id ON public.rules(org_id);
CREATE INDEX idx_scenarios_org_id ON public.scenarios(org_id);

-- =============================================================================
-- UPDATE RLS POLICIES FOR TENANT ISOLATION
-- =============================================================================

-- DIGITAL_TWINS: Drop old policies and create new ones
DROP POLICY IF EXISTS "Authenticated users can view digital twins" ON public.digital_twins;
DROP POLICY IF EXISTS "Moderators and admins can create digital twins" ON public.digital_twins;
DROP POLICY IF EXISTS "Moderators and admins can update digital twins" ON public.digital_twins;
DROP POLICY IF EXISTS "Admins can delete digital twins" ON public.digital_twins;

CREATE POLICY "Org members can view their digital twins"
ON public.digital_twins FOR SELECT
USING (
    public.is_org_member(auth.uid(), org_id)
    OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Org admins can create digital twins"
ON public.digital_twins FOR INSERT
WITH CHECK (
    public.is_org_admin(auth.uid(), org_id)
    OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Org admins can update digital twins"
ON public.digital_twins FOR UPDATE
USING (
    public.is_org_admin(auth.uid(), org_id)
    OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Platform admins can delete digital twins"
ON public.digital_twins FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- SENSORS: Drop old policies and create new ones
DROP POLICY IF EXISTS "Authenticated users can view sensors" ON public.sensors;
DROP POLICY IF EXISTS "Moderators and admins can modify sensors" ON public.sensors;
DROP POLICY IF EXISTS "Moderators and admins can update sensors" ON public.sensors;
DROP POLICY IF EXISTS "Admins can delete sensors" ON public.sensors;

CREATE POLICY "Org members can view their sensors"
ON public.sensors FOR SELECT
USING (
    public.is_org_member(auth.uid(), org_id)
    OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Org admins can create sensors"
ON public.sensors FOR INSERT
WITH CHECK (
    public.is_org_admin(auth.uid(), org_id)
    OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Org admins can update sensors"
ON public.sensors FOR UPDATE
USING (
    public.is_org_admin(auth.uid(), org_id)
    OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Platform admins can delete sensors"
ON public.sensors FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- ASSETS: Drop old policies and create new ones
DROP POLICY IF EXISTS "Authenticated users can view assets" ON public.assets;
DROP POLICY IF EXISTS "Moderators and admins can modify assets" ON public.assets;
DROP POLICY IF EXISTS "Moderators and admins can update assets" ON public.assets;
DROP POLICY IF EXISTS "Admins can delete assets" ON public.assets;

CREATE POLICY "Org members can view their assets"
ON public.assets FOR SELECT
USING (
    public.is_org_member(auth.uid(), org_id)
    OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Org admins can create assets"
ON public.assets FOR INSERT
WITH CHECK (
    public.is_org_admin(auth.uid(), org_id)
    OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Org admins can update assets"
ON public.assets FOR UPDATE
USING (
    public.is_org_admin(auth.uid(), org_id)
    OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Platform admins can delete assets"
ON public.assets FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- EVENTS: Drop old policies and create new ones
DROP POLICY IF EXISTS "Authenticated users can view events" ON public.events;
DROP POLICY IF EXISTS "Moderators and admins can insert events" ON public.events;
DROP POLICY IF EXISTS "Moderators and admins can update events" ON public.events;
DROP POLICY IF EXISTS "Admins can delete events" ON public.events;

CREATE POLICY "Org members can view their events"
ON public.events FOR SELECT
USING (
    public.is_org_member(auth.uid(), org_id)
    OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Org admins can create events"
ON public.events FOR INSERT
WITH CHECK (
    public.is_org_admin(auth.uid(), org_id)
    OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Org admins can update events"
ON public.events FOR UPDATE
USING (
    public.is_org_admin(auth.uid(), org_id)
    OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Platform admins can delete events"
ON public.events FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- RULES: Drop old policies and create new ones
DROP POLICY IF EXISTS "Authenticated users can view rules" ON public.rules;
DROP POLICY IF EXISTS "Moderators and admins can modify rules" ON public.rules;
DROP POLICY IF EXISTS "Moderators and admins can update rules" ON public.rules;
DROP POLICY IF EXISTS "Admins can delete rules" ON public.rules;

CREATE POLICY "Org members can view their rules"
ON public.rules FOR SELECT
USING (
    public.is_org_member(auth.uid(), org_id)
    OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Org admins can create rules"
ON public.rules FOR INSERT
WITH CHECK (
    public.is_org_admin(auth.uid(), org_id)
    OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Org admins can update rules"
ON public.rules FOR UPDATE
USING (
    public.is_org_admin(auth.uid(), org_id)
    OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Platform admins can delete rules"
ON public.rules FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- SCENARIOS: Drop old policies and create new ones
DROP POLICY IF EXISTS "Authenticated users can view scenarios" ON public.scenarios;
DROP POLICY IF EXISTS "Moderators and admins can modify scenarios" ON public.scenarios;
DROP POLICY IF EXISTS "Moderators and admins can update scenarios" ON public.scenarios;
DROP POLICY IF EXISTS "Admins can delete scenarios" ON public.scenarios;

CREATE POLICY "Org members can view their scenarios"
ON public.scenarios FOR SELECT
USING (
    public.is_org_member(auth.uid(), org_id)
    OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Org admins can create scenarios"
ON public.scenarios FOR INSERT
WITH CHECK (
    public.is_org_admin(auth.uid(), org_id)
    OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Org admins can update scenarios"
ON public.scenarios FOR UPDATE
USING (
    public.is_org_admin(auth.uid(), org_id)
    OR public.has_role(auth.uid(), 'admin')
);

CREATE POLICY "Platform admins can delete scenarios"
ON public.scenarios FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));

-- =============================================================================
-- ADD approved_org_id TO ACCESS_REQUESTS
-- =============================================================================

ALTER TABLE public.access_requests ADD COLUMN approved_org_id uuid REFERENCES public.organizations(id);