-- ============================================================
-- 008: Grabaciones (YouTube embeds de sesiones grabadas)
-- ============================================================

CREATE TABLE IF NOT EXISTS grabaciones (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo       TEXT NOT NULL,
  descripcion  TEXT,
  youtube_url  TEXT NOT NULL,
  fecha_sesion DATE,
  activa       BOOLEAN NOT NULL DEFAULT true,
  orden        INT NOT NULL DEFAULT 0,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-update updated_at
CREATE TRIGGER set_updated_at_grabaciones
  BEFORE UPDATE ON grabaciones
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- ── RLS ──────────────────────────────────────────────────────
ALTER TABLE grabaciones ENABLE ROW LEVEL SECURITY;

-- Clients with acceso secreto can view active grabaciones
CREATE POLICY "grabaciones_select_secret"
  ON grabaciones FOR SELECT
  USING (
    activa = true
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.tiene_acceso_secreto = true
    )
  );

-- Admins full access
CREATE POLICY "grabaciones_admin_all"
  ON grabaciones FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
  );
