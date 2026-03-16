import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'
import {
  collection, addDoc, deleteDoc, updateDoc, doc,
  query, orderBy, onSnapshot, Timestamp, writeBatch
} from 'firebase/firestore'
import { db } from '../firebase'
import {
  Entry, GrowthEntry, JournalEntry, HandoverEntry,
  View, FEED_CYCLE_MS, REMIND_AT_MS
} from '../types'
import { toDate } from '../utils/helpers'

interface AppState {
  view:           View
  entries:        Entry[]
  growth:         GrowthEntry[]
  journal:        JournalEntry[]
  handovers:      HandoverEntry[]
  loading:        boolean
  who:            string
  reminderDismissed: boolean
  eveningSeen:    string
  handoverSeen:   number
  notifPermission: NotificationPermission | 'unsupported'
}

interface AppContextValue extends AppState {
  setView:       (v: View) => void
  setWho:        (w: string) => void
  saveEntry:     (data: Omit<Entry, 'id' | 'loggedBy' | 'timestamp'> & { _t?: Date }) => Promise<void>
  updateEntry:   (id: string, data: Partial<Entry>) => Promise<void>
  removeEntry:   (id: string) => Promise<void>
  saveGrowth:    (data: Omit<GrowthEntry, 'id' | 'loggedBy' | 'timestamp'>) => Promise<void>
  removeGrowth:  (id: string) => Promise<void>
  saveJournal:   (data: Omit<JournalEntry, 'id' | 'loggedBy' | 'timestamp'>) => Promise<void>
  removeJournal: (id: string) => Promise<void>
  saveHandover:  (data: Omit<HandoverEntry, 'id' | 'from' | 'timestamp'>) => Promise<void>
  removeHandover:(id: string) => Promise<void>
  importEntries: (entries: object[]) => Promise<void>
  dismissReminder: () => void
  markEveningSeen: () => void
  markHandoverSeen: () => void
  requestNotifPermission: () => Promise<void>
  reminderActive: () => boolean
  nextFeedIn:    () => number | null
  hasUnreadHandover: () => boolean
}

const Ctx = createContext<AppContextValue | null>(null)

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>({
    view:    'home',
    entries: [], growth: [], journal: [], handovers: [],
    loading: true,
    who:     localStorage.getItem('eshaWho') || '',
    reminderDismissed: false,
    eveningSeen:  localStorage.getItem('eveningSeen') || '',
    handoverSeen: parseInt(localStorage.getItem('handoverSeen') || '0'),
    notifPermission: typeof Notification !== 'undefined' ? Notification.permission : 'unsupported',
  })

  const set = useCallback((patch: Partial<AppState>) =>
    setState(s => ({ ...s, ...patch })), [])

  // Firebase subscriptions
  useEffect(() => {
    if (!state.who) return
    let loaded = { entries: false, growth: false, journal: false, handover: false }
    const checkDone = () => {
      if (loaded.entries) set({ loading: false })
    }
    // Failsafe — show after 5s no matter what
    const t = setTimeout(() => set({ loading: false }), 5000)

    const unsubs = [
      onSnapshot(query(collection(db, 'esha_entries'), orderBy('timestamp', 'desc')),
        snap => { set({ entries: snap.docs.map(d => ({ id: d.id, ...d.data() } as Entry)) }); loaded.entries = true; checkDone() },
        () => { loaded.entries = true; checkDone() }),
      onSnapshot(query(collection(db, 'esha_growth'), orderBy('timestamp', 'desc')),
        snap => { set({ growth: snap.docs.map(d => ({ id: d.id, ...d.data() } as GrowthEntry)) }); loaded.growth = true },
        () => { loaded.growth = true }),
      onSnapshot(query(collection(db, 'esha_journal'), orderBy('timestamp', 'desc')),
        snap => { set({ journal: snap.docs.map(d => ({ id: d.id, ...d.data() } as JournalEntry)) }); loaded.journal = true },
        () => { loaded.journal = true }),
      onSnapshot(query(collection(db, 'esha_handover'), orderBy('timestamp', 'desc')),
        snap => { set({ handovers: snap.docs.map(d => ({ id: d.id, ...d.data() } as HandoverEntry)) }); loaded.handover = true },
        () => { loaded.handover = true }),
    ]
    return () => { clearTimeout(t); unsubs.forEach(u => u()) }
  }, [state.who, set])

  // Helpers
  const lastFeed = useCallback((): Date | null => {
    const f = state.entries.find(e => e.type === 'feed')
    return f ? toDate(f.timestamp) : null
  }, [state.entries])

  const reminderActive = useCallback((): boolean => {
    if (state.reminderDismissed) return false
    const lf = lastFeed()
    if (!lf) return false
    const el = Date.now() - lf.getTime()
    return el >= REMIND_AT_MS && el < FEED_CYCLE_MS + 30 * 60000
  }, [state.reminderDismissed, lastFeed])

  const nextFeedIn = useCallback((): number | null => {
    const lf = lastFeed()
    if (!lf) return null
    const ms = lf.getTime() + FEED_CYCLE_MS - Date.now()
    return ms > 0 ? ms : 0
  }, [lastFeed])

  const hasUnreadHandover = useCallback((): boolean => {
    const h = state.handovers[0]
    if (!h) return false
    return toDate(h.timestamp).getTime() > state.handoverSeen && h.from !== state.who
  }, [state.handovers, state.handoverSeen, state.who])

  // Write ops
  const saveEntry = async (data: Omit<Entry, 'id' | 'loggedBy' | 'timestamp'> & { _t?: Date }) => {
    const { _t, ...rest } = data as any
    await addDoc(collection(db, 'esha_entries'), {
      ...rest, loggedBy: state.who,
      timestamp: Timestamp.fromDate(_t || new Date()),
    })
  }

  const updateEntry = async (id: string, data: Partial<Entry>) => {
    const { timestamp, ...rest } = data as any
    const patch: any = { ...rest }
    if (timestamp) patch.timestamp = Timestamp.fromDate(toDate(timestamp))
    await updateDoc(doc(db, 'esha_entries', id), patch)
  }

  const removeEntry   = (id: string) => deleteDoc(doc(db, 'esha_entries', id))
  const removeGrowth  = (id: string) => deleteDoc(doc(db, 'esha_growth', id))
  const removeJournal = (id: string) => deleteDoc(doc(db, 'esha_journal', id))
  const removeHandover= (id: string) => deleteDoc(doc(db, 'esha_handover', id))

  const saveGrowth = async (data: Omit<GrowthEntry, 'id' | 'loggedBy' | 'timestamp'>) =>
    addDoc(collection(db, 'esha_growth'), { ...data, loggedBy: state.who, timestamp: Timestamp.now() }).then(() => {})

  const saveJournal = async (data: Omit<JournalEntry, 'id' | 'loggedBy' | 'timestamp'>) =>
    addDoc(collection(db, 'esha_journal'), { ...data, loggedBy: state.who, timestamp: Timestamp.now() }).then(() => {})

  const saveHandover = async (data: Omit<HandoverEntry, 'id' | 'from' | 'timestamp'>) =>
    addDoc(collection(db, 'esha_handover'), { ...data, from: state.who, timestamp: Timestamp.now() }).then(() => {})

  const importEntries = async (entries: object[]) => {
    const CHUNK = 400
    for (let i = 0; i < entries.length; i += CHUNK) {
      const batch = writeBatch(db)
      entries.slice(i, i + CHUNK).forEach((entry: any) => {
        const ref = doc(collection(db, 'esha_entries'))
        const ts = entry.timestamp ? Timestamp.fromDate(new Date(entry.timestamp)) : Timestamp.now()
        batch.set(ref, { ...entry, timestamp: ts })
      })
      await batch.commit()
    }
  }

  const requestNotifPermission = async () => {
    if (typeof Notification === 'undefined') return
    const p = await Notification.requestPermission()
    set({ notifPermission: p })
  }

  const setView  = (view: View)  => set({ view })
  const setWho   = (who: string) => { localStorage.setItem('eshaWho', who); set({ who }) }
  const dismissReminder  = () => set({ reminderDismissed: true })
  const markEveningSeen  = () => { const t = new Date().toDateString(); localStorage.setItem('eveningSeen', t); set({ eveningSeen: t }) }
  const markHandoverSeen = () => {
    const h = state.handovers[0]
    if (!h) return
    const t = toDate(h.timestamp).getTime()
    localStorage.setItem('handoverSeen', String(t))
    set({ handoverSeen: t })
  }

  return (
    <Ctx.Provider value={{
      ...state, setView, setWho,
      saveEntry, updateEntry, removeEntry,
      saveGrowth, removeGrowth,
      saveJournal, removeJournal,
      saveHandover, removeHandover,
      importEntries,
      dismissReminder, markEveningSeen, markHandoverSeen,
      requestNotifPermission,
      reminderActive, nextFeedIn, hasUnreadHandover,
    }}>
      {children}
    </Ctx.Provider>
  )
}

export function useApp() {
  const ctx = useContext(Ctx)
  if (!ctx) throw new Error('useApp must be used inside AppProvider')
  return ctx
}
