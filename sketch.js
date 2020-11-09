let state = 'loading';
let instruments;
let currentInstrument = 0;
let currentSlug = '';

let instrumentImage;
let maskImage;
let maskImageScale = 8;
let drawMask = false;

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



//------------SETUP------------------------------------------------------------
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
  // console.log(instruments);

	let i = 1;
	instruments.forEach((inst) => {
		inst.index = i++;
	} );

	// currentInstrument = int(random() * instruments.length);
  // console.log(instruments);

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
}


function loadInstrument() {
  setState('loading');
  currentSlug = instruments[currentInstrument].uid.toLowerCase();
  console.log('loading: ' + currentSlug);

  instrumentImage, maskImage = null;

	instrumentImage = loadImage(instruments[currentInstrument].data.instrumentimage.url, () => {
		instrumentImage.isLoaded = true;
    console.log("instrument loaded! ");

    if(instrumentImage.isLoaded && maskImage.isLoaded) {
      setState('ready');
      console.log( state );
    }
	});
	
	maskImage = loadImage(instruments[currentInstrument].data.maskimage.url, () => {
    maskImage.resize(maskImage.width / maskImageScale, maskImage.height / maskImageScale);
		maskImage.loadPixels();
		maskImage.isLoaded = true;
    console.log("mask loaded!");
    
    if(instrumentImage.isLoaded && maskImage.isLoaded){
      setState('ready');
      console.log( state );
    }
  });
  

}


function setInfoText(text){
  document.getElementById('info').innerHTML = text;
}

function setState(newState){
  state = newState;

  if(state == 'ready'){
    setInfoText(
      instruments[currentInstrument].data.title[0].text 
      + '\nby\n' 
      + instruments[currentInstrument].data.name 
      + ' \n(' 
      + instruments[currentInstrument].index 
      + ' of ' 
      + instruments.length 
      + ')'
      );
  }
  if(state == 'loading'){
    setInfoText('loading...');
  }
}


//------------UPDATE------------------------------------------------------------
function update(){

  // check orientation
  setDisplayState();
  if(displayState.currentOrientation != displayState.previousOrientation){
    let addr = window.location.href;
    let dest = addr.split('?')[0] + '?' + currentSlug;
    // console.log(dest);
    location.replace(dest); //do this instead, naviagting to current instrument
  }

  if(isPressed)
    setColorState(getColor());
  else
    setColorState(color(255))

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


function setColorState(c){
  currentColor = c;
  if (currentColor._getSaturation() > 20) {
    currentHue = parseInt(currentColor._getHue());
  }
  else {
    currentHue = -1;
  }
}


//------------DRAW------------------------------------------------------------
function draw() {
  //run update
  update();

  //prepare canvas
  // clear();
  resizeCanvas(windowWidth, windowHeight);
  canvas.position(0, 0);

  fillBg();
  
  if(state == 'loading'){
    //do something....
  }
  else if(state == 'ready'){
    fill(255);
    image(instrumentImage, displayState.drawOffset.x, displayState.drawOffset.y, displayState.drawSize.x, displayState.drawSize.y);
    
    if(drawMask)
      image(maskImage, displayState.drawOffset.x, displayState.drawOffset.y, displayState.drawSize.x, displayState.drawSize.y);
  }
}



function fillBg() {
	if (isPressed && currentHue >= 0) {
		colorMode(HSB);
		background(currentHue, 50, 100, 0.8);
		colorMode(RGB);
	}
	else {
		background(255, 100);
	}
}


//------------INTERACTION------------------------------------------------------------
//pick colour from mask
function getColor() {
	let foundColor = color(
		...maskImage.get((mouseX - displayState.drawOffset.x) / maskImageScale / displayState.drawScale, (mouseY - displayState.drawOffset.y) / maskImageScale / displayState.drawScale)
	);
	return foundColor;
}

///ONTOUCH
function go() { isPressed = true; }

///ON RELEASE
function stop(){ isPressed = false; }

//fuse touches and mouse clicks
function mousePressed(){ go(); }
function touchStarted(){ go(); }
function mouseReleased(){ stop(); }
function touchEnded(){ stop(); }

function loadPrev() {
	console.log('loading previous');
	currentInstrument--;
	if (currentInstrument < 0) currentInstrument = instruments.length - 1;
	loadInstrument();
}

function loadNext() {
	console.log('loading next');
	currentInstrument++;
	currentInstrument %= instruments.length;
	loadInstrument();
}

document.getElementById('button-next').onclick = loadNext;
document.getElementById('button-prev').onclick = loadPrev;

