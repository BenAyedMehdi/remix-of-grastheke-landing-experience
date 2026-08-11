REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.is_staff(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.ensure_profile() FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.ensure_profile() TO authenticated;