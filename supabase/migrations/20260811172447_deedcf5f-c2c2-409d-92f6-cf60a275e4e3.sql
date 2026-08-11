CREATE TABLE public.gram_invites (
  code text PRIMARY KEY,
  label text,
  max_uses integer NOT NULL DEFAULT 1,
  used_count integer NOT NULL DEFAULT 0,
  expires_at timestamptz,
  active boolean NOT NULL DEFAULT true,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.gram_invites TO authenticated;
GRANT ALL ON public.gram_invites TO service_role;
ALTER TABLE public.gram_invites ENABLE ROW LEVEL SECURITY;
CREATE POLICY "invites staff manage" ON public.gram_invites FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

CREATE TABLE public.gram_members (
  user_id uuid PRIMARY KEY,
  invite_code text REFERENCES public.gram_invites(code),
  tier text NOT NULL DEFAULT 'member',
  joined_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.gram_members TO authenticated;
GRANT ALL ON public.gram_members TO service_role;
ALTER TABLE public.gram_members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "members read own" ON public.gram_members FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.is_staff(auth.uid()));
CREATE POLICY "members staff manage" ON public.gram_members FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

CREATE OR REPLACE FUNCTION public.is_gram_member(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.gram_members WHERE user_id = _user_id);
$$;
REVOKE ALL ON FUNCTION public.is_gram_member(uuid) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.is_gram_member(uuid) TO authenticated, service_role;

CREATE OR REPLACE FUNCTION public.redeem_gram_invite(_code text)
RETURNS jsonb LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  uid uuid := auth.uid();
  norm text := upper(regexp_replace(coalesce(_code,''), '\s', '', 'g'));
  inv public.gram_invites%ROWTYPE;
BEGIN
  IF uid IS NULL THEN
    RETURN jsonb_build_object('ok', false, 'error', 'not_authenticated');
  END IF;

  IF EXISTS (SELECT 1 FROM public.gram_members WHERE user_id = uid) THEN
    RETURN jsonb_build_object('ok', true, 'already_member', true);
  END IF;

  SELECT * INTO inv FROM public.gram_invites WHERE code = norm FOR UPDATE;
  IF NOT FOUND OR NOT inv.active THEN
    RETURN jsonb_build_object('ok', false, 'error', 'invalid_code');
  END IF;
  IF inv.expires_at IS NOT NULL AND inv.expires_at < now() THEN
    RETURN jsonb_build_object('ok', false, 'error', 'expired');
  END IF;
  IF inv.used_count >= inv.max_uses THEN
    RETURN jsonb_build_object('ok', false, 'error', 'exhausted');
  END IF;

  INSERT INTO public.gram_members (user_id, invite_code) VALUES (uid, inv.code);
  UPDATE public.gram_invites SET used_count = used_count + 1 WHERE code = inv.code;
  PERFORM public.ensure_profile();

  RETURN jsonb_build_object('ok', true, 'already_member', false);
END;
$$;
REVOKE ALL ON FUNCTION public.redeem_gram_invite(text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.redeem_gram_invite(text) TO authenticated, service_role;

INSERT INTO public.gram_invites (code, label, max_uses, expires_at) VALUES
  ('GRAM-0001', 'Founding Circle', 1, NULL),
  ('GRAM-0002', 'Founding Circle', 1, NULL),
  ('GRAM-0003', 'Founding Circle', 1, NULL),
  ('MUSTER-GRAM', 'Demo / Test', 100, NULL),
  ('NACHTFLOR-KEY', 'Drop Nachtflor', 25, NULL);