// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://oemzshnztwhntfdadafb.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lbXpzaG56dHdobnRmZGFkYWZiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDY4NTgxOTgsImV4cCI6MjA2MjQzNDE5OH0.mNBGaBVnUAadBezSYeoOxsMJ3nkDS_0_4sTytQCQjIU'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)