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
var normMouseX;
var normMouseY;
// var hueslider;

function preload() {
	instrumentImage = loadImage('assets/Daphne_7_3916.png');
	maskImage = loadImage('assets/Daphne_7_3916-MASK.png');
	maskImage.loadPixels();
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


	background(255, 100);
	fill(255);
	// image(maskImage, width / 2 - imageWidth / 2, height / 2 - imageHeight / 2, imageWidth, imageHeight);
	image(maskImage,0 , 0, maskImage.width/2, maskImage.height/2);

	if (mouseX > 10 && mouseX < width - 10 && (mouseY > 10 && mouseY < height - 10)) {
		let ellipseWidth = mouseIsPressed ? 40 : 20;
		stroke(240, 100);
		strokeWeight(5);
		// fill();
		fill(currentColor);
		ellipse(mouseX, mouseY, ellipseWidth);
	}
}

function getColor() {
	//  aim:  to access pixels from mask image as effieciently as possible
	//				accounting for image scaling and transformation

	//do the opposite scaling to sampling coords
	//as is done to the image beingdrawn.
	let foundColor = color(...maskImage.get(mouseX*2, mouseY*2));

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
		hueUI.elt.style.color = '#999999';
	}
	else{
		currentColor = color(255);
	}
}

function mousePressed() {
	lastTouched = getElapsed();
	console.log('touched at ' + lastTouched + 'ms');
	console.log(getNormMouse());
	// step();
}

function mouseReleased() {
	console.log('released after ' + (getElapsed() - lastTouched) + 'ms');
	// stop();
}

function mouseMoved(){
	// getColor();
}

function getNormMouse(){
	let normMouseX = mouseX/width;
	let normMouseY = mouseY/height;
	let obj = {
		x: normMouseX,
		y: normMouseY
	}
	return obj;
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
