import React from 'react'
import { useApp } from '../context/AppContext'
import { GoalCard } from './GoalCard'
import { EntryList } from './EntryList'
import { GOALS } from '../types'
import { LeapCard } from './LeapCard'
import { todayOnly, feedVolume } from '../utils/helpers'

export function TodayView() {
  const { entries } = useApp()
  const td = todayOnly(entries)

  const counts = {
    feed:      td.filter(e => e.type === 'feed').length,
    wee:       td.filter(e => e.type === 'wee').length,
    poo:       td.filter(e => e.type === 'poo').length,
    massage:   td.filter(e => e.type === 'massage').length,
    vitaminD:  td.filter(e => e.type === 'vitaminD').length,
  }
  const totalMl = td.reduce((s, e) => s + feedVolume(e), 0)

  const goals = [
    { key: 'feed',     emoji: '🍼', label: 'Feeds',     bar: 'linear-gradient(90deg,#7bc4f0,#4a9fd4)', bg: 'var(--feed-bg)', extra: totalMl ? `${totalMl} ml total` : '' },
    { key: 'wee',      emoji: '💧', label: 'Wees',      bar: 'linear-gradient(90deg,#f5d060,#e8a820)', bg: 'var(--wee-bg)',  extra: '' },
    { key: 'poo',      emoji: '💩', label: 'Poos',      bar: 'linear-gradient(90deg,#6dd8a0,#3eb876)', bg: 'var(--poo-bg)',  extra: '' },
    { key: 'massage',  emoji: '🤲', label: 'Massages',  bar: 'linear-gradient(90deg,#c4a0f0,#8a5ec8)', bg: 'var(--mas-bg)',  extra: '' },
    { key: 'vitaminD', emoji: '☀️', label: 'Vitamin D', bar: 'linear-gradient(90deg,#f5a07a,#f07560)', bg: 'var(--vit-bg)',  extra: '' },
  ]

  return (
    <div style={{ padding: '18px 16px 72px' }}>
      <LeapCard />
      <div className="sec">Today's Goals</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 24 }}>
        {goals.map(g => (
          <GoalCard
            key={g.key}
            emoji={g.emoji}
            label={g.label}
            count={counts[g.key as keyof typeof counts]}
            goal={GOALS[g.key as keyof typeof GOALS]}
            barColor={g.bar}
            iconBg={g.bg}
            extra={g.extra}
          />
        ))}
      </div>
      <div className="sec">Today's Log — {td.length} entries</div>
      <EntryList entries={td} />
    </div>
  )
}
