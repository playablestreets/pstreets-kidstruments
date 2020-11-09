class Xylophone{
  constructor(){
    this.lastNote = "";
    this.isLoaded = false;
    this.notes = ["C4", "E4", "F#4", "G4", "A4", "B4", "D5", "C5", "E5", "F#5", "G5", "A5", "B5", "D6"];
    this.sound = SampleLibrary.load({
      instruments: "xylophone"
    });
    this.sound.toMaster();
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