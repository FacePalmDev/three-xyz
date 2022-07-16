import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
// import * as dat from 'lil-gui'

/**
 * Base
 */
// Debug
// const gui = new dat.GUI()

// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const parameters = {};
parameters.count = 1000000;
parameters.size = 0.001;
parameters.radius = 4;
parameters.branches = 5;
parameters.spin = 2.243;
parameters.randomness = 1;
parameters.randomnessPower = 1;
parameters.insideColour = '#ff6030';
parameters.outsideColour = '#21083f';

// gui.add(parameters, 'count').min(100).max(1000000).step(100);
// gui.add(parameters, 'size').min(0.001).max(0.1).step(0.001);
// gui.add(parameters, 'radius').min(1).max(50).step(1);
// gui.add(parameters, 'branches').min(2).max(20).step(1);
// gui.add(parameters, 'spin').min(-5).max(5).step(0.001);
// gui.add(parameters, 'randomness').min(0).max(2).step(0.001);
// gui.add(parameters, 'randomnessPower').min(1).max(10).step(0.001);
// gui.addColor(parameters, 'insideColour');
// gui.addColor(parameters, 'outsideColour');

let geometry = null;
let positions = null;
let points = null;
let material = null;
let colours = null;

const generateGalaxy = () => {
    
    if(points !== null) {
        geometry.dispose();
        material.dispose();
        scene.remove(points);
    }
    
    geometry = new THREE.BufferGeometry();
    positions = new Float32Array(parameters.count * 3);
    colours = new Float32Array(parameters.count * 3);
    const colourInside = new THREE.Color(parameters.insideColour);
    const colourOutside = new THREE.Color(parameters.outsideColour);
    
    for (let i = 0; i < parameters.count; i++) {
        const i3 = i * 3;
        
        const radius = Math.random() * parameters.radius; 
        const spinAngle = radius * parameters.spin;
        const branchAngle = (i % parameters.branches) / parameters.branches * (Math.PI * 2)
        
        const randomX = Math.pow(Math.abs((Math.random() * 0.5)), parameters.randomness) * parameters.randomness;
        const randomY = Math.pow(Math.abs((Math.random() * 0.5)), parameters.randomness) 
                            * parameters.randomness / 5;
        const randomZ = Math.pow(Math.abs((Math.random() * 0.5)), parameters.randomness) * parameters.randomness;

        const x =  Math.cos(branchAngle + spinAngle) * radius + randomX;
        const y = 0 + randomY;
        const z = Math.sin(branchAngle + spinAngle) * radius + randomZ;

        positions[i3] = x;
        positions[i3 + 1] = y;
        positions[i3 + 2] = z;

        const mixedColour = colourInside.clone();
        mixedColour.lerp(colourOutside, radius / parameters.radius)

        colours[i3] = mixedColour.r;
        colours[i3 + 1] = mixedColour.g;
        colours[i3 + 2] = mixedColour.b;
        
    }

    geometry.setAttribute(
        'position',
        new THREE.BufferAttribute(positions, 3)
    );

    geometry.setAttribute(
        'color',
        new THREE.BufferAttribute(colours, 3)
    );

    material = new THREE.PointsMaterial({
        size: parameters.size,
        sizeAttenuation: true,
        depthWrite: false, 
        blending: THREE.AdditiveBlending,
        vertexColors: true

    }); 

    points = new THREE.Points(geometry, material);
    scene.add(points);
}
// gui.onFinishChange(generateGalaxy);

generateGalaxy();
/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth
    sizes.height = window.innerHeight

    // Update camera
    camera.aspect = sizes.width / sizes.height
    camera.updateProjectionMatrix()
    
    // Update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
camera.position.x = 2
camera.position.y = 2;
camera.position.z = 3;

// geometry.rotateY(0.5);
// geometry.rotateZ(0.5);
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true
controls.autoRotate = true;
controls.autoRotateSpeed = 1;
controls.enableRotate = false;
controls.enableZoom = false;
controls.enablePan = false;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()
    // geometry.rotateX += 1;
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()