import './style.css'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as dat from 'lil-gui'
import { RectAreaLightHelper } from 'three/examples/jsm/helpers/RectAreaLightHelper.js'


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
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xe0ff21f, .5)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0xeeff44f, .3);
scene.add(directionalLight)

const hemisphere = new THREE.HemisphereLight(0x00fffc, 0x0003ff, 0.3);
scene.add(hemisphere);


const pointLight = new THREE.PointLight(0xffffff, .5)
// pointLight.position.x = 2
// pointLight.position.y = 3
// pointLight.position.z = 4
pointLight.position.set(1, 0.25, .2)
scene.add(pointLight)


const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 3, 1)
rectAreaLight.position.set(-1.5, 0, 1.5)
rectAreaLight.lookAt(new THREE.Vector3())
scene.add(rectAreaLight)

//! SpotLight(color, intensity, distance, angle, light width, decay )
const spotLight = new THREE.SpotLight(0xfffff, 0.5, 10, Math.PI * .1 , 0, 1)
scene.add(spotLight)

spotLight.target.position.x = .55
spotLight.target.position.y = - 1
scene.add(spotLight.target)

/**
 * Helpers
 */

 const hemisphereLightHelper = new THREE.HemisphereLightHelper(hemisphere, 0.1);
 scene.add(hemisphereLightHelper);
 
 const directionalLightHelper = new THREE.DirectionalLightHelper(directionalLight, 0.2);
 scene.add(directionalLightHelper);
 
 const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2)
 scene.add(pointLightHelper);
 
 const spotLightHelper = new THREE.SpotLightHelper(spotLight, 0.2);
 spotLightHelper.color = new THREE.Color('orange');
 scene.add(spotLightHelper);
 
 window.requestAnimationFrame(() => {
     spotLightHelper.update();
 })
 
 const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
 scene.add(rectAreaLightHelper);
 
const offLight = {
    myFunction: function () {
        ambientLight.isLight = false;
        pointLight.isLight = false;
        directionalLight.isLight = false;
        hemisphere.isLight = false;
        rectAreaLight.isLight = false;
    },
}

const onLight = {
    otherFunction: function() {
        ambientLight.isLight = true;
        pointLight.isLight = true;
        directionalLight.isLight = true;
        hemisphere.isLight = true;
        rectAreaLight.isLight = true;
    }
}

const helperOff = {
    offHelper: function() {
        hemisphereLightHelper.visible = false;
        directionalLightHelper.visible = false;
        pointLightHelper.visible = false;
        spotLightHelper.visible = false;
        rectAreaLightHelper.visible = false;
    }
}

const helperOn = {
    onHelper: function() {
        hemisphereLightHelper.visible = true;
        directionalLightHelper.visible = true;
        pointLightHelper.visible = true;
        spotLightHelper.visible = true;
        rectAreaLightHelper.visible = true;
    }
}


gui.addColor(ambientLight, 'color').name('ambient color');
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.01)
gui.addColor(directionalLight, 'color').name('directional color')
gui.add(directionalLight, 'intensity').name('directional intensity').min(0).max(1).step(0.01);
gui.addColor(hemisphere, 'color').name('hemisphere color')
gui.add(hemisphere, 'intensity').name('hemisphere intensity').min(0).max(1).step(0.01)
gui.addColor(pointLight, 'color').name('pointlight color')
gui.add(pointLight, 'intensity').name('point light').min(0).max(1).step(0.01);
gui.addColor(rectAreaLight, 'color').name('rect area color')
gui.add(rectAreaLight, 'intensity').name('rect area intensity').min(0).max(2).step(0.01);
gui.addColor(spotLight, 'color').name('spot light color')
gui.add(spotLight, 'intensity').name('spot light intensity').min(0).max(20).step(0.01);

// gui functions
gui.add(helperOff, 'offHelper' ).name('turn off helper');
gui.add(helperOn, 'onHelper' ).name('turn on helper');
gui.add(offLight, 'myFunction').name('turn off lights');
gui.add(onLight, 'otherFunction').name('turn on lights');



/**
 * Objects
 */
// Material
const material = new THREE.MeshPhysicalMaterial()
material.roughness = 0.4



// Objects
const sphere = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    material
)
sphere.position.x = - 1.5

const cube = new THREE.Mesh(
    new THREE.BoxGeometry(0.75, 0.75, 0.75),
    material
)

const torus = new THREE.Mesh(
    new THREE.TorusGeometry(0.3, 0.2, 32, 64),
    material
)
torus.position.x = 1.5

/**
 * Sizes
 */
 const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(sizes.width, sizes.height),
    new THREE.MeshMatcapMaterial({color: '#EFD5AF'})
)
plane.rotation.x = - Math.PI * 0.5
plane.position.y = - 0.65

scene.add(sphere, cube, torus, plane)

/**
 * window size
 */

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
    canvas: canvas,
    antialias : false
})
renderer.setSize(sizes.width, sizes.height)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

/**
 * Animate
 */
const clock = new THREE.Clock()

const tick = () => {
    const elapsedTime = clock.getElapsedTime()

    // Update objects
    sphere.rotation.y = 0.1 * elapsedTime
    cube.rotation.y = 0.1 * elapsedTime
    torus.rotation.y = 0.1 * elapsedTime

    //sphere.rotation.x = 0.15 * elapsedTime
    cube.rotation.x = 0.15 * elapsedTime
    torus.rotation.x = 0.15 * elapsedTime

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()