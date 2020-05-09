var car = document.querySelector("#car_icon");
var bike = document.querySelector("#bike_icon");
var bus = document.querySelector("#bus_icon");


var car_xPos = 0;
var car_yPos = 0;
var car_angle = 0;

var bike_xPos = 0;
var bike_yPos = 0;
var bike_angle = 0;

var bus_xPos = 0;
var bus_yPos = 0;
var bus_angle = 0;


function car_animate() {
  car_xPos += 2.5;
  car_angle += .1;
  car_yPos = Math.round(5 * Math.sin(car_angle));
  car.style.transform = `translate3d(${car_xPos}px, ${car_yPos}px, 0)`;
  // adjust starting and ending locations
  if (Math.abs(car_xPos) >= 1400) {
    car_xPos = -500;
  }
  if (car_angle > 2 * Math.PI) {
    car_angle = 0;
  }
  requestAnimationFrame(car_animate);
}


function bike_animate() {
  bike_xPos += 2;
  bike_angle += .1;
  bike_yPos = Math.round(5 * Math.sin(bike_angle));
  bike.style.transform = `translate3d(${bike_xPos}px, ${bike_yPos}px, 0)`;
  // adjust starting and ending locations
  if (Math.abs(bike_xPos) >= 1600) {
    bike_xPos = -500;
  }
  if (bike_angle > 2 * Math.PI) {
    bike_angle = 0;
  }
  requestAnimationFrame(bike_animate);
}


function bus_animate() {
    bus_xPos += 3;
    bus_angle += .1;
    bus_yPos = Math.round(5 * Math.sin(bus_angle));
    bus.style.transform = `translate3d(${bus_xPos}px, ${bus_yPos}px, 0)`;
    // adjust starting and ending locations
    if (Math.abs(bus_xPos) >= 1600) {
      bus_xPos = -500;
    }
    if (bus_angle > 2 * Math.PI) {
      bus_angle = 0;
    }
    requestAnimationFrame(bus_animate);
  }

car_animate();
bike_animate();
bus_animate();