import { useEffect, useState } from 'react'
import api from '../api/client'

function Dashboard() {
  const [challenges, setChallenges] = useState([])
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    api.get('/api/v1/challenges')
      .then((res) => {
        const data = res.data.data
        setChallenges(data)
        if (data.length > 0) setSelected(data[0])
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) return <p className="font-body text-parchment p-6">Loading...</p>
  if (error) return <p className="font-body text-alert-clay p-6">Error: {error}</p>

  const difficultyColor = (tags) => {
    const tag = tags?.[0]?.value
    if (tag === 'Hard') return 'text-alert-clay'
    if (tag === 'Medium') return 'text-signal-amber'
    return 'text-hub-sage'
  }

  return (
    <div className="h-screen flex bg-ink-navy text-parchment overflow-hidden">

      {/* Icon rail */}
      <div className="w-16 flex-shrink-0 bg-panel-navy flex flex-col items-center py-4 gap-4 border-r border-white/10">
        <div className="w-8 h-8 rounded bg-signal-amber flex items-center justify-center font-display text-ink-navy font-bold text-sm">
          MU
        </div>
        <div className="w-10 h-10 rounded flex items-center justify-center bg-white/10">
          <span className="text-xs">CTF</span>
        </div>
        <div className="w-10 h-10 rounded flex items-center justify-center text-white/50">
          <span className="text-xs">Hub</span>
        </div>
      </div>

      {/* List panel */}
      <div className="w-72 flex-shrink-0 border-r border-white/10 overflow-y-auto p-4">
        <p className="font-display text-lg mb-1">MU CyberClinic</p>
        <p className="font-body text-xs text-white/40 tracking-wider mb-3">
          CHALLENGES ({challenges.length})
        </p>
        <div className="flex flex-col gap-2">
          {challenges.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelected(c)}
              className={`text-left p-3 rounded transition ${
                selected?.id === c.id
                  ? 'bg-panel-navy ring-1 ring-signal-amber'
                  : 'hover:bg-panel-navy/60'
              }`}
            >
              <p className="font-body text-sm">{c.name}</p>
              <div className="flex justify-between items-center mt-1">
                <span className="font-body text-xs text-white/40">{c.category}</span>
                <span className="font-mono text-xs text-signal-amber">{c.value} pts</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Detail panel */}
      <div className="flex-grow overflow-y-auto p-8">
        {selected && (
          <>
            <p className={`font-body text-xs mb-2 ${difficultyColor(selected.tags)}`}>
              {selected.tags?.[0]?.value || 'Unrated'} · {selected.category}
            </p>
            <h1 className="font-display text-3xl mb-4">{selected.name}</h1>
            <div className="bg-panel-navy rounded p-6 mb-4">
              <p className="font-mono text-sm text-hub-sage">{selected.value} points</p>
              <p className="font-mono text-xs text-white/40 mt-2">
                {selected.solves} solve{selected.solves !== 1 ? 's' : ''} ·{' '}
                {selected.solved_by_me ? 'Solved by you' : 'Not yet solved'}
              </p>
            </div>
            <input
              type="text"
              placeholder="Enter flag..."
              className="w-full bg-panel-navy border border-white/10 rounded px-4 py-3 font-mono text-sm text-parchment focus:outline-none focus:ring-1 focus:ring-signal-amber"
            />
          </>
        )}
      </div>

    </div>
  )
}

export default Dashboard
