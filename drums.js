class Drums{
  constructor(){
    this.lastNote = "";
    this.isLoaded = false;

		this.fx = new Tone.Freeverb({
      roomSize : 0.7 ,
      dampening : 3000
      }).toMaster();

		this.snare = new Tone.NoiseSynth({
			"volume" : -5,
			"envelope" : {
				"attack" : 0.001,
				"decay" : 0.3,
				"sustain" : 0
			},
			"filterEnvelope" : {
				"attack" : 0.001,
				"decay" : 0.1,
        "sustain" : 0
			}
    }).connect(this.fx);
    
    	//kick!
    this.kick = new Tone.MembraneSynth({
      "envelope" : {
        "sustain" : 0,
        "attack" : 0.02,
        "decay" : 0.8
      },
      "octaves" : 10
    }).toMaster();

    this.density = 14;
    // this.notes = ["C4", "E4", "F#4", "G4", "A4", "B4", "D5", "C5", "E5", "F#5", "G5", "A5", "B5", "D6"];
    // this.snare = SampleLibrary.load({
    //   instruments: "xylophone"
    // });
    // this.snare.toMaster();
    // console.log(this.snare);
  }


  play(){
    // let note = getNormMouse()
    let note = parseInt((getNormMouse().x + getNormMouse().y) * this.density);
    // note %= this.notes.length - 1;
    // note = this.notes[note];
    if(note != this.lastNote && note != null){
      if(note%2 == 0)
        this.snare.triggerAttackRelease();
      else
        this.kick.triggerAttackRelease('C1', '8n');

      this.lastNote = note;
    }
  }

  stop(){
    // console.log("release the tuba");
    this.lastNote = "";
    // this.snare.releaseAll(1);
  }
}