import * as THREE from 'three';
// Import OrbitControls if needed for model display later
// import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// Import GLTFLoader if needed for model display later
// import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Hero Background Animation - Abstract Shape
function initHeroBackground() {
    const container = document.getElementById('threejs-container');
    if (!container) {
        console.error('Three.js container not found!');
        return;
    }

    const scene = new THREE.Scene();
    // No background color needed if the CSS background is sufficient
    // scene.background = new THREE.Color(0x1a1a2e);

    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 3; // Adjusted camera position for the shape

    const renderer = new THREE.WebGLRenderer({
        alpha: true, // Keep alpha for transparency over CSS background
        antialias: true
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // Soft white light
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x8a9afc, 1.5, 100); // A light source for highlights (bluish)
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    const pointLight2 = new THREE.PointLight(0x38d6e1, 1, 100); // Another light source (cyan)
    pointLight2.position.set(-5, -3, 2);
    scene.add(pointLight2);


    // Geometry - Icosahedron
    const geometry = new THREE.IcosahedronGeometry(1, 0); // Radius 1, detail 0 for low-poly look

    // Material - Standard material with some emissive glow
    const material = new THREE.MeshStandardMaterial({
        color: 0x7e88c8, // Base color similar to primary
        emissive: 0x38d6e1, // Emissive color similar to secondary for glow
        emissiveIntensity: 0.3, // Intensity of the glow
        metalness: 0.3, // Make it slightly metallic
        roughness: 0.6, // Control shininess
        flatShading: true // Gives a faceted, low-poly look
    });

    const shapeMesh = new THREE.Mesh(geometry, material);
    scene.add(shapeMesh);

    // Mouse interaction variables
    let mouseX = 0;
    let mouseY = 0;
    const targetRotation = { x: 0, y: 0 }; // Target rotation based on mouse

    document.addEventListener('mousemove', (event) => {
        // Calculate mouse position relative to the center of the container
        const rect = container.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        mouseX = (event.clientX - centerX) / (rect.width / 2); // Range -1 to 1
        mouseY = (event.clientY - centerY) / (rect.height / 2); // Range -1 to 1

        // Update target rotation based on mouse position
        targetRotation.y = mouseX * 0.5; // Rotate around Y axis based on horizontal mouse movement
        targetRotation.x = mouseY * 0.5; // Rotate around X axis based on vertical mouse movement
    });

    // Animation loop
    const clock = new THREE.Clock();
    function animate() {
        requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();

        // Smoothly interpolate current rotation towards target rotation
        shapeMesh.rotation.x += (targetRotation.x - shapeMesh.rotation.x) * 0.05;
        shapeMesh.rotation.y += (targetRotation.y - shapeMesh.rotation.y) * 0.05;

        // Add a slow constant rotation as well
        shapeMesh.rotation.y += 0.002;
        shapeMesh.rotation.z += 0.001;


        // Optional: Subtle pulsing effect on emissive intensity
        material.emissiveIntensity = 0.3 + Math.sin(elapsedTime * 2) * 0.1;

        renderer.render(scene, camera);
    }

    animate();

    // Handle window resize
    window.addEventListener('resize', () => {
        const width = container.clientWidth;
        const height = container.clientHeight;

        if (width > 0 && height > 0) { // Check if container has dimensions
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
            renderer.setPixelRatio(window.devicePixelRatio);
        }
    });
}

// 3D Models Display (Commented out)
/*
function initModelDisplays() { ... } // Keep the commented out code as is
*/

// Initialize typing animation for the hero section
function initTypingAnimation() {
    const typingElement = document.querySelector('.typing-text span');
    if (!typingElement) return; // Exit if element not found

    const words = ['Game Developer', 'XR Developer', 'Unity Developer', 'Software Engineer', '3D Modeler'];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    let timeoutId = null; // To manage timeouts

    function type() {
        const currentWord = words[wordIndex];

        if (isDeleting) {
            typingElement.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typingSpeed = 50;
        } else {
            typingElement.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typingSpeed = 150;
        }

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typingSpeed = 1500; // Longer pause at end of word
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typingSpeed = 500; // Pause before starting new word
        }

        // Clear previous timeout before setting a new one
        clearTimeout(timeoutId);
        timeoutId = setTimeout(type, typingSpeed);
    }

    // Start typing animation after a short delay
    timeoutId = setTimeout(type, 1000);
}

// Interactive elements on portfolio
function initInteractiveElements() {
    // Add hover effects to project cards
    const projectThumbs = document.querySelectorAll('.projects-thumb');

    projectThumbs.forEach(thumb => {
        thumb.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-8px) scale(1.02)'; // Subtle lift and scale
            this.style.boxShadow = '0 10px 20px rgba(0,0,0,0.2)'; // Add shadow
            this.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
        });

        thumb.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
            this.style.boxShadow = 'none'; // Remove shadow
        });
    });
}

// Initialize everything when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize hero background animation
    initHeroBackground();

    // Initialize model displays (Currently commented out)
    // initModelDisplays();

    // Initialize typing animation
    initTypingAnimation();

    // Initialize interactive elements
    initInteractiveElements();
});