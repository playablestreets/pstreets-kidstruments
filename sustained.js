class Sustained{
  constructor(){
    this.lastNote = "";
    this.isLoaded = false;
    this.notes = ["C2",  "F#2", "E2", "G2",  "B2", "A2", "D3", "C3", "E3",  "G3", "F#3", "A3", "B5"];
    this.sound = SampleLibrary.load({
      instruments: "sustained"
    });
    const gainNode =  new Tone.Gain(0.3)
    gainNode.toMaster();
    this.sound.connect(gainNode);
    // console.log(this.sound);
  }


  play(){
    // let note = getNormMouse()
    let note = parseInt((getNormMouse().x + getNormMouse().y) * this.notes.length);
    note %= this.notes.length - 1;
    note = this.notes[note];
    if(note != this.lastNote && note != null){
      this.sound.triggerAttackRelease(note, 5);
      this.lastNote = note;
    }
  }

  stop(){
    // console.log("release the tuba");
    this.lastNote = "";
    this.sound.releaseAll(5);
  }
}