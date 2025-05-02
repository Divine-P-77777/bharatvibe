// supabase/functions/update-profile/index.ts
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  const { username, avatar_url } = await req.json()
  const authHeader = req.headers.get('Authorization') || ''
  const token = authHeader.replace('Bearer ', '')

  const supabase = createClient(
    Deno.env.get('NEXT_PUBLIC_SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    { global: { headers: { Authorization: `Bearer ${token}` } } }
  )

  const { data: { user }, error: authError } = await supabase.auth.getUser(token)
  if (authError || !user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 })
  }

  const { error: updateError } = await supabase
    .from('profiles')
    .update({ username, avatar_url })
    .eq('id', user.id)

  if (updateError) {
    return new Response(JSON.stringify({ error: updateError.message }), { status: 400 })
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 })
})
