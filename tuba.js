class Tuba{
  constructor(){
    this.lastNote = "";
    this.isLoaded = false;
    this.notes = ["C1", "G1", "D2", "C2", "G1", "D2"];
    this.sound = SampleLibrary.load({
      instruments: "tuba"
    });
    this.sound.curve = "exponential";
    this.sound.toMaster();
    // console.log(this.sound);
  }


  play(){
    // let note = getNormMouse()
    let note = parseInt((getNormMouse().x + getNormMouse().y) * this.notes.length);
    note %= this.notes.length - 1;
    note = this.notes[note];
    // console.log(note);
    if(note != this.lastNote && note != null){
      this.sound.triggerAttackRelease(note, 1);
      this.lastNote = note;
    }
  }

  stop(){
    this.lastNote = "";
    this.sound.releaseAll(4);
  }
}