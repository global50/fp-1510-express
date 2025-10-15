import { createClient } from 'npm:@supabase/supabase-js@2.57.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
}

interface RequestBody {
  list_type: 'city' | 'country'
  search_query?: string
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { list_type, search_query }: RequestBody = await req.json()

    if (!list_type || !['city', 'country'].includes(list_type)) {
      return new Response(
        JSON.stringify({ error: 'Invalid list_type. Must be "city" or "country"' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    let query

    if (list_type === 'city') {
      query = supabase
        .from('list_city')
        .select('id, name, country, population')
        .order('name', { ascending: true })
        .limit(50)

      if (search_query && search_query.length >= 2) {
        query = query.or(`name.ilike.%${search_query}%,name_ru.ilike.%${search_query}%`);
      }
    } else {
      query = supabase
        .from('list_country')
        .select('id, name, code')
        .order('name', { ascending: true })
        .limit(50)

      if (search_query && search_query.length >= 2) {
        query = query.ilike('name', `%${search_query}%`)
      }
    }

    const { data, error } = await query

    if (error) {
      console.error('Database error:', error)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch reference data' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    return new Response(
      JSON.stringify({
        success: true,
        list_type,
        items: data || []
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error in fetch-reference-lists:', error)
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : 'Internal server error'
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  }
})