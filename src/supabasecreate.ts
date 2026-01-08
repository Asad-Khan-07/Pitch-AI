// import { createClient } from "@supabase/supabase-js"
import {createClient} from "@supabase/supabase-js"

  const supabaseUrl=import.meta.env.VITE_SUP_URL

  const supabasekey=import.meta.env.VITE_SUP_KEY
  
   const supabase=createClient(supabaseUrl,supabasekey)

 export default supabase