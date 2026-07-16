import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

// Maps survey dimensions to real CTFd challenge categories.
// Some dimensions (Self-Efficacy, AI Literacy, Career Identity) don't map to a category directly.
const DIMENSION_TO_CATEGORY = {
  Cryptography: 'Cryptography',
  Networking: 'Networking',
  Forensics: 'Forensics',
  OSINT: 'OSINT',
  'Web Security': 'Web Application',
}

const QUESTIONS_META = {
  q1: 'Self-Efficacy', q2: 'AI Literacy', q3: 'Cryptography', q4: 'Networking',
  q5: 'Forensics', q6: 'OSINT', q7: 'Web Security', q8: 'Career Identity',
}

// Mock mentor pool — real version should come from a backend assignment endpoint
const MOCK_MENTORS = ['Dr. Alex Mbaziira', 'Dr. Diane Murphy', 'Nirja P.', 'Oscar R.']

function SurveyResults() {
  const [recommendation, setRecommendation] = useState(null)
  const [mentor, setMentor] = useState(null)

  useEffect(() => {
    const raw = sessionStorage.getItem('ccs_answers')
    if (!raw) return
    const answers = JSON.parse(raw)

    // Find lowest-scored dimension that maps to a real category
    let lowest = null
    Object.entries(answers).forEach(([qId, score]) => {
      const dimension = QUESTIONS_META[qId]
      const category = DIMENSION_TO_CATEGORY[dimension]
      if (category && (!lowest || score < lowest.score)) {
        lowest = { dimension, category, score }
      }
    })
    setRecommendation(lowest)

    // Mock mentor assignment — real version: POST /api/v1/mentor/assign
    const assigned = MOCK_MENTORS[Math.floor(Math.random() * MOCK_MENTORS.length)]
    setMentor(assigned)
    console.log('Mentor assigned (mock, no backend yet):', assigned)
  }, [])

  if (!recommendation) {
    return (
      <div className="h-full flex items-center justify-center">
        <p className="text-white/40 text-sm">No survey answers found — please take the survey first.</p>
      </div>
    )
  }

  return (
    <div className="h-full overflow-y-auto p-6 flex items-center justify-center">
      <div className="max-w-md w-full">
        <p className="text-xs text-signal-amber uppercase tracking-wide mb-2 text-center">Survey complete</p>
        <h1 className="font-display text-2xl mb-6 text-center">Here's where to start</h1>

        <div className="bg-panel-navy rounded-2xl p-6 mb-4">
          <p className="text-[10px] text-white/40 uppercase tracking-wide mb-1">Recommended starting track</p>
          <p className="font-display text-xl text-signal-amber mb-2">{recommendation.category}</p>
          <p className="text-xs text-white/40">
            Based on your {recommendation.dimension} responses — sample logic, not the final scoring model.
          </p>
        </div>

        <div className="bg-panel-navy rounded-2xl p-6 mb-6">
          <p className="text-[10px] text-white/40 uppercase tracking-wide mb-1">Your mentor</p>
          <p className="font-display text-lg text-hub-sage">{mentor}</p>
          <p className="text-xs text-white/40 mt-1">Mock assignment — pending real backend logic</p>
        </div>

        <Link
          to="/learn"
          className="block w-full text-center py-3 rounded-xl font-medium text-sm bg-signal-amber text-ink-navy"
        >
          Go to your learning path
        </Link>
      </div>
    </div>
  )
}

export default SurveyResults
