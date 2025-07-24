'use client'

import { usePathname } from 'next/navigation'

const ConditionalLayout = ({ children }) => {
  const pathname = usePathname()
  
  if (pathname === '/maintenance') {
    return children[1]
  }

  return children
}

export default ConditionalLayout
