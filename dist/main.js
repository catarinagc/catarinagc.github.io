import * as THREE from "three";

var container2 = document.getElementById("mainZone");
var container = document.getElementById("home");
const scene = new THREE.Scene();
var width = container.clientWidth;
var height = window.innerHeight;
const camera = new THREE.PerspectiveCamera(75, width / height, 0.6, 1200);
const renderer = new THREE.WebGLRenderer();

// renderer.setClearColor("rgb(26, 26, 26)");
renderer.setClearColor("rgb(0, 0, 0)");
renderer.setSize(width, height);
container.appendChild(renderer.domElement);

window.addEventListener("resize", () => {
  width = container.clientWidth;
  height = container.clientHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
});

function resizeRendererToDisplaySize() {
  const width = container.clientWidth;
  const height = container.clientHeight;
  const needResize =
    renderer.domElement.width !== width ||
    renderer.domElement.height !== height;
  if (needResize) {
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  }
  return needResize;
}

//const geometry = new THREE.PlaneGeometry( 1, 1);
const sphereGeometry = new THREE.CircleGeometry(1, 100);
const material1 = new THREE.MeshBasicMaterial({ color: "rgb(132, 92, 206)" });
const material2 = new THREE.MeshBasicMaterial({ color: "rgb(235, 234, 176)" });
const material3 = new THREE.MeshBasicMaterial({ color: "rgb(216, 149, 177)" });
var materialArray = [material1, material2, material3];

const fov = camera.fov * (Math.PI / 180); // Convert to radians
const depth = 250; // Absolute value of the Z position

const visibleHeight = 2 * Math.tan(fov / 2) * depth;
const visibleWidth = visibleHeight * camera.aspect;

const mouse = new THREE.Vector2();
var isMoving = false;

window.addEventListener("mousemove", (event) => {
  isMoving = true;
  const rect = container.getBoundingClientRect(); // Get container position and size

  // Check if the mouse is inside the container
  if (
    event.clientX >= rect.left &&
    event.clientX <= rect.right &&
    event.clientY >= rect.top &&
    event.clientY <= rect.bottom
  ) {
    // Convert mouse position to normalized device coordinates (-1 to 1)
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
  } else {
    // If outside, set mouse to a value that won't affect objects
    mouse.x = -1000;
    mouse.y = -1000;
  }
});

function getMousePositionInWorld() {
  const worldPosition = new THREE.Vector3(mouse.x, mouse.y, 0.5);
  worldPosition.unproject(camera);

  const dir = worldPosition.clone().sub(camera.position).normalize();
  const distance = (-depth - camera.position.z) / dir.z;
  worldPosition.add(dir.multiplyScalar(distance));

  return worldPosition;
}

var circle;
let circles = [];
for (var i = 0; i < 1500; i++) {
  circle = new THREE.Mesh(
    sphereGeometry,
    materialArray[THREE.MathUtils.randInt(0, materialArray.length)]
  );
  let xPos = THREE.MathUtils.randFloat(-visibleWidth / 2, visibleWidth / 2);
  let yPos = THREE.MathUtils.randFloat(-visibleHeight / 2, visibleHeight / 2);
  circle.position.set(xPos, yPos, -depth);
  scene.add(circle);
  circles.push({ mesh: circle, originalX: xPos, originalY: yPos });
}

camera.position.z = 5;

let mouseX = 0,
  mouseY = 0;

function animate() {
  mouseX = getMousePositionInWorld().x;
  mouseY = getMousePositionInWorld().y;

  let range = 25; // Define interaction radius

  circles.forEach(({ mesh, originalX, originalY }) => {
    let offsetX = (mouseX - originalX) * 0.1; // Small displacement
    let offsetY = (mouseY - originalY) * 0.1;

    // Check if circle is within range of the actual mouse position
    if (
      originalX >= mouseX - range &&
      originalX <= mouseX + range &&
      originalY >= mouseY - range &&
      originalY <= mouseY + range &&
      isMoving
    ) {
      // Move circles slightly in response to the mouse
      mesh.position.x += offsetX;
      mesh.position.y += offsetY;
    } else {
      mesh.position.x += (originalX - mesh.position.x) * 0.05;
      mesh.position.y += (originalY - mesh.position.y) * 0.05;
    }
  });

  isMoving = false;
  renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);
