"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Sphere, Stars, OrbitControls } from "@react-three/drei";
import { useRef, useMemo, useEffect } from "react";
import * as THREE from "three";
import { useLoader } from "@react-three/fiber";

const CITIES: Record<string, { lat: number; lon: number }> = {
  "Visakhapatnam": { lat: 17.6868, lon: 83.2185 },
  "New Delhi": { lat: 28.6139, lon: 77.2090 },
  "Mumbai": { lat: 19.0760, lon: 72.8777 },
  "Almaty": { lat: 43.2220, lon: 76.8512 },
  "London": { lat: 51.5074, lon: -0.1278 },
  "San Francisco": { lat: 37.7749, lon: -122.4194 },
  "New York": { lat: 40.7128, lon: -74.0060 },
  "Tokyo": { lat: 35.6762, lon: 139.6503 },
  "Sydney": { lat: -33.8688, lon: 151.2093 }
};

const LAYER_HOTSPOTS: Record<string, { lat: number; lon: number; baseScale: number }[]> = {
  "fire": [
    { lat: 38.5816, lon: -121.4944, baseScale: 1.5 }, // California Wildfires
    { lat: -25.2744, lon: 133.7751, baseScale: 2.0 }, // Australian Bushfires
    { lat: -3.4653, lon: -62.2159, baseScale: 1.8 }, // Amazon Rainforest
    { lat: 39.0742, lon: 21.8243, baseScale: 1.0 }, // Greece
    { lat: 53.9333, lon: -116.5765, baseScale: 1.2 }, // Alberta, Canada
    { lat: 61.5240, lon: 105.3188, baseScale: 1.6 }, // Siberian Taiga
    { lat: -0.7893, lon: 113.9213, baseScale: 1.4 }, // Indonesia/Borneo
    { lat: 35.5397, lon: -5.4656, baseScale: 0.9 }, // Mediterranean/Spain
  ],
  "air": [
    { lat: 28.6139, lon: 77.2090, baseScale: 2.5 }, // New Delhi, India
    { lat: 39.9042, lon: 116.4074, baseScale: 2.2 }, // Beijing, China
    { lat: 34.0522, lon: -118.2437, baseScale: 1.2 }, // Los Angeles, USA
    { lat: 19.0760, lon: 72.8777, baseScale: 1.8 }, // Mumbai, India
    { lat: 51.5074, lon: -0.1278, baseScale: 0.8 }, // London, UK
    { lat: 35.6762, lon: 139.6503, baseScale: 1.0 }, // Tokyo, Japan
    { lat: 31.5497, lon: 74.3436, baseScale: 2.6 }, // Lahore, Pakistan
    { lat: 23.8103, lon: 90.4125, baseScale: 2.4 }, // Dhaka, Bangladesh
    { lat: 47.9221, lon: 106.9155, baseScale: 1.9 }, // Ulaanbaatar, Mongolia
    { lat: -6.2088, lon: 106.8456, baseScale: 2.0 }, // Jakarta, Indonesia
  ],
  "water": [
    { lat: 23.8103, lon: 90.4125, baseScale: 2.0 }, // Dhaka, Bangladesh (Flooding)
    { lat: 29.7604, lon: -95.3698, baseScale: 1.5 }, // Houston, USA
    { lat: 51.5074, lon: -0.1278, baseScale: 1.0 }, // London Thames
    { lat: 35.6762, lon: 139.6503, baseScale: 1.2 }, // Tokyo, Japan
    { lat: 25.7617, lon: -80.1918, baseScale: 1.8 }, // Miami, USA
    { lat: 45.4408, lon: 12.3155, baseScale: 1.6 }, // Venice, Italy
    { lat: -6.2088, lon: 106.8456, baseScale: 2.2 }, // Jakarta, Indonesia (Sinking)
    { lat: 14.5995, lon: 120.9842, baseScale: 1.9 }, // Manila, Philippines
    { lat: 29.9511, lon: -90.0715, baseScale: 1.7 }, // New Orleans, USA
    { lat: 10.8231, lon: 106.6297, baseScale: 1.5 }, // Ho Chi Minh City, Vietnam
  ],
  "carbon": [
    { lat: -3.4653, lon: -62.2159, baseScale: 2.5 }, // Amazon Rainforest
    { lat: -0.2280, lon: 22.5744, baseScale: 2.2 },  // Congo Basin
    { lat: -0.7893, lon: 113.9213, baseScale: 2.0 }, // Borneo Rainforest
    { lat: 60.0000, lon: 100.0000, baseScale: 2.4 }, // Siberian Taiga
    { lat: 56.1304, lon: -106.3468, baseScale: 2.1 }, // Canadian Boreal Forest
    { lat: -40.0000, lon: -73.0000, baseScale: 1.5 }, // Valdivian Rainforest
    { lat: -33.8688, lon: 151.2093, baseScale: 1.2 }, // Australian Eucalypt Forests
    { lat: 35.6762, lon: 139.6503, baseScale: 1.0 }, // Japan Forest Cover
    { lat: 15.7835, lon: -90.2308, baseScale: 1.6 }, // Central American Cloud Forests
  ],
  "temperature": [
    { lat: 24.7136, lon: 46.6753, baseScale: 2.0 }, // Riyadh
    { lat: 33.4484, lon: -112.0740, baseScale: 1.5 }, // Phoenix
    { lat: -23.5505, lon: -46.6333, baseScale: 1.2 }, // Sao Paulo
    { lat: 30.0444, lon: 31.2357, baseScale: 1.8 }, // Cairo
    { lat: -33.8688, lon: 151.2093, baseScale: 1.0 }, // Sydney
    { lat: 25.2048, lon: 55.2708, baseScale: 2.1 }, // Dubai, UAE
    { lat: 29.3759, lon: 47.9774, baseScale: 2.2 }, // Kuwait City
    { lat: 36.4614, lon: -116.8656, baseScale: 1.9 }, // Death Valley, USA
    { lat: -37.8136, lon: 144.9631, baseScale: 1.1 }, // Melbourne, Australia
  ]
};

function SpaceDebris() {
  const groupRef = useRef<THREE.Group>(null);
  
  // Generate random orbital positions for 150 pieces of debris/satellites
  const debrisData = useMemo(() => {
    return Array.from({ length: 150 }).map(() => {
      // Scale orbit radius to new Earth size (5)
      const radius = 5.5 + Math.random() * 1.5;
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      const isSatellite = Math.random() > 0.8;
      
      return { position: [x, y, z] as [number, number, number], isSatellite };
    });
  }, []);

  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.rotation.y += 0.002;
      groupRef.current.rotation.x += 0.0005;
    }
  });

  return (
    <group ref={groupRef}>
      {debrisData.map((data, i) => (
        <mesh key={i} position={data.position}>
          <icosahedronGeometry args={[0.04, 1]} />
          <meshStandardMaterial 
            color={data.isSatellite ? "#00ffaa" : "#888888"} 
            roughness={0.8}
            metalness={0.2}
            emissive={data.isSatellite ? "#00ffaa" : "#000000"}
            emissiveIntensity={data.isSatellite ? 0.5 : 0}
          />
        </mesh>
      ))}
    </group>
  );
}

function AtmosphereGlow() {
  const shaderMaterial = useMemo(() => new THREE.ShaderMaterial({
    vertexShader: `
      varying vec3 vNormal;
      void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      varying vec3 vNormal;
      void main() {
          float intensity = pow(0.7 - dot(vNormal, vec3(0, 0, 1.0)), 4.0);
          vec3 color = vec3(0.3, 0.6, 1.0); // Deeper blue for realistic satellite look
          gl_FragColor = vec4(color, 1.0) * intensity;
      }
    `,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending,
    transparent: true,
    depthWrite: false
  }), []);

  return (
    <mesh>
      <sphereGeometry args={[5.4, 64, 64]} />
      <primitive object={shaderMaterial} attach="material" />
    </mesh>
  );
}

// Convert Lat/Lon to 3D Cartesian coordinates on a sphere of given radius
function getCartesian(lat: number, lon: number, radius: number) {
  const phi = (90 - lat) * (Math.PI / 180);
  // +180 offset aligns longitude with the standard Three.js SphereGeometry wrapping
  const theta = (lon + 180) * (Math.PI / 180);

  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  
  return new THREE.Vector3(x, y, z);
}

function OrganicHeatmapSphere({ layer, year }: { layer: string; year: number }) {
  const hotspots = LAYER_HOTSPOTS[layer] || LAYER_HOTSPOTS["temperature"];
  
  const layerColor = useMemo(() => {
    if (layer === "fire") return new THREE.Color("#ff3300");
    if (layer === "water") return new THREE.Color("#00aaff");
    if (layer === "carbon") return new THREE.Color("#00ff66");
    if (layer === "air") return new THREE.Color("#ffaa00");
    return new THREE.Color("#ff0044"); // default temperature
  }, [layer]);

  const MAX_SPOTS = 15;

  const uniforms = useMemo(() => {
    const arr = new Array(MAX_SPOTS).fill(new THREE.Vector3(0,0,0));
    hotspots.forEach((spot, i) => {
      if (i < MAX_SPOTS) arr[i] = getCartesian(spot.lat, spot.lon, 1.0).normalize();
    });
    
    return {
      uHotspots: { value: arr },
      uCount: { value: Math.min(hotspots.length, MAX_SPOTS) },
      uColor: { value: layerColor },
      uTime: { value: 0 },
      uYearFactor: { value: 0 }
    };
  }, [layerColor, hotspots]);

  const shaderMaterial = useMemo(() => new THREE.ShaderMaterial({
    uniforms,
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vPosition;
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = position;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 uColor;
      uniform vec3 uHotspots[${MAX_SPOTS}];
      uniform int uCount;
      uniform float uTime;
      uniform float uYearFactor;
      
      varying vec3 vNormal;
      varying vec3 vPosition;
      
      // Simplex 3D Noise function (fast version)
      vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x, 289.0);}
      vec4 taylorInvSqrt(vec4 r){return 1.79284291400159 - 0.85373472095314 * r;}
      float snoise(vec3 v){ 
        const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
        const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);
        vec3 i  = floor(v + dot(v, C.yyy) );
        vec3 x0 = v - i + dot(i, C.xxx) ;
        vec3 g = step(x0.yzx, x0.xyz);
        vec3 l = 1.0 - g;
        vec3 i1 = min( g.xyz, l.zxy );
        vec3 i2 = max( g.xyz, l.zxy );
        vec3 x1 = x0 - i1 + 1.0 * C.xxx;
        vec3 x2 = x0 - i2 + 2.0 * C.xxx;
        vec3 x3 = x0 - 1.0 + 3.0 * C.xxx;
        i = mod(i, 289.0 ); 
        vec4 p = permute( permute( permute( 
                   i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                 + i.y + vec4(0.0, i1.y, i2.y, 1.0 )) 
                 + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));
        float n_ = 1.0/7.0;
        vec3  ns = n_ * D.wyz - D.xzx;
        vec4 j = p - 49.0 * floor(p * ns.z *ns.z);
        vec4 x_ = floor(j * ns.z);
        vec4 y_ = floor(j - 7.0 * x_ );
        vec4 x = x_ *ns.x + ns.yyyy;
        vec4 y = y_ *ns.x + ns.yyyy;
        vec4 h = 1.0 - abs(x) - abs(y);
        vec4 b0 = vec4( x.xy, y.xy );
        vec4 b1 = vec4( x.zw, y.zw );
        vec4 s0 = floor(b0)*2.0 + 1.0;
        vec4 s1 = floor(b1)*2.0 + 1.0;
        vec4 sh = -step(h, vec4(0.0));
        vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
        vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;
        vec3 p0 = vec3(a0.xy,h.x);
        vec3 p1 = vec3(a0.zw,h.y);
        vec3 p2 = vec3(a1.xy,h.z);
        vec3 p3 = vec3(a1.zw,h.w);
        vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
        p0 *= norm.x;
        p1 *= norm.y;
        p2 *= norm.z;
        p3 *= norm.w;
        vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
        m = m * m;
        return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3) ) );
      }
      
      float fbm(vec3 x) {
        float v = 0.0;
        float a = 0.5;
        vec3 shift = vec3(100);
        for (int i = 0; i < 4; ++i) {
          v += a * snoise(x);
          x = x * 2.0 + shift;
          a *= 0.5;
        }
        return v;
      }

      void main() {
        vec3 normPos = normalize(vPosition);
        float minDist = 1.0;
        
        // Find distance to closest hotspot
        for(int i=0; i<${MAX_SPOTS}; i++) {
          if (i >= uCount) break;
          float d = distance(normPos, uHotspots[i]);
          if (d < minDist) minDist = d;
        }
        
        // Generate organic noise
        float noise = fbm(normPos * 4.0 + uTime * 0.15);
        
        // Base intensity from distance
        float intensity = max(0.0, 1.0 - (minDist * 3.5));
        
        // Add noise to make it organic and fiery
        intensity += noise * 0.5;
        
        // Year factor (0.0 for 2010 to ~1.0 for 2035) makes it spread outward
        float threshold = 0.85 - (uYearFactor * 0.65);
        
        if (intensity < threshold) discard;
        
        // Map color
        float glow = (intensity - threshold) * 2.5;
        vec3 finalColor = mix(uColor, vec3(1.0), glow * 0.6);
        
        // Edge fade
        float alpha = min(1.0, glow * 1.5);
        
        gl_FragColor = vec4(finalColor, alpha * 0.7);
      }
    `,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    side: THREE.DoubleSide
  }), [uniforms]);

  useFrame((state) => {
    shaderMaterial.uniforms.uTime.value = state.clock.elapsedTime;
    const targetFactor = Math.max(0.0, (year - 2010) / 25.0);
    shaderMaterial.uniforms.uYearFactor.value += (targetFactor - shaderMaterial.uniforms.uYearFactor.value) * 0.1;
  });

  return (
    <mesh>
      <sphereGeometry args={[5.06, 128, 128]} />
      <primitive object={shaderMaterial} attach="material" />
    </mesh>
  );
}

function DataBeacons({ layer, year }: { layer: string; year: number }) {
  const hotspots = LAYER_HOTSPOTS[layer] || LAYER_HOTSPOTS["temperature"];
  const meshRef = useRef<THREE.InstancedMesh>(null);
  
  const layerColor = useMemo(() => {
    if (layer === "fire") return new THREE.Color("#ffaa00");
    if (layer === "water") return new THREE.Color("#00ffff");
    if (layer === "carbon") return new THREE.Color("#aaffaa");
    if (layer === "air") return new THREE.Color("#ffff00");
    return new THREE.Color("#ff5555");
  }, [layer]);

  const targetFactor = Math.max(0.1, (year - 2010) / 25.0);

  useFrame(() => {
    if (!meshRef.current) return;
    const dummy = new THREE.Object3D();
    
    hotspots.forEach((spot, i) => {
      const pos = getCartesian(spot.lat, spot.lon, 5.0);
      const normal = pos.clone().normalize();
      
      // Scale height based on year severity
      const height = spot.baseScale * targetFactor * 0.4;
      
      // The cylinder's center is in the middle, so we offset by half height to make it grow from surface
      const offsetPos = pos.clone().add(normal.clone().multiplyScalar(height / 2));
      
      dummy.position.copy(offsetPos);
      dummy.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal); // cylinder points along Y
      dummy.scale.set(1, height, 1);
      dummy.updateMatrix();
      
      meshRef.current!.setMatrixAt(i, dummy.matrix);
      meshRef.current!.setColorAt(i, layerColor);
    });
    
    meshRef.current.instanceMatrix.needsUpdate = true;
    if (meshRef.current.instanceColor) meshRef.current.instanceColor.needsUpdate = true;
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, hotspots.length]}>
      <cylinderGeometry args={[0.015, 0.015, 1, 8]} />
      <meshBasicMaterial toneMapped={false} />
    </instancedMesh>
  );
}

// Helper to set points into buffer geometry
function UpdateCurve({ curve }: { curve: THREE.QuadraticBezierCurve3 }) {
  const geomRef = useRef<THREE.BufferGeometry>(null);
  useEffect(() => {
    if (geomRef.current) {
      geomRef.current.setFromPoints(curve.getPoints(50));
    }
  }, [curve]);
  return <bufferGeometry ref={geomRef} />;
}

function FlowArcs({ layer, year }: { layer: string; year: number }) {
  const hotspots = LAYER_HOTSPOTS[layer] || LAYER_HOTSPOTS["temperature"];
  
  const layerColor = useMemo(() => {
    if (layer === "fire") return new THREE.Color("#ff4400");
    if (layer === "water") return new THREE.Color("#00aaff");
    if (layer === "carbon") return new THREE.Color("#00ff66");
    if (layer === "air") return new THREE.Color("#ffaa00");
    return new THREE.Color("#ff0044");
  }, [layer]);

  // Generate 8 random arcs connecting hotspots
  const arcs = useMemo(() => {
    const lines = [];
    for(let i=0; i<8; i++) {
      if(hotspots.length < 2) break;
      const start = hotspots[Math.floor(Math.random() * hotspots.length)];
      let end = hotspots[Math.floor(Math.random() * hotspots.length)];
      let attempts = 0;
      while(end === start && attempts < 10) {
        end = hotspots[Math.floor(Math.random() * hotspots.length)];
        attempts++;
      }
      
      const p1 = getCartesian(start.lat, start.lon, 5.0);
      const p2 = getCartesian(end.lat, end.lon, 5.0);
      
      // Control point is above the midpoint
      const mid = p1.clone().add(p2).multiplyScalar(0.5);
      const dist = p1.distanceTo(p2);
      mid.normalize().multiplyScalar(5.0 + dist * 0.4); // bulge outward
      
      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
      lines.push(curve);
    }
    return lines;
  }, [hotspots]);

  const material = useMemo(() => new THREE.LineBasicMaterial({
    color: layerColor,
    transparent: true,
    opacity: 0.5,
    blending: THREE.AdditiveBlending
  }), [layerColor]);

  return (
    <group>
      {arcs.map((curve, i) => (
        <line key={i}>
          <UpdateCurve curve={curve} />
          <primitive object={material} attach="material" />
        </line>
      ))}
    </group>
  );
}

function Earth({ layer = "base", targetCity, year = 2024 }: { layer?: string; targetCity?: string; year?: number }) {
  const earthGroupRef = useRef<THREE.Group>(null);
  const cloudsRef = useRef<THREE.Mesh>(null);
  
  // Load highly realistic textures
  const [colorMap, normalMap, specularMap, cloudsMap] = useLoader(THREE.TextureLoader, [
    "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_atmos_2048.jpg",
    "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_normal_2048.jpg",
    "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_specular_2048.jpg",
    "https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/planets/earth_clouds_1024.png"
  ]);

  // Target rotation for city
  const targetRotation = useRef(new THREE.Quaternion());

  useEffect(() => {
    if (targetCity && CITIES[targetCity]) {
      const { lat, lon } = CITIES[targetCity];
      
      // Calculate perfect Euler rotation to bring the city to exactly +Z (facing camera)
      // With +180 offset and negative x mapping, the Y rotation is -(lon + 180)
      const euler = new THREE.Euler(
        -lat * (Math.PI / 180), 
        -(lon + 180) * (Math.PI / 180), 
        0, 
        'YXZ'
      );
      targetRotation.current.setFromEuler(euler);
    }
  }, [targetCity]);

  useFrame(() => {
    if (earthGroupRef.current) {
      if (targetCity) {
        // Smoothly slerp to city
        earthGroupRef.current.quaternion.slerp(targetRotation.current, 0.05);
      } else {
        // Default slow rotation
        earthGroupRef.current.rotation.y += 0.0004;
      }
    }
    // Independent cloud rotation
    if (cloudsRef.current && !targetCity) {
       cloudsRef.current.rotation.y += 0.00015; // Differential rotation
    }
  });

  const isDataLayer = layer !== "base";

  return (
    <group ref={earthGroupRef}>
      {/* Photorealistic Earth */}
      <Sphere args={[5, 64, 64]}>
        <meshPhongMaterial 
          map={colorMap}
          normalMap={normalMap}
          normalScale={new THREE.Vector2(0.85, 0.85)}
          specularMap={specularMap}
          specular={new THREE.Color("grey")}
          shininess={10}
        />
      </Sphere>

      {/* Cloud Layer */}
      <Sphere ref={cloudsRef} args={[5.1, 64, 64]}>
        <meshPhongMaterial 
          map={cloudsMap}
          transparent={true}
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </Sphere>

      {/* Atmospheric Glow Custom Shader */}
      <AtmosphereGlow />

      {/* Data Layers Overlay (Premium Aesthetics) */}
      {isDataLayer && (
        <group>
          <OrganicHeatmapSphere layer={layer} year={year} />
          <DataBeacons layer={layer} year={year} />
          <FlowArcs layer={layer} year={year} />
        </group>
      )}
    </group>
  );
}

export default function Globe({ activeLayer = "base", targetCity, year = 2024 }: { activeLayer?: string; targetCity?: string; year?: number }) {
  return (
    <div style={{ width: "100%", height: "100%", minHeight: "600px" }}>
      <Canvas camera={{ position: [0, 0, 15], fov: 45 }}>
        {/* Bright omni-directional lighting to eliminate the day/night shadow completely */}
        <ambientLight intensity={2.0} color={0xffffff} />
        <directionalLight position={[15, 10, 15]} intensity={1.5} color={0xffffff} />
        <directionalLight position={[-15, -10, -15]} intensity={1.0} color={0xffffff} />
        
        {/* Deep space starfield background */}
        <Stars radius={150} depth={50} count={8000} factor={4} saturation={0} fade speed={0.5} />
        
        <Earth layer={activeLayer} targetCity={targetCity} year={year} />
        <SpaceDebris />
        {/* Disable autoRotate when targeting a city so it stays locked on */}
        <OrbitControls enableZoom={true} enablePan={false} autoRotate={!targetCity} autoRotateSpeed={0.5} minDistance={6} maxDistance={50} />
      </Canvas>
    </div>
  );
}
