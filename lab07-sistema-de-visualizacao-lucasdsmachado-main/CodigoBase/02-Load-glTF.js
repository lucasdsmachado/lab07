// Ainda testando a instalação do Three.JS

import * as THREE 			from 'three';
import { GLTFLoader } 		from 'glTF-loaders';

const 	rendSize = new THREE.Vector2();

const 	clock 			= new THREE.Clock();

let 	scene,
		renderer, 
		camera;

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

	camera = new THREE.PerspectiveCamera( 75.0, rendSize.x / rendSize.y, 0.01, 10000.0 );
	
	scene.add( camera );
	
	// Load Mesh
	const gltfLoader = new GLTFLoader();
	gltfLoader.load('../../Assets/Models/glTF/city/scene.gltf', onLoadMesh, onProgress, onError);

	//Adiciona uma fonte de luz ambiente
	var ambLight = new THREE.AmbientLight( 0xffffff ); 
	scene.add(ambLight);

	anime();
};

/// ***************************************************************
/// ***                                                          **
/// ***************************************************************

function onProgress( xhr ) {

	let msg = document.getElementById("percentLoad");
	
	if (msg)
		msg.outerText += '... ' + Math.round( xhr.loaded / xhr.total * 100, 2 ) + '% ';
}

/// ***************************************************************
/// ***                                                          **
/// ***************************************************************

function onError(errorCode) {

	let msg = document.getElementById("errorCode");
	
	if (msg)
		msg.outerText = errorCode;
}
		
/// ***************************************************************
/// ***                                                          **
/// ***************************************************************

function onLoadMesh(loadedMesh) {
		
	const root 	= loadedMesh.scene;
	root.name 	= "malha";
	scene.add(root);
	
	const helper = new THREE.BoxHelper();
	helper.setFromObject(root);

	helper.geometry.computeBoundingBox();

	let dx = (helper.geometry.boundingBox.max.x - helper.geometry.boundingBox.min.x) / 2.0;
	let dy = (helper.geometry.boundingBox.max.y - helper.geometry.boundingBox.min.y) / 2.0;
	let dz = (helper.geometry.boundingBox.max.z - helper.geometry.boundingBox.min.z) / 2.0;

	root.position.set(	-(helper.geometry.boundingBox.min.x + dx),
						-(helper.geometry.boundingBox.min.y + dy),
						-(helper.geometry.boundingBox.min.z + dz) );

	camera.position.set 	( 	0.0, 
								0.0, 
								helper.geometry.boundingBox.max.z );

	let maxDim = Math.max(	helper.geometry.boundingBox.max.x, 
							helper.geometry.boundingBox.max.y, 
							helper.geometry.boundingBox.max.z )

	const axis = new THREE.AxesHelper( maxDim );
	axis.name = "eixos";
	scene.add(axis);

};

/// ***************************************************************
/// **                                                           **
/// ***************************************************************

function anime() {

	let obj = scene.getObjectByName("malha");

	if (obj)
		obj.rotateY(0.001);

	renderer.render(scene, camera);
	requestAnimationFrame(anime);
};

/// ***************************************************************
/// ***************************************************************
/// ***************************************************************

main();
