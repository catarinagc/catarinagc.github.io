import * as THREE from 'three';

var container = document.getElementById( 'home' );
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.6, 1200);
const renderer = new THREE.WebGLRenderer();

renderer.setClearColor("rgb(26, 26, 26)");

renderer.setSize(container.clientWidth, container.clientHeight);
container.appendChild(renderer.domElement);

window.addEventListener('resize', () => {
    renderer.setSize( container.clientWidth, container.clientHeight);
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
})

const geometry = new THREE.PlaneGeometry( 1, 1);
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;

function animate() {
	renderer.render( scene, camera );
}
renderer.setAnimationLoop( animate );