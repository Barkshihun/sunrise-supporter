"use strict";
const home = document.body.querySelector(".home");
const main = document.body.querySelector(".main");
const timeForm = document.getElementById("timeForm");
const sunBackground = document.body.querySelector(".sun-background");
const sun = document.body.querySelector(".sun");
const ground = document.body.querySelector(".ground");
const clock = document.body.querySelector(".clock");

let counter = 1;
let sunBackgroundCounter = -390;
let sunCounter = 0;
let groundCounter = 0;

const sunAnimate = () => {
  const intervalId = setInterval(() => {
    if (counter > 60) {
      clearInterval(intervalId);
      return;
    }
    if (counter >= 1) {
      sunBackgroundCounter += 11;
      sunCounter += 3.5;
      if (counter >= 30 && groundCounter <= 24) {
        groundCounter += 0.8;
        ground.style = `background: hsl(124 55% ${groundCounter}%);`;
      }
      sunBackground.style = `top: ${sunBackgroundCounter}px;`;
      sun.style = `bottom: ${sunCounter}px;`;
    }
    counter++;
  }, 60000);
};

const clockAnimate = () => {
  const date = new Date();
  const hour = date.getHours();
  const min = date.getMinutes();
  clock.innerText = `${hour < 10 ? `0${hour}` : hour}:${min < 10 ? `0${min}` : min}`;
};

const getCamera = async () => {
  const camera = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } });
  const cameraView = document.getElementById("cameraView");
  cameraView.srcObject = camera;
};

timeForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const sunRiseTime = e.target[0].value;
  const sunRiseTimeHour = parseInt(sunRiseTime.split(":")[0]);
  const sunRiseTimeMin = parseInt(sunRiseTime.split(":")[1]);
  const currentDate = new Date();
  const currentHour = currentDate.getHours();
  const currentMin = currentDate.getMinutes();
  const remainTime = new Date(0, 0, 1, sunRiseTimeHour, sunRiseTimeMin) - new Date(0, 0, 1, currentHour, currentMin);
  if (remainTime <= 0) {
    alert("현재 시간보다 큰 값을 입력해주세요");
    return;
  }
  const latedTime = 60 - remainTime / 60000;
  counter += latedTime;
  if (latedTime > 0) {
    sunBackgroundCounter += 11 * latedTime;
    sunCounter += 3.5 * latedTime;
    if (latedTime >= 30) {
      groundCounter += 0.8 * (latedTime - 29);
    }
    ground.style = `background: hsl(124 55% ${groundCounter}%);`;
    sunBackground.style = `top: ${sunBackgroundCounter}px;`;
    sun.style = `bottom: ${sunCounter}px;`;
  }
  sunAnimate();
  home.classList.add("hide");
  main.classList.remove("hide");
  getCamera();
  clockAnimate();
  const intervalId = setInterval(() => {
    const nowDate = new Date();
    const nowHour = nowDate.getHours();
    const nowMin = nowDate.getMinutes();
    clockAnimate();
    if (sunRiseTimeHour === nowHour && sunRiseTimeMin === nowMin) {
      clearInterval(intervalId);
      clock.style = "color: #ff9800;";
      return;
    }
  }, 1000);
});
