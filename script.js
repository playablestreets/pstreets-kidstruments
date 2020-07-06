//TODO
//for further UI
// https://github.com/loneboarder/p5.experience.js
//https://github.com/bitcraftlab/p5.gui
//https://github.com/generative-light/p5.scribble.js

//TOUCH GUI
//https://github.com/L05/p5.touchgui
// early work but good to look at for touch interactions on mobile
//it works great actually
//https://editor.p5js.org/L05/sketches/LWfA8lGwe

// TODO
// interface to synths
// hue, alpha, normx, normy, duration
// interface to synth indexed by hue:
// alpha, normx, normy, duration;
// manually start audioContext.  Perhaps use an instructional splash screen...


'use strict';
// let synths = [];
let hasBegun = false;
let sounds = [];

// let synth;
let activeSynth;
let notes = [ 'C', 'D', 'E', 'F#', 'G', 'A', 'B' ];
let octaves = [ '2', '3', '4', '5', '6', '7' ];
let divX;
let divY;
let isPressed = false;
let lastNote = '';
let isPlaying = false;

let drawMask = false;

var startTime = new Date();
var lastTouched = getElapsed();
var instrumentImage;
var maskImage;
var currentColor;
var currentHue;
var hueUI;
var normMouseX;
var normMouseY;
var maskImageScale = 16; //
var drawScale = 0.5;
var offset = [ 0, 0 ];

function preload() {
	instrumentImage = loadImage('assets/Daphne_7_3916.png');
	maskImage = loadImage('assets/Daphne_7_3916-MASK.png');
}

function windowResized() {
	let xOffset = windowWidth / 2;
	xOffset -= instrumentImage.width * drawScale / 2;
	let yOffset = windowHeight / 2;
	yOffset -= instrumentImage.height * drawScale / 2;
	offset = {
		x: xOffset,
		y: yOffset
	};

	resizeCanvas(windowWidth, windowHeight);
}

///SETUP
function setup() {
	console.log('hi');
	pixelDensity(1);

	//set up sounds

	let synth = new Tone.Synth(
		B[2]
	).toMaster();
	let sound = new Sound(synth);
	sounds.push(sound);

	synth = new Tone.Synth(
		U[0]
	).toMaster();
	sound = new Sound(synth);
	sounds.push(sound);

	synth = new Tone.Synth(
		V[3]
	).toMaster();
	sound = new Sound(synth);
	sounds.push(sound);

	divX = width / notes.length;
	divY = height / octaves.length;

	//debug gui
	hueUI = createElement('h2', 'nothin has happened');
	currentColor = color(255);

	// Create the canvas
	canvas = createCanvas(windowWidth, windowHeight);
	canvas.position(0, 0);
	canvas.style('z-index', -1);

	//set up mask image
	maskImage.resize(maskImage.width / maskImageScale, maskImage.height / maskImageScale);
	maskImage.loadPixels();

	//resize window to init
	windowResized();
}

///DRAW
function draw() {
	update();

	if (isPressed && currentHue >= 0) {
		colorMode(HSB);
		background(currentHue, 50, 100, 0.2);
		colorMode(RGB);
	}
	else {
		background(255, 100);
	}

	fill(255);

	image(instrumentImage, offset.x, offset.y, instrumentImage.width * drawScale, instrumentImage.height * drawScale);

	if (drawMask) {
		image(
			maskImage,
			offset.x,
			offset.y,
			maskImage.width * maskImageScale * drawScale,
			maskImage.height * maskImageScale * drawScale
		);
	}

	if (mouseX > 10 && mouseX < width - 10 && (mouseY > 10 && mouseY < height - 10)) {
		let ellipseWidth = mouseIsPressed ? 70 : 0;
		stroke(240, 100);
		strokeWeight(5);
		fill(currentColor);
		ellipse(mouseX, mouseY, ellipseWidth);
	}
}

///UPDATE
function update() {
	// if (Tone.context.state != 'running') {
	// 	console.log('starting tone.js');
	// 	Tone.start();
	// }

	//color picking
	if (isPressed) {
		currentColor = getColor();

		if (currentColor._getSaturation() > 20) {
			currentHue = currentColor._getHue();
		}
		else {
			currentHue = -1;
		}

		hueUI.elt.innerText = parseInt(activeSynth);
		hueUI.elt.style.color = '#999999';
	}
	else {
		currentColor = color(255);
	}

	//sound making
	if (isPressed && currentHue >= 0) {
		activeSynth = parseInt(map(currentHue, 0, 360, 0, sounds.length));

		// let note = map(getNormMouse().x, 0, 1, 400, 2000);
		// console.log('note: ' + note +  ', activeSynth: ' + activeSynth);

		let i = 0;
		sounds.forEach(sound => {
			if(activeSynth != i)
				sound.stopNotes();
			else
				sound.playNote();
			i++;
		});

		
	}
	// release all notes
	else {
		sounds.forEach(sound => {
				sound.stopNotes();
		});
	}
}

///ONTOUCH
function go() {

	if(!hasBegun){
		console.log('starting tone.js');
		Tone.start();
	}

	isPressed = true;
	lastTouched = getElapsed();
	console.log('go at ' + lastTouched + 'ms');
}

///ON RELEASE
function stop() {
	isPressed = false;
	console.log('stop after ' + (getElapsed() - lastTouched) + 'ms');
}

//fuse touches and mouse clicks
function mousePressed() {
	go();
}

function touchStarted() {
	go();
}
function mouseReleased() {
	stop();
}

function touchEnded() {
	stop();
}
