import { Router } from 'express'
import { createClient } from '@supabase/supabase-js'

const router = Router()

router.post('/fetch-by-username', async (req, res) => {
  try {
    const { username } = req.body

    if (!username || typeof username !== 'string') {
      return res.status(400).json({
        error: 'Username is required and must be a string'
      })
    }

    const usernameRegex = /^[a-zA-Z0-9_-]{3,30}$/
    if (!usernameRegex.test(username)) {
      return res.status(400).json({
        error: 'Invalid username format'
      })
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_ANON_KEY
    )

    const { data: profile, error } = await supabase
      .from('profiles')
      .select(`
        id,
        name,
        username,
        about,
        avatar_url,
        cover_url,
        profile_type,
        badge,
        contact_info,
        created_at
      `)
      .eq('username', username)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(200).json({ profile: null })
      }

      console.error('Database error:', error)
      return res.status(500).json({
        error: 'Failed to fetch profile'
      })
    }

    return res.status(200).json({ profile })

  } catch (error) {
    console.error('Unexpected error:', error)
    return res.status(500).json({
      error: 'Internal server error'
    })
  }
})

export default router
