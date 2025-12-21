import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export default function ScrollToTop() {
  const { pathname, search, hash } = useLocation()

  useEffect(() => {
    // If you use #anchors, keep this behavior
    if (hash) return

    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto', // ✅ use auto for reliable "back to top"
    })
  }, [pathname, search, hash])

  return null
}
