'use client'

import { ReactNode } from "react"
import Image from "next/image"

interface CardListItemProps {
  avatarUrl?: string
  title: string
  subtitle?: string
  extraInfo?: ReactNode
  children?: ReactNode
}

export function CardListItem({
  avatarUrl,
  title,
  subtitle,
  extraInfo,
  children,
}: CardListItemProps) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-200 space-x-4">
      {/* Left: Avatar and Info */}
      <div className="flex items-center space-x-4">
        {avatarUrl && (
          <Image
            src={avatarUrl}
            alt={`${title} avatar`}
            width={56}
            height={56}
            className="w-14 h-14 rounded-full border-2 border-indigo-500 object-cover"
          />
        )}
        <div>
          <p className="font-semibold text-lg text-gray-900">{title}</p>
          {subtitle && <p className="text-sm text-gray-600">{subtitle}</p>}
          {extraInfo && (
            <p className="text-sm font-semibold text-purple-600">
              {extraInfo}
            </p>
          )}
        </div>
      </div>

      {/* Right: Buttons */}
      {children && (
        <div className="flex items-center space-x-2">
          {children}
        </div>
      )}
    </div>
  )
}
