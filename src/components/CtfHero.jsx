import { useRef, useMemo, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { EffectComposer, Bloom } from '@react-three/postprocessing'
import * as THREE from 'three'

function Core() {
  const coreRef = useRef()
  const wireRef = useRef()

  useFrame((_, delta) => {
    coreRef.current.rotation.y += delta * 0.25
    coreRef.current.rotation.x = Math.sin(Date.now() * 0.0003) * 0.2
    wireRef.current.rotation.copy(coreRef.current.rotation)
  })

  return (
    <>
      <mesh ref={coreRef}>
        <icosahedronGeometry args={[1.1, 0]} />
        <meshStandardMaterial
          color="#4a7ba6"
          emissive="#112244"
          roughness={0.28}
          metalness={0.75}
          transparent
          opacity={0.92}
        />
      </mesh>
      <mesh ref={wireRef} scale={1.08}>
        <icosahedronGeometry args={[1.1, 0]} />
        <meshBasicMaterial color="#F0EDE4" wireframe transparent opacity={0.25} />
      </mesh>
    </>
  )
}

function ParticleRing() {
  const ref = useRef()
  const count = 1200

  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const col = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      const t = (i / count) * Math.PI * 2
      const radius = 1.55
      pos[i * 3] = Math.cos(t) * radius
      pos[i * 3 + 1] = Math.sin(3 * t) * 0.35
      pos[i * 3 + 2] = Math.sin(t) * radius
      // amber-to-sage color sweep instead of blue/purple
      col[i * 3] = 0.5 + 0.15 * Math.sin(t) // hint of amber only
      col[i * 3 + 1] = 0.4 + 0.3 * Math.cos(1.7 * t)
      col[i * 3 + 2] = 0.8 + 0.2 * Math.sin(2.3 * t)
    }
    return [pos, col]
  }, [])

  useFrame((_, delta) => {
    ref.current.rotation.y += delta * 0.35
    ref.current.rotation.x = Math.sin(Date.now() * 0.0002) * 0.2
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.05} vertexColors transparent blending={THREE.AdditiveBlending} />
    </points>
  )
}

function TorusRings() {
  const ref1 = useRef()
  const ref2 = useRef()

  useFrame((_, delta) => {
    ref1.current.rotation.z += delta * 0.5
    ref2.current.rotation.z += delta * 0.65
  })

  return (
    <>
      <mesh ref={ref1} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[1.45, 0.045, 64, 500]} />
        <meshStandardMaterial color="#88a595" emissive="#223d33" roughness={0.3} metalness={0.9} />
      </mesh>
      <mesh ref={ref2} rotation={[Math.PI / 2 + 0.3, 0, 0]}>
        <torusGeometry args={[1.68, 0.03, 64, 500]} />
        <meshStandardMaterial color="#7ea8d8" emissive="#1a3355" roughness={0.5} metalness={0.7} />
      </mesh>
    </>
  )
}

function Starfield() {
  const ref = useRef()
  const count = 800

  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 200
      pos[i * 3 + 1] = (Math.random() - 0.5) * 100
      pos[i * 3 + 2] = (Math.random() - 0.5) * 80 - 40
    }
    return pos
  }, [])

  useFrame(() => {
    ref.current.rotation.y += 0.0005
    ref.current.rotation.x += 0.0003
  })

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
      </bufferGeometry>
      <pointsMaterial color="#aabfff" size={0.08} transparent opacity={0.6} />
    </points>
  )
}

function Scene() {
  return (
    <>
      <color attach="background" args={['#14192B']} />
      <fog attach="fog" args={['#14192B', 5, 40]} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[2, 3, 4]} intensity={1.2} />
      <pointLight position={[-2, 1, -3]} color="#6FA88F" intensity={0.6} />
      <pointLight position={[1.5, 1, 2]} color="#6fa0d8" intensity={0.5} />
      <pointLight position={[1, 1, 2]} color="#E8A33D" intensity={0.35} />

      <gridHelper args={[12, 24, '#88AAFF', '#335588']} position={[0, -1.8, 0]} material-transparent material-opacity={0.2} />

      <Starfield />
      <Core />
      <ParticleRing />
      <TorusRings />

      <OrbitControls
        enableDamping
        dampingFactor={0.05}
        autoRotate
        autoRotateSpeed={1.2}
        enableZoom
        enablePan={false}
      />

      <EffectComposer>
        <Bloom intensity={0.8} luminanceThreshold={0.1} luminanceSmoothing={0.3} />
      </EffectComposer>
    </>
  )
}

function CtfHero() {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="relative h-full w-full bg-ink-navy overflow-hidden">
      <Canvas camera={{ position: [3, 2, 5], fov: 45 }} onCreated={() => setLoaded(true)}>
        <Scene />
      </Canvas>

      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <p className="font-body text-xs text-signal-amber uppercase tracking-[0.3em] mb-3">
          MU CyberClinic
        </p>
        <h1 className="font-display text-5xl text-parchment mb-2 text-center px-4">
          Welcome to Capture the Flag
        </h1>
        <p className="font-body text-sm text-white/50 max-w-md text-center px-4">
          Tiered challenges, real mentorship, and a research-backed path into cybersecurity.
        </p>
      </div>

      <div
        className="absolute bottom-6 left-0 right-0 flex justify-center transition-opacity duration-1000"
        style={{ opacity: loaded ? 1 : 0 }}
      >
        <div className="font-mono text-xs text-white/70 bg-black/30 border border-white/15 rounded-full px-5 py-2 backdrop-blur-md">
          <span className="text-signal-amber">✦</span> MU CyberClinic{' '}
          <span className="text-hub-sage">| Drag to rotate view</span>
        </div>
      </div>

      <div
        className="absolute inset-0 flex flex-col items-center justify-center gap-3 transition-opacity duration-1000 pointer-events-none"
        style={{ opacity: loaded ? 0 : 1 }}
      >
        <div className="flag-buffer-glow">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <line x1="4" y1="22" x2="4" y2="2" stroke="#F0EDE4" strokeWidth="1.5" strokeLinecap="round" />
            <path
              className="flag-buffer-icon"
              d="M4 3 L19 6 L15 9 L19 12 L4 15 Z"
              fill="#E8A33D"
            />
          </svg>
        </div>
        <p className="font-mono text-xs text-white/50 tracking-wide">Capturing the scene...</p>
      </div>
    </div>
  )
}

export default CtfHero
