// Controle de camera com GUI.

import * as THREE 			from 'three';
import { OBJLoader } 		from 'obj-loaders';
import { TrackballControls } from 'trackball-ctrl';

let 	scene,
		renderer,
		camera,
		camControl;

const 	rendSize 		= new THREE.Vector2();

const 	clock 			= new THREE.Clock();


/// ***************************************************************
/// ***                                                          **
/// ***************************************************************

function main() {

	renderer = new THREE.WebGLRenderer();

	renderer.setClearColor(new THREE.Color(0.0, 0.0, 0.0));

	rendSize.x = window.innerWidth * 0.8;
	rendSize.y = window.innerHeight * 0.8;

	renderer.setSize(rendSize.x, rendSize.y);

	document.body.appendChild(renderer.domElement);

	scene 	= new THREE.Scene();
	camera = new THREE.PerspectiveCamera( 75.0, rendSize.x/rendSize.y, 0.01, 500.0);
	camera.position.set( 0, 0, 1.0 );

	// Load Mesh
	const loader = new OBJLoader();
	loader.load('../../Assets/Models/OBJ/bunny.obj', onLoadMesh, onProgress, onError);

	// Acrescente aqui o controle de Camera Trackball

	//Adiciona uma fonte de luz ambiente
	var ambLight = new THREE.AmbientLight( 0xffffff );
	scene.add(ambLight);

	render();
};

/// ***************************************************************
/// ***                                                          **
/// ***************************************************************

function onLoadMesh(loadedMesh) {

	let msg = document.getElementById("percentLoad");
	if (msg)
		msg.outerText = 'Loaded: 100.0% ';

	loadedMesh.children.forEach(function (child) {
		child.material = new THREE.MeshStandardMaterial(	{	color  		: new THREE.Color(Math.random(), Math.random(), Math.random()),
																wireframe  	: true
															} );
		});

	loadedMesh.name = "malha";
	scene.add(loadedMesh);

	const helper = new THREE.BoxHelper();
	helper.setFromObject(loadedMesh);

	helper.geometry.computeBoundingBox();

	let dx = (helper.geometry.boundingBox.max.x - helper.geometry.boundingBox.min.x) / 2.0;
	let dy = (helper.geometry.boundingBox.max.y - helper.geometry.boundingBox.min.y) / 2.0;
	let dz = (helper.geometry.boundingBox.max.z - helper.geometry.boundingBox.min.z) / 2.0;

	loadedMesh.position.set(	-(helper.geometry.boundingBox.min.x + dx),
								-(helper.geometry.boundingBox.min.y + dy),
								-(helper.geometry.boundingBox.min.z + dz) );

	camera.position.set 	( 	0.0,
								0.0,
								helper.geometry.boundingBox.max.z*3.0 );

	let maxDim = Math.max(	helper.geometry.boundingBox.max.x,
							helper.geometry.boundingBox.max.y,
							helper.geometry.boundingBox.max.z )

	const axis = new THREE.AxesHelper( maxDim );
	axis.name = "eixos";
	scene.add(axis);

	render();
}

/// ***************************************************************
/// ***                                                          **
/// ***************************************************************

function onProgress( xhr ) {

	let msg = document.getElementById("percentLoad");

	if (msg)
		msg.outerText += '... ' + Math.round( xhr.loaded / xhr.total * 100 , 2) + '% ';
}

/// ***************************************************************
/// ***                                                          **
/// ***************************************************************

function onError(errorCode) {

	document.getElementById("errorCode").outerText = errorCode;
}


/// ***************************************************************
/// ***                                                          **
/// ***************************************************************

function render() {

	renderer.render(scene, camera);
}

/// ***************************************************************
/// ***************************************************************
/// ***************************************************************

main();
