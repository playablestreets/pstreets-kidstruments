class Fart{
  constructor(){
    this.lastNote = "";
    this.isLoaded = false;
    this.notes = ["C4", "E4", "G4", "C3", "E5", "G5" ];
    this.sound = SampleLibrary.load({
      instruments: "fart"
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
      this.sound.triggerAttack(note);
      this.lastNote = note;
    }
  }

  stop(){
    // console.log("release the tuba");
    this.lastNote = "";
    this.sound.releaseAll(1);
  }
}