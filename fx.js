class FX{
  constructor(){
    this.lastNote = "";
    this.isLoaded = false;
    this.notes = ["C4",  "A4", "D4", "E4",  "F4", "G4"];
    this.sound = SampleLibrary.load({
      instruments: "fx"
    });
    this.sound.toMaster();
    // console.log(this.sound);
  }


  play(){
    // console.log('fx');
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