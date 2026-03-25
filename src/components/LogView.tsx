import React, { useState } from 'react'
import { useApp } from '../context/AppContext'
import { EntryList } from './EntryList'
import { FeedModal } from './modals/FeedModal'
import { Entry, FeedComponent } from '../types'
import { inputToDate, fmtTime } from '../utils/helpers'
import { LeapCard } from './LeapCard'
import { GuidanceCard } from './GuidanceCard'
import { GoalUpdateCard } from './GoalUpdateCard'

interface SimpleModalProps {
  emoji: string
  title: string
  onClose: () => void
  onSave: (t: string, notes: string, dur?: string) => Promise<void>
  hasDuration?: boolean
  hasNotes?: boolean
}

function SimpleModal({ emoji, title, onClose, onSave, hasDuration, hasNotes = true }: SimpleModalProps) {
  const n = new Date()
  const [time,   setTime]   = useState(`${String(n.getHours()).padStart(2,'0')}:${String(n.getMinutes()).padStart(2,'0')}`)
  const [notes,  setNotes]  = useState('')
  const [dur,    setDur]    = useState('')
  const [saving, setSaving] = useState(false)
  const [error,  setError]  = useState('')

  async function handleSave() {
    setSaving(true)
    setError('')
    try {
      await onSave(time, notes, dur)
    } catch (e: any) {
      console.error('Save failed:', e)
      setError('Save failed — check your connection')
      setSaving(false)
    }
  }

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(46,28,18,0.45)', zIndex: 100, display: 'flex', alignItems: 'flex-end', backdropFilter: 'blur(8px)' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: 'var(--white)', borderRadius: 'var(--r) var(--r) 0 0', width: '100%', maxWidth: 430, margin: '0 auto', padding: '8px 20px 48px', boxShadow: '0 -8px 40px rgba(100,60,20,0.18)' }}>
        <div style={{ width: 36, height: 4, background: '#e0d4cc', borderRadius: 2, margin: '12px auto 20px' }} />
        <div style={{ fontFamily: 'Comfortaa, sans-serif', fontSize: 20, fontWeight: 700, textAlign: 'center', marginBottom: 20 }}>{emoji} {title}</div>
        {hasDuration && (
          <div className="fg">
            <label className="flbl">Duration (minutes)</label>
            <input className="finput" type="number" inputMode="numeric" placeholder="e.g. 10" value={dur} onChange={e => setDur(e.target.value)} />
          </div>
        )}
        <div className="fg">
          <label className="flbl">Time</label>
          <div style={{ display: 'flex', gap: 8 }}>
            <input className="finput" type="time" style={{ flex: 1 }} value={time} onChange={e => setTime(e.target.value)} />
            <button
              onClick={() => { const now = new Date(); setTime(`${String(now.getHours()).padStart(2,'0')}:${String(now.getMinutes()).padStart(2,'0')}`) }}
              style={{ padding: '0 14px', background: 'var(--cream2)', border: '1.5px solid var(--border)', borderRadius: 'var(--r-sm)', color: 'var(--text-med)', fontSize: 13, fontWeight: 700 }}
            >Now</button>
          </div>
        </div>
        {hasNotes && (
          <div className="fg">
            <label className="flbl">Notes (optional)</label>
            <input className="finput" type="text" placeholder="Any observations…" value={notes} onChange={e => setNotes(e.target.value)} />
          </div>
        )}
        {error && <div style={{ color: 'var(--red)', fontSize: 13, fontWeight: 700, marginBottom: 8, textAlign: 'center' }}>{error}</div>}
        <button className="btn-primary" onClick={handleSave} disabled={saving} style={{ marginTop: 6 }}>
          {saving ? 'Saving…' : 'Save'}
        </button>
        <button className="btn-secondary" onClick={onClose} style={{ marginTop: 8 }} disabled={saving}>Cancel</button>
      </div>
    </div>
  )
}

export function LogView() {
  const { entries, saveEntry, updateEntry } = useApp()
  const [modal,     setModal]     = useState<string | null>(null)
  const [editEntry, setEditEntry] = useState<Entry | null>(null)

  const close = () => { setModal(null); setEditEntry(null) }

  async function saveSimple(type: string, time: string, notes: string, dur?: string): Promise<void> {
    await saveEntry({
      type: type as any,
      notes: notes || null,
      ...(dur ? { duration: parseInt(dur) } : {}),
      _t: inputToDate(time),
    } as any)
    close()
  }

  async function saveFeed(components: FeedComponent[], time: string, notes: string) {
    const totalDur = components.filter(c => c.duration).reduce((s, c) => s + (c.duration || 0), 0)
    const totalVol = components.filter(c => c.volume).reduce((s, c)  => s + (c.volume  || 0), 0)
    if (editEntry) {
      await updateEntry(editEntry.id, {
        feedType:   components[0].feedType,
        components,
        duration:   totalDur || null,
        volume:     totalVol || null,
        notes:      notes || null,
        timestamp:  inputToDate(time) as any,
      })
    } else {
      await saveEntry({
        type:       'feed',
        feedType:   components[0].feedType,
        components,
        duration:   totalDur || null,
        volume:     totalVol || null,
        notes:      notes || null,
        _t:         inputToDate(time),
      } as any)
    }
    close()
  }

  const actions = [
    { emoji: '🍼', name: 'Feed',      sub: 'With live timer', bg: 'var(--feed-bg)',  action: () => setModal('feed') },
    { emoji: '💧', name: 'Wee',       sub: 'Wet nappy',       bg: 'var(--wee-bg)',   action: () => setModal('wee') },
    { emoji: '💩', name: 'Poo',       sub: 'Bowel movement',  bg: 'var(--poo-bg)',   action: () => setModal('poo') },
    { emoji: '🤲', name: 'Massage',   sub: 'Log duration',    bg: 'var(--mas-bg)',   action: () => setModal('massage') },
    { emoji: '☀️', name: 'Vitamin D', sub: 'Daily drop',      bg: 'var(--vit-bg)',   action: () => setModal('vitaminD') },
    { emoji: '📝', name: 'Note',      sub: 'Anything else',   bg: 'var(--note-bg)', action: () => setModal('note') },
  ]

  return (
    <div style={{ padding: '18px 16px 72px' }}>
      <GoalUpdateCard />
      <LeapCard />
      <GuidanceCard />
      <div className="sec">Log Activity</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9, marginBottom: 26 }}>
        {actions.map(a => (
          <button key={a.name} onClick={a.action} style={{
            background: 'var(--white)', border: 'none', borderRadius: 'var(--r)',
            boxShadow: 'var(--shadow)', padding: '16px 13px 14px',
            cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: 10,
            transition: 'transform 0.12s',
          }}>
            <div style={{ width: 48, height: 48, borderRadius: 15, background: a.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24 }}>{a.emoji}</div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--text)' }}>{a.name}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, marginTop: 1 }}>{a.sub}</div>
            </div>
          </button>
        ))}
      </div>

      <div className="sec">Recent</div>
      <EntryList entries={entries.slice(0, 10)} onEditFeed={e => { setEditEntry(e); setModal('feed') }} />

      {modal === 'feed' && (
        <FeedModal
          onSave={saveFeed}
          onClose={close}
          isEdit={!!editEntry}
          initial={editEntry ? {
            components: editEntry.components || (editEntry.feedType ? [{ feedType: editEntry.feedType, duration: editEntry.duration, volume: editEntry.volume }] : []),
            time:  fmtTime(editEntry.timestamp),
            notes: editEntry.notes || '',
          } : undefined}
        />
      )}
      {modal === 'wee'      && <SimpleModal emoji="💧" title="Log Wee"        onClose={close} onSave={(t,n)   => saveSimple('wee',      t, n)}    />}
      {modal === 'poo'      && <SimpleModal emoji="💩" title="Log Poo"        onClose={close} onSave={(t,n)   => saveSimple('poo',      t, n)}    />}
      {modal === 'massage'  && <SimpleModal emoji="🤲" title="Log Massage"    onClose={close} onSave={(t,n,d) => saveSimple('massage',  t, n, d)} hasDuration />}
      {modal === 'vitaminD' && <SimpleModal emoji="☀️" title="Vitamin D Drop" onClose={close} onSave={(t,n)   => saveSimple('vitaminD', t, n)}    hasNotes={false} />}
      {modal === 'note'     && <SimpleModal emoji="📝" title="Add Note"       onClose={close} onSave={(t,n)   => saveSimple('note',     t, n)}    />}
    </div>
  )
}
