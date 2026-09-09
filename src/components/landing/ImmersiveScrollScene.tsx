'use client';

import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Float, RoundedBox, Text } from '@react-three/drei';
import * as THREE from 'three';

export type ScrollSceneProgress = {
  /** 0–1 overall scroll through the immersive section */
  value: number;
};

function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function smoothstep(edge0: number, edge1: number, x: number) {
  const t = THREE.MathUtils.clamp((x - edge0) / (edge1 - edge0), 0, 1);
  return t * t * (3 - 2 * t);
}

/** Sample a MeetMind-inspired figure: dual arches + central waveform chevron */
function sampleMindFigure(i: number, count: number, out: THREE.Vector3) {
  const t = i / count;
  const band = Math.floor(t * 3) % 3;
  const u = (t * 3) % 1;

  if (band === 0) {
    // Left arch
    const a = Math.PI * 0.15 + u * Math.PI * 0.7;
    out.set(
      -1.35 + Math.cos(a) * 1.1,
      Math.sin(a) * 1.55 - 0.15,
      Math.sin(u * Math.PI * 2) * 0.18
    );
  } else if (band === 1) {
    // Right arch
    const a = Math.PI * 0.15 + u * Math.PI * 0.7;
    out.set(
      1.35 - Math.cos(a) * 1.1,
      Math.sin(a) * 1.55 - 0.15,
      Math.sin(u * Math.PI * 2 + 1) * 0.18
    );
  } else {
    // Central chevron / pulse
    const x = (u - 0.5) * 2.2;
    const y = -0.15 - Math.abs(x) * 0.85;
    out.set(x, y, Math.cos(u * Math.PI * 4) * 0.12);
  }
}

function sampleCompactCore(i: number, count: number, out: THREE.Vector3) {
  const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
  const theta = Math.PI * (1 + Math.sqrt(5)) * i;
  const r = 0.85 + (i % 7) * 0.02;
  out.set(
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.sin(phi) * Math.sin(theta),
    r * Math.cos(phi)
  );
}

function sampleExpandedCloud(i: number, count: number, out: THREE.Vector3) {
  const phi = Math.acos(1 - (2 * (i + 0.5)) / count);
  const theta = Math.PI * (1 + Math.sqrt(5)) * i;
  const lobe = 1 + 0.55 * Math.sin(theta * 2.2) * Math.cos(phi * 3);
  const r = (2.6 + (i % 11) * 0.08) * lobe;
  out.set(
    r * Math.sin(phi) * Math.cos(theta),
    r * Math.sin(phi) * Math.sin(theta) * 0.72,
    r * Math.cos(phi) * 0.9
  );
}

function sampleRingOrbit(i: number, count: number, out: THREE.Vector3) {
  const ring = i % 3;
  const u = (i / count) * Math.PI * 2;
  const radius = 1.4 + ring * 0.55;
  const y = (ring - 1) * 0.35 + Math.sin(u * 2 + ring) * 0.08;
  out.set(Math.cos(u) * radius, y, Math.sin(u) * radius);
}

const tmpA = new THREE.Vector3();
const tmpB = new THREE.Vector3();
const tmpC = new THREE.Vector3();
const tmpD = new THREE.Vector3();
const tmpBlend = new THREE.Vector3();
const tmpOut = new THREE.Vector3();

const MorphingField: React.FC<{
  progressRef: React.MutableRefObject<number>;
  count?: number;
}> = ({ progressRef, count = 1400 }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const materialRef = useRef<THREE.PointsMaterial>(null);

  const positions = useMemo(() => new Float32Array(count * 3), [count]);
  const colors = useMemo(() => {
    const c = new Float32Array(count * 3);
    const rose = new THREE.Color('#f43f5e');
    const amber = new THREE.Color('#f59e0b');
    const soft = new THREE.Color('#fda4af');
    for (let i = 0; i < count; i++) {
      const mix = (i % 17) / 17;
      const col = mix < 0.55 ? rose.clone().lerp(soft, mix) : rose.clone().lerp(amber, (mix - 0.55) / 0.45);
      c[i * 3] = col.r;
      c[i * 3 + 1] = col.g;
      c[i * 3 + 2] = col.b;
    }
    return c;
  }, [count]);

  useFrame((state) => {
    const points = pointsRef.current;
    if (!points) return;

    const p = progressRef.current;
    const expand = smoothstep(0.06, 0.36, p);
    const toFigure = smoothstep(0.38, 0.62, p);
    const settle = smoothstep(0.78, 0.95, p);
    const breath = 1 + Math.sin(state.clock.elapsedTime * 0.9) * 0.02;

    const posAttr = points.geometry.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;

    for (let i = 0; i < count; i++) {
      sampleCompactCore(i, count, tmpA);
      sampleExpandedCloud(i, count, tmpB);
      sampleMindFigure(i, count, tmpC);
      sampleRingOrbit(i, count, tmpD);

      // compact → expanded cloud → MeetMind figure → soft orbit accent
      tmpOut.copy(tmpA).lerp(tmpB, expand);
      tmpOut.lerp(tmpC, toFigure);
      if (settle > 0) {
        tmpBlend.copy(tmpC).lerp(tmpD, 0.45);
        tmpOut.lerp(tmpBlend, settle * 0.55);
      }
      tmpOut.multiplyScalar(breath * lerp(1.15, 1, expand));

      tmpOut.x += state.pointer.x * 0.28 * (1 - settle * 0.5);
      tmpOut.y += state.pointer.y * 0.16 * (1 - settle * 0.5);

      arr[i * 3] = tmpOut.x;
      arr[i * 3 + 1] = tmpOut.y;
      arr[i * 3 + 2] = tmpOut.z;
    }
    posAttr.needsUpdate = true;

    points.rotation.y = state.clock.elapsedTime * 0.08 + state.pointer.x * 0.12;
    points.rotation.x = lerp(points.rotation.x, -state.pointer.y * 0.08, 0.06);

    if (materialRef.current) {
      const figureBoost = smoothstep(0.4, 0.6, p) * (1 - settle);
      materialRef.current.size = lerp(0.038, 0.048, expand) * lerp(1, 1.15, figureBoost) * lerp(1, 0.72, settle);
      materialRef.current.opacity = lerp(0.75, 0.95, expand) * lerp(1, 0.55, settle);
    }
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" count={count} array={positions} itemSize={3} />
        <bufferAttribute attach="attributes-color" count={count} array={colors} itemSize={3} />
      </bufferGeometry>
      <pointsMaterial
        ref={materialRef}
        size={0.032}
        vertexColors
        transparent
        opacity={0.7}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        sizeAttenuation
      />
    </points>
  );
};

const CoreOrb: React.FC<{ progressRef: React.MutableRefObject<number> }> = ({ progressRef }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const p = progressRef.current;
    const expand = smoothstep(0.06, 0.35, p);
    const figure = smoothstep(0.4, 0.58, p);
    const scale = lerp(1.15, 2.6, expand) * lerp(1, 0.22, figure);
    const opacity = lerp(0.9, 0.2, expand) * lerp(1, 0.05, figure);

    if (meshRef.current) {
      meshRef.current.scale.setScalar(scale * (1 + Math.sin(state.clock.elapsedTime * 1.4) * 0.03));
      const mat = meshRef.current.material as THREE.MeshPhysicalMaterial;
      mat.opacity = opacity;
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.25;
      meshRef.current.rotation.z = state.clock.elapsedTime * 0.12;
    }
    if (glowRef.current) {
      glowRef.current.scale.setScalar(scale * 1.45);
      const mat = glowRef.current.material as THREE.MeshBasicMaterial;
      mat.opacity = opacity * 0.35;
    }
  });

  return (
    <group>
      <mesh ref={glowRef}>
        <sphereGeometry args={[0.55, 32, 32]} />
        <meshBasicMaterial color="#f43f5e" transparent opacity={0.25} depthWrite={false} />
      </mesh>
      <mesh ref={meshRef}>
        <icosahedronGeometry args={[0.48, 1]} />
        <meshPhysicalMaterial
          color="#1a0a10"
          emissive="#f43f5e"
          emissiveIntensity={0.55}
          roughness={0.25}
          metalness={0.7}
          transparent
          opacity={0.85}
          clearcoat={0.6}
        />
      </mesh>
    </group>
  );
};

const ExpandingRings: React.FC<{ progressRef: React.MutableRefObject<number> }> = ({ progressRef }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const p = progressRef.current;
    const expand = smoothstep(0.1, 0.45, p);
    const contract = smoothstep(0.5, 0.8, p);
    const scale = lerp(0.6, 2.8, expand) * lerp(1, 0.55, contract);

    if (groupRef.current) {
      groupRef.current.scale.setScalar(scale);
      groupRef.current.rotation.x = Math.PI / 2.4 + state.pointer.y * 0.1;
      groupRef.current.rotation.z = state.clock.elapsedTime * 0.15 + state.pointer.x * 0.15;
      groupRef.current.children.forEach((child, i) => {
        const mesh = child as THREE.Mesh;
        const mat = mesh.material as THREE.MeshBasicMaterial;
        mat.opacity = lerp(0.15, 0.55, expand) * lerp(1, 0.35, contract) * (1 - i * 0.12);
      });
    }
  });

  return (
    <group ref={groupRef}>
      {[1.1, 1.45, 1.85].map((r, i) => (
        <mesh key={r} rotation={[Math.PI / 2, 0, i * 0.4]}>
          <torusGeometry args={[r, 0.012, 12, 96]} />
          <meshBasicMaterial
            color={i === 1 ? '#f59e0b' : '#f43f5e'}
            transparent
            opacity={0.35}
            depthWrite={false}
          />
        </mesh>
      ))}
    </group>
  );
};

const ProductReveal: React.FC<{ progressRef: React.MutableRefObject<number> }> = ({ progressRef }) => {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    const p = progressRef.current;
    const reveal = smoothstep(0.78, 0.96, p);
    if (!groupRef.current) return;
    groupRef.current.visible = reveal > 0.04;
    const s = lerp(0.82, 1, reveal);
    groupRef.current.scale.setScalar(s);
    groupRef.current.position.y = lerp(-0.55, 0.05, reveal);
    groupRef.current.position.z = lerp(-1.2, 0.2, reveal);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      state.pointer.x * 0.18,
      0.06
    );
    groupRef.current.rotation.x = THREE.MathUtils.lerp(
      groupRef.current.rotation.x,
      -state.pointer.y * 0.1,
      0.06
    );
  });

  return (
    <group ref={groupRef} visible={false}>
      <Float speed={1.2} rotationIntensity={0.12} floatIntensity={0.18}>
        <group>
          <RoundedBox args={[3.4, 2.1, 0.07]} radius={0.09} smoothness={4}>
            <meshPhysicalMaterial color="#0d0e14" roughness={0.2} metalness={0.75} clearcoat={0.35} />
          </RoundedBox>
          <RoundedBox position={[0, 0.88, 0.045]} args={[3.25, 0.24, 0.02]} radius={0.03}>
            <meshStandardMaterial color="#141620" />
          </RoundedBox>
          <mesh position={[-1.4, 0.88, 0.06]}>
            <sphereGeometry args={[0.032, 12, 12]} />
            <meshBasicMaterial color="#ef4444" />
          </mesh>
          <mesh position={[-1.28, 0.88, 0.06]}>
            <sphereGeometry args={[0.032, 12, 12]} />
            <meshBasicMaterial color="#eab308" />
          </mesh>
          <mesh position={[-1.16, 0.88, 0.06]}>
            <sphereGeometry args={[0.032, 12, 12]} />
            <meshBasicMaterial color="#22c55e" />
          </mesh>
          <mesh position={[-0.9, 0.2, 0.06]}>
            <sphereGeometry args={[0.07, 16, 16]} />
            <meshBasicMaterial color="#f43f5e" />
          </mesh>
          <Text position={[-0.72, 0.2, 0.06]} fontSize={0.12} color="#f43f5e" anchorX="left" anchorY="middle">
            REC 00:14:32
          </Text>
          {[-0.7, -0.5, -0.3, -0.1, 0.1, 0.3, 0.5, 0.7].map((x, i) => (
            <RoundedBox
              key={x}
              position={[x, -0.25, 0.06]}
              args={[0.06, 0.16 + ((i * 5) % 4) * 0.05, 0.02]}
              radius={0.012}
            >
              <meshStandardMaterial
                color={i % 2 === 0 ? '#f43f5e' : '#f59e0b'}
                emissive={i % 2 === 0 ? '#9f1239' : '#78350f'}
                emissiveIntensity={0.55}
              />
            </RoundedBox>
          ))}
        </group>
      </Float>
    </group>
  );
};

export const ImmersiveScrollScene: React.FC<{
  progressRef: React.MutableRefObject<number>;
  particleCount?: number;
}> = ({ progressRef, particleCount = 1400 }) => {
  return (
    <>
      <ambientLight intensity={0.65} />
      <directionalLight position={[4, 5, 4]} intensity={1.35} color="#ffffff" />
      <pointLight position={[-3, 2, 3]} intensity={2.1} color="#f43f5e" />
      <pointLight position={[3, -1.5, 2]} intensity={1.5} color="#f59e0b" />
      <fog attach="fog" args={['#09090b', 8, 18]} />

      <CoreOrb progressRef={progressRef} />
      <ExpandingRings progressRef={progressRef} />
      <MorphingField progressRef={progressRef} count={particleCount} />
      <ProductReveal progressRef={progressRef} />
    </>
  );
};
