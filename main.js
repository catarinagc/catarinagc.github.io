import * as THREE from "three";

var container2 = document.getElementById("mainZone");
var container = document.getElementById("home");
const scene = new THREE.Scene();
var width = container.clientWidth;
var height = window.innerHeight;
const camera = new THREE.PerspectiveCamera(75, width / height, 0.6, 1200);
const renderer = new THREE.WebGLRenderer();

// Background color
renderer.setClearColor("rgb(0, 0, 0)");
renderer.setSize(width, height);
container.appendChild(renderer.domElement);

// Handle window resize
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

// Geometry + materials
const sphereGeometry = new THREE.CircleGeometry(1, 100);
const material1 = new THREE.MeshBasicMaterial({ color: "rgb(132, 92, 206)" });
const material2 = new THREE.MeshBasicMaterial({ color: "rgb(235, 234, 176)" });
const material3 = new THREE.MeshBasicMaterial({ color: "rgb(216, 149, 177)" });
var materialArray = [material1, material2, material3];

const fov = camera.fov * (Math.PI / 180);
const depth = 250;
const visibleHeight = 2 * Math.tan(fov / 2) * depth;
const visibleWidth = visibleHeight * camera.aspect;

// Interaction tracking
const mouse = new THREE.Vector2();
var isMoving = false;

// 🖱️ Handle both mouse + touch input
function handlePointerMove(clientX, clientY) {
  isMoving = true;
  const rect = container.getBoundingClientRect();

  if (
    clientX >= rect.left &&
    clientX <= rect.right &&
    clientY >= rect.top &&
    clientY <= rect.bottom
  ) {
    mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
    mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
  } else {
    mouse.x = -1000;
    mouse.y = -1000;
  }
}

// Mouse events
window.addEventListener("mousemove", (event) => {
  handlePointerMove(event.clientX, event.clientY);
});

// Touch events
window.addEventListener("touchstart", (event) => {
  const touch = event.touches[0];
  if (touch) handlePointerMove(touch.clientX, touch.clientY);
});

window.addEventListener("touchmove", (event) => {
  const touch = event.touches[0];
  if (touch) handlePointerMove(touch.clientX, touch.clientY);
});

window.addEventListener("touchend", () => {
  isMoving = false;
});

// Prevent page scroll while touching the canvas
container.addEventListener("touchmove", (e) => e.preventDefault(), {
  passive: false,
});

// Convert screen to world position
function getMousePositionInWorld() {
  const worldPosition = new THREE.Vector3(mouse.x, mouse.y, 0.5);
  worldPosition.unproject(camera);
  const dir = worldPosition.clone().sub(camera.position).normalize();
  const distance = (-depth - camera.position.z) / dir.z;
  worldPosition.add(dir.multiplyScalar(distance));
  return worldPosition;
}

// Create circles
var circle;
let circles = [];
for (var i = 0; i < 1500; i++) {
  circle = new THREE.Mesh(
    sphereGeometry,
    materialArray[THREE.MathUtils.randInt(0, materialArray.length - 1)]
  );
  let xPos = THREE.MathUtils.randFloat(-visibleWidth / 2, visibleWidth / 2);
  let yPos = THREE.MathUtils.randFloat(-visibleHeight / 2, visibleHeight / 2);
  circle.position.set(xPos, yPos, -depth);
  scene.add(circle);
  circles.push({ mesh: circle, originalX: xPos, originalY: yPos });
}

camera.position.z = 5;

// Animation loop
function animate() {
  const pos = getMousePositionInWorld();
  const mouseX = pos.x;
  const mouseY = pos.y;

  let range = 25; // interaction radius

  circles.forEach(({ mesh, originalX, originalY }) => {
    let offsetX = (mouseX - originalX) * 0.1;
    let offsetY = (mouseY - originalY) * 0.1;

    if (
      originalX >= mouseX - range &&
      originalX <= mouseX + range &&
      originalY >= mouseY - range &&
      originalY <= mouseY + range &&
      isMoving
    ) {
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
