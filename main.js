import './style.css'
import * as THREE from 'three'
import { DragControls } from 'three/examples/jsm/controls/DragControls';
import { addBoilerPlateMesh, videoControl, addVideoMesh2, addVideoMesh3, addVideoMesh4, addVideoMesh5, addVideoMesh6, addVideoMesh7,addVideoMesh8 } from './addMeshes'
import { addLight } from './addLights'
import {edgeModel} from './Model'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import { environment } from './environment'
// import { postprocessing } from './postprocessing'

const scene = new THREE.Scene()
const renderer = new THREE.WebGLRenderer({ antialias: true })
const camera = new THREE.PerspectiveCamera(
	75,
	window.innerWidth / window.innerHeight,
	0.1,
	100
)
camera.position.set(0, 3, 20)

//Globals
const meshes = {}
const lights = {}
const mixers = []
const clock = new THREE.Clock()
const controls = new OrbitControls(camera, renderer.domElement)
let edge;
var objects = []; // store draggable objects: https://www.youtube.com/watch?v=gEZcJ3GufmE 

// orbitControls 
controls.panSpeed = 1;
controls.rotateSpeed = 1;
controls.maxDistance = 100;
controls.mouseButtons.RIGHT = THREE.MOUSE.PAN;
controls.mouseButtons.LEFT = THREE.MOUSE.ROTATE;

init()
function init() {
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)

	//meshes
	meshes.box1 = addBoilerPlateMesh()
	meshes.box2 = addVideoMesh2()
	meshes.box3 = addVideoMesh3()
	meshes.box4 = addVideoMesh4()
	meshes.box5 = addVideoMesh5()
	meshes.box6 = addVideoMesh6()
	meshes.box7 = addVideoMesh7()
	meshes.box8 = addVideoMesh8()

	//lights
	lights.defaultLight = addLight()

	//changes
	meshes.box1.scale.set(2, 2, 2)
	meshes.box2.scale.set(2, 2, 2)
	meshes.box3.scale.set(2, 3.5, 2)
	meshes.box4.scale.set(1, 1, 1)
	meshes.box5.scale.set(1, 1, 1)
	meshes.box6.scale.set(1, 1, 1)
	meshes.box7.scale.set(1, 1, 1)
	meshes.box8.scale.set(1, 1, 1)


	//scene operations
	scene.background = new THREE.Color(0x1234562);
	scene.add(meshes.box1)
	scene.add(meshes.box2)
	scene.add(meshes.box3)
	scene.add(meshes.box4)
	scene.add(meshes.box5)
	scene.add(meshes.box6)
	scene.add(meshes.box7)
	scene.add(meshes.box8)
	scene.add(lights.defaultLight)
	edge = new edgeModel(scene); 

	scene.background = environment()
	scene.environment = environment()

	//add meshes to array
	objects.push(meshes.box1);
	objects.push(meshes.box2);
	objects.push(meshes.box3);
	objects.push(meshes.box4);
	objects.push(meshes.box5);
	objects.push(meshes.box6);
	objects.push(meshes.box7);
	objects.push(meshes.box8);

	//drag control
	var dragControls = new DragControls(objects, camera, renderer.domElement);

	videoControl.playVideo();

	resize()
	animate()
}

function resize() {
	window.addEventListener('resize', () => {
		renderer.setSize(window.innerWidth, window.innerHeight)
		camera.aspect = window.innerWidth / window.innerHeight
		camera.updateProjectionMatrix()
	})
}

function animate() {
	requestAnimationFrame(animate)
	const delta = clock.getDelta()
	controls.update();

	// meshes.default.rotation.x += 0.01
	// meshes.default.rotation.z += 0.01

	// meshes.default.scale.x += 0.01

	const model = edge.getModel(); 
    if (model) {
        model.rotation.y += 0.02; 
    }
	// VideoTexture.needsUpdate = true;
	renderer.render(scene, camera)
}
