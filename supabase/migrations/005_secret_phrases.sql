-- a) Tabla de frases secretas
CREATE TABLE IF NOT EXISTS public.frases_secretas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  frase TEXT NOT NULL UNIQUE,
  activa BOOLEAN NOT NULL DEFAULT true,
  descripcion TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.frases_secretas ENABLE ROW LEVEL SECURITY;

-- Solo admins pueden ver/editar frases
CREATE POLICY "Admins full access on frases_secretas"
  ON public.frases_secretas FOR ALL
  USING (public.is_admin()) WITH CHECK (public.is_admin());

-- b) Agregar campo a profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS tiene_acceso_secreto BOOLEAN NOT NULL DEFAULT false;

-- c) Agregar 'secreto' como nivel de acceso válido en materiales
ALTER TABLE public.materiales_digitales
  DROP CONSTRAINT IF EXISTS materiales_digitales_acceso_check;
ALTER TABLE public.materiales_digitales
  ADD CONSTRAINT materiales_digitales_acceso_check
  CHECK (acceso IN ('libre', 'premium', 'privado', 'secreto'));

-- d) Actualizar RLS policy para que usuarios con acceso secreto vean materiales 'secreto'
DROP POLICY IF EXISTS "Users can view accessible materials" ON public.materiales_digitales;
CREATE POLICY "Users can view accessible materials"
  ON public.materiales_digitales FOR SELECT
  USING (
    activo = true
    AND auth.uid() IS NOT NULL
    AND (
      acceso = 'libre'
      OR (acceso = 'secreto' AND EXISTS (
        SELECT 1 FROM public.profiles
        WHERE id = auth.uid() AND tiene_acceso_secreto = true
      ))
      OR EXISTS (
        SELECT 1 FROM public.materiales_acceso
        WHERE material_id = materiales_digitales.id AND user_id = auth.uid()
      )
    )
  );

-- e) Función RPC para validar frase (evita exponer la tabla al cliente)
CREATE OR REPLACE FUNCTION public.validar_frase_secreta(frase_input TEXT)
RETURNS BOOLEAN AS $$
DECLARE
  es_valida BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 FROM public.frases_secretas
    WHERE LOWER(TRIM(frase)) = LOWER(TRIM(frase_input)) AND activa = true
  ) INTO es_valida;

  IF es_valida THEN
    UPDATE public.profiles
    SET tiene_acceso_secreto = true
    WHERE id = auth.uid();
  END IF;

  RETURN es_valida;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- f) Insertar una frase secreta de ejemplo (cambiar por la real)
INSERT INTO public.frases_secretas (frase, descripcion)
VALUES ('tu-frase-secreta-aqui', 'Frase para acceso a contenido exclusivo');
