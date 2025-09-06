import React from 'react'

interface UseRealTimeUpdatesOptions {
  refreshInterval?: number // in milliseconds
  enabled?: boolean
}

export function useRealTimeUpdates(
  refreshFn: () => Promise<void>,
  dependencies: React.DependencyList = [],
  options: UseRealTimeUpdatesOptions = {}
) {
  const { refreshInterval = 30000, enabled = true } = options // Default 30 seconds
  
  React.useEffect(() => {
    if (!enabled) return
    
    // Initial load
    refreshFn()
    
    // Set up polling
    const interval = setInterval(() => {
      refreshFn()
    }, refreshInterval)
    
    return () => clearInterval(interval)
  }, [...dependencies, enabled, refreshInterval])
  
  // Handle visibility change to refresh when user returns to tab
  React.useEffect(() => {
    if (!enabled) return
    
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refreshFn()
      }
    }
    
    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [refreshFn, enabled])
}
