import { useEffect, useState } from 'react'
import api from '../api/client'

function ChallengeList() {
  const [challenges, setChallenges] = useState([])
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

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

  if (loading) {
    return <p className="font-body text-parchment">Loading challenges...</p>
  }

  if (error) {
    return <p className="font-body text-alert-clay">Error: {error}</p>
  }

  return (
    <div className="p-6">
      <h1 className="font-display text-2xl text-parchment mb-4">
        Challenges ({challenges.length})
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {challenges.map((c) => (
          <div
            key={c.id}
            className="bg-panel-navy rounded p-4 border-l-4 border-signal-amber"
          >
            <p className="font-body text-xs text-signal-amber mb-1">{c.category}</p>
            <p className="font-body text-parchment font-medium mb-2">{c.name}</p>
            <p className="font-mono text-xs text-hub-sage">{c.value} pts</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ChallengeList
