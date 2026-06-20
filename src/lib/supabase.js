import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vizhpmjkagfogauzuhlb.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZpemhwbWprYWdmb2dhdXp1aGxiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5NjI0NDIsImV4cCI6MjA5NzUzODQ0Mn0.ChDY6eJ1kkJdaPUoE3IoPMBp4dZ0O-W2CDHc6dCwhec'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
