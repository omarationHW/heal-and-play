-- ============================================================
-- 007: Fix materiales access for 'secreto' level
-- ============================================================

-- First, allow 'secreto' as valid acceso level
ALTER TABLE public.materiales_digitales
  DROP CONSTRAINT IF EXISTS materiales_digitales_acceso_check;

ALTER TABLE public.materiales_digitales
  ADD CONSTRAINT materiales_digitales_acceso_check
  CHECK (acceso IN ('libre', 'premium', 'privado', 'secreto'));

-- Drop old user select policy and recreate with secreto support
DROP POLICY IF EXISTS "Users can view accessible materials" ON public.materiales_digitales;

CREATE POLICY "Users can view accessible materials"
  ON public.materiales_digitales
  FOR SELECT
  USING (
    activo = true
    AND auth.uid() IS NOT NULL
    AND (
      -- Free materials: anyone authenticated
      acceso = 'libre'
      -- Secret materials: only users with tiene_acceso_secreto
      OR (
        acceso = 'secreto'
        AND EXISTS (
          SELECT 1 FROM public.profiles
          WHERE profiles.id = auth.uid()
            AND profiles.tiene_acceso_secreto = true
        )
      )
      -- Premium/privado: explicit access grant
      OR EXISTS (
        SELECT 1 FROM public.materiales_acceso
        WHERE material_id = materiales_digitales.id
          AND user_id = auth.uid()
      )
    )
  );
