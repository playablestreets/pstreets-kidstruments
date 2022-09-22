class Bleep{
  constructor(){
    this.lastNote = "";
    this.isLoaded = false;
    this.notes = ["D3", "C3", "E3",  "G3", "F#3", "A3", "B3", "D4", "D3", "C3", "E3",  "G3", "F#3", "A3", "B3", "D4"];
    this.sound = SampleLibrary.load({
      instruments: "bleep"
    });
    const gainNode =  new Tone.Gain(0.5)
    gainNode.toMaster();
    this.sound.connect(gainNode);
    // console.log(this.sound);
  }


  play(){
    console.log('bleep');
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
    this.lastNote = "";
    this.sound.releaseAll(5);
  }
}