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
var normMouseX;
var normMouseY;
var maskImageScale = 16; //
var drawScale = 0.2;
var offset = [ 0, 0 ];
let isLoading = true;
let loadStartTime;
let splashHue;

function windowResized() {
	if (instrumentImage.isLoaded && maskImage.isLoaded) {
		let uiOffset = 35;

		drawScale = windowWidth / instrumentImage.width;
		if (windowWidth > windowHeight) {
			drawScale = windowHeight / instrumentImage.height;
		}

		let xOffset = windowWidth / 2;
		xOffset -= instrumentImage.width * drawScale / 2;
		let yOffset = windowHeight / 2;
		yOffset -= instrumentImage.height * drawScale / 2 + uiOffset;

		offset = {
			x: xOffset,
			y: yOffset
		};

		if (instrumentImage.isLoaded && maskImage.isLoaded) {
			canvas.style('z-index', -1);
			isLoading = false;
		}

		resizeCanvas(windowWidth, windowHeight);
	}
}

function loadInstrument() {

	isLoading = true;
	loadStartTime = millis();
	instrumentImage = loadImage('assets/Daphne_7_3916.png', () => {
		instrumentImage.isLoaded = true;
		windowResized();
	});
	maskImage = loadImage('assets/Daphne_7_3916-MASK.png', () => {
		maskImage.resize(maskImage.width / maskImageScale, maskImage.height / maskImageScale);
		maskImage.loadPixels();
		maskImage.isLoaded = true;
		windowResized();
	});
	document.getElementById('info').innerHTML = 'INSTRUMENT by \n NAME';
}

///SETUP
function setup() {
	console.log('hi');
	pixelDensity(1);
	splashHue = random(360);


	//set up sounds
	let synth = new Tone.Synth(B[2]).toMaster();
	let sound = new Sound(synth);
	sounds.push(sound);

	synth = new Tone.Synth(B[4]).toMaster();
	sound = new Sound(synth);
	sounds.push(sound);

	synth = new Tone.Synth(V[3]).toMaster();
	sound = new Sound(synth);
	sounds.push(sound);

	divX = width / notes.length;
	divY = height / octaves.length;

	currentColor = color(255);

	// Create the canvas
	canvas = createCanvas(windowWidth, windowHeight);
	canvas.position(0, 0);

	loadInstrument();
	//resize window to init
	windowResized();
}

function drawSplash() {
	// console.log('splash');
	canvas.style('z-index', 10);
	colorMode(HSB);
	background(splashHue, 50, 100, 0.1);
	colorMode(RGB);

	fill(255);
	strokeWeight(0);
	textAlign(CENTER, CENTER);
	textSize(32);

	// if(isLoading && (millis() - loadStartTime) > 5000){
	if(isLoading || (millis() - loadStartTime) < 1000){
		text("LOADING...", windowWidth/2, windowHeight/2);
	}else if(!hasBegun || Tone.context.state != 'running'){
		text("LET'S JAM!", windowWidth/2, windowHeight/2);
	}

}

///DRAW
function draw() {
	update();

	if (isLoading || !hasBegun) {
		drawSplash();
	}
	else {
		fillBg();

		fill(255);

		if (instrumentImage.isLoaded && maskImage.isLoaded) {
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
			currentHue = parseInt(currentColor._getHue());
		}
		else {
			currentHue = -1;
		}
	}
	else {
		currentColor = color(255);
	}

	//sound making
	if (isPressed && currentHue >= 0) {
		activeSynth = parseInt(map(currentHue, 0, 360, 0, sounds.length));

		let i = 0;
		sounds.forEach((sound) => {
			if (activeSynth != i) sound.stopNotes();
			else sound.playNote();
			i++;
		});
	}
	else {
		// release all notes
		sounds.forEach((sound) => {
			sound.stopNotes();
		});
	}
}

function fillBg() {
	if (isPressed && currentHue >= 0) {
		colorMode(HSB);
		background(currentHue, 50, 100, 0.2);
		colorMode(RGB);
	}
	else {
		background(255, 100);
	}
}

///ONTOUCH
function go() {
	if (!hasBegun) {
		console.log('starting tone.js');
		Tone.start();
		hasBegun = true;
		canvas.style('z-index', -1);
	}
	else {
		isPressed = true;
		lastTouched = getElapsed();
		// console.log('go at ' + lastTouched + 'ms');
	}
}

///ON RELEASE
function stop() {
	isPressed = false;
	// console.log('stop after ' + (getElapsed() - lastTouched) + 'ms');
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

function loadPrev() {
	console.log('loading previous');
	splashHue = random(360);
	loadInstrument();
	hasBegun = false;
}

function loadNext() {
	console.log('loading next');
	splashHue = random(360);
	loadInstrument();
	hasBegun = false;
}

document.getElementById('button-next').onclick = loadNext;
document.getElementById('button-prev').onclick = loadPrev;
