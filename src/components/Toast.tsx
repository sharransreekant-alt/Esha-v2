import React, { createContext, useContext, useState, useCallback } from 'react'

interface ToastCtx { showToast: (msg: string) => void }
const Ctx = createContext<ToastCtx>({ showToast: () => {} })

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [msg, setMsg]       = useState('')
  const [visible, setVisible] = useState(false)
  const timer = React.useRef<ReturnType<typeof setTimeout>>()

  const showToast = useCallback((m: string) => {
    setMsg(m); setVisible(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setVisible(false), 2600)
  }, [])

  return (
    <Ctx.Provider value={{ showToast }}>
      {children}
      <div style={{
        position: 'fixed', bottom: 28, left: '50%',
        transform: `translateX(-50%) translateY(${visible ? 0 : 14}px)`,
        background: 'var(--text)', color: 'var(--cream)',
        padding: '11px 22px', borderRadius: 24,
        fontFamily: 'Nunito, sans-serif', fontSize: 14, fontWeight: 700,
        zIndex: 300, opacity: visible ? 1 : 0, pointerEvents: 'none',
        transition: 'opacity 0.22s, transform 0.22s',
        boxShadow: '0 6px 28px rgba(46,28,18,0.3)', whiteSpace: 'nowrap',
      }}>
        {msg}
      </div>
    </Ctx.Provider>
  )
}

export const useToast = () => useContext(Ctx)
