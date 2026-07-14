const sampleTimeline = [
  { challenge: 'Caesar Salad', category: 'Cryptography', minutes: 6, attempts: 1, status: 'solved' },
  { challenge: 'Street View', category: 'OSINT', minutes: 9, attempts: 2, status: 'solved' },
  { challenge: 'Linux Basics', category: 'Forensics', minutes: 42, attempts: 5, status: 'stuck' },
  { challenge: 'Hash Generation', category: 'Password Cracking', minutes: 14, attempts: 3, status: 'solved' },
  { challenge: 'DNS Exfil', category: 'Networking', minutes: 28, attempts: 4, status: 'in_progress' },
]

const STATUS_STYLES = {
  solved: { color: '#6FA88F', label: 'Solved' },
  stuck: { color: '#C05746', label: 'Stuck — needs check-in' },
  in_progress: { color: '#E8A33D', label: 'In progress' },
}

const MAX_MINUTES = 45

function StruggleTimeline({ menteeName }) {
  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-1">
        <p className="text-xs text-white/40 uppercase tracking-wide">
          Time-on-task — {menteeName}
        </p>
        <span className="text-[10px] text-white/30 font-mono">sample data</span>
      </div>
      <p className="text-xs text-white/30 mb-4">
        Derived from challenge-opened, hint, and submission timestamps. Longer bars, more attempts, or red = worth a check-in.
      </p>

      <div className="flex flex-col gap-3">
        {sampleTimeline.map((row) => {
          const style = STATUS_STYLES[row.status]
          const widthPct = Math.min((row.minutes / MAX_MINUTES) * 100, 100)
          return (
            <div key={row.challenge}>
              <div className="flex justify-between items-center mb-1">
                <div>
                  <span className="text-sm text-parchment">{row.challenge}</span>
                  <span className="text-xs text-white/40 ml-2">{row.category}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs text-white/50">{row.attempts} attempt{row.attempts !== 1 ? 's' : ''}</span>
                  <span className="font-mono text-xs" style={{ color: style.color }}>{row.minutes}m</span>
                </div>
              </div>
              <div className="w-full h-2.5 bg-panel-navy rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${widthPct}%`, backgroundColor: style.color }}
                />
              </div>
              {row.status !== 'solved' && (
                <p className="text-[11px] mt-1" style={{ color: style.color }}>
                  {style.label}
                </p>
              )}
            </div>
          )
        })}
      </div>

      <div className="mt-5 pt-4 border-t border-white/10">
        <p className="text-xs text-white/40">
          <span className="text-alert-clay font-medium">Linux Basics</span> has taken 42 minutes across 5 attempts with no solve —
          this is the strongest signal in this view that a mentor check-in would help.
        </p>
      </div>
    </div>
  )
}

export default StruggleTimeline
