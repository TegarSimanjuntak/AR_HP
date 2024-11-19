const model = document.querySelector("#model");
const camera = document.querySelector("#camera");
const annotation = document.getElementById("annotation");
const infoBox = document.getElementById("info-box");

let isDragging = false;
let lastX = 0;
let lastY = 0;

// Menyesuaikan posisi dan skala model berdasarkan ukuran layar
function adjustCamera() {
    // Menghitung rasio ukuran layar (lebar dan tinggi) terhadap ukuran standar
    const screenWidth = window.innerWidth;
    const screenHeight = window.innerHeight;

    // Menentukan ukuran model berdasarkan ukuran layar
    const scaleX = screenWidth / 1000;  // Misalnya, 1000 adalah ukuran standar
    const scaleY = screenHeight / 1000; // Misalnya, 1000 adalah ukuran standar
    const scale = `${Math.min(scaleX, scaleY)} ${Math.min(scaleX, scaleY)} ${Math.min(scaleX, scaleY)}`;

    // Menyesuaikan skala model dengan ukuran layar
    model.setAttribute("scale", scale);

    // Posisi model tetap berada di tengah layar dengan sedikit offset untuk visibilitas
    model.setAttribute("position", "0 0 -8");

    // Menyesuaikan posisi kamera agar pas dengan ukuran layar
    camera.setAttribute("position", "0 1.5 3");
    camera.setAttribute("camera", "fov", 60); // Tetap menggunakan FOV default yang dapat menyesuaikan untuk berbagai perangkat
}

// Update annotation position on the screen
function updateAnnotationPosition() {
   const vector = new THREE.Vector3(1 ,1 ,1);
   vector.applyMatrix4(model.object3D.matrixWorld);
   vector.project(model.sceneEl.camera);

   const x = (vector.x * 0.5 + 0.5) * window.innerWidth;
   const y = -(vector.y * 0.5 - 0.5) * window.innerHeight;

   annotation.style.left = `${x}px`;
   annotation.style.top = `${y}px`;
   annotation.style.display = "block";
   requestAnimationFrame(updateAnnotationPosition);
}

// Handle annotation click
annotation.addEventListener("click", () => {
   infoBox.style.display = "block";
   infoBox.style.left = `${parseInt(annotation.style.left) + 30}px`;
   infoBox.style.top = annotation.style.top;
});

// Handle info box click (hide it)
infoBox.addEventListener("click", () => {
   infoBox.style.display = "none";
});

// Event listener when the model is loaded
model.addEventListener("model-loaded", () => {
   adjustCamera();  // Set initial camera position and scale
   updateAnnotationPosition();
});

// Event listener on window resize
window.addEventListener("resize", adjustCamera);  // Update camera and model on resize

// Event listeners for dragging the model
window.addEventListener("mousedown", (event) => {
   isDragging = true;
   lastX = event.clientX;
   lastY = event.clientY;
});

window.addEventListener("mousemove", (event) => {
   if (isDragging) {
      const deltaX = event.clientX - lastX;
      const deltaY = event.clientY - lastY;
      const currentRotation = model.getAttribute("rotation");

      model.setAttribute("rotation", {
         x: currentRotation.x + deltaY * 0.5,
         y: currentRotation.y + deltaX * 0.5,
         z: currentRotation.z
      });

      lastX = event.clientX;
      lastY = event.clientY;
   }
});

window.addEventListener("mouseup", () => {
   isDragging = false;
});

// Initial setup
adjustCamera();  // Set initial camera and model settings
