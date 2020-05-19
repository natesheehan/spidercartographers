var littlebike = document.querySelector('#little_bike');

var littlebike_xPos = 0;
var littlebike_yPos = 0;
var littlebike_angle = 0;

function littlebike_animate() {

  littlebike_xPos += 1.5;
  littlebike_angle += 0;
  littlebike_yPos = Math.round(0 * Math.sin(littlebike_angle));

  littlebike.style.transform = `translate3d(${littlebike_xPos}px, 0, 0)`;
  
  // adjust starting and ending locations
  if (Math.abs(littlebike_xPos) >= 1200) {
    littlebike_xPos = -100;
  }
  if (littlebike_angle > 2 * Math.PI) {
    littlebike_angle = 0;
  }
  requestAnimationFrame(littlebike_animate);
}

littlebike_animate();