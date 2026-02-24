-- ============================================================
-- 006: Sesiones Zoom
-- ============================================================

CREATE TABLE IF NOT EXISTS sesiones_zoom (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  titulo      TEXT NOT NULL,
  descripcion TEXT,
  zoom_link   TEXT NOT NULL,
  meeting_id  TEXT,
  passcode    TEXT,
  fecha_hora  TIMESTAMPTZ NOT NULL,
  recurrencia TEXT,
  activa      BOOLEAN NOT NULL DEFAULT true,
  orden       INT NOT NULL DEFAULT 0,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Auto-update updated_at
CREATE TRIGGER set_updated_at_sesiones_zoom
  BEFORE UPDATE ON sesiones_zoom
  FOR EACH ROW EXECUTE FUNCTION handle_updated_at();

-- ── RLS ──────────────────────────────────────────────────────
ALTER TABLE sesiones_zoom ENABLE ROW LEVEL SECURITY;

-- Clients with acceso secreto can view active sessions
CREATE POLICY "sesiones_zoom_select_secret"
  ON sesiones_zoom FOR SELECT
  USING (
    activa = true
    AND EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
        AND profiles.tiene_acceso_secreto = true
    )
  );

-- Admins full access
CREATE POLICY "sesiones_zoom_admin_all"
  ON sesiones_zoom FOR ALL
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

-- ── Seed ─────────────────────────────────────────────────────
INSERT INTO sesiones_zoom (titulo, descripcion, zoom_link, meeting_id, passcode, fecha_hora, recurrencia, activa, orden)
VALUES (
  'New Girl Challenge',
  'Sesión grupal con Michell Pm',
  'https://us06web.zoom.us/j/89595748816?pwd=kq7LYcKK9oPXOsTIqWpQUx8f2Fwn1f.1',
  '895 9574 8816',
  'magia',
  '2026-02-23T20:30:00-06:00',
  'Cada semana los lunes, 8:30 PM CDMX',
  true,
  1
);
