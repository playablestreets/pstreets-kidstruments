// var players = [];
// var currentStep = 0;
// var numSteps = 6;
// var currentBank = 0;
// var numBanks = 8;
// var bankLengths = [ 176, 91, 16, 31, 12, 161, 11, 16 ];

let synth;
let notes = [ 'C', 'D', 'E', 'F', 'G', 'A', 'B' ];
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
var maskImageScale = 32;
var drawScale = 0.5;
var offset = [ 0, 0 ];
// var hueslider;

function preload() {
	instrumentImage = loadImage('assets/Daphne_7_3916.png');
	maskImage = loadImage('assets/Daphne_7_3916-MASK.png');
}

function windowResized() {
	let xOffset = width / 2;
	xOffset -= instrumentImage.width * drawScale / 2;
	let yOffset = height / 2;
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
		},
		portamento: 0.05
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
	maskImage.resize(maskImage.width / maskImageScale, maskImage.height / maskImageScale);
	maskImage.loadPixels();

	//resize window to init
	windowResized();
}

///DRAW
function draw() {
	update();

	background(255, 100);
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
	// if (Tone.context.state != 'running') {
	// 	console.log('starting tone.js');
	// 	Tone.start();
	// }

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

	if (isPressed) {
		// let note = Math.round((mouseX + divX / 2) / divX) - 1;
		// let octave = Math.round((mouseY + divY / 2) / divY) - 1;
		// note = notes[note] + octaves[octave];

		// if (lastNote != note) {
			// lastNote = note;
			// console.log('release');
			// synth.triggerRelease();
			console.log('trigger');
			synth.triggerAttack(400);
		// }
	}
	else {
		// if (lastNote != '') {
			// lastNote = '';
			console.log('Release');
			synth.triggerRelease();
		// }
	}
}

function getColor() {
	//  aim:  to access pixels from mask image as effieciently as possible
	//				accounting for image scaling and transformation

	//do the opposite scaling to sampling coords
	//as is done to the image beingdrawn.
	let foundColor = color(
		...maskImage.get((mouseX - offset.x) / maskImageScale / drawScale, (mouseY - offset.y) / maskImageScale / drawScale)
	);

	//  this approach might be faster...
	//  let d = pixelDensity();
	//  let off = (y * maskImage.width + x) * d * 4;
	//  let components = [
	// 	maskImage.pixels[off],
	// 	maskImage.pixels[off + 1],
	// 	maskImage.pixels[off + 2],
	// 	maskImage.pixels[off + 3]
	//  ];
	//  print(components);
	//  let foundColor = color(...components);

	return foundColor;
}

function getNormMouse() {
	let normMouseX = mouseX / width;
	let normMouseY = mouseY / height;
	let obj = {
		x: normMouseX,
		y: normMouseY
	};
	return obj;
}

function getElapsed() {
	let endTime = new Date();
	return (timeDiff = endTime - startTime); //in ms
}

function go() {
	isPressed = true;
	lastTouched = getElapsed();
	console.log('go at ' + lastTouched + 'ms');
	console.log(getNormMouse());
}

function stop() {
	isPressed = false;
	console.log('stop after ' + (getElapsed() - lastTouched) + 'ms');
}

//fuse touches and mouse clicks
function touchStarted() {
	go();
}

function touchEnded() {
	stop();
}

function mousePressed() {
	go();
	// step();
}

function mouseReleased() {
	stop();
}

// document.getElementById('playbutton').onclick = step;
// document.getElementById('playbutton').onmousedown = step;
// document.getElementById('button').onmousedown = buttonDown;
// document.getElementById('bg').onmousedown = bgTouch;
// document.getElementById('bg').onmouseup = bgTouchUp;

// function loadBank() {
// 	//todo implement loading bar
// 	numSteps = bankLengths[currentBank];

// 	console.log(numSteps);

// 	for (var i = 1; i <= numSteps; i++) {
// 		let fileString = '../assets/' + (currentBank + 1) + '/00' + i + '.mp3';
// 		// let player = new Tone.Player(fileString);

// 		let player = new Tone.Player({
// 			url: fileString,
// 			fadeOut: 2.5,
// 			volume: -6

// 			// "loop" : true,
// 			// "loopStart" : 0.5,
// 			// "loopEnd" : 0.7,
// 		}).toMaster();

// 		//TODO this isn't sticking
// 		// player.volume = -12;
// 		player.toMaster();
// 		players.push(player);
// 		// mp3Locations.push("../assets/1/00" + i + ".mp3")
// 	}
// }

// function buttonDown() {
// 	console.log('bank next');

// 	//for each in players
// 	//dispose
// 	players.forEach((player) => player.dispose());

// 	//clear players
// 	players = [];

// 	//increment bank
// 	currentBank++;
// 	currentBank %= numBanks;

// 	console.log('bank ' + currentBank);

// 	//load sounds
// 	loadBank();
// }

// function step() {
// 	currentStep++;
// 	if (currentStep >= numSteps) {
// 		currentStep = 1;
// 	}

// 	// players[currentStep].volume = -12;
// 	players[currentStep].start();
// }

// function stop() {
// 	// players[currentStep].fadeOut = 1;
// 	players[currentStep].stop();
// }
