-- Add birthday and address fields to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS fecha_nacimiento DATE,
  ADD COLUMN IF NOT EXISTS direccion TEXT,
  ADD COLUMN IF NOT EXISTS direccion_lat DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS direccion_lng DOUBLE PRECISION;

-- Update trigger to also store new fields from signup metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, nombre_completo, fecha_nacimiento, direccion, direccion_lat, direccion_lng, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'nombre_completo', ''),
    (NEW.raw_user_meta_data->>'fecha_nacimiento')::DATE,
    NEW.raw_user_meta_data->>'direccion',
    (NEW.raw_user_meta_data->>'direccion_lat')::DOUBLE PRECISION,
    (NEW.raw_user_meta_data->>'direccion_lng')::DOUBLE PRECISION,
    'client'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
