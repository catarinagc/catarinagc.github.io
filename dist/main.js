import * as THREE from 'three';

var container2 = document.getElementById("mainZone");
var container = document.getElementById( 'home' );
const scene = new THREE.Scene();
var width = container2.clientWidth;
var height =  container2.clientHeight;
const camera = new THREE.PerspectiveCamera(75, width / height, 0.6, 1200);
const renderer = new THREE.WebGLRenderer();

// renderer.setClearColor("rgb(26, 26, 26)");
renderer.setClearColor("rgb(0, 0, 0)");

renderer.setSize(width, height);
container.appendChild(renderer.domElement);

window.addEventListener('resize', () => {
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
})

const geometry = new THREE.PlaneGeometry( 1, 1);
const sphereGeometry = new THREE.CircleGeometry(1,100);
const material1 = new THREE.MeshBasicMaterial( { color: "rgb(132, 92, 206)"} );
const material2 = new THREE.MeshBasicMaterial( { color: "rgb(235, 234, 176)"} );
const material3 = new THREE.MeshBasicMaterial( { color: "rgb(216, 149, 177)"} );
var materialArray = [material1,material2,material3];

const fov = camera.fov * (Math.PI / 180); // Convert to radians
const depth = 250; // Absolute value of the Z position

const visibleHeight = 2 * Math.tan(fov / 2) * depth;
const visibleWidth = visibleHeight * camera.aspect;

var circle;
let circles = [];
for (var i = 0; i< 1500; i++) {
    circle = new THREE.Mesh(sphereGeometry, materialArray[THREE.MathUtils.randInt(0,materialArray.length)]);
    let xPos = THREE.MathUtils.randFloat(-visibleWidth / 2, visibleWidth / 2);
    let yPos = THREE.MathUtils.randFloat(-visibleHeight / 2, visibleHeight / 2);
    circle.position.set(xPos, yPos, -depth);
    scene.add( circle );
    circles.push({ mesh: circle, originalX: xPos, originalY: yPos });
}

camera.position.z = 5;

let mouseX = 0, mouseY = 0;

window.addEventListener("mousemove", (event) => {
    mouseX = (event.clientX / width) * visibleWidth - visibleWidth / 2;
    mouseY = -(event.clientY / height) * visibleHeight + visibleHeight / 2;
});

function animate() {
    let range = 50; // Define interaction radius

    circles.forEach(({ mesh, originalX, originalY }) => {
        let offsetX = (mouseX - originalX) * 0.1; // Small displacement
        let offsetY = (mouseY - originalY) * 0.1;

        // Check if circle is within range of the actual mouse position
        if (originalX >= mouseX - range && originalX <= mouseX + range &&
            originalY >= mouseY - range && originalY <= mouseY + range) {
            
            // Move circles slightly in response to the mouse
            mesh.position.x += offsetX;
            mesh.position.y += offsetY;
        } else {
            // Smoothly return circles to their original position
            mesh.position.x += (originalX - mesh.position.x) * 0.05;
            mesh.position.y += (originalY - mesh.position.y) * 0.05;
        }
    });

    renderer.render(scene, camera);
}

renderer.setAnimationLoop( animate );