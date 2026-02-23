-- ============================================================
-- FIX: RLS infinite recursion on admin policies
-- The old admin policies queried profiles FROM profiles,
-- causing infinite recursion. This fix uses a SECURITY DEFINER
-- function that bypasses RLS to check the admin role.
-- ============================================================

-- Step 1: Create is_admin() function (bypasses RLS)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER;

-- Step 2: Drop the broken policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;

-- Step 3: Recreate admin policies using the function
CREATE POLICY "Admins can view all profiles"
  ON public.profiles
  FOR SELECT
  USING (public.is_admin());

CREATE POLICY "Admins can update all profiles"
  ON public.profiles
  FOR UPDATE
  USING (public.is_admin());
