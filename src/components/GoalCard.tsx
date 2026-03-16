import React from 'react'

interface Props {
  emoji: string
  label: string
  count: number
  goal:  number
  barColor: string
  extra?: string
  iconBg: string
}

export function GoalCard({ emoji, label, count, goal, barColor, extra, iconBg }: Props) {
  const pct  = Math.min(100, Math.round((count / goal) * 100))
  const done = count >= goal
  const rem  = goal - count

  return (
    <div style={{
      background: done ? 'linear-gradient(135deg,#f0fff6,#e8faf0)' : 'var(--white)',
      borderRadius: 'var(--r-sm)', boxShadow: 'var(--shadow)', padding: '13px 15px',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 9 }}>
        <div style={{ fontSize: 13, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 7 }}>
          <div style={{ width: 28, height: 28, borderRadius: 8, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>
            {emoji}
          </div>
          {label}
        </div>
        <div style={{ fontFamily: 'Comfortaa, sans-serif', fontSize: 15, fontWeight: 700, color: done ? 'var(--green)' : count > 0 ? 'var(--coral)' : 'var(--muted)' }}>
          {count} / {goal}{done ? ' ✓' : ''}
        </div>
      </div>
      <div style={{ height: 8, background: 'var(--cream2)', borderRadius: 8, overflow: 'hidden' }}>
        <div style={{ height: '100%', borderRadius: 8, width: `${pct}%`, background: barColor, transition: 'width 0.5s cubic-bezier(.34,1.56,.64,1)' }} />
      </div>
      <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 700, marginTop: 6 }}>
        {done ? '🎉 Goal reached!' : rem === goal ? 'Not started yet' : `${rem} more to go`}
        {extra ? ` · ${extra}` : ''}
      </div>
    </div>
  )
}
