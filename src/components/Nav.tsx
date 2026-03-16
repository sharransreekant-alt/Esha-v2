import React from 'react'
import { useApp } from '../context/AppContext'
import { View } from '../types'

const TABS: { id: View; label: string }[] = [
  { id: 'home',    label: 'Log' },
  { id: 'today',   label: 'Today' },
  { id: 'history', label: 'History' },
  { id: 'more',    label: 'More' },
]

const SUB_VIEWS: View[] = ['growth', 'insights', 'journal', 'handover']

export function Nav() {
  const { view, setView, hasUnreadHandover } = useApp()
  const activeTab = SUB_VIEWS.includes(view) ? 'more' : view
  const unread = hasUnreadHandover()

  return (
    <nav style={{
      background: 'var(--white)', display: 'flex', padding: '8px 12px 0',
      borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, zIndex: 19,
    }}>
      {TABS.map(tab => (
        <button
          key={tab.id}
          onClick={() => setView(tab.id)}
          style={{
            flex: 1, padding: '10px 0',
            fontSize: 12, fontWeight: 800,
            color: activeTab === tab.id ? 'var(--coral)' : 'var(--muted)',
            background: 'none', border: 'none',
            borderBottom: `2.5px solid ${activeTab === tab.id ? 'var(--coral)' : 'transparent'}`,
            transition: 'color 0.2s, border-color 0.2s',
          }}
        >
          {tab.label}{tab.id === 'more' && unread ? ' 🔴' : ''}
        </button>
      ))}
    </nav>
  )
}
