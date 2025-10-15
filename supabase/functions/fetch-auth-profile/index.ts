import { createClient } from 'npm:@supabase/supabase-js@2.57.0';

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    // Extract the Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Missing Authorization header' }), 
        {
          status: 401,
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          },
        }
      );
    }

    // Initialize Supabase client with the user's token
    // This ensures Row Level Security (RLS) policies are applied
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    // Get the authenticated user's ID from the token
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    if (userError || !user) {
      console.error('User authentication error:', userError);
      return new Response(
        JSON.stringify({ error: 'Unauthorized: Invalid token or user not found' }), 
        {
          status: 401,
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          },
        }
      );
    }

    console.log(`Fetching profile for user: ${user.id}`);

    // Fetch the profile for the authenticated user
    // RLS on the 'profiles' table should ensure the user can only fetch their own profile
    const { data: profile, error: profileError } = await supabaseClient
      .from('profiles')
      .select('name, username, about, avatar_url')
      .eq('user_id', user.id)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      
      // If no profile found, return 404
      if (profileError.code === 'PGRST116') {
        return new Response(
          JSON.stringify({ error: 'Profile not found' }), 
          {
            status: 404,
            headers: { 
              'Content-Type': 'application/json',
              ...corsHeaders
            },
          }
        );
      }

      return new Response(
        JSON.stringify({ error: profileError.message }), 
        {
          status: 500,
          headers: { 
            'Content-Type': 'application/json',
            ...corsHeaders
          },
        }
      );
    }

    console.log(`Profile fetched successfully for user: ${user.id}`);

    return new Response(
      JSON.stringify(profile), 
      {
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        },
      }
    );

  } catch (error) {
    console.error('Edge Function error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }), 
      {
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          ...corsHeaders
        },
      }
    );
  }
});