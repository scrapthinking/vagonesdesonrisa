// Three.js Hero Animation — Vagones de Sonrisas
// Floating 3D balloons / spheres in warm orange palette
import * as THREE from 'three';

let renderer, scene, camera, animationId;
let balloons = [];
let ribbons = [];
let particles;

const COLORS = [
    0xFF6B35, // primary orange
    0xFF8C5E, // light orange
    0xF5A623, // gold
    0xFF4500, // deep orange
    0xFFD166, // yellow-gold
    0xFF9B70, // peach
    0xE54E1B, // dark orange
    0xFFBB8C, // light peach
];

function hexToRGB(hex) {
    return { r: ((hex >> 16) & 255) / 255, g: ((hex >> 8) & 255) / 255, b: (hex & 255) / 255 };
}

function createBalloon(x, y, z) {
    const group = new THREE.Group();

    // Balloon body — slightly non-uniform sphere
    const geo = new THREE.SphereGeometry(1, 32, 32);
    const color = COLORS[Math.floor(Math.random() * COLORS.length)];
    const mat = new THREE.MeshPhongMaterial({
        color,
        shininess: 120,
        specular: 0xffffff,
        transparent: true,
        opacity: 0.92,
    });
    const sphere = new THREE.Mesh(geo, mat);
    sphere.scale.y = 1.15; // slightly elongated
    group.add(sphere);

    // Highlight sphere (inner glow illusion)
    const hlGeo = new THREE.SphereGeometry(0.55, 16, 16);
    const hlMat = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.18,
    });
    const highlight = new THREE.Mesh(hlGeo, hlMat);
    highlight.position.set(-0.3, 0.4, 0.7);
    group.add(highlight);

    // Knot at bottom
    const knotGeo = new THREE.SphereGeometry(0.12, 8, 8);
    const knotMat = new THREE.MeshPhongMaterial({ color });
    const knot = new THREE.Mesh(knotGeo, knotMat);
    knot.position.y = -1.2;
    group.add(knot);

    // Ribbon (line down)
    const ribbonPoints = [];
    const segments = 20;
    const len = THREE.MathUtils.randFloat(2.5, 5);
    for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        ribbonPoints.push(new THREE.Vector3(
            Math.sin(t * Math.PI * 2) * 0.12,
            -1.2 - t * len,
            Math.cos(t * Math.PI * 1.5) * 0.08
        ));
    }
    const ribbonGeo = new THREE.BufferGeometry().setFromPoints(ribbonPoints);
    const ribbonMat = new THREE.LineBasicMaterial({ color, opacity: 0.6, transparent: true });
    const ribbon = new THREE.Line(ribbonGeo, ribbonMat);
    group.add(ribbon);
    ribbons.push({ line: ribbon, points: ribbonPoints, phase: Math.random() * Math.PI * 2 });

    group.position.set(x, y, z);
    group.userData = {
        floatSpeed: THREE.MathUtils.randFloat(0.003, 0.008),
        floatAmp: THREE.MathUtils.randFloat(0.3, 0.8),
        swaySpeed: THREE.MathUtils.randFloat(0.002, 0.006),
        swayAmp: THREE.MathUtils.randFloat(0.1, 0.35),
        rotSpeed: THREE.MathUtils.randFloat(0.002, 0.005),
        phase: Math.random() * Math.PI * 2,
        initY: y,
        sphere,
        color,
    };

    return group;
}

function createParticleField() {
    const count = 350;
    const geo = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3);
    const sizes = new Float32Array(count);
    const colors = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
        positions[i * 3] = THREE.MathUtils.randFloatSpread(40);
        positions[i * 3 + 1] = THREE.MathUtils.randFloatSpread(25);
        positions[i * 3 + 2] = THREE.MathUtils.randFloat(-12, -2);
        sizes[i] = THREE.MathUtils.randFloat(0.05, 0.25);
        const c = hexToRGB(COLORS[Math.floor(Math.random() * COLORS.length)]);
        colors[i * 3] = c.r;
        colors[i * 3 + 1] = c.g;
        colors[i * 3 + 2] = c.b;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
    geo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const mat = new THREE.PointsMaterial({
        size: 0.18,
        vertexColors: true,
        transparent: true,
        opacity: 0.6,
        sizeAttenuation: true,
    });

    return new THREE.Points(geo, mat);
}

export function initThreeHero() {
    const canvas = document.getElementById('heroCanvas');
    if (!canvas) return;

    const w = canvas.clientWidth || window.innerWidth;
    const h = canvas.clientHeight || window.innerHeight;

    // Renderer
    renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.setClearColor(0x000000, 0);

    // Scene
    scene = new THREE.Scene();

    // Camera
    camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 100);
    camera.position.set(0, 0, 18);

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffeedd, 0.6);
    scene.add(ambientLight);

    const keyLight = new THREE.PointLight(0xFF6B35, 3, 40);
    keyLight.position.set(8, 10, 12);
    scene.add(keyLight);

    const fillLight = new THREE.PointLight(0xF5A623, 1.5, 35);
    fillLight.position.set(-10, -5, 8);
    scene.add(fillLight);

    const rimLight = new THREE.PointLight(0xFFFFFF, 1.0, 30);
    rimLight.position.set(0, 15, -5);
    scene.add(rimLight);

    // Balloons
    const positions = [
        [-7, 2, 0], [-3.5, 4, -2], [0, 1, 1], [3.5, 5, -1], [7, 3, 0],
        [-5, -1, -3], [-1, -2, 2], [2, 0, -2], [5.5, 0, 1],
        [-8, 6, -4], [1.5, 6, -3], [6, 7, -2], [-4, 8, -1],
    ];

    positions.forEach(([x, y, z]) => {
        const balloon = createBalloon(x, y, z);
        scene.add(balloon);
        balloons.push(balloon);
    });

    // Particle field
    particles = createParticleField();
    scene.add(particles);

    // Resize handler
    const onResize = () => {
        const w = canvas.clientWidth;
        const h = canvas.clientHeight;
        renderer.setSize(w, h);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);

    // Mouse parallax
    let mouseX = 0, mouseY = 0;
    window.addEventListener('mousemove', (e) => {
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    });

    // Animation loop
    const clock = new THREE.Clock();
    let keyLightPhase = 0;

    function animate() {
        animationId = requestAnimationFrame(animate);
        const t = clock.getElapsedTime();
        keyLightPhase = t * 0.5;

        // Animate balloons
        balloons.forEach((b, i) => {
            const d = b.userData;
            const phase = d.phase + i * 0.4;

            // Float up/down
            b.position.y = d.initY + Math.sin(t * d.floatSpeed * 60 + phase) * d.floatAmp;
            // Sway
            b.position.x += Math.sin(t * d.swaySpeed * 60 + phase) * d.swayAmp * 0.01;
            // Slow rotation
            b.rotation.y += d.rotSpeed;
            b.rotation.z = Math.sin(t * 0.4 + phase) * 0.08;
        });

        // Particle drift
        particles.rotation.y = t * 0.015;
        particles.rotation.x = t * 0.008;

        // Subtle key light pulse
        keyLight.intensity = 2.5 + Math.sin(keyLightPhase) * 0.6;

        // Camera parallax from mouse
        camera.position.x += (mouseX * 1.5 - camera.position.x) * 0.04;
        camera.position.y += (-mouseY * 1.0 - camera.position.y) * 0.04;
        camera.lookAt(0, 2, 0);

        renderer.render(scene, camera);
    }

    animate();

    // Pause when hero out of view
    const hero = document.getElementById('hero');
    if (hero) {
        const obs = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (!e.isIntersecting) {
                    cancelAnimationFrame(animationId);
                } else {
                    animate();
                }
            });
        }, { threshold: 0.1 });
        obs.observe(hero);
    }

    return () => {
        cancelAnimationFrame(animationId);
        renderer.dispose();
        window.removeEventListener('resize', onResize);
    };
}
