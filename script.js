// var players = [];
// var currentStep = 0;
// var numSteps = 6;
// var currentBank = 0;
// var numBanks = 8;
// var bankLengths = [ 176, 91, 16, 31, 12, 161, 11, 16 ];

var startTime = new Date();
var lastTouched = getElapsed();
var instrumentImage;
var maskImage;
var currentColor;
var currentHue;
var hueUI;
// var hueslider;

function preload() {
	instrumentImage = loadImage('assets/Daphne_7_3916.png');
	maskImage = loadImage('assets/Daphne_7_3916-MASK.png');
}

function getElapsed() {
	let endTime = new Date();
	return (timeDiff = endTime - startTime); //in ms
}

function windowResized() {
	resizeCanvas(windowWidth, windowHeight);
}

//SETUP_________________________________
function setup() {
	console.log('hi');
	hueUI = createElement('h2', 'nothin has happened');

	// Create the canvas
	canvas = createCanvas(windowWidth, windowHeight);
	canvas.position(0, 0);
	canvas.style('z-index', -1);

	windowResized();
	currentColor = color(255);
}

function draw() {
	update();

	let imageWidth = instrumentImage.width / 2;
	let imageHeight = instrumentImage.height / 2;

	background(255, 100);
	fill(255);
	image(maskImage, width / 2 - imageWidth / 2, height / 2 - imageHeight / 2, imageWidth, imageHeight);

	if (mouseX > 10 && mouseX < width - 10 && (mouseY > 10 && mouseY < height - 10)) {
		let ellipseWidth = mouseIsPressed ? 65 : 50;
		stroke(currentColor);
		strokeWeight(5);
		fill(240, 100);
		ellipse(mouseX, mouseY, ellipseWidth);
	}
}

function getColor() {
	let foundColor = color(...get(mouseX, mouseY));
	return foundColor;
}

//TODO more effiecient get... look up pixel array directly
function update() {
	if (mouseIsPressed) {
		currentColor = getColor();

		// hueUI = createElement('h2', currentColor._getHue());
		if (currentColor._getSaturation() > 20) {
			currentHue = currentColor._getHue();
		}
		else {
			currentHue = -1;
		}

		hueUI.elt.innerText = parseInt(currentHue);
		hueUI.elt.style.color = '#000000';
	}
}

function mousePressed() {
	lastTouched = getElapsed();
	console.log('touched at ' + lastTouched + 'ms');

	// step();
}

function mouseReleased() {
	console.log('released after ' + (getElapsed() - lastTouched) + 'ms');
	// stop();
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
