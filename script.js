// var players = [];
// var currentStep = 0;
// var numSteps = 6;
// var currentBank = 0;
// var numBanks = 8;
// var bankLengths = [ 176, 91, 16, 31, 12, 161, 11, 16 ];

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




let synth;
let notes = [ 'C', 'D', 'E', 'F#', 'G', 'A', 'B' ];
// let colores = [0, 20, 40, 90, 130, 170, 210];
let octaves = [ '2', '3', '4', '5', '6', '7' ];
let tonos = [ 105, 135, 165, 195, 225, 255 ];
let divX;
let divY;
// let oldIsPressed = false;
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
var maskImageScale = 64; //
var drawScale = 0.5;
var offset = [ 0, 0 ];
// var hueslider;

function preload() {
	instrumentImage = loadImage('assets/Daphne_7_3916.png');
	maskImage = loadImage('assets/Daphne_7_3916-MASK.png');
}

function windowResized() {
	let xOffset = windowWidth / 2;
	xOffset -= instrumentImage.width * drawScale / 2;
	let yOffset = windowHeight / 2;
	yOffset -= instrumentImage.height * drawScale / 2;
	console.log(xOffset, yOffset);
	// let xOffset = 0;
	// let yOffset = 0;
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

	//set up synth
	synth = new Tone.Synth({
		oscillator: {
			type: 'amtriangle',
			harmonicity: 0.5,
			modulationType: 'sine'
		},
		envelope: {
			attackCurve: 'exponential',
			attack: 0.05,
			decay: 0.2,
			sustain: 0.2,
			release: 1.5
		} //,
		// portamento: 0.05
	}).toMaster();
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
	// maskImage = instrumentImage.get();
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
		// background(millis()* 0.1 % 360, 50, 100, 0.2);
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
		// fill();
		fill(currentColor);
		ellipse(mouseX, mouseY, ellipseWidth);
	}
}

///UPDATE
function update() {
	if (Tone.context.state != 'running') {
		console.log('starting tone.js');
		Tone.start();
	}

	//color picking
	if (isPressed) {
		currentColor = getColor();

		// hueUI = createElement('h2', currentColor._getHue());
		if (currentColor._getSaturation() > 20) {
			currentHue = currentColor._getHue();
		}
		else {
			currentHue = -1;
		}

		hueUI.elt.innerText = parseInt(currentHue);
		hueUI.elt.style.color = '#999999';
	}
	else {
		currentColor = color(255);
	}

	if (isPressed && currentHue >= 0) {
		// let note = Math.round((mouseX + divX / 2) / divX) - 1;
		// let octave = Math.round((mouseY + divY / 2) / divY) - 1;
		// note = notes[note] + octaves[octave];

		let note = map(getNormMouse().x, 0, 1, 400, 2000);
		console.log(note);

		// synth.setNote(map(getNormMouse().x, 0, 1, 400, 2000));
		if (lastNote != note) {
			lastNote = note;
			// console.log('release');
			// synth.triggerRelease();
			console.log('trigger');
			synth.triggerAttack(note);
		}
	}
	else {
		if (lastNote != '') {
			lastNote = '';
			console.log('Release');
			synth.triggerRelease();
		}
	}
}

///ONTOUCH
function go() {
	isPressed = true;
	lastTouched = getElapsed();
	console.log('go at ' + lastTouched + 'ms');
	console.log(getNormMouse());
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
