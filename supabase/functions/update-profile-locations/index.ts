import { createClient } from 'npm:@supabase/supabase-js@2.57.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
}

interface LocationItem {
  type: 'city' | 'country'
  id: number
  name: string
}

interface RequestBody {
  profile_id: string
  locations: LocationItem[]
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Missing authorization header' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Missing Supabase environment variables')
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const { profile_id, locations }: RequestBody = await req.json()

    if (!profile_id) {
      return new Response(
        JSON.stringify({ error: 'profile_id is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    if (user.id !== profile_id) {
      return new Response(
        JSON.stringify({ error: 'Cannot update another user\'s profile' }),
        {
          status: 403,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    if (!Array.isArray(locations)) {
      return new Response(
        JSON.stringify({ error: 'locations must be an array' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    if (locations.length > 3) {
      return new Response(
        JSON.stringify({ error: 'Maximum 3 locations allowed' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    for (const location of locations) {
      if (!location.type || !['city', 'country'].includes(location.type)) {
        return new Response(
          JSON.stringify({ error: 'Invalid location type. Must be "city" or "country"' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      }
      if (!location.id || !location.name) {
        return new Response(
          JSON.stringify({ error: 'Each location must have id and name' }),
          {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      }
    }

    const { error: deleteError } = await supabase
      .from('relations')
      .delete()
      .eq('src_table', 'profiles')
      .eq('src_id', profile_id)
      .in('type', ['city', 'country'])

    if (deleteError) {
      console.error('Error deleting old location relations:', deleteError)
      return new Response(
        JSON.stringify({ error: 'Failed to update locations' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    if (locations.length > 0) {
      const relationsToInsert = locations.map(location => ({
        type: location.type,
        src_table: 'profiles',
        src_id: profile_id,
        dst_table: location.type === 'city' ? 'list_city' : 'list_country',
        dst_id: location.id.toString(),
        metadata: { name: location.name }
      }))

      const { error: insertError } = await supabase
        .from('relations')
        .insert(relationsToInsert)

      if (insertError) {
        console.error('Error inserting new location relations:', insertError)
        return new Response(
          JSON.stringify({ error: 'Failed to save locations' }),
          {
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          }
        )
      }
    }

    const cities = locations.filter(l => l.type === 'city')
    const countries = locations.filter(l => l.type === 'country')

    return new Response(
      JSON.stringify({
        success: true,
        location_data: {
          cities,
          countries
        }
      }),
      {
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    )
  } catch (error) {
    console.error('Error in update-profile-locations:', error)
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