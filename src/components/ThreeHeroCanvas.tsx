import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export const ThreeHeroCanvas: React.FC<{ accentColor?: string }> = ({ accentColor = '#8b5cf6' }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.z = 35;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 1. Starfield Particles (Deep Space Navy & Violet)
    const particleCount = 700;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    const colorViolet = new THREE.Color(accentColor);
    const colorCrimson = new THREE.Color('#f43f5e');
    const colorCyan = new THREE.Color('#38bdf8');

    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 120;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 90;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 80;

      // Color variation
      const rChoice = Math.random();
      const c = rChoice > 0.6 ? colorViolet : rChoice > 0.3 ? colorCrimson : colorCyan;
      colors[i * 3] = c.r;
      colors[i * 3 + 1] = c.g;
      colors[i * 3 + 2] = c.b;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
      size: 0.35,
      vertexColors: true,
      transparent: true,
      opacity: 0.75,
      blending: THREE.AdditiveBlending
    });

    const starParticles = new THREE.Points(geometry, particleMaterial);
    scene.add(starParticles);

    // 2. Central Floating Anime Mana Ring (Torus Knot)
    const torusGeo = new THREE.TorusKnotGeometry(8.5, 1.8, 100, 16);
    const torusMat = new THREE.MeshStandardMaterial({
      color: 0x8b5cf6,
      wireframe: true,
      roughness: 0.2,
      metalness: 0.9,
      emissive: 0x3b0764,
      emissiveIntensity: 0.4
    });
    const torusKnot = new THREE.Mesh(torusGeo, torusMat);
    torusKnot.position.set(16, 0, -5);
    scene.add(torusKnot);

    // 3. Second accent ring (Crimson)
    const ringGeo = new THREE.TorusGeometry(12, 0.4, 16, 100);
    const ringMat = new THREE.MeshBasicMaterial({
      color: 0xf43f5e,
      wireframe: true,
      transparent: true,
      opacity: 0.4
    });
    const ringMesh = new THREE.Mesh(ringGeo, ringMat);
    ringMesh.position.set(16, 0, -5);
    ringMesh.rotation.x = Math.PI / 3;
    scene.add(ringMesh);

    // 4. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x8b5cf6, 2.5, 100);
    pointLight.position.set(10, 10, 20);
    scene.add(pointLight);

    const crimsonLight = new THREE.PointLight(0xf43f5e, 2, 80);
    crimsonLight.position.set(-15, -10, 15);
    scene.add(crimsonLight);

    // Mouse Parallax
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const handleMouseMove = (event: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      mouseX = (event.clientX / innerWidth - 0.5) * 2;
      mouseY = (event.clientY / innerHeight - 0.5) * 2;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Resize handler
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();

      // Smooth camera interpolation
      targetX = mouseX * 4;
      targetY = -mouseY * 4;
      camera.position.x += (targetX - camera.position.x) * 0.05;
      camera.position.y += (targetY - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      // Rotate objects
      torusKnot.rotation.x = elapsedTime * 0.2;
      torusKnot.rotation.y = elapsedTime * 0.25;

      ringMesh.rotation.z = elapsedTime * 0.15;
      ringMesh.rotation.y = elapsedTime * 0.1;

      starParticles.rotation.y = elapsedTime * 0.03;
      starParticles.rotation.x = elapsedTime * 0.015;

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (container && renderer.domElement) {
        container.removeChild(renderer.domElement);
      }
      geometry.dispose();
      particleMaterial.dispose();
      torusGeo.dispose();
      torusMat.dispose();
      ringGeo.dispose();
      ringMat.dispose();
      renderer.dispose();
    };
  }, [accentColor]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-80"
      style={{ filter: 'drop-shadow(0 0 40px rgba(139,92,246,0.3))' }}
    />
  );
};
