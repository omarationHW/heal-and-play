-- ============================================================
-- 009: Agregar campo resumen a grabaciones
-- ============================================================

ALTER TABLE grabaciones ADD COLUMN IF NOT EXISTS resumen TEXT;
