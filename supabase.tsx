import { createClient } from "@supabase/supabase-js";

const API_KEY = import.meta.env.VITE_SUPABASE_API_KEY;
const SUPABASE_URL = import.meta.env.VITE_SUPABASE_PROJECT_URL;

export const supabase = createClient(SUPABASE_URL, API_KEY);
