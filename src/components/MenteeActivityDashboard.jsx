import { useEffect, useState } from 'react'
import api from '../api/client'
import MentorNoteForm from './MentorNoteForm'
import StruggleTimeline from './StruggleTimeline'

const sampleMentees = [
  { id: 1, name: 'Jordan R.', tier: 'Foundational', score: 42, initials: 'JR' },
  { id: 2, name: 'Priya S.', tier: 'Intermediate', score: 68, initials: 'PS' },
  { id: 3, name: 'Elena K.', tier: 'Foundational', score: 51, initials: 'EK' },
  { id: 4, name: 'Marcus T.', tier: 'Advanced', score: 84, initials: 'MT' },
  { id: 5, name: 'New Mentee', tier: 'Foundational', score: 0, initials: 'NM' },
]

const tabs = ['Activity', 'Time on Task', 'CCS Survey', 'Mentor Notes', 'Hub Progress']

function MenteeActivityDashboard() {
  const [challenges, setChallenges] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selected, setSelected] = useState(sampleMentees[0])
  const [activeTab, setActiveTab] = useState('Activity')

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

  const activityLog = selected.score === 0
    ? []
    : challenges.slice(0, 6).map((c, i) => ({
        type: ['Solve', 'Hint', 'Retry', 'Solve', 'Quiz', 'Hint'][i % 6],
        category: c.category,
        name: c.name,
        points: c.value,
        date: `07.${10 + i}.2026`,
      }))

  const typeColor = (type) => {
    if (type === 'Solve') return 'text-hub-sage'
    if (type === 'Hint') return 'text-signal-amber'
    if (type === 'Quiz') return 'text-parchment'
    return 'text-white/40'
  }

  return (
    <div className="h-full flex overflow-hidden">

      <div className="w-64 flex-shrink-0 border-r border-white/10 p-5 overflow-y-auto">
        <p className="font-body text-xs text-white/40 uppercase tracking-wider mb-1">Mentees</p>
        <input
          type="text"
          placeholder="Search"
          className="w-full bg-panel-navy border border-white/10 rounded px-3 py-1.5 text-xs mb-4 focus:outline-none focus:ring-1 focus:ring-signal-amber"
        />
        <div className="flex flex-col gap-2">
          {sampleMentees.map((m) => (
            <div key={m.id} className="tilt-parent">
              <button
                onClick={() => setSelected(m)}
                className={`tilt-card w-full p-3 rounded-2xl flex flex-col text-left cursor-pointer ${
                  selected.id === m.id ? 'bg-panel-navy glow-active' : 'hover:bg-panel-navy/60'
                }`}
                style={selected.id === m.id ? {
                  boxShadow: '0 0 28px 6px rgba(232,163,61,0.28), 0 0 8px 1px rgba(232,163,61,0.35)',
                } : undefined}
              >
                <div className="tilt-content flex items-center gap-2 mb-1">
                  <div className="tilt-badge w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[10px]">
                    {m.initials}
                  </div>
                  <span className="text-sm">{m.name}</span>
                </div>
                <div className="tilt-content flex justify-between items-center">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-white/50">{m.tier}</span>
                  <span className="tilt-badge font-mono text-xs text-signal-amber">{m.score}/105</span>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-grow overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-panel-navy flex items-center justify-center font-display">
              {selected.initials}
            </div>
            <h1 className="font-display text-2xl">{selected.name}</h1>
          </div>
          <div className="text-right">
            <p className="text-xs text-white/40">CCS composite</p>
            <p className="font-mono text-lg text-signal-amber">{selected.score} / 105</p>
          </div>
        </div>

        <div className="flex gap-5 mb-6 border-b border-white/10 pb-2">
          {tabs.map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={`text-sm pb-1 transition-all duration-100 cursor-pointer hover:text-signal-amber hover:-translate-y-0.5 ${
                activeTab === t ? 'text-signal-amber border-b-2 border-signal-amber' : 'text-white/40'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {activeTab === 'Activity' && (
          <>
            {loading && <p className="text-white/40 text-sm">Loading activity...</p>}
            {error && <p className="text-alert-clay text-sm">Error loading data: {error}</p>}
            {!loading && !error && activityLog.length === 0 && (
              <div className="bg-panel-navy rounded-lg p-8 text-center">
                <p className="text-white/60 text-sm mb-1">No activity yet</p>
                <p className="text-white/30 text-xs">
                  {selected.name} hasn't attempted any challenges. Once they do, solves, hints, and retries will show up here.
                </p>
              </div>
            )}
            {!loading && !error && activityLog.length > 0 && (
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="text-white/40 text-xs uppercase">
                    <th className="font-normal pb-3 border-b border-white/10">Type</th>
                    <th className="font-normal pb-3 border-b border-white/10">Category</th>
                    <th className="font-normal pb-3 border-b border-white/10">Challenge</th>
                    <th className="font-normal pb-3 border-b border-white/10">Points</th>
                    <th className="font-normal pb-3 border-b border-white/10">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {activityLog.map((a, i) => (
                    <tr key={i} className="border-b border-white/5">
                      <td className={`py-2.5 ${typeColor(a.type)}`}>{a.type}</td>
                      <td className="py-2.5 text-white/60">{a.category}</td>
                      <td className="py-2.5">{a.name}</td>
                      <td className="py-2.5 font-mono text-xs text-hub-sage">{a.points} pts</td>
                      <td className="py-2.5 text-white/40 font-mono text-xs">{a.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </>
        )}

        {activeTab === 'Time on Task' && <StruggleTimeline menteeName={selected.name} />}

        {activeTab === 'Mentor Notes' && <MentorNoteForm menteeName={selected.name} />}

        {(activeTab === 'CCS Survey' || activeTab === 'Hub Progress') && (
          <p className="text-white/40 text-sm">
            {activeTab} view — not built yet (backend feature not implemented)
          </p>
        )}
      </div>

    </div>
  )
}

export default MenteeActivityDashboard
