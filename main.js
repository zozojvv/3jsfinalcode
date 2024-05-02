import './style.css'
import * as THREE from 'three'
import { DragControls } from 'three/examples/jsm/controls/DragControls';
import { addBoilerPlateMesh, videoControl, addVideoMesh2, addVideoMesh3, addVideoMesh4, addVideoMesh5, addVideoMesh6, addVideoMesh7,addVideoMesh8,
	videoMesh3, videoMesh4, videoMesh5, videoMesh6, videoMesh7, videoMesh8, videoMesh9
} from './addMeshes'
import { addLight } from './addLights'
import {edgeModel} from './Model'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
// import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
// import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
// import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass';

import { environment } from './environment'
import { postprocessing } from './postprocessing'

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
var draggingobjects = []; // store draggable objects: https://www.youtube.com/watch?v=gEZcJ3GufmE 
let glitchFlag = false;
let composer;
let placeMeshMode = false;  
const soundeffect = new Audio('click.mp3');



// orbitControls 
controls.enableZoom = false; 
controls.enablePan = false;
controls.enableDamping = true; 
controls.screenSpacePanning = false;
controls.maxDistance = 500;
controls.maxPolarAngle = Math.PI / 2;
controls.update;


//raycaster
const mouse = new THREE.Vector2();
const intersectionPoint = new THREE.Vector3();
const planeNormal = new THREE.Vector3();
const plane = new THREE.Plane();
const raycaster = new THREE.Raycaster();

window.addEventListener('mousemove',function(e){
	mouse.x = (e.clientX / window.innerWidth) * 2 -1; 
	mouse.y = -(e.clientY / window.innerHeight) * 2 +1;
	planeNormal.copy(camera.position).normalize();
	plane.setFromNormalAndCoplanarPoint(planeNormal, scene.position);
	raycaster.setFromCamera(mouse,camera);
	raycaster.ray.intersectPlane(plane, intersectionPoint);
});


window.addEventListener('click', function(e){
    if (placeMeshMode) {
        const intersects = raycaster.intersectObjects(scene.children, true);
        addNewMesh(intersectionPoint);
        placeMeshMode = false; 
		soundeffect.play();
    } else {
	}
});

const meshDesigns = [
	addBoilerPlateMesh,
	addVideoMesh2,
	videoMesh3, 
	videoMesh4, 
	videoMesh5, 
	videoMesh6, videoMesh7, videoMesh8, videoMesh9
]

function addNewMesh(position){
	let randomIndex = Math.floor(Math.random() * meshDesigns.length);
    let mesh = meshDesigns[randomIndex](); 
    mesh.position.copy(position);
    scene.add(mesh);
    draggingobjects.push(mesh); 
}

function keyHandler(event){
	event.preventDefault();
	// console.log(event.key);
    if (event.key.toLowerCase() === 'a') {
        placeMeshMode = !placeMeshMode;  
        console.log("place mesh mode", placeMeshMode);
    }
}


//ocean: https://jsfiddle.net/prisoner849/79z8jyLk/
let g = new THREE.PlaneGeometry(200, 200, 25, 25);
g.rotateX(-Math.PI * 0.5);
g.rotateY(-Math.PI * 0.65);
g.rotateY(-Math.PI * 0.5);
let vertData = [];
let v3 = new THREE.Vector3(); // for re-use
for (let i = 0; i < g.attributes.position.count; i++) {
  v3.fromBufferAttribute(g.attributes.position, i);
  vertData.push({
    initH: v3.y,
    amplitude: THREE.MathUtils.randFloatSpread(2),
    phase: THREE.MathUtils.randFloat(0, Math.PI)
  })
}

const textureLoader = new THREE.TextureLoader();
const colorMap = textureLoader.load('Water_002_COLOR.jpg');
const displacementMap = textureLoader.load('Water_002_DISP.png');
const normalMap = textureLoader.load('Water_002_NORM.jpg');
const aoMap = textureLoader.load('Water_002_OCC.jpg');
const roughnessMap = textureLoader.load('Water_002_ROUGH.jpg');

const oceanMaterial = new THREE.MeshStandardMaterial({
	map: colorMap,
	displacementMap: displacementMap,
	displacementScale: 0.5, 
	normalMap: normalMap,
	aoMap: aoMap,
	roughnessMap: roughnessMap,
	metalness: 0,
	roughness: 0.05
});

let o = new THREE.Mesh(g, oceanMaterial);

o.position.set(0, -40, 0);
scene.add(o);



init()
function init() {
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)

	var dragControls = new DragControls(draggingobjects, camera, renderer.domElement);
    document.addEventListener('keydown', keyHandler);  

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
	let directionalLight = new THREE.DirectionalLight(0xffffff, 1); 
	directionalLight.position.set(15,50,0);
	scene.add(directionalLight);

	let ambientLight = new THREE.AmbientLight(0x404040);
	scene.add(ambientLight);

	//changes
	meshes.box1.scale.set(2, 2, 2)
	meshes.box2.scale.set(2, 2, 2)
	meshes.box3.scale.set(2, 3.5, 2)
	meshes.box4.scale.set(2, 2, 2)
	meshes.box5.scale.set(1, 1, 2)
	meshes.box6.scale.set(2, 1, 2)
	meshes.box7.scale.set(1, 1, 1)
	meshes.box8.scale.set(1, 2, 1)


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
	draggingobjects.push(meshes.box1);
	draggingobjects.push(meshes.box2);
	draggingobjects.push(meshes.box3);
	draggingobjects.push(meshes.box4);
	draggingobjects.push(meshes.box5);
	draggingobjects.push(meshes.box6);
	draggingobjects.push(meshes.box7);
	draggingobjects.push(meshes.box8);

	dragControls.addEventListener('dragstart', function () {
		controls.enabled = false;
	});
	
	dragControls.addEventListener('dragend', function () {
		controls.enabled = true;
	});


	videoControl.playVideo();


	//post
	composer = postprocessing(scene, camera, renderer, meshes.box1);

	postprocessing(scene, camera, renderer)
	// glitchTrigger();
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
	let time = clock.getElapsedTime();

	controls.update();

	const edgemodel = edge.getModel(); 
    if (edgemodel) {
        edgemodel.rotation.y += 0.02; 
		edgemodel.position.set(-11, -20, -100)
    }

	//ocean
	vertData.forEach((vd, idx) => {
	  let y = vd.initH + Math.sin(time + vd.phase) * vd.amplitude;
	  g.attributes.position.setY(idx, y);
	})
	g.attributes.position.needsUpdate = true;
	g.computeVertexNormals();
	
	camera.updateMatrixWorld(true);
	// VideoTexture.needsUpdate = true;
	renderer.render(scene, camera)
	composer.composer.render()
}

