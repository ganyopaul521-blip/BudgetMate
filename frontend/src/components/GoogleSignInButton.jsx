import { useEffect, useRef, useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import { GOOGLE_CLIENT_ID, loadGoogleIdentity } from '../utils/googleIdentity'

/**
 * Renders Google's own "Sign in with Google" button (via Google Identity
 * Services) and hands the resulting ID token credential to `onCredential`.
 * Renders nothing if VITE_GOOGLE_CLIENT_ID isn't configured, rather than
 * showing a button that can't actually work.
 */
export default function GoogleSignInButton({ onCredential, onError }) {
  const { theme } = useTheme()
  const containerRef = useRef(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!GOOGLE_CLIENT_ID) return
    let cancelled = false

    loadGoogleIdentity()
      .then((google) => {
        if (cancelled || !google) return
        google.accounts.id.initialize({
          client_id: GOOGLE_CLIENT_ID,
          callback: ({ credential }) => onCredential(credential),
        })
        setReady(true)
      })
      .catch(() => onError?.())

    return () => {
      cancelled = true
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!ready || !window.google) return
    const container = containerRef.current
    if (!container) return

    const render = () => {
      const width = Math.max(Math.min(container.offsetWidth || 320, 400), 200)
      container.innerHTML = ''
      window.google.accounts.id.renderButton(container, {
        type: 'standard',
        theme: theme === 'dark' ? 'filled_black' : 'outline',
        size: 'large',
        shape: 'rectangular',
        text: 'continue_with',
        logo_alignment: 'left',
        width,
      })
    }

    render()
    const observer = new ResizeObserver(render)
    observer.observe(container)
    return () => observer.disconnect()
  }, [ready, theme])

  if (!GOOGLE_CLIENT_ID) return null

  return <div ref={containerRef} className="flex w-full justify-center" />
}
