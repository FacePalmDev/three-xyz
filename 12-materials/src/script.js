import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import { MeshLambertMaterial, MeshToonMaterial } from 'three'
import * as dat from 'dat.gui';


const GUI = new dat.GUI();



/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

const textureLoader = new THREE.TextureLoader()

const doorColorTexture = textureLoader.load('/textures/door/color.jpg')
const doorAlphaTexture = textureLoader.load('/textures/door/alpha.jpg')
const doorAmbientOcclusionTexture = textureLoader.load('/textures/door/ambientOcclusion.jpg')
const doorHeightTexture = textureLoader.load('/textures/door/height.jpg')
const doorNormalTexture = textureLoader.load('/textures/door/normal.jpg')
const doorMetalnessTexture = textureLoader.load('/textures/door/metalness.jpg')
const doorRoughnessTexture = textureLoader.load('/textures/door/roughness.jpg')
const matcapTexture = textureLoader.load('/textures/matcaps/8.png')
const gradientTexture = textureLoader.load('/textures/gradients/5.jpg')


const cubeTextureLoader = new THREE.CubeTextureLoader();
const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/2/px.jpg',
    '/textures/environmentMaps/2/nx.jpg',
    '/textures/environmentMaps/2/py.jpg',
    '/textures/environmentMaps/2/ny.jpg',
    '/textures/environmentMaps/2/pz.jpg',
    '/textures/environmentMaps/2/nz.jpg'
])


// gradientTexture.minFilter = THREE.NearestFilter;
// gradientTexture.magFilter= THREE.NearestFilter;
// gradientTexture.generateMipmaps = false;

/**
 * Objects
 */
// const material = new THREE.MeshBasicMaterial({
// map: doorColorTexture,
// wireframe: false,
// });

// material.color.set(0x00ff00)
// material.opacity = 0.5;
// material.transparent = true;
// material.alphaMap = doorAlphaTexture;
// material.side = THREE.DoubleSide;

// const material = new THREE.MeshNormalMaterial;
// material.side = THREE.DoubleSide;
// material.wireframe = false;
// //material.flatShading = true;

// const material = new THREE.MeshMatcapMaterial()
// material.matcap = matcapTexture;
// material.side = THREE.DoubleSide;

// const material = new THREE.MeshDepthMaterial();

// const material = new MeshLambertMaterial();

// less peformant than lambert but it's ok for this example
// const material = new THREE.MeshPhongMaterial();
// material.shininess = 1000;
// material.specular = new THREE.Color(0xff0000);


// const material = new THREE.MeshToonMaterial()
// material.gradientMap = gradientTexture;




// const material = new THREE.MeshStandardMaterial();
// GUI.add(material, 'metalness').min(0).max(1).step(0.01);
// GUI.add(material, 'roughness').min(0).max(1).step(0.01);
// material.map = doorColorTexture;
// material.side = THREE.DoubleSide;
// material.aoMap = doorAmbientOcclusionTexture;
// material.displacementMap = doorHeightTexture;
// material.displacementScale = 0.1;
// material.metalnessMap = doorMetalnessTexture;
// material.roughnessMap = doorRoughnessTexture;
// material.normalMap = doorNormalTexture;
// material.normalScale = new THREE.Vector2(1,1);
// material.alphaMap = doorAlphaTexture;
// material.transparent = true; // require if using the alphaMap
// material.envMap = textureLoader.load('/textures/envmap.jpg')

const material = new THREE.MeshStandardMaterial();
GUI.add(material, 'metalness').min(0).max(1).step(0.01);
GUI.add(material, 'roughness').min(0).max(1).step(0.01);

material.metalness = .7;
material.roughness = .2;
material.envMap = environmentMapTexture;
material.side = THREE.DoubleSide;

GUI.add(material, 'wireframe')
GUI.add(material, 'displacementScale').min(0).max(3).step(0.001);
GUI.add(material, 'aoMapIntensity').min(0).max(3).step(0.01);

const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(.5, 64, 64),
    material);

sphere.geometry.setAttribute('uv2',
    new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2));

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(1, 1, 100, 100),
    material);

plane.geometry.setAttribute(
    'uv2', new THREE.BufferAttribute(
        plane.geometry.attributes.uv.array, 2));


const torus = new THREE.Mesh(
    new THREE.TorusGeometry(.5, .2, 64, 128),
    material);

torus.geometry.setAttribute('uv2',
    new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2));

const offset = 1.5;
sphere.position.x -= offset;
torus.position.x += offset;

scene.add(plane, sphere, torus);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.2)
const pointLight = new THREE.PointLight(0xffffff, 1, 100)
pointLight.position.set(2, 3, 4)

scene.add(ambientLight);
scene.add(pointLight);
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

    //update objects
    const rotationSpeed = .2;
    sphere.rotation.x = rotationSpeed * elapsedTime;
    sphere.rotation.y = rotationSpeed * elapsedTime;

    plane.rotation.x = rotationSpeed * elapsedTime;
    plane.rotation.y = rotationSpeed * elapsedTime;

    torus.rotation.x = rotationSpeed * elapsedTime;
    torus.rotation.y = rotationSpeed * elapsedTime;


    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()