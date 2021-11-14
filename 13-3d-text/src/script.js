import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

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
const matcapTexture = textureLoader.load('textures/matcaps/8.png');

/** 
 * Fonts 
 */

const fontLoader = new FontLoader();
fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
    console.log('font loaded');

    const textGeometry = new TextGeometry('Hi Fran!', {
        font: font,
        size: .5,
        height: .2,
        curveSegments: 10,
        bevelEnabled: true,
        bevelThickness: .03,
        bevelSize: .02,
        bevelOffset: 0,
        bevelSegments: 5
    });

    textGeometry.center()

    const textMaterial = new THREE.MeshMatcapMaterial({
        wireframe: false,
        matcap: matcapTexture
    });
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);

    scene.add(textMesh)

    // Axis Helper
    const axisHelper = new THREE.AxisHelper(1)
    // scene.add(axisHelper);

    for (let i = 0; i < 100; i++) {
        const donutGeometry = new THREE.TorusGeometry(.3, .1, 20, 45);
        const donutMaterial = new THREE.MeshMatcapMaterial({
            matcap: matcapTexture,
        });
        const donutMesh = new THREE.Mesh(donutGeometry, donutMaterial);
        donutMesh.position.x = (Math.random() - .5) * 10;
        donutMesh.position.y = (Math.random() - .5) * 10;
        donutMesh.position.z = (Math.random() - .5) * 10;
        donutMesh.rotateX(Math.random() * Math.PI);
        donutMesh.rotateY(Math.random() * Math.PI);
        const scale = Math.random();
        donutMesh.scale.set(scale,scale,scale);
        scene.add(donutMesh);
    }
});


/**
 * Object
 */
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial()
)

// scene.add(cube)

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
camera.position.x = 1
camera.position.y = 1
camera.position.z = 2
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

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

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()