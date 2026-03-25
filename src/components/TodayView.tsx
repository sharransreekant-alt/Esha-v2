import React from 'react'
import { useApp } from '../context/AppContext'
import { GoalCard } from './GoalCard'
import { EntryList } from './EntryList'
import { LeapCard } from './LeapCard'
import { GuidanceCard } from './GuidanceCard'
import { GoalUpdateCard } from './GoalUpdateCard'
import { todayOnly, feedVolume } from '../utils/helpers'

export function TodayView() {
  const { entries, activeGoals } = useApp()
  const td = todayOnly(entries)

  const counts = {
    feed:      td.filter(e => e.type === 'feed').length,
    wee:       td.filter(e => e.type === 'wee').length,
    poo:       td.filter(e => e.type === 'poo').length,
    massage:   td.filter(e => e.type === 'massage').length,
    vitaminD:  td.filter(e => e.type === 'vitaminD').length,
    tummyTime: td.filter(e => e.type === 'massage').reduce((s, e) => s + (Number(e.duration) || 0), 0),
  }
  const totalMl = td.reduce((s, e) => s + feedVolume(e), 0)

  const goalsConfig = [
    { key: 'feed',      goalKey: 'feedsPerDay',    emoji: '🍼', label: 'Feeds',      bar: 'linear-gradient(90deg,#7bc4f0,#4a9fd4)', bg: 'var(--feed-bg)', extra: totalMl ? `${totalMl} ml total` : '' },
    { key: 'wee',       goalKey: 'weesPerDay',     emoji: '💧', label: 'Wees',       bar: 'linear-gradient(90deg,#f5d060,#e8a820)', bg: 'var(--wee-bg)',  extra: '' },
    { key: 'poo',       goalKey: 'poosPerDay',     emoji: '💩', label: 'Poos',       bar: 'linear-gradient(90deg,#6dd8a0,#3eb876)', bg: 'var(--poo-bg)',  extra: '' },
    { key: 'massage',   goalKey: 'massagesPerDay', emoji: '🤲', label: 'Massages',   bar: 'linear-gradient(90deg,#c4a0f0,#8a5ec8)', bg: 'var(--mas-bg)',  extra: '' },
    { key: 'vitaminD',  goalKey: 'vitaminDPerDay', emoji: '☀️', label: 'Vitamin D',  bar: 'linear-gradient(90deg,#f5a07a,#f07560)', bg: 'var(--vit-bg)',  extra: '' },
    { key: 'tummyTime', goalKey: 'tummyTimeMins',  emoji: '🏋️', label: 'Tummy time', bar: 'linear-gradient(90deg,#a0d4f0,#5ab4e8)', bg: 'var(--feed-bg)', extra: '' },
  ]

  return (
    <div style={{ padding: '18px 16px 72px' }}>
      <GoalUpdateCard />
      <LeapCard />
      <GuidanceCard />
      <div className="sec">Today's Goals</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9, marginBottom: 24 }}>
        {goalsConfig.map(g => {
          const goalVal = activeGoals[g.goalKey as keyof typeof activeGoals]
          const countVal = counts[g.key as keyof typeof counts]
          // Skip poos if goalVal is -1 (variable age)
          if (goalVal === -1) return (
            <div key={g.key} style={{ background: 'var(--white)', borderRadius: 'var(--r-sm)', boxShadow: 'var(--shadow)', padding: '13px 15px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                <div style={{ width: 28, height: 28, borderRadius: 8, background: g.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>{g.emoji}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 800 }}>{g.label}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, marginTop: 1 }}>Today: {countVal} · Variable at this age — see guidance</div>
                </div>
              </div>
            </div>
          )
          return (
            <GoalCard
              key={g.key}
              emoji={g.emoji}
              label={g.label}
              count={countVal}
              goal={goalVal}
              barColor={g.bar}
              iconBg={g.bg}
              extra={g.extra}
            />
          )
        })}
      </div>
      <div className="sec">Today's Log — {td.length} entries</div>
      <EntryList entries={td} />
    </div>
  )
}
