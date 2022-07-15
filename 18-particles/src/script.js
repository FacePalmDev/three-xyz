import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'

const amplitude = 2;
const distance = 100;
const particleCount = 500000;

/**
 * Base
 */
// Debug
const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader()
const particleTexture = textureLoader.load("/textures/particles/1.png");
/**
 * Particles
 */

// const radius = 1;
// const subdivision = 32;
// const widthSegments = 32;

// const particlesGeometry = new THREE.SphereBufferGeometry(radius, widthSegments, subdivision);
const particlesGeometry = new THREE.BufferGeometry();
const particlesMaterial = new THREE.PointsMaterial();
// particlesMaterial.color = new THREE.Color('cyan')
const dimensions = 3;
const positions = new Float32Array(particleCount * dimensions);
const colors = new Float32Array(particleCount * 3)

for(let i = 0; i < particleCount * dimensions; i++) {
    const rnd = Math.random();
     positions[i] = ((rnd - 0.5) * distance);
     colors[i] = rnd;
}

particlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3))

//Material
particlesMaterial.size = 0.5;
particlesMaterial.sizeAttenuation = true
; // particle size will depend on how close to the camera.
particlesMaterial.transparent = true;
particlesMaterial.alphaMap = particleTexture;
particlesMaterial.vertexColors = true;

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles);

/*
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix()

    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.001, 2000)
camera.position.z = 2;
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = false;
controls.autoRotate = false;
controls.autoRotateSpeed = 0.1;
controls.maxDistance = 100;
controls.minDistance = 10;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});

renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()

    for(let i = 0; i < particleCount; i++) {
        const i3 = i * dimensions + 1;
        const x = particlesGeometry.attributes.position.array[i3 + 1];

        particlesGeometry.attributes.position.array[i3] = Math.sin(elapsedTime + x) * amplitude;

    }
    particlesGeometry.attributes.position.needsUpdate = true
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

// addEventListener("mousemove", (event) => {
//     const amountRotate = 0.01;
//     const amountZoom = 0.2;
//     particles.rotation.set(particles.rotation.x + event.movementY * amountRotate, particles.rotation.y, 0)
//     particles.position.z -= event.movementY * amountZoom;
// })
