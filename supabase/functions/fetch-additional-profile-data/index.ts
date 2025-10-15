import { createClient } from 'npm:@supabase/supabase-js@2.57.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
}

interface RequestBody {
  profile_id: string
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

    const { profile_id }: RequestBody = await req.json()

    if (!profile_id) {
      return new Response(
        JSON.stringify({ error: 'profile_id is required' }),
        {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const { data: relations, error: relationsError } = await supabase
      .from('relations')
      .select('type, dst_id, metadata')
      .eq('src_table', 'profiles')
      .eq('src_id', profile_id)
      .in('type', ['city', 'country'])
      .order('created_at', { ascending: true })

    if (relationsError) {
      console.error('Error fetching relations:', relationsError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch location relations' }),
        {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        }
      )
    }

    const cities = []
    const countries = []

    if (relations && relations.length > 0) {
      const cityIds = relations.filter(r => r.type === 'city').map(r => r.dst_id)
      const countryIds = relations.filter(r => r.type === 'country').map(r => r.dst_id)

      if (cityIds.length > 0) {
        const { data: cityData, error: cityError } = await supabase
          .from('list_city')
          .select('id, name, country, population')
          .in('id', cityIds)

        if (cityError) {
          console.error('Error fetching cities:', cityError)
        } else if (cityData) {
          for (const relation of relations.filter(r => r.type === 'city')) {
            const city = cityData.find(c => c.id === parseInt(relation.dst_id))
            if (city) {
              cities.push({
                type: 'city',
                id: city.id,
                name: city.name,
                metadata: {
                  country: city.country,
                  population: city.population
                }
              })
            }
          }
        }
      }

      if (countryIds.length > 0) {
        const { data: countryData, error: countryError } = await supabase
          .from('list_country')
          .select('id, name, code')
          .in('id', countryIds)

        if (countryError) {
          console.error('Error fetching countries:', countryError)
        } else if (countryData) {
          for (const relation of relations.filter(r => r.type === 'country')) {
            const country = countryData.find(c => c.id === parseInt(relation.dst_id))
            if (country) {
              countries.push({
                type: 'country',
                id: country.id,
                name: country.name,
                metadata: {
                  code: country.code
                }
              })
            }
          }
        }
      }
    }

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
    console.error('Error in fetch-additional-profile-data:', error)
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