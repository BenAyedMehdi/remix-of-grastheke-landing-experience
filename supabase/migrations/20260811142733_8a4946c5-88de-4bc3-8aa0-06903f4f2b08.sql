CREATE TYPE public.app_role AS ENUM ('admin','staff','patient');

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY,
  email text,
  full_name text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own profile read" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "own profile insert" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY "own profile update" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.is_staff(_user_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role IN ('admin','staff'));
$$;

CREATE POLICY "own roles read" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid() OR public.has_role(auth.uid(),'admin'));

CREATE OR REPLACE FUNCTION public.ensure_profile()
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE
  uid uuid := auth.uid();
BEGIN
  IF uid IS NULL THEN RETURN; END IF;
  INSERT INTO public.profiles (id, email)
  VALUES (uid, nullif(auth.jwt() ->> 'email',''))
  ON CONFLICT (id) DO NOTHING;
  INSERT INTO public.user_roles (user_id, role)
  VALUES (uid, 'patient')
  ON CONFLICT (user_id, role) DO NOTHING;
END;
$$;
GRANT EXECUTE ON FUNCTION public.ensure_profile() TO authenticated;

CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END;
$$;

CREATE TABLE public.batches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_number text NOT NULL UNIQUE,
  product_name text NOT NULL,
  cultivar text,
  genetics text,
  thc_percent numeric(5,2),
  cbd_percent numeric(5,2),
  total_terpenes_percent numeric(5,2),
  moisture_percent numeric(5,2),
  water_activity numeric(4,3),
  irradiation text,
  cultivation text,
  origin text,
  harvest_date date,
  packaged_date date,
  best_before date,
  coa_number text,
  coa_lab text,
  coa_issued_on date,
  coa_path text,
  notes text,
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX batches_batch_number_idx ON public.batches (lower(batch_number));
GRANT SELECT, INSERT, UPDATE, DELETE ON public.batches TO authenticated;
GRANT ALL ON public.batches TO service_role;
ALTER TABLE public.batches ENABLE ROW LEVEL SECURITY;
CREATE POLICY "batches read" ON public.batches FOR SELECT TO authenticated USING (status = 'published' OR public.is_staff(auth.uid()));
CREATE POLICY "batches staff write" ON public.batches FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));
CREATE TRIGGER batches_updated_at BEFORE UPDATE ON public.batches FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.batch_terpenes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id uuid NOT NULL REFERENCES public.batches(id) ON DELETE CASCADE,
  name text NOT NULL,
  percent numeric(5,3),
  note text,
  sort_order int NOT NULL DEFAULT 0
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.batch_terpenes TO authenticated;
GRANT ALL ON public.batch_terpenes TO service_role;
ALTER TABLE public.batch_terpenes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "terpenes read" ON public.batch_terpenes FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.batches b WHERE b.id = batch_id AND (b.status = 'published' OR public.is_staff(auth.uid()))));
CREATE POLICY "terpenes staff write" ON public.batch_terpenes FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

CREATE TABLE public.batch_lab_results (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id uuid NOT NULL REFERENCES public.batches(id) ON DELETE CASCADE,
  category text NOT NULL DEFAULT 'Allgemein',
  parameter text NOT NULL,
  value text,
  unit text,
  limit_value text,
  passed boolean,
  sort_order int NOT NULL DEFAULT 0
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.batch_lab_results TO authenticated;
GRANT ALL ON public.batch_lab_results TO service_role;
ALTER TABLE public.batch_lab_results ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lab read" ON public.batch_lab_results FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.batches b WHERE b.id = batch_id AND (b.status = 'published' OR public.is_staff(auth.uid()))));
CREATE POLICY "lab staff write" ON public.batch_lab_results FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

CREATE TABLE public.batch_photos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  batch_id uuid NOT NULL REFERENCES public.batches(id) ON DELETE CASCADE,
  storage_path text NOT NULL,
  caption text,
  taken_at date,
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.batch_photos TO authenticated;
GRANT ALL ON public.batch_photos TO service_role;
ALTER TABLE public.batch_photos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "photos read" ON public.batch_photos FOR SELECT TO authenticated USING (EXISTS (SELECT 1 FROM public.batches b WHERE b.id = batch_id AND (b.status = 'published' OR public.is_staff(auth.uid()))));
CREATE POLICY "photos staff write" ON public.batch_photos FOR ALL TO authenticated USING (public.is_staff(auth.uid())) WITH CHECK (public.is_staff(auth.uid()));

INSERT INTO public.batches (id, batch_number, product_name, cultivar, genetics, thc_percent, cbd_percent, total_terpenes_percent, moisture_percent, water_activity, irradiation, cultivation, origin, harvest_date, packaged_date, best_before, coa_number, coa_lab, coa_issued_on, notes, status)
VALUES
 ('11111111-1111-4111-8111-111111111111','GT-2026-0812-A','Nachtflor 22','Nachtflor','Indica',22.40,0.40,2.10,10.80,0.552,'Beta-bestrahlt (10 kGy)','Indoor, EU-GMP','Portugal','2026-04-18','2026-06-02','2028-06-02','COA-2026-04812','Labor Muster GmbH','2026-06-05','Demodaten – Charge zur Veranschaulichung der Chargenrückverfolgung.','published'),
 ('22222222-2222-4222-8222-222222222222','GT-2026-0805-K','Klarfeld 18','Klarfeld','Sativa',18.10,0.30,1.60,11.40,0.578,'Unbestrahlt','Indoor, EU-GMP','Kanada','2026-03-30','2026-05-20','2028-05-20','COA-2026-04455','Labor Muster GmbH','2026-05-24','Demodaten – Charge zur Veranschaulichung der Chargenrückverfolgung.','published');

INSERT INTO public.batch_terpenes (batch_id, name, percent, note, sort_order) VALUES
 ('11111111-1111-4111-8111-111111111111','Myrcen',0.820,'erdig, krautig',1),
 ('11111111-1111-4111-8111-111111111111','Caryophyllen',0.610,'pfeffrig',2),
 ('11111111-1111-4111-8111-111111111111','Linalool',0.340,'floral',3),
 ('11111111-1111-4111-8111-111111111111','Limonen',0.230,'zitrisch',4),
 ('22222222-2222-4222-8222-222222222222','Limonen',0.540,'zitrisch',1),
 ('22222222-2222-4222-8222-222222222222','Terpinolen',0.430,'frisch',2),
 ('22222222-2222-4222-8222-222222222222','Pinen',0.310,'harzig',3),
 ('22222222-2222-4222-8222-222222222222','Myrcen',0.180,'erdig',4);

INSERT INTO public.batch_lab_results (batch_id, category, parameter, value, unit, limit_value, passed, sort_order) VALUES
 ('11111111-1111-4111-8111-111111111111','Cannabinoide','THC (Δ9-THC + THCA)','22.4','%','—',true,1),
 ('11111111-1111-4111-8111-111111111111','Cannabinoide','CBD (CBD + CBDA)','0.4','%','—',true,2),
 ('11111111-1111-4111-8111-111111111111','Physikalisch','Restfeuchte','10.8','%','< 12',true,3),
 ('11111111-1111-4111-8111-111111111111','Physikalisch','Wasseraktivität (aw)','0.552','—','0.55–0.65',true,4),
 ('11111111-1111-4111-8111-111111111111','Mikrobiologie','Gesamtkeimzahl','< 10^3','KBE/g','< 10^5',true,5),
 ('11111111-1111-4111-8111-111111111111','Rückstände','Pestizide','n.n.','—','Ph. Eur.',true,6),
 ('11111111-1111-4111-8111-111111111111','Rückstände','Schwermetalle','n.n.','—','Ph. Eur.',true,7),
 ('22222222-2222-4222-8222-222222222222','Cannabinoide','THC (Δ9-THC + THCA)','18.1','%','—',true,1),
 ('22222222-2222-4222-8222-222222222222','Cannabinoide','CBD (CBD + CBDA)','0.3','%','—',true,2),
 ('22222222-2222-4222-8222-222222222222','Physikalisch','Restfeuchte','11.4','%','< 12',true,3),
 ('22222222-2222-4222-8222-222222222222','Physikalisch','Wasseraktivität (aw)','0.578','—','0.55–0.65',true,4),
 ('22222222-2222-4222-8222-222222222222','Mikrobiologie','Gesamtkeimzahl','< 10^3','KBE/g','< 10^5',true,5),
 ('22222222-2222-4222-8222-222222222222','Rückstände','Pestizide','n.n.','—','Ph. Eur.',true,6);