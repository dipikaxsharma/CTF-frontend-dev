import { useEffect, useState } from 'react'
import { Lock, Play, Check } from 'lucide-react'
import api from '../api/client'
import ChallengePreviewModal from './ChallengePreviewModal'

const DIFFICULTY_TO_LEVEL = { Easy: 1, Medium: 2, Hard: 3 }

const STATUS_CONFIG = {
  locked: { color: '#7b8099', bg: '#1a2038', Icon: Lock, label: 'Locked' },
  available: { color: '#E8A33D', bg: '#242b52', Icon: Play, label: 'Available' },
  completed: { color: '#6FA88F', bg: '#1e3630', Icon: Check, label: 'Completed' },
}

function LearningPath() {
  const [challenges, setChallenges] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    api.get('/api/v1/challenges')
      .then((res) => {
        setChallenges(res.data.data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  // --- Derive level + status (mock logic per spec, until backend API provides these) ---
  const grouped = {}
  challenges.forEach((c) => {
    const level = DIFFICULTY_TO_LEVEL[c.tags?.[0]?.value] || 1
    if (!grouped[c.category]) grouped[c.category] = []
    grouped[c.category].push({ ...c, level })
  })

  Object.keys(grouped).forEach((cat) => {
    grouped[cat].sort((a, b) => a.level - b.level) // Sort by level ASC, never alphabetical
    let unlockedNext = true
    grouped[cat] = grouped[cat].map((c) => {
      let status
      if (c.solved_by_me) status = 'completed'
      else if (unlockedNext) {
        status = 'available'
        unlockedNext = false // only one "available" at a time, sequential unlock
      } else status = 'locked'
      return { ...c, status }
    })
  })

  const totalCount = challenges.length
  const completedCount = challenges.filter((c) => c.solved_by_me).length

  if (loading) return <p className="text-white/40 p-6 text-sm">Loading your learning path...</p>
  if (error) return <p className="text-alert-clay p-6 text-sm">Error: {error}</p>

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="flex items-center justify-between mb-2">
        <h1 className="font-display text-2xl">Your learning path</h1>
        <span className="text-[10px] text-white/30 font-mono">
          level/status are placeholders — pending backend API
        </span>
      </div>

      {/* Course progress — Phase 5, using real solve data */}
      <div className="bg-panel-navy rounded-2xl p-4 mb-6 flex items-center gap-6">
        <div>
          <p className="text-xs text-white/40 uppercase tracking-wide mb-1">Course progress</p>
          <p className="font-mono text-lg text-signal-amber">{completedCount} / {totalCount}</p>
        </div>
        <div className="flex-grow h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-signal-amber rounded-full transition-all duration-500"
            style={{ width: `${totalCount ? (completedCount / totalCount) * 100 : 0}%` }}
          />
        </div>
      </div>

      {/* Category sections */}
      {Object.entries(grouped).map(([category, items]) => (
        <div key={category} className="mb-8">
          <h2 className="font-display text-lg text-parchment mb-3">{category}</h2>
          <div className="flex flex-col gap-2">
            {items.map((c) => {
              const cfg = STATUS_CONFIG[c.status]
              const clickable = c.status !== 'locked'
              return (
                <button
                  key={c.id}
                  disabled={!clickable}
                  onClick={() => clickable && setSelected(c)}
                  title={c.status === 'locked' ? 'Complete the previous level first.' : ''}
                  className="flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-150"
                  style={{
                    backgroundColor: cfg.bg,
                    opacity: c.status === 'locked' ? 0.6 : 1,
                    cursor: clickable ? 'pointer' : 'not-allowed',
                  }}
                >
                  <cfg.Icon size={16} color={cfg.color} />
                  <span className="text-sm text-parchment flex-grow">
                    Level {c.level} — {c.name}
                  </span>
                  <span className="font-mono text-xs" style={{ color: cfg.color }}>
                    {c.value} pts
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      ))}

      {/* Reserved sections for future phases — placeholder content per spec */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8 pt-6 border-t border-white/10">
        <div className="bg-panel-navy rounded-2xl p-4">
          <p className="text-xs text-hub-sage uppercase tracking-wide mb-2">Learning insights</p>
          <p className="text-xs text-white/30">Coming soon — pending backend analytics API</p>
        </div>
        <div className="bg-panel-navy rounded-2xl p-4">
          <p className="text-xs text-hub-sage uppercase tracking-wide mb-2">Recommended resources</p>
          <p className="text-xs text-white/30">Coming soon — pending AI recommendation engine</p>
        </div>
        <div className="bg-panel-navy rounded-2xl p-4">
          <p className="text-xs text-hub-sage uppercase tracking-wide mb-2">Suggested next topic</p>
          <p className="text-xs text-white/30">Coming soon — pending learning analytics API</p>
        </div>
      </div>

      {selected && (
        <ChallengePreviewModal challenge={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  )
}

export default LearningPath
