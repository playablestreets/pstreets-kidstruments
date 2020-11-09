let state = 'loading';
let instruments;
let currentInstrument = 0;
let currentInstrumentName = '';

let instrumentImage;
let maskImage;
let maskImageScale = 8;
// let drawScale = 1;
// let aspect = 1;

// let offset = [0, 0];


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
// let isTurned = false;
// let prevWidth;



//------------SETUP
function setup() {
  //send for kidstruments
  getApi(this); //returns to setKidstruments()
  
  canvas = createCanvas(windowWidth, windowHeight);
  canvas.position(0, 0);
  
  setDisplayState();
  displayState.previousOrientation = displayState.currentOrientation;

  textSize(100);
}


function setKidstruments(data) {
	console.log("setting kidstruments...")
  instruments = data;

	let i = 1;
	instruments.forEach((inst) => {
		inst.index = i++;
	} );

	currentInstrument = int(random() * instruments.length);
	console.log(instruments);
	instruments = shuffle(instruments);
	// instrumentsFound = true;

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
  clear();
  resizeCanvas(windowWidth, windowHeight);
  canvas.position(0, 0);

  // background(color(255));

  if(state == 'loading'){
    text(state, width/2, height/2);
  }
  else if(state == 'ready'){
    image(instrumentImage, displayState.drawOffset.x, displayState.drawOffset.y, displayState.drawSize.x, displayState.drawSize.y);
  }
  
}
