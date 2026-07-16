import { Link, useLocation } from 'react-router-dom'
import { Home, Flag, BookOpen, Route as RouteIcon, ShieldCheck, GraduationCap, ClipboardList } from 'lucide-react'

const navItems = [
  { to: '/', label: 'Home', Icon: Home },
  { to: '/survey', label: 'Survey', Icon: ClipboardList },
  { to: '/learn', label: 'Learn', Icon: GraduationCap },
  { to: '/dashboard', label: 'CTF', Icon: Flag },
  { to: '/hub', label: 'Hub', Icon: BookOpen },
  { to: '/pathway', label: 'Path', Icon: RouteIcon },
]

function NavRail() {
  const { pathname } = useLocation()

  return (
    <div className="w-16 flex-shrink-0 bg-panel-navy flex flex-col items-center py-4 gap-3 border-r border-white/10 relative">

      {/* Logo — glowing icon box, matching the reference's .logo-icon treatment */}
      <div
        className="w-10 h-10 rounded-2xl flex items-center justify-center mb-2 cursor-default transition-all duration-300 hover:-translate-y-0.5"
        style={{
          background: 'linear-gradient(135deg, rgba(232,163,61,0.22), rgba(111,168,143,0.14))',
          border: '1px solid rgba(232,163,61,0.4)',
          boxShadow: '0 0 20px rgba(232,163,61,0.18)',
        }}
      >
        <ShieldCheck size={20} color="#E8A33D" strokeWidth={2} />
      </div>

      {navItems.map(({ to, label, Icon }) => {
        const active = pathname === to
        return (
          <Link
            key={to}
            to={to}
            className="w-12 h-12 rounded-2xl flex flex-col items-center justify-center gap-0.5 transition-all duration-300 ease-out cursor-pointer"
            style={{
              backgroundColor: active ? 'rgba(232,163,61,0.1)' : 'rgba(255,255,255,0.02)',
              border: `1px solid ${active ? 'rgba(232,163,61,0.35)' : 'transparent'}`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'rgba(232,163,61,0.35)'
              e.currentTarget.style.backgroundColor = 'rgba(232,163,61,0.08)'
            }}
            onMouseLeave={(e) => {
              if (!active) {
                e.currentTarget.style.borderColor = 'transparent'
                e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.02)'
              }
            }}
          >
            <Icon
              size={18}
              strokeWidth={2}
              className="transition-all duration-300 ease-out group-hover:scale-110"
              style={{
                color: active ? '#E8A33D' : 'rgba(255,255,255,0.5)',
                transition: 'transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), color 0.3s ease, filter 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px) scale(1.12) rotate(-4deg)'
                e.currentTarget.style.filter = 'drop-shadow(0 0 8px currentColor)'
                e.currentTarget.style.color = '#E8A33D'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'none'
                e.currentTarget.style.filter = 'none'
                if (!active) e.currentTarget.style.color = 'rgba(255,255,255,0.5)'
              }}
            />
            <span
              className="text-[8px] font-medium transition-colors duration-300"
              style={{ color: active ? '#E8A33D' : 'rgba(255,255,255,0.35)' }}
            >
              {label}
            </span>
          </Link>
        )
      })}

      {/* Status pulse, matching the reference's "online" indicator */}
      <div className="mt-auto flex flex-col items-center gap-1.5">
        <span
          className="w-2 h-2 rounded-full"
          style={{
            backgroundColor: '#6FA88F',
            boxShadow: '0 0 8px rgba(111,168,143,0.7)',
            animation: 'pulse 2s infinite',
          }}
        />
        <span className="text-[7px] text-white/25 tracking-wide">live</span>
      </div>

    </div>
  )
}

export default NavRail
