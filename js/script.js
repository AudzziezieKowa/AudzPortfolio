document.addEventListener("DOMContentLoaded", function(){

/* ===== PAGE FADE TRANSITION ===== */

document.querySelectorAll('a').forEach(link => {

if(link.getAttribute("href").startsWith("#")) return;

link.addEventListener('click', e => {

e.preventDefault();

const target = link.href;

document.body.classList.add('fade-out');

setTimeout(() => {

window.location.href = target;

}, 400);

});

});



/* ===== DRAG TO SCROLL ===== */

let sliders = document.querySelectorAll('.gallery-row');

sliders.forEach(slider => {

let isDown = false;
let startX;
let scrollLeft;

slider.addEventListener('mousedown', e => {

isDown = true;
startX = e.pageX - slider.offsetLeft;
scrollLeft = slider.scrollLeft;

});

slider.addEventListener('mouseleave', () => {

isDown = false;

});

slider.addEventListener('mouseup', () => {

isDown = false;

});

slider.addEventListener('mousemove', e => {

if(!isDown) return;

e.preventDefault();

const x = e.pageX - slider.offsetLeft;

const walk = (x - startX) * 2;

slider.scrollLeft = scrollLeft - walk;

});

});



/* ===== LIGHTBOX ===== */

const lightbox = document.getElementById("lightbox");

const lightboxImg = document.getElementById("lightbox-img");

const lightboxVideo = document.getElementById("lightbox-video");



/* IMAGE CLICK */

document.querySelectorAll(".gallery-row img").forEach(img => {

img.addEventListener("click", function(){

lightbox.classList.add("active");

lightboxImg.src = this.src;
lightboxImg.style.display = "block";

lightboxVideo.pause();
lightboxVideo.style.display = "none";

});

});



/* VIDEO CLICK */

document.querySelectorAll(".gallery-row video").forEach(video => {

video.addEventListener("click", function(){

lightbox.classList.add("active");

lightboxVideo.src = this.src;

lightboxVideo.style.display = "block";

lightboxVideo.muted = false;

lightboxVideo.currentTime = 0;

lightboxVideo.controls = true;

lightboxVideo.play();

lightboxImg.style.display = "none";

});

});



/* CLOSE LIGHTBOX */

window.closeLightbox = function(){

lightbox.classList.remove("active");

lightboxVideo.pause();

}



/* CLICK OUTSIDE CLOSE */

lightbox.addEventListener("click", function(e){

if(e.target === lightbox){

closeLightbox();

}

});

});