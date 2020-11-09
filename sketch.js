let state = 'loading';
let instruments;
let currentInstrument = 0;
let currentInstrumentName = '';

let instrumentImage;
let maskImage;
let maskImageScale = 8;
let drawMask = true;

let currentColor;
let isPressed = false;

let displayState = {
  currentOrientation: 'protrait',
  previousOrientation: 'portrait',
  drawScale: 1,
  drawOffset: {
    x: 0,
    y: 0
  },
  drawSize: {
    x: 1,
    y: 1
  }
}



//------------SETUP
function setup() {
  //send for kidstruments
  getApi(this); //returns to setKidstruments()
  
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0, 0);
  
  setDisplayState();
  displayState.previousOrientation = displayState.currentOrientation;

  textSize(100);
  currentColor = color(255);
}


function setKidstruments(data) {
	console.log("setting kidstruments...")
  instruments = data;

	let i = 1;
	instruments.forEach((inst) => {
		inst.index = i++;
	} );

	// currentInstrument = int(random() * instruments.length);
	// console.log(instruments);
	// instruments = shuffle(instruments);

	// let urlName = getUrlName();
	// if (urlName != '') {
	// 	for (let index = 0; index < instruments.length; index++) {
	// 		if (instruments[index].uid.toLowerCase() == urlName) {
	// 			currentInstrument = index;
	// 			console.log('loading ' + instruments[currentInstrument].uid);
	// 			break;
	// 		}
	// 	}
	// }

	loadInstrument();
}


function loadInstrument() {
  state = 'loading';

  instrumentImage, maskImage = null;

	instrumentImage = loadImage(instruments[currentInstrument].data.instrumentimage.url, () => {
		instrumentImage.isLoaded = true;
    console.log("instrument loaded! ");

    if(instrumentImage.isLoaded && maskImage.isLoaded) {
      state = 'ready';
      console.log( state );
    }
	});
	
	maskImage = loadImage(instruments[currentInstrument].data.maskimage.url, () => {
    maskImage.resize(maskImage.width / maskImageScale, maskImage.height / maskImageScale);
		maskImage.loadPixels();
		maskImage.isLoaded = true;
    console.log("mask loaded!");
    
    if(instrumentImage.isLoaded && maskImage.isLoaded){
      state = 'ready';
      console.log( state );
    }
  });
  
	// document.getElementById('info').innerHTML =
		  // instruments[currentInstrument].data.title[0].text + '\nby\n' + instruments[currentInstrument].data.name + ' \n(' + instruments[currentInstrument].index + ' of ' + instruments.length + ')';
}



//------------UPDATE
function update(){

  // check orientation
  setDisplayState();
  if(displayState.currentOrientation != displayState.previousOrientation){
    location.reload();
    // location.replace("http://zeal.co"); //do this instead, naviagting to current instrument
  }

  //pick colour
  // if (isPressed) {
	// 	currentColor = getColor();
	// 	if (currentColor._getSaturation() > 20) {
	// 		currentHue = parseInt(currentColor._getHue());
	// 	}
	// 	else {
	// 		currentHue = -1;
	// 	}
	// }
	// else {
	// 	currentColor = color(255);
  // }
  if(isPressed)
    setColorState(getColor());
  else
    setColorState(color(255))

}


function setColorState(c){
  currentColor = c;
  if (currentColor._getSaturation() > 20) {
    currentHue = parseInt(currentColor._getHue());
  }
  else {
    currentHue = -1;
  }
}


function setDisplayState(){
  if(windowWidth > windowHeight)
    displayState.currentOrientation = 'landscape';
  else
    displayState.currentOrientation = 'portrait';

  if(instrumentImage){
    displayState.drawScale = windowWidth / instrumentImage.width;
    displayState.drawOffset.y = windowHeight / 2 - instrumentImage.height * displayState.drawScale / 2; 
    displayState.drawSize.x = windowWidth;
    displayState.drawSize.y = instrumentImage.height * displayState.drawScale;
  }
}


//------------DRAW
function draw() {
  //run update
  update();

  //prepare canvas
  // clear();
  resizeCanvas(windowWidth, windowHeight);
  canvas.position(0, 0);

  fillBg();
  fill(255);

  if(state == 'loading'){
    text(state, width/2, height/2);
  }
  else if(state == 'ready'){
    image(instrumentImage, displayState.drawOffset.x, displayState.drawOffset.y, displayState.drawSize.x, displayState.drawSize.y);
    
    if(drawMask)
      image(maskImage, displayState.drawOffset.x, displayState.drawOffset.y, displayState.drawSize.x, displayState.drawSize.y);
  }
}



function fillBg() {
	// if (isPressed && currentHue >= 0) {
	if (isPressed) {
		colorMode(HSB);
		background(currentHue, 50, 100, 0.8);
		colorMode(RGB);
	}
	else {
		background(255, 100);
	}
}



//pick colour from mask
function getColor() {


	//  aim:  to access pixels from mask image as effieciently as possible
	//				accounting for image scaling and transformation

	//do the opposite scaling to sampling coords
	//as is done to the image beingdrawn.
	let foundColor = color(
		...maskImage.get((mouseX - displayState.drawOffset.x) / maskImageScale / displayState.drawScale, (mouseY - displayState.drawOffset.y) / maskImageScale / displayState.drawScale)
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

///ONTOUCH
function go() {
	// if (!isLoading && millis() - loadStartTime > 1700) {
	// 	if (!hasBegun) {
	// 		console.log('starting tone.js');
	// 		Tone.start();
	// 		hasBegun = true;
	// 		canvas.style('z-index', -1);
	// 		colorMode(HSB);
	// 		background(splashHue, 50, 100, 1);
	// 		colorMode(RGB);
	// 	}
	// 	else {
	// 		isPressed = true;
	// 		lastTouched = getElapsed();
	// 		// console.log('go at ' + lastTouched + 'ms');
	// 	}
  // }
  isPressed = true;
}

///ON RELEASE
function stop(){ isPressed = false; }

//fuse touches and mouse clicks
function mousePressed(){ go(); }
function touchStarted(){ go(); }
function mouseReleased(){ stop(); }
function touchEnded(){ stop(); }