import { useState } from 'react'

function MentorNoteForm({ menteeName }) {
  const [note, setNote] = useState('')
  const [savedNotes, setSavedNotes] = useState([])

  const handleSave = () => {
    if (!note.trim()) return
    const entry = { text: note, date: new Date().toLocaleString() }
    console.log('Saved mentor note (no backend yet):', entry)
    setSavedNotes([entry, ...savedNotes])
    setNote('')
  }

  return (
    <div className="max-w-xl">
      <p className="text-xs text-white/40 uppercase tracking-wide mb-3">
        Log a session note — {menteeName}
      </p>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="What did you discuss? What was the mentee stuck on?"
        rows={3}
        className="w-full bg-panel-navy border border-white/10 rounded-xl p-3 text-sm transition-all duration-150 focus:outline-none focus:ring-1 focus:ring-signal-amber focus:border-signal-amber/50 mb-2"
      />
      <div className="tilt-parent inline-block">
        <button
          onClick={handleSave}
          className="tilt-card bg-signal-amber text-ink-navy text-sm font-medium px-4 py-2 rounded-xl cursor-pointer hover:brightness-110"
        >
          Save note
        </button>
      </div>
      <p className="text-[11px] text-white/30 mt-2">
        Not connected to a backend yet — this only logs to your browser console and this session.
      </p>

      {savedNotes.length > 0 && (
        <div className="mt-6 flex flex-col gap-2">
          {savedNotes.map((n, i) => (
            <div key={i} className="tilt-parent">
              <div className="tilt-card bg-panel-navy rounded-lg p-3 glow-active-sage">
                <p className="tilt-content text-sm text-parchment">{n.text}</p>
                <p className="tilt-content text-[11px] text-white/30 mt-1">{n.date}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MentorNoteForm
