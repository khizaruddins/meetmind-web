'use client';

import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, Text, RoundedBox } from '@react-three/drei';
import * as THREE from 'three';

// 3D Particles Orbiting around the recorder
const SoundParticles: React.FC<{ count?: number }> = ({ count = 35 }) => {
  const pointsRef = useRef<THREE.Points>(null);

  const particlesPosition = React.useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 2.6 + Math.sin(i * 3) * 0.4;
      positions[i * 3] = Math.cos(angle) * radius;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 1.5;
      positions[i * 3 + 2] = Math.sin(angle) * radius;
    }
    return positions;
  }, [count]);

  useFrame((_, delta) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.y += delta * 0.12;
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={particlesPosition.length / 3}
          array={particlesPosition}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.055}
        color="#f43f5e"
        transparent
        opacity={0.65}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
};

// 3D Floating Mockup of the MeetMind Desktop App Window
export const Hero3DScene: React.FC = () => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const { pointer } = state;
    if (groupRef.current) {
      // Subtle mouse parallax tilt
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        pointer.x * 0.14,
        0.05
      );
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        -pointer.y * 0.1,
        0.05
      );
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Ambient & Rim Lighting */}
      <ambientLight intensity={0.9} />
      <directionalLight position={[4, 5, 4]} intensity={1.6} color="#ffffff" />
      <pointLight position={[-3, 2, 3]} intensity={1.8} color="#f43f5e" />
      <pointLight position={[3, -2, 2]} intensity={1.4} color="#f59e0b" />

      {/* Orbiting sound field particles */}
      <SoundParticles count={35} />

      {/* Main Desktop Window Mockup (Depth 0) */}
      <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.25}>
        <group position={[0, 0, 0]}>
          {/* Window Outer Frame */}
          <RoundedBox args={[3.8, 2.4, 0.08]} radius={0.1} smoothness={4}>
            <meshPhysicalMaterial
              color="#0d0e14"
              roughness={0.2}
              metalness={0.8}
              clearcoat={0.3}
              reflectivity={0.5}
            />
          </RoundedBox>

          {/* Window Header / Window Controls */}
          <RoundedBox position={[0, 0.98, 0.05]} args={[3.65, 0.28, 0.02]} radius={0.04}>
            <meshStandardMaterial color="#141620" />
          </RoundedBox>
          {/* Red, Yellow, Green Mac/Window dots */}
          <mesh position={[-1.58, 0.98, 0.07]}>
            <sphereGeometry args={[0.038, 16, 16]} />
            <meshBasicMaterial color="#ef4444" />
          </mesh>
          <mesh position={[-1.45, 0.98, 0.07]}>
            <sphereGeometry args={[0.038, 16, 16]} />
            <meshBasicMaterial color="#eab308" />
          </mesh>
          <mesh position={[-1.32, 0.98, 0.07]}>
            <sphereGeometry args={[0.038, 16, 16]} />
            <meshBasicMaterial color="#22c55e" />
          </mesh>

          {/* Main Display Inner Canvas */}
          <RoundedBox position={[0, -0.12, 0.05]} args={[3.65, 1.8, 0.02]} radius={0.05}>
            <meshStandardMaterial color="#090a0f" roughness={0.4} />
          </RoundedBox>

          {/* Central Recording Pulse Visual in 3D */}
          <mesh position={[-1.0, 0.22, 0.07]}>
            <sphereGeometry args={[0.09, 24, 24]} />
            <meshBasicMaterial color="#f43f5e" />
          </mesh>
          <Text
            position={[-0.8, 0.22, 0.07]}
            fontSize={0.14}
            color="#f43f5e"
            anchorX="left"
            anchorY="middle"
          >
            REC 00:14:32
          </Text>

          {/* Audio Waveform Bars (System + Mic) */}
          {[-0.8, -0.6, -0.4, -0.2, 0.0, 0.2, 0.4, 0.6, 0.8].map((x, i) => {
            const h = 0.18 + ((i * 7) % 5) * 0.06;
            return (
              <RoundedBox
                key={i}
                position={[x, -0.22, 0.07]}
                args={[0.07, h, 0.02]}
                radius={0.015}
              >
                <meshStandardMaterial
                  color={i % 2 === 0 ? '#f43f5e' : '#f59e0b'}
                  emissive={i % 2 === 0 ? '#9f1239' : '#78350f'}
                  emissiveIntensity={0.6}
                />
              </RoundedBox>
            );
          })}

          {/* Status Label */}
          <Text
            position={[0, -0.6, 0.07]}
            fontSize={0.10}
            color="#a1a1aa"
            anchorX="center"
            anchorY="middle"
          >
            Local MP4 • Hardware Accelerated • WebRTC Echo Cancellation
          </Text>
        </group>
      </Float>

      {/* Layered Floating Card 1: Google Meet Detected (Top Left Depth +0.6) */}
      <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.35}>
        <group position={[-1.4, 1.15, 0.6]}>
          <RoundedBox args={[2.0, 0.72, 0.04]} radius={0.07}>
            <meshPhysicalMaterial
              color="#13151f"
              roughness={0.2}
              transmission={0.4}
              thickness={0.2}
              transparent
              opacity={0.92}
            />
          </RoundedBox>
          <mesh position={[-0.72, 0.08, 0.03]}>
            <sphereGeometry args={[0.06, 16, 16]} />
            <meshBasicMaterial color="#10b981" />
          </mesh>
          <Text
            position={[-0.55, 0.1, 0.03]}
            fontSize={0.105}
            color="#ffffff"
            anchorX="left"
            anchorY="middle"
          >
            Google Meet Detected
          </Text>
          <Text
            position={[-0.55, -0.1, 0.03]}
            fontSize={0.08}
            color="#10b981"
            anchorX="left"
            anchorY="middle"
          >
            Auto-Recording Active
          </Text>
        </group>
      </Float>

      {/* Layered Floating Card 2: AI Intelligence & Summary (Bottom Right Depth +0.7) */}
      <Float speed={1.6} rotationIntensity={0.18} floatIntensity={0.3}>
        <group position={[1.35, -0.92, 0.7]}>
          <RoundedBox args={[2.1, 0.95, 0.04]} radius={0.07}>
            <meshPhysicalMaterial
              color="#161824"
              roughness={0.2}
              metalness={0.3}
              transparent
              opacity={0.94}
            />
          </RoundedBox>
          <Text
            position={[-0.85, 0.25, 0.03]}
            fontSize={0.105}
            color="#fbbf24"
            anchorX="left"
            anchorY="middle"
          >
            ⚡ AI Meeting Notes
          </Text>
          <Text
            position={[-0.85, 0.03, 0.03]}
            fontSize={0.08}
            color="#e4e4e7"
            anchorX="left"
            anchorY="middle"
          >
            • Action: Finalize Q4 Roadmap
          </Text>
          <Text
            position={[-0.85, -0.15, 0.03]}
            fontSize={0.08}
            color="#a1a1aa"
            anchorX="left"
            anchorY="middle"
          >
            • Decision: Ship Native App
          </Text>
        </group>
      </Float>

      {/* Layered Floating Card 3: Crystal Clear Audio (Top Right Depth -0.3) */}
      <Float speed={1.2} rotationIntensity={0.12} floatIntensity={0.2}>
        <group position={[1.4, 1.15, -0.3]}>
          <RoundedBox args={[1.85, 0.68, 0.04]} radius={0.07}>
            <meshStandardMaterial color="#12131a" roughness={0.3} />
          </RoundedBox>
          <Text
            position={[-0.72, 0.08, 0.03]}
            fontSize={0.095}
            color="#f43f5e"
            anchorX="left"
            anchorY="middle"
          >
            Acoustic Echo Cancellation
          </Text>
          <Text
            position={[-0.72, -0.1, 0.03]}
            fontSize={0.08}
            color="#71717a"
            anchorX="left"
            anchorY="middle"
          >
            Dual Track: System + Mic
          </Text>
        </group>
      </Float>
    </group>
  );
};
