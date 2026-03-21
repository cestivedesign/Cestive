import re

with open('szolgaltatasok.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Pattern to match the Cobe script
pattern = r'<!-- Cobe Globe Vanilla JS Integration -->.*?</script>'

replacement = """<!-- Three.js Interactive Globe Integration -->
  <script type="module">
    import * as THREE from 'https://unpkg.com/three@0.160.0/build/three.module.js';
    import { OrbitControls } from 'https://unpkg.com/three@0.160.0/examples/jsm/controls/OrbitControls.js';

    const container = document.getElementById('globe-container');
    if (container) {
      // 1. Initial Setup
      let width = container.offsetWidth;
      let height = container.offsetHeight;
      if (width === 0) width = 850;
      if (height === 0) height = 850;

      const scene = new THREE.Scene();
      // Transparent background so it blends with Cestive's layout
      scene.background = null; 

      const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.z = 12; // Zoom level

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap at 2 for performance
      container.appendChild(renderer.domElement);

      const controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.enableZoom = false; // Prevent scrolling from zooming the globe
      controls.autoRotate = true;
      controls.autoRotateSpeed = 0.5;

      // 2. Create the Dot Matrix Globe (Fibonacci Sphere)
      const numPoints = 8000;
      const radius = 5;
      const geometry = new THREE.BufferGeometry();
      const positions = new Float32Array(numPoints * 3);

      const phi = Math.PI * (3 - Math.sqrt(5)); // Golden angle
      for (let i = 0; i < numPoints; i++) {
        const y = 1 - (i / (numPoints - 1)) * 2;
        const r = Math.sqrt(1 - y * y);
        const theta = phi * i;

        const x = Math.cos(theta) * r;
        const z = Math.sin(theta) * r;

        positions[i * 3] = x * radius;
        positions[i * 3 + 1] = y * radius;
        positions[i * 3 + 2] = z * radius;
      }
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      // Light gray/blue dots for the main sphere 
      const material = new THREE.PointsMaterial({
        color: 0xcbd5e1, // Tailwind slate-300 equivalent for white background
        size: 0.045,
        transparent: true,
        opacity: 0.8
      });

      const globe = new THREE.Points(geometry, material);
      scene.add(globe);

      // 3. Add City Markers
      const markerMaterial = new THREE.MeshBasicMaterial({ color: 0x143642 }); // Cestive Dark Blue
      
      function latLongToVector3(lat, lng, r) {
        const phi = (90 - lat) * (Math.PI / 180);
        const theta = (lng + 180) * (Math.PI / 180);
        const x = -(r * Math.sin(phi) * Math.cos(theta));
        const z = (r * Math.sin(phi) * Math.sin(theta));
        const y = (r * Math.cos(phi));
        return new THREE.Vector3(x, y, z);
      }

      const markersData = [
        { location: [14.5995, 120.9842], size: 0.08 },
        { location: [19.076, 72.8777], size: 0.15 },
        { location: [23.8103, 90.4125], size: 0.1 },
        { location: [30.0444, 31.2357], size: 0.12 },
        { location: [39.9042, 116.4074], size: 0.14 },
        { location: [-23.5505, -46.6333], size: 0.15 },
        { location: [19.4326, -99.1332], size: 0.15 },
        { location: [40.7128, -74.006], size: 0.15 },
        { location: [34.6937, 135.5022], size: 0.1 },
        { location: [41.0082, 28.9784], size: 0.12 },
        { location: [47.4979, 19.0402], size: 0.16 } // Budapest!
      ];

      markersData.forEach(m => {
        const pos = latLongToVector3(m.location[0], m.location[1], radius + 0.02);
        const mGeo = new THREE.SphereGeometry(m.size, 16, 16);
        const marker = new THREE.Mesh(mGeo, markerMaterial);
        marker.position.copy(pos);
        globe.add(marker);
      });

      // 4. Handle Interaction Cursors
      container.addEventListener('mousedown', () => container.style.cursor = 'grabbing');
      container.addEventListener('mouseup', () => container.style.cursor = 'grab');
      container.addEventListener('mouseleave', () => container.style.cursor = 'grab');

      // 5. Responsive Resize
      window.addEventListener('resize', () => {
        width = container.offsetWidth;
        height = container.offsetHeight;
        if (width > 0 && height > 0) {
          renderer.setSize(width, height);
          camera.aspect = width / height;
          camera.updateProjectionMatrix();
        }
      });

      // 6. Animation Loop
      function animate() {
        requestAnimationFrame(animate);
        controls.update(); // Required for damping and autoRotate
        renderer.render(scene, camera);
      }
      animate();

      // Fade in effect
      renderer.domElement.style.opacity = '0';
      renderer.domElement.style.transition = 'opacity 1.5s ease-in-out';
      setTimeout(() => renderer.domElement.style.opacity = '1', 100);
    }
  </script>"""

new_content = re.sub(pattern, replacement, content, flags=re.DOTALL)

with open('szolgaltatasok.html', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Replacement done!")
