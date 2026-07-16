import { Routes, Route } from 'react-router-dom'
import MenteeActivityDashboard from './components/MenteeActivityDashboard'
import LearningHub from './components/LearningHub'
import CareerPathway from './components/CareerPathway'
import NavRail from './components/NavRail'
import CtfHero from './components/CtfHero'

function App() {
  return (
    <div className="h-screen flex bg-ink-navy text-parchment font-body overflow-hidden">
      <NavRail />
      <div className="flex-grow overflow-hidden">
        <Routes>
          <Route path="/" element={<CtfHero />} />
          <Route path="/dashboard" element={<MenteeActivityDashboard />} />
          <Route path="/hub" element={<LearningHub />} />
          <Route path="/pathway" element={<CareerPathway />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
