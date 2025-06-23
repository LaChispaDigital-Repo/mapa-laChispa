import { createClient } from "@supabase/supabase-js";

// Obtener las credenciales de Supabase desde las variables de entorno de Vite
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Validar que las variables de entorno estén definidas
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Las variables VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY deben estar definidas en el archivo .env");
}

// Crear y exportar el cliente de Supabase para usar en toda la aplicación
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
