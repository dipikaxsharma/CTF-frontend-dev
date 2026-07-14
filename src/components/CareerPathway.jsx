import { useState } from 'react'

// Column x-positions
const COL_X = { feeder: 60, starting: 230, mid: 400, advanced: 570 }
const COLORS = { feeder: '#7b8099', starting: '#6FA88F', mid: '#8a9fd9', advanced: '#E8A33D' }

const roles = [
  // Feeder roles (left, informational, not clickable pathway nodes)
  { id: 'it-support', label: 'IT Support', col: 'feeder', y: 60, openings: 3 },
  { id: 'networking', label: 'Networking', col: 'feeder', y: 120, openings: 2 },
  { id: 'software-dev', label: 'Software Development', col: 'feeder', y: 180, openings: 2 },
  { id: 'systems-eng', label: 'Systems Engineering', col: 'feeder', y: 240, openings: 1 },
  { id: 'financial-risk', label: 'Financial and Risk Analysis', col: 'feeder', y: 300, openings: 1 },
  { id: 'security-intel', label: 'Security Intelligence', col: 'feeder', y: 360, openings: 1 },

  // Starting-Level
  {
    id: 'specialist', label: 'Cybersecurity Specialist', col: 'starting', y: 60, openings: 3, unlocked: true,
    titles: ['Cybersecurity Specialist', 'IT Security Specialist'], salary: '$65k–$85k',
    skills: ['Networking', 'Basic incident response', 'Security tools'], certs: ['Security+'],
  },
  {
    id: 'crime-analyst', label: 'Cyber Crime Analyst', col: 'starting', y: 150, openings: 2, unlocked: true,
    titles: ['Cyber Crime Analyst', 'Digital Forensics Analyst'], salary: '$60k–$80k',
    skills: ['Forensics', 'Evidence handling', 'Log analysis'], certs: ['GCFA'],
  },
  {
    id: 'incident-analyst', label: 'Incident & Intrusion Analyst', col: 'starting', y: 240, openings: 2, unlocked: true,
    titles: ['Incident Analyst', 'Intrusion Detection Analyst'], salary: '$65k–$88k',
    skills: ['Log analysis', 'Threat detection', 'SIEM tools'], certs: ['CySA+'],
  },
  {
    id: 'it-auditor', label: 'IT Auditor', col: 'starting', y: 330, openings: 1, unlocked: false,
    titles: ['IT Auditor', 'Compliance Analyst'], salary: '$62k–$82k',
    skills: ['Risk assessment', 'Compliance frameworks'], certs: ['CISA'],
  },

  // Mid-Level
  {
    id: 'analyst', label: 'Cybersecurity Analyst', col: 'mid', y: 90, openings: 3, unlocked: true,
    titles: ['Cybersecurity Analyst', 'Information Security Analyst'], salary: '$78k–$102k',
    skills: ['Log analysis', 'Threat detection', 'SIEM tools'], certs: ['Security+', 'CySA+'],
  },
  {
    id: 'consultant', label: 'Cybersecurity Consultant', col: 'mid', y: 210, openings: 2, unlocked: true,
    titles: ['Security Consultant', 'GRC Consultant'], salary: '$85k–$115k',
    skills: ['Risk assessment', 'Client communication', 'Compliance'], certs: ['CISSP'],
  },
  {
    id: 'pentester', label: 'Penetration & Vulnerability Tester', col: 'mid', y: 330, openings: 2, unlocked: true,
    titles: ['Penetration Tester', 'Vulnerability Analyst'], salary: '$95k–$135k',
    skills: ['Web app security', 'Exploitation', 'Report writing'], certs: ['OSCP', 'CEH'],
  },

  // Advanced-Level
  {
    id: 'manager', label: 'Cybersecurity Manager', col: 'advanced', y: 60, openings: 3, unlocked: false,
    titles: ['Cybersecurity Manager', 'Security Operations Manager'], salary: '$115k–$150k',
    skills: ['Team leadership', 'Risk management', 'Budgeting'], certs: ['CISM'],
  },
  {
    id: 'engineer', label: 'Cybersecurity Engineer', col: 'advanced', y: 180, openings: 2, unlocked: false,
    titles: ['Security Engineer', 'Cloud Security Engineer'], salary: '$105k–$145k',
    skills: ['Cryptography', 'Systems design', 'Cloud security'], certs: ['CISSP', 'AWS Security'],
  },
  {
    id: 'architect', label: 'Cybersecurity Architect', col: 'advanced', y: 300, openings: 3, unlocked: false,
    titles: ['Security Architect', 'Enterprise Security Architect'], salary: '$130k–$175k',
    skills: ['Systems design', 'Enterprise architecture', 'Threat modeling'], certs: ['CISSP', 'SABSA'],
  },
]

const roleMap = Object.fromEntries(roles.map((r) => [r.id, r]))

const edges = [
  ['specialist', 'analyst'], ['specialist', 'consultant'], ['specialist', 'pentester'],
  ['crime-analyst', 'analyst'],
  ['incident-analyst', 'analyst'],
  ['it-auditor', 'consultant'],
  ['analyst', 'manager'], ['analyst', 'engineer'], ['analyst', 'architect'],
  ['consultant', 'manager'],
  ['pentester', 'engineer'],
]

function DotIndicator({ count, color }) {
  return (
    <div className="flex gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="w-2 h-2 rounded-full"
          style={{ backgroundColor: i < count ? color : 'rgba(255,255,255,0.12)' }}
        />
      ))}
    </div>
  )
}

function bezier(x1, y1, x2, y2) {
  const mx = (x1 + x2) / 2
  return `M ${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`
}

function CareerPathway() {
  const [hovered, setHovered] = useState(null)
  const [selected, setSelected] = useState(null)

  const focus = hovered || selected?.id

  const connectedIds = new Set()
  if (focus) {
    connectedIds.add(focus)
    edges.forEach(([a, b]) => {
      if (a === focus) connectedIds.add(b)
      if (b === focus) connectedIds.add(a)
    })
  }

  const isDimmed = (id) => focus && !connectedIds.has(id)

  return (
    <div className="h-full overflow-y-auto p-6">
      <div className="flex items-center justify-between mb-1">
        <h1 className="font-display text-2xl">Your career pathway</h1>
        <div className="flex gap-2">
          <span className="text-xs px-4 py-1.5 rounded-full bg-signal-amber text-ink-navy font-medium">Roles</span>
          <span className="text-xs px-4 py-1.5 rounded-full text-white/40">Skills and Certifications</span>
        </div>
      </div>
      <p className="text-sm text-white/40 mb-6">
        Modeled on CyberSeek's role pathway. Hover or click a role to trace its connections. Sample data.
      </p>

      <div className="flex gap-4">
        <div className="flex-grow bg-panel-navy rounded-2xl p-6 overflow-x-auto">
          <div className="relative" style={{ minWidth: 680, height: 430 }}>

            {/* Column headers */}
            {Object.entries({ feeder: 'Feeder Roles', starting: 'Starting-Level', mid: 'Mid-Level', advanced: 'Advanced-Level' }).map(([col, label]) => (
              <div key={col} className="absolute" style={{ left: COL_X[col], top: 0 }}>
                <p className="font-display text-sm text-parchment border-b-2 border-white/20 pb-1 inline-block">{label}</p>
              </div>
            ))}

            {/* Connector arrows */}
            <svg className="absolute top-0 left-0 pointer-events-none" width="680" height="430" style={{ zIndex: 0 }}>
              {edges.map(([a, b], i) => {
                const ra = roleMap[a], rb = roleMap[b]
                const active = connectedIds.has(a) && connectedIds.has(b)
                const dim = focus && !active
                return (
                  <path
                    key={i}
                    d={bezier(COL_X[ra.col] + 90, ra.y + 40, COL_X[rb.col] - 4, rb.y + 40)}
                    fill="none"
                    stroke={active ? '#E8A33D' : '#333c5c'}
                    strokeWidth={active ? 2 : 1.2}
                    opacity={dim ? 0.15 : 1}
                    className={active ? 'pathway-wire-active' : ''}
                    style={{ transition: 'opacity 0.25s ease' }}
                    markerEnd="url(#arrowhead)"
                  />
                )
              })}
              <defs>
                <marker id="arrowhead" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
                  <path d="M0,0 L6,3 L0,6 Z" fill="#556" />
                </marker>
              </defs>
            </svg>

            {/* Role nodes */}
            {roles.map((r) => {
              const dim = isDimmed(r.id)
              const color = COLORS[r.col]
              const clickable = r.col !== 'feeder'
              return (
                <div
                  key={r.id}
                  className="absolute"
                  style={{
                    left: COL_X[r.col], top: r.y + 26, width: 170,
                    opacity: dim ? 0.25 : 1,
                    transition: 'opacity 0.25s ease',
                    cursor: clickable ? 'pointer' : 'default',
                  }}
                  onMouseEnter={() => setHovered(r.id)}
                  onMouseLeave={() => setHovered(null)}
                  onClick={() => clickable && setSelected(r)}
                >
                  <p
                    className="text-xs mb-1.5 leading-tight"
                    style={{ color: r.col === 'feeder' ? '#c9cee0' : '#F0EDE4', fontWeight: selected?.id === r.id ? 600 : 400 }}
                  >
                    {r.label}
                  </p>
                  <DotIndicator count={r.openings} color={color} />
                </div>
              )
            })}
          </div>

          <div className="flex items-center gap-6 mt-4 pt-4 border-t border-white/10 text-[11px] text-white/40">
            <span className="text-white/50 font-medium">Job Openings</span>
            <span className="flex items-center gap-1.5"><DotIndicator count={1} color="#7b8099" /> {'< 10,000'}</span>
            <span className="flex items-center gap-1.5"><DotIndicator count={2} color="#7b8099" /> 10,000–30,000</span>
            <span className="flex items-center gap-1.5"><DotIndicator count={3} color="#7b8099" /> {'> 30,000'}</span>
          </div>
        </div>

        <div className="w-72 flex-shrink-0 bg-panel-navy rounded-2xl p-5" style={{ maxHeight: 480, overflowY: 'auto' }}>
          {!selected ? (
            <p className="text-sm text-white/40">Click a Starting, Mid, or Advanced-level role to see its profile.</p>
          ) : (
            <>
              <p className="font-display text-lg text-parchment mb-3">{selected.label}</p>
              <p className="text-[10px] text-white/40 uppercase tracking-wide mb-1.5">Common job titles</p>
              <div className="flex flex-col gap-1 mb-4">
                {selected.titles.map((t) => <span key={t} className="text-xs text-parchment">• {t}</span>)}
              </div>
              <p className="text-[10px] text-white/40 uppercase tracking-wide mb-1.5">Top skills</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {selected.skills.map((s) => (
                  <span key={s} className="text-[10px] px-2 py-1 rounded-full bg-white/5 text-hub-sage border border-white/10">{s}</span>
                ))}
              </div>
              <p className="text-[10px] text-white/40 uppercase tracking-wide mb-1.5">Top certifications</p>
              <div className="flex flex-wrap gap-1.5 mb-4">
                {selected.certs.map((c) => (
                  <span key={c} className="text-[10px] px-2 py-1 rounded-full bg-signal-amber/10 text-signal-amber border border-signal-amber/20">{c}</span>
                ))}
              </div>
              <div className="pt-3 border-t border-white/10">
                <p className="text-[10px] text-white/40 uppercase tracking-wide mb-1">Average salary</p>
                <p className="font-mono text-lg text-parchment">{selected.salary}</p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default CareerPathway
