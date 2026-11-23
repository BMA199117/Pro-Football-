// Click SHOP-API callbacks (Prepare and Complete) for Pro Football.
// Click posts its form here; all checks (signature, amount, order state) run in the database
// function click_callback(), which also turns the subscription on when a payment completes.
// Deploy with JWT verification OFF (Click cannot send a token): supabase functions deploy click --no-verify-jwt
import { createClient } from 'npm:@supabase/supabase-js@2'

const sb = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!, { auth: { persistSession: false } })

Deno.serve(async (req) => {
  if (req.method !== 'POST') return new Response('Pro Football: Click endpoint', { status: 200 })
  const p: Record<string, string> = {}
  const type = req.headers.get('content-type') ?? ''
  try {
    if (type.includes('application/json')) Object.assign(p, Object.fromEntries(Object.entries(await req.json()).map(([k, v]) => [k, String(v)])))
    else for (const [k, v] of (await req.formData()).entries()) p[k] = String(v)
  } catch {
    return Response.json({ error: -8, error_note: 'Error in request from click' })
  }
  const { data, error } = await sb.rpc('click_callback', { p })
  if (error) {
    console.error('click_callback', error.message)
    return Response.json({ click_trans_id: p.click_trans_id, merchant_trans_id: p.merchant_trans_id, error: -7, error_note: 'Failed to update user' })
  }
  return Response.json(data)
})
