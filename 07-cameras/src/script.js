import './style.css'
import * as THREE from 'three'
import { MapControls, OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

/**
 * Cursor
 */

let cursor = { 
    x : 0,
    y : 0
}
// Sizes
const sizes = {
    width: 800,
    height: 600
}


window.addEventListener('mousemove', (event) => {
    cursor.x = event.clientX / sizes.width -0.5
    cursor.y = -(event.clientY / sizes.height -0.5)
});


// Scene
const scene = new THREE.Scene()

// Object
const mesh = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1, 5, 5, 5),
    new THREE.MeshBasicMaterial({ color: 0xff0000 })
)
scene.add(mesh)

const fieldOfView = 75
const aspectRatio = sizes.width / sizes.height

//* If object is outside of this range it won't be rendered.
const near = 0.1 
const far = 100

// Camera
const camera = new THREE.PerspectiveCamera(fieldOfView, aspectRatio, near, far)

// * OrthographicCamera

// const left = -1 * aspectRatio;
// const right = 1 * aspectRatio;
// const top = 1;
// const bottom = -1;

// const camera = new THREE.OrthographicCamera(left, right, top, bottom, near, far)

// camera.position.x = 2
// camera.position.y = 2
camera.position.z = 2
camera.lookAt(mesh.position)
scene.add(camera)

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

// Animate
// const clock = new THREE.Clock()

// Orbit controls


const tick = () =>
{
    // const elapsedTime = clock.getElapsedTime()

    // const amount = (cursor.x * Math.PI * 2);
    // camera.position.x = Math.sin(amount) * 3;
    // camera.position.z = Math.cos(amount) * 3;'
    // camera.position.y = cursor.y * 5 ;

    // camera.lookAt(mesh.position)
    // Update objects
    // mesh.rotation.y = elapsedTime;
    
    controls.update

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()

