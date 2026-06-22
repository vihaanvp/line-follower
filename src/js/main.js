/* ============================================================
   main.js — Three.js 3D Scene & GSAP Scroll Animations
   ============================================================ */

(function () {
  'use strict';

  // ----- CANVAS SETUP -----
  const canvas = document.getElementById('hero-canvas');
  if (!canvas) return;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0a0a0f, 0.035);

  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
  camera.position.set(8, 6, 12);
  camera.lookAt(0, 0, 0);

  const renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.2;

  // ----- LIGHTS -----
  const ambientLight = new THREE.AmbientLight(0x222244, 0.4);
  scene.add(ambientLight);

  const mainLight = new THREE.DirectionalLight(0x00ddff, 0.8);
  mainLight.position.set(10, 20, 10);
  mainLight.castShadow = true;
  mainLight.shadow.mapSize.width = 2048;
  mainLight.shadow.mapSize.height = 2048;
  scene.add(mainLight);

  const fillLight = new THREE.DirectionalLight(0x7b2ff7, 0.4);
  fillLight.position.set(-10, 10, -10);
  scene.add(fillLight);

  const rimLight = new THREE.DirectionalLight(0xffffff, 0.3);
  rimLight.position.set(0, -5, 15);
  scene.add(rimLight);

  // Point light near the robot for dramatic effect
  const robotLight = new THREE.PointLight(0x00ddff, 0.6, 15);
  robotLight.position.set(0, 3, 0);
  scene.add(robotLight);

  // ----- GROUND / TRACK -----
  const groundGeometry = new THREE.PlaneGeometry(40, 40);
  const groundMaterial = new THREE.MeshStandardMaterial({
    color: 0x080810,
    roughness: 0.8,
    metalness: 0.2,
    transparent: true,
    opacity: 0.6,
    side: THREE.DoubleSide,
  });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.1;
  ground.receiveShadow = true;
  scene.add(ground);

  // ---- Track Line (the path the robot follows) ----
  function createTrack() {
    const points = [];
    const segments = 120;
    const radius = 4.5;

    // Create a rounded rectangular path
    for (let i = 0; i <= segments; i++) {
      const t = i / segments;
      const angle = t * Math.PI * 2;

      // Stadium shape: rounded rectangle
      let x, z;
      const rx = 5.0;
      const rz = 3.0;

      if (angle < Math.PI / 2) {
        // Top-right corner
        const a = angle;
        x = rx - 1.2 + 1.2 * Math.cos(a);
        z = rz - 1.2 + 1.2 * Math.sin(a);
      } else if (angle < Math.PI) {
        // Top-left corner
        const a = angle - Math.PI / 2;
        x = -rx + 1.2 + 1.2 * Math.cos(a + Math.PI / 2);
        z = rz - 1.2 + 1.2 * Math.sin(a + Math.PI / 2);
      } else if (angle < Math.PI * 1.5) {
        // Bottom-left corner
        const a = angle - Math.PI;
        x = -rx + 1.2 + 1.2 * Math.cos(a + Math.PI);
        z = -rz + 1.2 + 1.2 * Math.sin(a + Math.PI);
      } else {
        // Bottom-right corner
        const a = angle - Math.PI * 1.5;
        x = rx - 1.2 + 1.2 * Math.cos(a + Math.PI * 1.5);
        z = -rz + 1.2 + 1.2 * Math.sin(a + Math.PI * 1.5);
      }

      points.push(new THREE.Vector3(x, 0.02, z));
    }

    // Create the line path
    const curve = new THREE.CatmullRomCurve3(points, true);
    const curvePoints = curve.getPoints(200);

    const lineGeometry = new THREE.BufferGeometry().setFromPoints(curvePoints);
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x00ddff,
      transparent: true,
      opacity: 0.3,
    });
    const line = new THREE.Line(lineGeometry, lineMaterial);
    scene.add(line);

    // Create a wider, more visible track with a tube
    const tubeGeo = new THREE.TubeGeometry(curve, 200, 0.06, 8, true);
    const tubeMat = new THREE.MeshBasicMaterial({
      color: 0x00ddff,
      transparent: true,
      opacity: 0.15,
    });
    const tube = new THREE.Mesh(tubeGeo, tubeMat);
    scene.add(tube);

    // Glow dots along the path
    const dotMat = new THREE.MeshBasicMaterial({
      color: 0x00ddff,
      transparent: true,
      opacity: 0.4,
    });
    for (let i = 0; i < 60; i++) {
      const t = i / 60;
      const pos = curve.getPoint(t);
      const dot = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), dotMat);
      dot.position.copy(pos);
      dot.position.y += 0.02;
      scene.add(dot);
    }

    return curve;
  }

  const trackCurve = createTrack();

  // ----- ROBOT MODEL -----
  function createRobot() {
    const robot = new THREE.Group();

    // ---- Chassis ----
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0x1a1a2e,
      roughness: 0.4,
      metalness: 0.7,
    });

    // Main body
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.25, 0.9), bodyMat);
    body.position.y = 0.2;
    body.castShadow = true;
    robot.add(body);

    // Top plate (Arduino)
    const plateMat = new THREE.MeshStandardMaterial({
      color: 0x0077b6,
      roughness: 0.3,
      metalness: 0.1,
    });
    const plate = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.05, 0.7), plateMat);
    plate.position.y = 0.33;
    robot.add(plate);

    // ---- Wheels ----
    const wheelMat = new THREE.MeshStandardMaterial({
      color: 0x222222,
      roughness: 0.9,
      metalness: 0.1,
    });
    const wheelRimMat = new THREE.MeshStandardMaterial({
      color: 0x444444,
      roughness: 0.6,
      metalness: 0.3,
    });

    function addWheel(x, z, angle) {
      const wheelGroup = new THREE.Group();

      const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.08, 16), wheelMat);
      wheel.rotation.z = Math.PI / 2;
      wheel.castShadow = true;
      wheelGroup.add(wheel);

      const rim = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.09, 8), wheelRimMat);
      rim.rotation.z = Math.PI / 2;
      wheelGroup.add(rim);

      wheelGroup.position.set(x, 0.1, z);
      if (angle) wheelGroup.rotation.y = angle;

      return wheelGroup;
    }

    const w1 = addWheel(-0.7, -0.5);
    robot.add(w1);
    const w2 = addWheel(0.7, -0.5);
    robot.add(w2);
    const w3 = addWheel(-0.7, 0.5);
    robot.add(w3);
    const w4 = addWheel(0.7, 0.5);
    robot.add(w4);

    // ---- IR Sensors (front) ----
    const irMat = new THREE.MeshStandardMaterial({
      color: 0x00ddff,
      emissive: 0x00ddff,
      emissiveIntensity: 0.3,
    });

    for (let x = -0.35; x <= 0.35; x += 0.35) {
      const ir = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 8), irMat);
      ir.position.set(x, 0.08, 0.55);
      robot.add(ir);

      // IR sensor arm
      const armMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.03, 0.08), armMat);
      arm.position.set(x, 0.08, 0.48);
      robot.add(arm);
    }

    // ---- Ultrasonic Sensor (HC-SR04) ----
    const usMat = new THREE.MeshStandardMaterial({
      color: 0x222233,
      roughness: 0.3,
      metalness: 0.5,
    });
    const usBody = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.08, 0.12), usMat);
    usBody.position.set(0, 0.22, 0.55);
    robot.add(usBody);

    // Ultrasonic eyes
    const eyeMat = new THREE.MeshStandardMaterial({
      color: 0x88ddff,
      emissive: 0x44aaff,
      emissiveIntensity: 0.5,
    });
    for (let x = -0.08; x <= 0.08; x += 0.16) {
      const eye = new THREE.Mesh(new THREE.CircleGeometry(0.04, 12), eyeMat);
      eye.position.set(x, 0.22, 0.62);
      robot.add(eye);
    }

    // ---- LEDs on top ----
    const ledMat = new THREE.MeshStandardMaterial({
      color: 0xff4444,
      emissive: 0xff2222,
      emissiveIntensity: 0.6,
    });
    const led = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), ledMat);
    led.position.set(0.3, 0.38, 0.2);
    robot.add(led);

    const led2 = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), ledMat);
    led2.position.set(-0.3, 0.38, 0.2);
    robot.add(led2);

    // ---- Caster wheel (back center) ----
    const casterMat = new THREE.MeshStandardMaterial({ color: 0x555555 });
    const caster = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), casterMat);
    caster.position.set(0, 0.04, -0.55);
    robot.add(caster);

    return robot;
  }

  const robot = createRobot();
  scene.add(robot);

  // ----- ENERGY PARTICLES -----
  const particleCount = 1200;
  const particleGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);

  for (let i = 0; i < particleCount; i++) {
    const radius = 8 + Math.random() * 12;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);

    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = Math.random() * 4 - 1;
    positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    sizes[i] = 0.02 + Math.random() * 0.06;
  }

  particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  particleGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const particleMaterial = new THREE.PointsMaterial({
    color: 0x4488ff,
    size: 0.05,
    transparent: true,
    opacity: 0.4,
    blending: THREE.AdditiveBlending,
    sizeAttenuation: true,
  });

  const particles = new THREE.Points(particleGeometry, particleMaterial);
  scene.add(particles);

  // ----- FLOATING LINES / GRID -----
  const gridHelper = new THREE.GridHelper(30, 30, 0x003355, 0x001122);
  gridHelper.position.y = -0.05;
  gridHelper.material.transparent = true;
  gridHelper.material.opacity = 0.15;
  scene.add(gridHelper);

  // ----- ROBOT ANIMATION STATE -----
  let robotT = 0;
  const robotSpeed = 0.0008;

  // ----- MOUSE PARALLAX -----
  let mouseX = 0;
  let mouseY = 0;
  let targetMouseX = 0;
  let targetMouseY = 0;

  document.addEventListener('mousemove', (e) => {
    targetMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    targetMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // ----- GSAP SCROLL ANIMATIONS -----
  let scrollProgress = 0;

  // Register ScrollTrigger if available
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Animate camera on scroll
    gsap.to(camera.position, {
      y: 8,
      z: 16,
      scrollTrigger: {
        trigger: '#hero',
        start: 'top top',
        end: 'bottom top',
        scrub: 1,
      },
    });

    // Camera X movement on scroll
    gsap.to(camera.position, {
      x: 4,
      scrollTrigger: {
        trigger: '#techradiance',
        start: 'top bottom',
        end: 'top center',
        scrub: 1,
      },
    });

    // Robot light intensity
    gsap.to(robotLight, {
      intensity: 0.2,
      scrollTrigger: {
        trigger: '#techradiance',
        start: 'top bottom',
        end: 'center center',
        scrub: 1,
      },
    });
  } else {
    // Fallback: simple scroll-based zoom
    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY;
      const maxScroll = window.innerHeight;
      scrollProgress = Math.min(scrollY / maxScroll, 1);

      camera.position.y = 6 + scrollProgress * 4;
      camera.position.z = 12 + scrollProgress * 6;
    });
  }

  // ----- WINDOW RESIZE -----
  window.addEventListener('resize', () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });

  // ----- ANIMATION LOOP -----
  function animate() {
    requestAnimationFrame(animate);

    // Smooth mouse follow
    mouseX += (targetMouseX - mouseX) * 0.05;
    mouseY += (targetMouseY - mouseY) * 0.05;

    // Update robot position along track
    robotT += robotSpeed;
    if (robotT > 1) robotT -= 1;

    const pos = trackCurve.getPoint(robotT);
    const tangent = trackCurve.getTangent(robotT);

    robot.position.copy(pos);
    robot.position.y = 0.15;

    // Orient robot along the track
    const angle = Math.atan2(tangent.x, tangent.z);
    robot.rotation.y = angle;

    // Gentle body tilt for realism
    const tiltAmount = 0.03;
    robot.rotation.x = Math.sin(robotT * Math.PI * 8) * tiltAmount;
    robot.rotation.z = Math.cos(robotT * Math.PI * 6) * tiltAmount;

    // Animate wheels
    robot.children.forEach((child) => {
      if (child.isGroup && child.children.length >= 2) {
        child.children[0].rotation.x += 0.05;
        child.children[1].rotation.x += 0.05;
      }
    });

    // LED pulse
    const pulse = 0.4 + 0.6 * Math.abs(Math.sin(Date.now() * 0.003));
    robot.children.forEach((child) => {
      if (child.isMesh && child.material && child.material.emissiveIntensity !== undefined) {
        if (child.material.color.getHex() === 0xff4444) {
          child.material.emissiveIntensity = pulse;
        }
      }
    });

    // Particle rotation
    particles.rotation.y += 0.0005;

    // Camera parallax (subtle)
    camera.position.x += (mouseX * 1.5 - camera.position.x + 0) * 0.02;
    camera.position.y += (mouseY * 0.8 + 6 - camera.position.y) * 0.02;
    camera.lookAt(0, 0.5, 0);

    // Animate ultrasonic sensor eyes
    const usEyes = [];
    robot.children.forEach((child) => {
      if (child.isMesh && child.material && child.material.type === 'MeshStandardMaterial' && child.material.color.getHex() === 0x88ddff) {
        usEyes.push(child);
      }
    });
    usEyes.forEach((eye) => {
      if (eye.material) {
        const usPulse = 0.3 + 0.7 * Math.abs(Math.sin(Date.now() * 0.002));
        eye.material.emissiveIntensity = usPulse;
      }
    });

    // Point light follows robot
    robotLight.position.copy(robot.position);
    robotLight.position.y += 2.5;

    renderer.render(scene, camera);
  }

  animate();

  // ----- EXPOSE TO CONSOLE FOR DEBUGGING -----
  window.__scene = { scene, camera, renderer, robot, trackCurve };
})();
