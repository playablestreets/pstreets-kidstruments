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
// let currentRadio = "off";
let radioOffColor = "#ff84ef";
let radioOnColor = "#f6cff7";
let radioPlayer;
let radioBuffers = [];
// let synth;
let activeSynth;
// let notes = [ 'C', 'D', 'E', 'F#', 'G', 'A', 'B' ];
// let octaves = [ '2', '3', '4', '5', '6', '7' ];
// let divX;
// let divY;
let isPressed = false;
let lastNote = '';
let isPlaying = false;

let currentInstrument = 0;

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

let instruments;
let instrumentsFound = false;

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

//INSTRUMENT LOADING
function loadInstrument() {
	isLoading = true;
	loadStartTime = millis();

	instrumentImage = loadImage(instruments[currentInstrument].data.instrumentimage.url, () => {
		instrumentImage.isLoaded = true;
		windowResized();
	});

	maskImage = loadImage(instruments[currentInstrument].data.maskimage.url, () => {
		maskImage.resize(maskImage.width / maskImageScale, maskImage.height / maskImageScale);
		maskImage.loadPixels();
		maskImage.isLoaded = true;
		windowResized();
	});
	document.getElementById('info').innerHTML =
		  instruments[currentInstrument].data.title[0].text + '\nby\n' + instruments[currentInstrument].data.name + ' \n(' + instruments[currentInstrument].index + ' of ' + instruments.length + ')';
}

///SETUP
function setup() {
	console.log('hi');
	pixelDensity(1);
	splashHue = random(360);

	getApi(this);

	//set up sounds
	let sound = new Xylophone();
	sounds.push(sound);

	sound = new Harp();
	sounds.push(sound);

	sound = new Tuba();
	sounds.push(sound);

	sound = new SliderSynth();
	sounds.push(sound);

	sound = new Drums();
	sounds.push(sound);

	sound = new Fart();
	sounds.push(sound);

	// let classicalBuffer = new Tone.Buffer("samples/radio/classical.mp3", () => {
	// 	console.log("classical loaded");
	// });
	// radioBuffers.push(classicalBuffer);
	
	// let rockBuffer = new Tone.Buffer("samples/radio/rock.mp3", () => {
	// 	console.log("rock loaded");
	// });
	// radioBuffers.push(rockBuffer);
	
	// let jazzBuffer = new Tone.Buffer("samples/radio/jazz.mp3", () => {
	// 	console.log("jazz loaded");
	// });
	// radioBuffers.push(jazzBuffer);
	
	// let danceBuffer = new Tone.Buffer("samples/radio/dance.mp3", () => {
	// 	console.log("dance loaded");
	// });
	// radioBuffers.push(danceBuffer);
	



	currentColor = color(255);

	// Create the canvas
	canvas = createCanvas(windowWidth, windowHeight);
	canvas.position(0, 0);
	setRadioOff();
}

//data is set from calling getApi() API
function setKidstruments(data) {
	instruments = data;
	let i = 1;
	instruments.forEach((inst) => {
		inst.index = i++;
	} );

	currentInstrument = int(random() * instruments.length);
	// console.log(instruments);
	// instruments = shuffle(instruments);
	// instrumentsFound = true;

	let urlName = getUrlName();
	if (urlName != '') {
		for (let index = 0; index < instruments.length; index++) {
			if (instruments[index].uid.toLowerCase() == urlName) {
				currentInstrument = index;
				console.log('loading ' + instruments[currentInstrument].uid);
				break;
			}
		}
	}

	loadInstrument();

	//resize window to init
	windowResized();
}

//SPLASH SCREEN
function drawSplash() {
	// console.log('splash');
	canvas.style('z-index', 10);
	colorMode(HSB);
	background(splashHue, 50, 100, 1);
	colorMode(RGB);

	fill(255);
	strokeWeight(0);
	textAlign(CENTER, CENTER);
	textSize(40);

	if (isLoading || millis() - loadStartTime < 1700) {
		text('loading...', windowWidth / 2, windowHeight / 2);
	}
	else if (!hasBegun || Tone.context.state != 'running') {
		splashHue += deltaTime * 0.1;
		splashHue %= 360;
		text('🤘\nTouch to rock', windowWidth / 2, windowHeight / 2);
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
			if (activeSynth != i) sound.stop();
			else sound.play();
			i++;
		});
	}
	else if (!isPressed) {
		// release all notes
		sounds.forEach((sound) => {
			sound.stop();
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
	if (!isLoading && millis() - loadStartTime > 1700) {
		if (!hasBegun) {
			console.log('starting tone.js');
			Tone.start();
			hasBegun = true;
			canvas.style('z-index', -1);
			colorMode(HSB);
			background(splashHue, 50, 100, 1);
			colorMode(RGB);
		}
		else {
			isPressed = true;
			lastTouched = getElapsed();
			// console.log('go at ' + lastTouched + 'ms');
		}
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
	currentInstrument--;
	if (currentInstrument < 0) currentInstrument = instruments.length - 1;

	loadInstrument();
	hasBegun = false;
}

function loadNext() {
	console.log('loading next');
	splashHue = random(360);
	currentInstrument++;
	currentInstrument %= instruments.length;
	loadInstrument();
	hasBegun = false;
}

function setRadioClassical(){
	clearRadioButtons();
	document.getElementById('radio-classical').style.backgroundColor = radioOnColor;
	if(radioPlayer != null) radioPlayer.dispose();
	radioPlayer = new Tone.Player("samples/radio/classical.mp3").toMaster();
	radioPlayer.autostart = true;
	radioPlayer.loop = true;

}
function setRadioJazz(){
	clearRadioButtons();
	document.getElementById('radio-jazz').style.backgroundColor = radioOnColor;
	if(radioPlayer != null) radioPlayer.dispose();
	radioPlayer = new Tone.Player("samples/radio/jazz.mp3").toMaster();
	radioPlayer.autostart = true;
	radioPlayer.loop = true;
}
function setRadioRock(){
	clearRadioButtons();
	document.getElementById('radio-rock').style.backgroundColor = radioOnColor;
	if(radioPlayer != null) radioPlayer.dispose();
	radioPlayer = new Tone.Player("samples/radio/rock.mp3").toMaster();
	radioPlayer.autostart = true;
	radioPlayer.loop = true;
}
function setRadioDance(){
	clearRadioButtons();
	document.getElementById('radio-dance').style.backgroundColor = radioOnColor;
	if(radioPlayer != null) radioPlayer.dispose();
	radioPlayer = new Tone.Player("samples/radio/dance.mp3").toMaster();
	radioPlayer.autostart = true;
	radioPlayer.loop = true;
}
function setRadioOff(){
	if(radioPlayer != null) radioPlayer.stop();
	clearRadioButtons();
	document.getElementById('radio-off').style.backgroundColor = radioOnColor;
}
function clearRadioButtons(){
	document.getElementById('radio-off').style.backgroundColor = radioOffColor;
	document.getElementById('radio-jazz').style.backgroundColor = radioOffColor;
	document.getElementById('radio-rock').style.backgroundColor = radioOffColor;
	document.getElementById('radio-classical').style.backgroundColor = radioOffColor;
	document.getElementById('radio-dance').style.backgroundColor = radioOffColor;

}



document.getElementById('button-next').onclick = loadNext;
document.getElementById('button-prev').onclick = loadPrev;
document.getElementById('radio-off').onclick = setRadioOff;
document.getElementById('radio-classical').onclick = setRadioClassical;
document.getElementById('radio-jazz').onclick = setRadioJazz;
document.getElementById('radio-rock').onclick = setRadioRock;
document.getElementById('radio-dance').onclick = setRadioDance;

// Listen for orientation changes
window.addEventListener(
	'orientationchange',
	function() {
		// Announce the new orientation number
		// alert(window.orientation);
		console.log('orientation change');
		// windowResized();
	},
	false
);

// function deviceTurned(){
// 	console.log("device turned");
// }
