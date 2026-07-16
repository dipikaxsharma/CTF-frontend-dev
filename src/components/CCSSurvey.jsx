import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

// Placeholder questions, organized by capital dimension.
// Swap question text with real CCS instrument wording later —
// structure (dimension -> question -> 1-5 answer) stays the same.
const QUESTIONS = [
  { id: 'q1', dimension: 'Self-Efficacy', text: 'I feel confident tackling a cybersecurity problem I have not seen before.' },
  { id: 'q2', dimension: 'AI Literacy', text: 'I understand how AI models can be used in security attacks or defense.' },
  { id: 'q3', dimension: 'Cryptography', text: 'I understand how basic encryption and hashing work.' },
  { id: 'q4', dimension: 'Networking', text: 'I understand how data moves across a network (DNS, packets, ports).' },
  { id: 'q5', dimension: 'Forensics', text: 'I know how to investigate a compromised system or suspicious file.' },
  { id: 'q6', dimension: 'OSINT', text: 'I know how to research and verify information from public sources.' },
  { id: 'q7', dimension: 'Web Security', text: 'I understand common web application vulnerabilities.' },
  { id: 'q8', dimension: 'Career Identity', text: 'I see myself pursuing a career in cybersecurity.' },
]

const SCALE = [1, 2, 3, 4, 5]

function CCSSurvey() {
  const [answers, setAnswers] = useState({})
  const navigate = useNavigate()

  const allAnswered = QUESTIONS.every((q) => answers[q.id])

  const handleSubmit = () => {
    // Placeholder — real version should POST to something like
    // POST /api/v1/ccs/submit  { user_id, answers }
    console.log('CCS Survey submitted (no backend endpoint yet):', answers)

    // Store in sessionStorage so the results/recommendation page can read it
    sessionStorage.setItem('ccs_answers', JSON.stringify(answers))
    navigate('/survey-results')
  }

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="max-w-2xl mx-auto">
        <h1 className="font-display text-2xl mb-1">Skills Survey</h1>
        <p className="text-sm text-white/40 mb-6">
          Answer honestly — this helps us recommend the right starting point and pair you with a mentor. Sample questions, not the final instrument.
        </p>

        <div className="flex flex-col gap-5">
          {QUESTIONS.map((q) => (
            <div key={q.id} className="bg-panel-navy rounded-2xl p-5">
              <p className="text-[10px] text-hub-sage uppercase tracking-wide mb-2">{q.dimension}</p>
              <p className="text-sm text-parchment mb-4">{q.text}</p>
              <div className="flex items-center justify-between gap-2">
                <span className="text-[10px] text-white/30">Disagree</span>
                <div className="flex gap-2">
                  {SCALE.map((n) => (
                    <button
                      key={n}
                      onClick={() => setAnswers((prev) => ({ ...prev, [q.id]: n }))}
                      className="w-9 h-9 rounded-full text-sm font-mono transition-all duration-150"
                      style={{
                        backgroundColor: answers[q.id] === n ? '#E8A33D' : '#242b52',
                        color: answers[q.id] === n ? '#14192B' : '#F0EDE4',
                      }}
                    >
                      {n}
                    </button>
                  ))}
                </div>
                <span className="text-[10px] text-white/30">Agree</span>
              </div>
            </div>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          disabled={!allAnswered}
          className="w-full mt-6 py-3 rounded-xl font-medium text-sm transition-all duration-150"
          style={{
            backgroundColor: allAnswered ? '#E8A33D' : '#242b52',
            color: allAnswered ? '#14192B' : 'rgba(255,255,255,0.3)',
            cursor: allAnswered ? 'pointer' : 'not-allowed',
          }}
        >
          {allAnswered ? 'Submit Survey' : `Answer all ${QUESTIONS.length} questions to continue`}
        </button>
      </div>
    </div>
  )
}

export default CCSSurvey
