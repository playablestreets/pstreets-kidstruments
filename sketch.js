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
};

let radioOffColor = '#ff84ef';
let radioOnColor = '#f6cff7';
let radioPlayer;
let sounds = [];
// let radioBuffers = [];

//------------SETUP------------------------------------------------------------
function setup() {
  setInfoText('loading...');
	//send for kidstruments
  getApi(this); //returns to setKidstruments()
  
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

	canvas = createCanvas(windowWidth, windowHeight);
	canvas.position(0, 0);

	setDisplayState();
	// displayState.previousOrientation = displayState.currentOrientation;

	textSize(100);
	currentColor = color(255);
}

function setKidstruments(data) {
	console.log('setting kidstruments...');
	instruments = data;
	// console.log(instruments);

	let i = 1;
	instruments.forEach((inst) => {
		inst.index = i++;
	});

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

	instrumentImage, (maskImage = null);

	instrumentImage = loadImage(instruments[currentInstrument].data.instrumentimage.url, () => {
		instrumentImage.isLoaded = true;
		console.log('instrument loaded! ');

		if (instrumentImage.isLoaded && maskImage.isLoaded) {
			setState('ready');
			console.log(state);
		}
	});

	maskImage = loadImage(instruments[currentInstrument].data.maskimage.url, () => {
		maskImage.resize(maskImage.width / maskImageScale, maskImage.height / maskImageScale);
		maskImage.loadPixels();
		maskImage.isLoaded = true;
		console.log('mask loaded!');

		if (instrumentImage.isLoaded && maskImage.isLoaded) {
			setState('ready');
			console.log(state);
		}
	});
}

function setInfoText(text) {
	document.getElementById('info').innerHTML = text;
	// for small screen added Gujie
	document.getElementById('info-s').innerHTML = text;
	// for small screen
}

function setState(newState) {
  
  if(newState != state){

    state = newState;
    
    if (state == 'ready') {
      setInfoText(
        instruments[currentInstrument].data.title[0].text +
				'\nby\n' +
				instruments[currentInstrument].data.name +
				' \n(' +
				instruments[currentInstrument].index +
				' of ' +
				instruments.length +
				')'
        );
      }

      if (state == 'loading') {
        setInfoText('loading...');
      }
    }
}

//------------UPDATE------------------------------------------------------------
function update() {
  // check orientation
  setDisplayState();
  //if we have rotated, reload the page
  if (displayState.currentOrientation != displayState.previousOrientation)
    reloadPage();


  if (isPressed) 
    setColorState(getColor());
  else 
    setColorState(color(255));
  
  //sound making
	if (isPressed && currentHue >= 0) 
    startSound();
  // else if (!isPressed)
  else
    stopSound();
}


function startSound(){
  activeSynth = parseInt(map(currentHue, 0, 360, 0, sounds.length));
  let i = 0;

  sounds.forEach((sound) => {
    if (activeSynth != i) 
      sound.stop();
    else 
      sound.play();

    i++;
  });
}


function stopSound(){
		// release all notes
		sounds.forEach((sound) => {
			sound.stop();
		});
}


function setDisplayState() {

  displayState.previousOrientation = displayState.currentOrientation;

	if (windowWidth > windowHeight){
    displayState.currentOrientation = 'landscape';
  } 
  else {
    displayState.currentOrientation = 'portrait';
  }

	if (instrumentImage) {
		displayState.drawScale = windowWidth / instrumentImage.width;
		displayState.drawOffset.y = windowHeight / 2 - instrumentImage.height * displayState.drawScale / 2;
		displayState.drawSize.x = windowWidth;
		displayState.drawSize.y = instrumentImage.height * displayState.drawScale;
	}
}

function setColorState(c) {
	currentColor = c;
	if (currentColor._getSaturation() > 20) {
		currentHue = parseInt(currentColor._getHue());
	}
	else {
    // console.log('setting to -1');
		currentHue = -1;
	}
}

function reloadPage(){
  let addr = window.location.href;
  let dest = addr.split('?')[0] + '?' + currentSlug;
  // console.log(dest);
  location.replace(dest); //do this instead, naviagting to current instrument
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

	if (state == 'loading') {
		//do something....
	}
	else if (state == 'ready') {
		fill(255);
		image(
			instrumentImage,
			displayState.drawOffset.x,
			displayState.drawOffset.y,
			displayState.drawSize.x,
			displayState.drawSize.y
		);

		if (drawMask)
			image(
				maskImage,
				displayState.drawOffset.x,
				displayState.drawOffset.y,
				displayState.drawSize.x,
				displayState.drawSize.y
			);
	}

	drawTouch();
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

function drawTouch() {
	if (mouseX > 10 && mouseX < width - 10 && (mouseY > 10 && mouseY < height - 10)) {
		let ellipseWidth = mouseIsPressed ? 70 : 0;
		stroke(240, 100);
		strokeWeight(5);
		fill(currentColor);
		ellipse(mouseX, mouseY, ellipseWidth);
	}
}

//------------INTERACTION------------------------------------------------------------
//pick colour from mask
function getColor() {
	let foundColor = color(
		...maskImage.get(
			(mouseX - displayState.drawOffset.x) / maskImageScale / displayState.drawScale,
			(mouseY - displayState.drawOffset.y) / maskImageScale / displayState.drawScale
		)
	);
	return foundColor;
}

///ONTOUCH
function go() {
  if (Tone.context.state != 'running') {
    console.log('starting tone.js');
    Tone.start();
  }
	isPressed = true;
}

///ON RELEASE
function stop() {
  isPressed = false;
  currentHue = -1;
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
	currentInstrument--;
  if (currentInstrument < 0) currentInstrument = instruments.length - 1;
	loadInstrument();
  reloadPage();
}

function loadNext() {
	console.log('loading next');
	currentInstrument++;
  currentInstrument %= instruments.length;
	loadInstrument();
  reloadPage();
}

//------------RADIO------------------------------------------------------------
function setRadioClassical() {
	clearRadioButtons();
	document.getElementById('radio-classical').style.backgroundColor = radioOnColor;
	if (radioPlayer != null) radioPlayer.dispose();
	radioPlayer = new Tone.Player('samples/radio/classical.mp3').toMaster();
	radioPlayer.autostart = true;
	radioPlayer.loop = true;
}

function setRadioJazz() {
	clearRadioButtons();
	document.getElementById('radio-jazz').style.backgroundColor = radioOnColor;
	if (radioPlayer != null) radioPlayer.dispose();
	radioPlayer = new Tone.Player('samples/radio/jazz.mp3').toMaster();
	radioPlayer.autostart = true;
	radioPlayer.loop = true;
}

function setRadioRock() {
	clearRadioButtons();
	document.getElementById('radio-rock').style.backgroundColor = radioOnColor;
	if (radioPlayer != null) radioPlayer.dispose();
	radioPlayer = new Tone.Player('samples/radio/rock.mp3').toMaster();
	radioPlayer.autostart = true;
	radioPlayer.loop = true;
}

function setRadioDance() {
	clearRadioButtons();
	document.getElementById('radio-dance').style.backgroundColor = radioOnColor;
	if (radioPlayer != null) radioPlayer.dispose();
	radioPlayer = new Tone.Player('samples/radio/dance.mp3').toMaster();
	radioPlayer.autostart = true;
	radioPlayer.loop = true;
}

function setRadioOff() {
	if (radioPlayer != null) radioPlayer.stop();
	clearRadioButtons();
	document.getElementById('radio-off').style.backgroundColor = radioOnColor;
}

function clearRadioButtons() {
	document.getElementById('radio-off').style.backgroundColor = radioOffColor;
	document.getElementById('radio-jazz').style.backgroundColor = radioOffColor;
	document.getElementById('radio-rock').style.backgroundColor = radioOffColor;
	document.getElementById('radio-classical').style.backgroundColor = radioOffColor;
	document.getElementById('radio-dance').style.backgroundColor = radioOffColor;
}

document.getElementById('button-next').onclick = loadNext;
document.getElementById('button-prev').onclick = loadPrev;

// for small screen added Gujie
document.getElementById('button-next-s').onclick = loadNext;
document.getElementById('button-prev-s').onclick = loadPrev;
// for small screen

document.getElementById('radio-off').onclick = setRadioOff;
document.getElementById('radio-classical').onclick = setRadioClassical;
document.getElementById('radio-jazz').onclick = setRadioJazz;
document.getElementById('radio-rock').onclick = setRadioRock;
document.getElementById('radio-dance').onclick = setRadioDance;
