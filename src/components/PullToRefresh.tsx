import React, { useRef, useState, useCallback } from 'react'
import { useApp } from '../context/AppContext'

const THRESHOLD    = 72  // px to pull before triggering
const MAX_PULL     = 100 // max visual pull distance

export function PullToRefresh({ children }: { children: React.ReactNode }) {
  const { refresh, loading } = useApp()
  const [pullY,      setPullY]      = useState(0)
  const [refreshing, setRefreshing] = useState(false)
  const startY   = useRef<number | null>(null)
  const pulling  = useRef(false)

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    // Only activate if scrolled to top
    const el = e.currentTarget as HTMLElement
    if (el.scrollTop > 0) return
    startY.current = e.touches[0].clientY
    pulling.current = true
  }, [])

  const onTouchMove = useCallback((e: React.TouchEvent) => {
    if (!pulling.current || startY.current === null) return
    const delta = e.touches[0].clientY - startY.current
    if (delta <= 0) { setPullY(0); return }
    // Resistance curve — gets harder to pull as you go further
    const resistance = 1 - Math.min(delta / (MAX_PULL * 3), 0.6)
    setPullY(Math.min(delta * resistance, MAX_PULL))
  }, [])

  const onTouchEnd = useCallback(() => {
    pulling.current = false
    if (pullY >= THRESHOLD && !refreshing && !loading) {
      setRefreshing(true)
      refresh()
      setTimeout(() => { setRefreshing(false); setPullY(0) }, 1200)
    } else {
      setPullY(0)
    }
    startY.current = null
  }, [pullY, refreshing, loading, refresh])

  const progress  = Math.min(pullY / THRESHOLD, 1)
  const triggered = pullY >= THRESHOLD

  return (
    <div
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
      style={{ height: '100%', overflowY: 'auto', WebkitOverflowScrolling: 'touch' as any, position: 'relative' }}
    >
      {/* Pull indicator */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 10,
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        height: refreshing ? 52 : pullY > 0 ? pullY : 0,
        overflow: 'hidden',
        transition: pullY === 0 ? 'height 0.3s ease' : 'none',
        background: 'var(--cream)',
      }}>
        {(pullY > 0 || refreshing) && (
          <div style={{
            width: 32, height: 32, borderRadius: '50%',
            background: triggered || refreshing ? 'var(--coral)' : 'var(--cream2)',
            border: `2px solid ${triggered || refreshing ? 'var(--coral)' : 'var(--border)'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            transition: 'background 0.2s, border-color 0.2s',
            transform: `rotate(${refreshing ? 0 : progress * 180}deg)`,
            animation: refreshing ? 'ptr-spin 0.8s linear infinite' : 'none',
          }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 2C4.24 2 2 4.24 2 7s2.24 5 5 5 5-2.24 5-5"
                stroke={triggered || refreshing ? 'white' : 'var(--muted)'}
                strokeWidth="1.8" strokeLinecap="round"/>
              <path d="M10 4.5L12 2l2 2.5"
                stroke={triggered || refreshing ? 'white' : 'var(--muted)'}
                strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        )}
      </div>

      {children}

      <style>{`
        @keyframes ptr-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
