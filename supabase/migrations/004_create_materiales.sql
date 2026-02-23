-- ============================================
-- Material Digital: tables, RLS, storage bucket
-- ============================================

-- 1. Table: materiales_digitales
CREATE TABLE IF NOT EXISTS public.materiales_digitales (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo TEXT NOT NULL,
  descripcion TEXT,
  tipo TEXT NOT NULL CHECK (tipo IN ('pdf', 'audio', 'video')),
  acceso TEXT NOT NULL DEFAULT 'libre' CHECK (acceso IN ('libre', 'premium', 'privado')),
  archivo_path TEXT NOT NULL,
  archivo_nombre TEXT NOT NULL,
  archivo_tamano BIGINT,
  archivo_tipo TEXT,
  activo BOOLEAN NOT NULL DEFAULT true,
  orden INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL
);

ALTER TABLE public.materiales_digitales ENABLE ROW LEVEL SECURITY;

-- 2. Table: materiales_acceso (must be created BEFORE the policy that references it)
CREATE TABLE IF NOT EXISTS public.materiales_acceso (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  material_id UUID NOT NULL REFERENCES public.materiales_digitales(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  granted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  granted_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  UNIQUE(material_id, user_id)
);

ALTER TABLE public.materiales_acceso ENABLE ROW LEVEL SECURITY;

-- 3. Policies for materiales_digitales

-- Admin: full CRUD
CREATE POLICY "Admins full access on materiales_digitales"
  ON public.materiales_digitales
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Authenticated users: read active materials they have access to
CREATE POLICY "Users can view accessible materials"
  ON public.materiales_digitales
  FOR SELECT
  USING (
    activo = true
    AND auth.uid() IS NOT NULL
    AND (
      acceso = 'libre'
      OR EXISTS (
        SELECT 1 FROM public.materiales_acceso
        WHERE material_id = materiales_digitales.id
          AND user_id = auth.uid()
      )
    )
  );

-- Auto-update updated_at (reuse existing function)
DROP TRIGGER IF EXISTS on_materiales_digitales_updated ON public.materiales_digitales;
CREATE TRIGGER on_materiales_digitales_updated
  BEFORE UPDATE ON public.materiales_digitales
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- 4. Policies for materiales_acceso

-- Admin: full CRUD
CREATE POLICY "Admins full access on materiales_acceso"
  ON public.materiales_acceso
  FOR ALL
  USING (public.is_admin())
  WITH CHECK (public.is_admin());

-- Users: can see their own access grants
CREATE POLICY "Users can view own access grants"
  ON public.materiales_acceso
  FOR SELECT
  USING (auth.uid() = user_id);

-- 5. Storage bucket: materiales (private)
INSERT INTO storage.buckets (id, name, public)
VALUES ('materiales', 'materiales', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policies: admin can upload/update/delete
CREATE POLICY "Admins can upload materiales"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'materiales' AND public.is_admin());

CREATE POLICY "Admins can update materiales"
  ON storage.objects
  FOR UPDATE
  USING (bucket_id = 'materiales' AND public.is_admin());

CREATE POLICY "Admins can delete materiales"
  ON storage.objects
  FOR DELETE
  USING (bucket_id = 'materiales' AND public.is_admin());

-- Authenticated users can download (read) from materiales bucket
-- Fine-grained access control is handled at the application level via signed URLs
CREATE POLICY "Authenticated users can read materiales"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'materiales' AND auth.uid() IS NOT NULL);
