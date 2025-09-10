'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Shield, Upload, Eye } from 'lucide-react'

export default function Navigation() {
  const pathname = usePathname()

  const navItems = [
    {
      href: '/',
      label: 'Submit the Spot',
      icon: Upload,
      description: 'Report new vigilante activity'
    },
    {
      href: '/spots',
      label: 'View All Spots',
      icon: Eye,
      description: 'Browse all submitted reports'
    }
  ]

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <Shield className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Spot Vigilante</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`
                    flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors
                    ${isActive 
                      ? 'bg-blue-50 text-blue-700 border border-blue-200' 
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                    }
                  `}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </div>
    </nav>
  )
}
