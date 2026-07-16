import { useState } from 'react'
import { X } from 'lucide-react'

function ChallengePreviewModal({ challenge, onClose }) {
  const [started, setStarted] = useState(false)

  const handleStart = () => {
    // Placeholder — real version should POST to a backend endpoint
    // that records start time and returns the actual timer/challenge detail.
    console.log('Start challenge requested (no backend endpoint yet):', challenge.id)
    setStarted(true)
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-panel-navy rounded-2xl p-6 w-full max-w-md"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-start mb-4">
          <div>
            <p className="text-xs text-signal-amber uppercase tracking-wide mb-1">
              {challenge.category} · Level {challenge.level}
            </p>
            <h2 className="font-display text-xl text-parchment">{challenge.name}</h2>
          </div>
          <button onClick={onClose} className="text-white/40 hover:text-white/80">
            <X size={20} />
          </button>
        </div>

        <p className="text-sm text-white/50 mb-4">
          Brief description not yet available from the API — pending backend field.
        </p>

        <div className="flex items-center justify-between mb-6">
          <span className="text-xs text-white/40">Estimated time: pending backend</span>
          <span className="font-mono text-sm text-signal-amber">{challenge.value} pts</span>
        </div>

        {!started ? (
          <div className="flex gap-3">
            <button
              onClick={handleStart}
              className="flex-grow bg-signal-amber text-ink-navy font-medium text-sm py-2.5 rounded-xl"
            >
              Start Challenge
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-sm text-white/50 border border-white/10"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div>
            <p className="text-xs text-hub-sage mb-2">
              Started — timer display pending backend timer API
            </p>
            <div className="bg-ink-navy rounded-xl p-3 text-center mb-3">
              <p className="text-[10px] text-white/30 uppercase tracking-wide">Time remaining</p>
              <p className="font-mono text-2xl text-white/20">--:--</p>
            </div>
            <button
              onClick={onClose}
              className="w-full text-sm text-white/50 border border-white/10 rounded-xl py-2"
            >
              Close preview
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ChallengePreviewModal
