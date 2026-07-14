import { useState } from 'react'

const resources = [
  { category: 'Cryptography', title: 'Intro to Caesar ciphers', type: 'Article', done: true },
  { category: 'OSINT', title: 'Reverse image search basics', type: 'Video', done: true },
  { category: 'Forensics', title: 'Reading Linux file permissions', type: 'Article', done: false },
  { category: 'Password Cracking', title: 'How hashing works', type: 'Article', done: false },
  { category: 'Networking', title: 'What is DNS exfiltration?', type: 'Video', done: false },
]

const quizQuestion = {
  question: 'What does a hash function primarily provide?',
  options: [
    'Reversible encryption of data',
    'A fixed-size fingerprint of data',
    'Compression of large files',
    'Encryption keys for AES',
  ],
  correct: 1,
}

function LearningHub() {
  const [answered, setAnswered] = useState(null)

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="mb-6">
        <h1 className="font-display text-2xl mb-1">Learning Hub</h1>
        <p className="text-sm text-hub-sage">
          No score, no timer — read, watch, and check your understanding before trying the CTF.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {resources.map((r, i) => (
          <div key={i} className="tilt-parent">
            <div
              className={`tilt-card bg-panel-navy rounded-2xl p-4 border-l-4 ${r.done ? 'glow-active-sage' : ''}`}
              style={{ borderColor: r.done ? '#6FA88F' : '#333c5c' }}
            >
              <div className="tilt-content flex justify-between items-start mb-2">
                <span className="text-xs text-hub-sage">{r.category}</span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-white/50">{r.type}</span>
              </div>
              <p className="tilt-content text-sm mb-2">{r.title}</p>
              <p className={`tilt-content text-xs ${r.done ? 'text-hub-sage' : 'text-white/30'}`}>
                {r.done ? 'Completed' : 'Not started'}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-panel-navy rounded-2xl p-6 max-w-xl">
        <p className="text-xs text-hub-sage uppercase tracking-wide mb-3">Concept check</p>
        <p className="text-sm mb-4">{quizQuestion.question}</p>
        <div className="flex flex-col gap-2">
          {quizQuestion.options.map((opt, i) => {
            const isCorrect = i === quizQuestion.correct
            const isSelected = answered === i
            let style = 'border-white/10'
            if (answered !== null) {
              if (isCorrect) style = 'border-hub-sage bg-hub-sage/10 glow-active-sage'
              else if (isSelected) style = 'border-alert-clay bg-alert-clay/10'
            }
            return (
              <div key={i} className="tilt-parent">
                <button
                  onClick={() => setAnswered(i)}
                  disabled={answered !== null}
                  className={`tilt-card w-full text-left text-sm border rounded-xl px-4 py-2 cursor-pointer hover:border-signal-amber/50 ${style}`}
                >
                  <span className="tilt-content block">{opt}</span>
                </button>
              </div>
            )
          })}
        </div>
        {answered !== null && (
          <p className="text-xs mt-3 text-white/50">
            This quiz score is tracked separately from CTF solves — independent evidence of literacy.
          </p>
        )}
      </div>
    </div>
  )
}

export default LearningHub
