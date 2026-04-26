import React, { useState, useEffect, useRef } from 'react'
import { FeedComponent, FeedType, FEED_LABELS, FEED_EMOJI } from '../../types'
import { fmtMs, nowInput, inputToDate } from '../../utils/helpers'

interface Props {
  onSave:  (components: FeedComponent[], time: string, notes: string) => void
  onClose: () => void
  initial?: { components: FeedComponent[]; date?: string; time: string; notes: string }
  isEdit?: boolean
}

export function FeedModal({ onSave, onClose, initial, isEdit }: Props) {
  const [components, setComponents]   = useState<FeedComponent[]>(initial?.components || [])
  const [activeSide, setActiveSide]   = useState<FeedType | null>(null)
  const [running, setRunning]         = useState(false)
  const [elapsed, setElapsed]         = useState(0)
  const [startMs, setStartMs]         = useState<number | null>(null)
  const [volType, setVolType]         = useState<FeedType | null>(null)
  const [volVal, setVolVal]           = useState('')
  const [manualSide, setManualSide]   = useState<FeedType | null>(null)
  const [manualDur, setManualDur]     = useState('')
  const [date, setDate]               = useState(initial?.date ? initial.date.slice(0,10) : new Date().toISOString().slice(0,10))
  const [time, setTime]               = useState(initial?.time ? initial.time.slice(0,5) : nowInput())
  const [notes, setNotes]             = useState(initial?.notes || '')

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Timer tick
  useEffect(() => {
    if (running && startMs !== null) {
      intervalRef.current = setInterval(() => {
        setElapsed(Date.now() - startMs)
      }, 500)
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [running, startMs])

  function startTimer(side: FeedType) {
    setActiveSide(side); setElapsed(0); setRunning(true); setStartMs(Date.now())
  }
  function pauseTimer() {
    setRunning(false)
  }
  function resumeTimer() {
    setRunning(true); setStartMs(Date.now() - elapsed)
  }
  function stopTimer() {
    setRunning(false)
    const mins = Math.max(1, Math.round(elapsed / 60000))
    setComponents(c => [...c, { feedType: activeSide!, duration: mins }])
    setActiveSide(null); setElapsed(0); setStartMs(null)
  }
  function addVolume() {
    if (!volType) return
    const v = parseInt(volVal)
    if (!v || v <= 0) return
    setComponents(c => [...c, { feedType: volType, volume: v }])
    setVolType(null); setVolVal('')
  }
  function addManual() {
    if (!manualSide) return
    const d = parseInt(manualDur)
    if (!d || d <= 0) return
    setComponents(c => [...c, { feedType: manualSide, duration: d }])
    setManualSide(null); setManualDur('')
  }
  function removeComponent(i: number) {
    setComponents(c => c.filter((_, idx) => idx !== i))
  }
  function handleSave() {
    let comps = [...components]
    if (activeSide && elapsed > 0) {
      const mins = Math.max(1, Math.round(elapsed / 60000))
      comps = [...comps, { feedType: activeSide, duration: mins }]
    }
    if (!comps.length) { alert('Add at least one feed component'); return }
    onSave(comps, date + 'T' + time, notes)
  }

  const s: React.CSSProperties = {
    position: 'fixed', inset: 0, background: 'rgba(46,28,18,0.45)',
    zIndex: 100, display: 'flex', alignItems: 'flex-end', backdropFilter: 'blur(8px)',
  }

  return (
    <div onClick={onClose} style={s}>
      <div onClick={e => e.stopPropagation()} style={{
        background: 'var(--white)', borderRadius: 'var(--r) var(--r) 0 0',
        width: '100%', maxWidth: 430, margin: '0 auto',
        padding: '8px 20px 48px', maxHeight: '90vh', overflowY: 'auto',
        WebkitOverflowScrolling: 'touch' as any,
        boxShadow: '0 -8px 40px rgba(100,60,20,0.18)',
      }}>
        <div style={{ width: 36, height: 4, background: '#e0d4cc', borderRadius: 2, margin: '12px auto 20px' }} />
        <div style={{ fontFamily: 'Comfortaa, sans-serif', fontSize: 20, fontWeight: 700, textAlign: 'center', marginBottom: 20 }}>
          🍼 {isEdit ? 'Edit Feed' : 'Log Feed'}
        </div>

        {/* Logged components */}
        {components.length > 0 && (
          <div style={{ marginBottom: 12 }}>
            <div className="sec">This feed so far</div>
            {components.map((c, i) => (
              <div key={i} style={{ background: 'var(--cream2)', borderRadius: 'var(--r-xs)', padding: '8px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 13, fontWeight: 700, marginBottom: 6 }}>
                <span style={{ color: 'var(--text-med)' }}>{FEED_EMOJI[c.feedType]} {FEED_LABELS[c.feedType]}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: 'var(--text)', fontWeight: 800 }}>{c.duration ? `${c.duration} min` : c.volume ? `${c.volume} ml` : ''}</span>
                  <button onClick={() => removeComponent(i)} className="del-btn">✕</button>
                </span>
              </div>
            ))}
          </div>
        )}

        {/* Active breast timer */}
        {activeSide && (
          <div style={{ background: 'linear-gradient(135deg,var(--feed-bg),#c8e8ff)', borderRadius: 'var(--r-sm)', padding: 14, marginBottom: 12, textAlign: 'center' }}>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--feed-fg)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 6 }}>
              {FEED_EMOJI[activeSide]} {FEED_LABELS[activeSide]} breast — timing
            </div>
            <div style={{ fontFamily: 'Comfortaa, sans-serif', fontSize: 44, color: 'var(--text)' }}>{fmtMs(elapsed)}</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
              {!running
                ? <button onClick={resumeTimer} style={{ flex: 2, padding: 12, background: 'var(--green)', color: '#fff', border: 'none', borderRadius: 'var(--r-sm)', fontSize: 14, fontWeight: 800, boxShadow: '0 4px 14px rgba(62,184,118,0.3)' }}>▶ Resume</button>
                : <button onClick={pauseTimer}  style={{ flex: 2, padding: 12, background: 'var(--red)',   color: '#fff', border: 'none', borderRadius: 'var(--r-sm)', fontSize: 14, fontWeight: 800, boxShadow: '0 4px 14px rgba(224,90,69,0.3)' }}>⏸ Pause</button>
              }
              <button onClick={stopTimer} style={{ flex: 2, padding: 12, background: 'var(--cream2)', color: 'var(--text-med)', border: '1.5px solid var(--border)', borderRadius: 'var(--r-sm)', fontSize: 14, fontWeight: 800 }}>✓ Done</button>
            </div>
          </div>
        )}

        {/* Breast buttons */}
        {!activeSide && (
          <div style={{ background: 'var(--cream2)', borderRadius: 'var(--r-sm)', padding: 12, marginBottom: 8 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-med)', marginBottom: 8 }}>🤱 Breast — use timer or enter manually</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
              {(['rightBreast', 'leftBreast'] as FeedType[]).map(side => (
                <button key={side} onClick={() => startTimer(side)} style={{ flex: 1, padding: 12, background: 'var(--green)', color: '#fff', border: 'none', borderRadius: 'var(--r-sm)', fontSize: 13, fontWeight: 800, boxShadow: '0 4px 14px rgba(62,184,118,0.3)' }}>
                  ▶ {side === 'rightBreast' ? 'Right' : 'Left'}
                </button>
              ))}
            </div>
            <div style={{ fontSize: 11, fontWeight: 800, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: 7 }}>Or log manually</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 7 }}>
              {(['rightBreast', 'leftBreast'] as FeedType[]).map(side => (
                <button key={side} onClick={() => setManualSide(side)} className={`pill${manualSide === side ? ' on' : ''}`} style={{ flex: 1, textAlign: 'center', padding: '8px 0' }}>
                  {side === 'rightBreast' ? 'Right' : 'Left'}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input className="finput" type="number" placeholder="Duration in mins" inputMode="numeric" style={{ flex: 1 }} value={manualDur} onChange={e => setManualDur(e.target.value)} />
              <button onClick={addManual} style={{ flexShrink: 0, padding: '0 16px', background: 'var(--cream)', border: '1.5px solid var(--border)', borderRadius: 'var(--r-sm)', fontSize: 14, fontWeight: 800, color: 'var(--text-med)' }}>Add</button>
            </div>
          </div>
        )}

        {/* Expressed / Formula */}
        <div style={{ background: 'var(--cream2)', borderRadius: 'var(--r-sm)', padding: 12, marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: 'var(--text-med)', marginBottom: 8 }}>🍶 Expressed / 🍼 Formula — enter volume</div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            {(['expressed', 'formula'] as FeedType[]).map(t => (
              <button key={t} onClick={() => setVolType(t)} className={`pill${volType === t ? ' on' : ''}`} style={{ flex: 1, textAlign: 'center' }}>
                {t === 'expressed' ? '🍶 Expressed' : '🍼 Formula'}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input className="finput" type="number" placeholder="Volume (ml)" inputMode="numeric" style={{ flex: 1 }} value={volVal} onChange={e => setVolVal(e.target.value)} />
            <button onClick={addVolume} style={{ flexShrink: 0, padding: '0 16px', background: 'var(--cream)', border: '1.5px solid var(--border)', borderRadius: 'var(--r-sm)', fontSize: 14, fontWeight: 800, color: 'var(--text-med)' }}>Add</button>
          </div>
        </div>

        {/* Time & notes */}
        <div className="fg">
          <label className="flbl">Date &amp; time started</label>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <input className="finput" type="date" style={{ flex: 1 }} value={date} onChange={e => setDate(e.target.value)} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <input className="finput" type="time" style={{ flex: 1 }} value={time} onChange={e => setTime(e.target.value)} />
            <button onClick={() => { setDate(new Date().toISOString().slice(0,10)); setTime(nowInput()) }}
              style={{ padding: '0 14px', background: 'var(--cream2)', border: '1.5px solid var(--border)', borderRadius: 'var(--r-sm)', color: 'var(--text-med)', fontSize: 13, fontWeight: 700 }}>Now</button>
          </div>
        </div>
        <div className="fg">
          <label className="flbl">Notes (optional)</label>
          <input className="finput" type="text" placeholder="e.g. fussy, good latch" value={notes} onChange={e => setNotes(e.target.value)} />
        </div>

        <button className="btn-primary" onClick={handleSave} style={{ marginTop: 6 }}>
          {isEdit ? 'Update Feed' : components.length ? `Save Feed (${components.length} component${components.length > 1 ? 's' : ''})` : 'Save Feed'}
        </button>
        <button className="btn-secondary" onClick={onClose} style={{ marginTop: 8 }}>Cancel</button>
      </div>
    </div>
  )
}
