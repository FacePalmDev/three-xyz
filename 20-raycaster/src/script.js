import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { Vector2, Vector3, Vector4 } from 'three'

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
 * Objects
 */
const object1 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object1.position.x = - 2

const object2 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)

const object3 = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 16, 16),
    new THREE.MeshBasicMaterial({ color: '#ff0000' })
)
object3.position.x = 2

scene.add(object1, object2, object3)

// Rays need an origin and a direction 
const raycaster = new THREE.Raycaster();
// const rayOrigin = new THREE.Vector3(-3, 0, 0);
// // Normalise takes values and makes it between 0 and 1
// const rayDirection = new THREE.Vector3(10, 0, 0).normalize();
// raycaster.set(rayOrigin, rayDirection);

const intersects = raycaster.intersectObjects([object1, object2, object3])

console.log(intersects)
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
camera.position.z = 3
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


const mouseVec = new THREE.Vector2()

// For mouse click we can use the mouse click event

window.addEventListener("mousemove", (ea) => { 
    // Why all this complicated maths?! 
    // We need to convert the coords to a range between -1 and 1
    const mouseX =  2 * (ea.clientX / window.innerWidth) - 1;
    const mouseY = 1 - 2 * (ea.clientY / window.innerHeight);
    mouseVec.x = (mouseX);
    mouseVec.y = (mouseY);

})

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5;
    object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5;
    object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5;



    // const raycasterOrigin = new Vector3(-3, 0, 0);
    // const raycasterDirection = new Vector3(10, 0, 0).normalize();
    // raycaster.set(raycasterOrigin, raycasterDirection);
    
    raycaster.setFromCamera(mouseVec, camera);

    const objs = [object1, object2, object3];
    objs.forEach(obj => obj.material.color.set("#ff0000"));

    const intersects = raycaster.intersectObjects(objs);
    // console.log(intersects)
    intersects.forEach(intersect => intersect.object.material.color.set("#00ff00"));

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()