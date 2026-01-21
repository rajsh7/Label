'use client'

import React, { createContext, useContext, useState } from 'react'
import { cn } from '@/lib/utils/cn'

interface TabsContextValue {
  activeTab: string
  setActiveTab: (value: string) => void
}

const TabsContext = createContext<TabsContextValue | undefined>(undefined)

export interface TabsProps {
  defaultValue: string
  children: React.ReactNode
  className?: string
}

/**
 * Tabs component
 */
export const Tabs: React.FC<TabsProps> = ({ defaultValue, children, className }) => {
  const [activeTab, setActiveTab] = useState(defaultValue)

  return (
    <TabsContext.Provider value={{ activeTab, setActiveTab }}>
      <div className={cn('w-full', className)}>{children}</div>
    </TabsContext.Provider>
  )
}

export interface TabsListProps {
  children: React.ReactNode
  className?: string
}

/**
 * TabsList component
 */
export const TabsList: React.FC<TabsListProps> = ({ children, className }) => {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 bg-[var(--color-bg-secondary)] p-1 rounded-lg',
        className
      )}
    >
      {children}
    </div>
  )
}

export interface TabsTriggerProps {
  value: string
  children: React.ReactNode
  className?: string
}

/**
 * TabsTrigger component
 */
export const TabsTrigger: React.FC<TabsTriggerProps> = ({
  value,
  children,
  className,
}) => {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error('TabsTrigger must be used within Tabs')
  }

  const { activeTab, setActiveTab } = context
  const isActive = activeTab === value

  return (
    <button
      onClick={() => setActiveTab(value)}
      className={cn(
        'px-4 py-2 text-sm font-medium rounded-md transition-colors',
        isActive
          ? 'bg-white text-[var(--color-text-primary)] shadow-sm'
          : 'text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]',
        className
      )}
    >
      {children}
    </button>
  )
}

export interface TabsContentProps {
  value: string
  children: React.ReactNode
  className?: string
}

/**
 * TabsContent component
 */
export const TabsContent: React.FC<TabsContentProps> = ({
  value,
  children,
  className,
}) => {
  const context = useContext(TabsContext)
  if (!context) {
    throw new Error('TabsContent must be used within Tabs')
  }

  const { activeTab } = context

  if (activeTab !== value) return null

  return <div className={cn('mt-4', className)}>{children}</div>
}

