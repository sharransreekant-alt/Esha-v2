import React, { useRef } from 'react'
import { useApp } from '../context/AppContext'
import { eshaAge, timeSince, timeUntil, toDate } from '../utils/helpers'

export function Header() {
  const { who, setWho, entries, reminderActive, nextFeedIn, dismissReminder } = useApp()
  const fileRef = useRef<HTMLInputElement>(null)

  const lastFeedEntry = entries.find(e => e.type === 'feed')
  const lf = lastFeedEntry ? toDate(lastFeedEntry.timestamp) : null
  const nfIn = nextFeedIn()
  const showReminder = reminderActive()

  const photo = localStorage.getItem('eshaPhoto')
  const today = new Date().toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' })

  function handlePhotoClick() {
    if (photo) {
      // Show lightbox
      openLightbox(photo)
    } else {
      fileRef.current?.click()
    }
  }

  function handlePhotoBadge(e: React.MouseEvent) {
    e.stopPropagation()
    fileRef.current?.click()
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = ev => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        canvas.width = 200; canvas.height = 200
        const ctx = canvas.getContext('2d')!
        const size = Math.min(img.width, img.height)
        const ox = (img.width - size) / 2, oy = (img.height - size) / 2
        ctx.drawImage(img, ox, oy, size, size, 0, 0, 200, 200)
        try {
          localStorage.setItem('eshaPhoto', canvas.toDataURL('image/jpeg', 0.82))
          window.location.reload()
        } catch { alert('Photo too large') }
      }
      img.src = ev.target?.result as string
    }
    reader.readAsDataURL(file)
  }

  function openLightbox(src: string) {
    const lb = document.createElement('div')
    lb.style.cssText = 'position:fixed;inset:0;z-index:200;background:rgba(20,10,5,0.92);display:flex;flex-direction:column;align-items:center;justify-content:center;backdrop-filter:blur(14px)'
    lb.innerHTML = `
      <img src="${src}" style="width:min(80vw,80vh);height:min(80vw,80vh);border-radius:50%;object-fit:cover;box-shadow:0 8px 60px rgba(0,0,0,0.6);border:4px solid rgba(255,255,255,0.15)">
      <div style="font-family:Comfortaa,sans-serif;font-size:24px;font-weight:700;color:#fff;margin-top:24px">Esha</div>
      <div style="font-size:13px;color:rgba(255,255,255,0.55);font-weight:700;margin-top:5px">${eshaAge()}</div>
      <div style="display:flex;gap:11px;margin-top:28px">
        <button id="lb-change" style="font-family:Nunito,sans-serif;font-size:14px;font-weight:800;padding:12px 22px;border-radius:24px;cursor:pointer;border:none;background:#f07560;color:#fff">📷 Change</button>
        <button id="lb-close"  style="font-family:Nunito,sans-serif;font-size:14px;font-weight:800;padding:12px 22px;border-radius:24px;cursor:pointer;background:rgba(255,255,255,0.13);color:rgba(255,255,255,0.85);border:1px solid rgba(255,255,255,0.2)">Close</button>
      </div>`
    document.body.appendChild(lb)
    lb.querySelector('#lb-close')!.addEventListener('click', () => lb.remove())
    lb.querySelector('#lb-change')!.addEventListener('click', () => { lb.remove(); fileRef.current?.click() })
    lb.addEventListener('click', e => { if (e.target === lb) lb.remove() })
  }

  return (
    <>
      <header style={{
        background: 'linear-gradient(135deg, var(--hdr-from) 0%, var(--hdr-to) 100%)',
        padding: '52px 16px 12px',
        position: 'sticky', top: 0, zIndex: 20,
        boxShadow: '0 2px 20px rgba(180,100,60,0.10)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 13 }}>
          {/* Photo */}
          <div style={{ position: 'relative', flexShrink: 0, width: 72, height: 72 }}>
            <div onClick={handlePhotoClick} style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'var(--white)', border: '3px solid rgba(255,255,255,0.9)',
              boxShadow: '0 3px 14px rgba(180,100,60,0.18)',
              cursor: 'pointer', overflow: 'hidden',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 32,
            }}>
              {photo ? <img src={photo} alt="Esha" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : '👶'}
            </div>
            <div onClick={handlePhotoBadge} style={{
              position: 'absolute', bottom: 1, right: 1,
              width: 22, height: 22, borderRadius: '50%',
              background: 'var(--coral)', border: '2px solid rgba(255,255,255,0.95)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', fontSize: 11, boxShadow: '0 2px 6px rgba(240,117,96,0.4)',
              zIndex: 2,
            }}>📷</div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoChange} />
          </div>

          {/* Info */}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontFamily: 'Comfortaa, sans-serif', fontSize: 22, fontWeight: 700, letterSpacing: -0.3 }}>Esha</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 3, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 11, fontWeight: 800, padding: '3px 10px', borderRadius: 20, background: 'rgba(255,255,255,0.75)', color: 'var(--coral-d)', border: '1px solid rgba(255,255,255,0.5)' }}>
                {eshaAge()}
              </span>
              <span style={{ fontSize: 11, fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: 'rgba(255,255,255,0.5)', color: 'var(--text-med)', border: '1px solid rgba(255,255,255,0.4)' }}>
                {today}
              </span>
            </div>
          </div>

          {/* Who */}
          <div onClick={() => {
            const n = prompt('Your name:', who)
            if (n?.trim()) setWho(n.trim())
          }} style={{
            fontSize: 12, fontWeight: 700, color: 'var(--text-med)',
            background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.5)',
            padding: '6px 13px', borderRadius: 20, cursor: 'pointer', flexShrink: 0,
          }}>
            👤 {who}
          </div>
        </div>

        {/* Timing pills */}
        {lf && (
          <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginTop: 10 }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 800, padding: '5px 12px', borderRadius: 20, background: 'rgba(255,255,255,0.65)', color: '#8a4e28', border: '1px solid rgba(255,255,255,0.4)' }}>
              🕐 Last feed {timeSince(lf)}
            </span>
            {nfIn !== null && (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, fontSize: 11, fontWeight: 800, padding: '5px 12px', borderRadius: 20, background: 'rgba(74,159,212,0.18)', color: '#2a7ab0', border: '1px solid rgba(74,159,212,0.25)' }}>
                ⏱ Next in {timeUntil(nfIn)}
              </span>
            )}
          </div>
        )}
      </header>

      {/* Reminder banner */}
      {showReminder && (
        <div style={{ background: 'linear-gradient(135deg,#fff3e0,#ffebe0)', borderBottom: '1px solid rgba(240,117,96,0.2)', padding: '12px 18px', display: 'flex', alignItems: 'center', gap: 11 }}>
          <span style={{ fontSize: 22 }}>⏰</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--coral-d)' }}>Time to pump! Feed due in 30 mins</div>
            <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, marginTop: 2 }}>
              Last feed {lf ? timeSince(lf) : ''} · Next in {nfIn !== null ? timeUntil(nfIn) : 'soon'}
            </div>
          </div>
          <button onClick={dismissReminder} style={{ background: 'rgba(240,117,96,0.12)', border: 'none', color: 'var(--coral-d)', fontSize: 14, fontWeight: 800, padding: '5px 9px', borderRadius: 8 }}>✕</button>
        </div>
      )}
    </>
  )
}
