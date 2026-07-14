import { useEffect, useState } from 'react'
import api from '../api/client'

const sampleCCS = [
  { label: 'CCS composite', value: 68, color: '#E8A33D' },
  { label: 'Hint independence', value: 54, color: '#6FA88F' },
  { label: 'Hub engagement', value: 82, color: '#F0EDE4' },
]

const sampleGrowth = [41, 45, 52, 58, 61, 68] // pre -> mid -> post trend, sample

const sampleMentorNotes = [
  { name: 'Jordan R.', note: 'Stuck on Forensics — flagged for check-in' },
  { name: 'Priya S.', note: 'Completed on-ramp track, moving to Intermediate' },
  { name: 'Elena K.', note: 'Requested mentor before hint — responded' },
]

const sampleActivity = [
  { text: 'Priya S. solved', bold: 'Caesar Salad', category: 'Cryptography' },
  { text: 'Jordan R. requested a hint on', bold: 'Linux Basics', category: 'Forensics' },
  { text: 'Elena K. completed the', bold: 'General Skills On-Ramp', category: 'Hub' },
]

function CircleStat({ label, value, color }) {
  const circumference = 2 * Math.PI * 15.9155
  const dash = (value / 100) * circumference
  return (
    <div className="bg-panel-navy rounded-lg p-4 flex items-center gap-4 flex-1">
      <div className="flex-shrink-0">
        <p className="font-body text-xs text-white/40 uppercase tracking-wider mb-2">{label}</p>
        <p className="font-display text-2xl text-parchment">{value}%</p>
      </div>
      <svg viewBox="0 0 36 36" className="w-16 h-16 ml-auto">
        <path
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none" stroke="#333c5c" strokeWidth="2.5"
        />
        <path
          d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
          fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference}`}
        />
      </svg>
    </div>
  )
}

function ResearchDashboard() {
  const [challenges, setChallenges] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/api/v1/challenges')
      .then((res) => {
        setChallenges(res.data.data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const categoryCounts = challenges.reduce((acc, c) => {
    acc[c.category] = (acc[c.category] || 0) + 1
    return acc
  }, {})
  const totalChallenges = challenges.length || 1
  const topCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)

  const catColors = ['#E8A33D', '#6FA88F', '#C05746', '#7b8099']

  return (
    <div className="h-screen flex bg-ink-navy text-parchment overflow-hidden font-body">

      {/* Icon rail */}
      <div className="w-16 flex-shrink-0 bg-[#0d1122] flex flex-col items-center py-4 gap-4">
        <div className="w-8 h-8 rounded bg-signal-amber flex items-center justify-center font-display text-ink-navy font-bold text-sm mb-2">
          MU
        </div>
        <div className="w-10 h-10 rounded flex items-center justify-center bg-white/10 text-xs">CTF</div>
        <div className="w-10 h-10 rounded flex items-center justify-center text-white/40 text-xs">Hub</div>
        <div className="w-10 h-10 rounded flex items-center justify-center text-white/40 text-xs">Team</div>
      </div>

      {/* Main content */}
      <div className="flex-grow overflow-y-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="font-display text-2xl">MU CyberClinic — Capital Dashboard</h1>
        </div>

        {/* Stat circles */}
        <div className="flex gap-4 mb-6">
          {sampleCCS.map((s) => <CircleStat key={s.label} {...s} />)}
        </div>

        <div className="flex gap-4">
          {/* Growth line + solved count */}
          <div className="flex-grow bg-panel-navy rounded-lg p-5">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-body text-xs text-white/60 uppercase tracking-wide">
                Capital growth (pre → post)
              </h2>
              <span className="font-mono text-xs text-signal-amber">sample data</span>
            </div>
            <svg viewBox="0 0 300 100" className="w-full h-32">
              <polyline
                fill="none" stroke="#E8A33D" strokeWidth="2"
                points={sampleGrowth.map((v, i) => `${i * 60},${100 - v}`).join(' ')}
              />
              {sampleGrowth.map((v, i) => (
                <circle key={i} cx={i * 60} cy={100 - v} r="3" fill="#E8A33D" />
              ))}
            </svg>
            <p className="font-mono text-xs text-white/40 mt-2">
              {loading ? 'Loading...' : `${totalChallenges} real challenges loaded from CTFd`}
            </p>
          </div>

          {/* Category breakdown - real data */}
          <div className="w-72 flex-shrink-0 bg-panel-navy rounded-lg p-5">
            <h2 className="font-body text-xs text-white/60 uppercase tracking-wide mb-4">
              Challenge categories (live)
            </h2>
            <div className="flex h-2 rounded-full overflow-hidden mb-4">
              {topCategories.map(([cat, count], i) => (
                <div
                  key={cat}
                  style={{ width: `${(count / totalChallenges) * 100}%`, backgroundColor: catColors[i] }}
                />
              ))}
            </div>
            {topCategories.map(([cat, count], i) => (
              <div key={cat} className="flex items-center gap-2 mt-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: catColors[i] }} />
                <span className="font-body text-xs text-white/60 flex-grow">{cat}</span>
                <span className="font-mono text-xs text-white/40">{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel */}
      <div className="w-72 flex-shrink-0 bg-[#0d1122] p-6 overflow-y-auto">
        <div className="flex flex-col items-center mb-6">
          <div className="w-16 h-16 rounded-full bg-panel-navy flex items-center justify-center font-display text-lg mb-3">
            DS
          </div>
          <p className="font-body text-sm">Dipika S.</p>
          <p className="font-body text-xs text-white/40">Research lead</p>
        </div>

        <p className="font-body text-xs text-white/40 uppercase tracking-wide mb-3">Mentor notes (sample)</p>
        {sampleMentorNotes.map((m, i) => (
          <div key={i} className="mb-3 p-3 bg-panel-navy rounded">
            <p className="font-body text-xs text-parchment mb-1">{m.name}</p>
            <p className="font-body text-xs text-white/50">{m.note}</p>
          </div>
        ))}

        <p className="font-body text-xs text-white/40 uppercase tracking-wide mb-3 mt-6">Recent activity (sample)</p>
        {sampleActivity.map((a, i) => (
          <div key={i} className="mb-3">
            <p className="font-body text-xs text-white/60">
              {a.text} <strong className="text-parchment">{a.bold}</strong>
            </p>
            <p className="font-body text-[10px] text-hub-sage mt-0.5">{a.category}</p>
          </div>
        ))}
      </div>

    </div>
  )
}

export default ResearchDashboard
