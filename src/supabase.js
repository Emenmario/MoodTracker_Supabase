import { createClient } from '@supabase/supabase-js'
const supabaseUrl = 'https://fslsxhovxureoyasioxp.supabase.co'   
const supabaseAnon='sb_publishable_9E_cUB2zlLgmvGdR_D3NOw_zjxRZ0t4'
export const supabase = createClient(supabaseUrl, supabaseAnon)
