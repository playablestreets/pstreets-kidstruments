//TODO
//add sounds modes
// - slide
// - note
// - perc
// - sample
// - grid notes

//current sliding implementation is spitting out too many notes i suspect.

'use strict';
class Sound{
  constructor(synth){
    this.synth = synth;
    this.note = 500;
    this.lastNote = 500;
    this.isPlaying = false;
  }

  playNote(){
    
    this.note = map(getNormMouse().x, 0, 1, 400, 2000);
    if(this.note != this.lastNote){
      this.lastNote = this.note;
      this.synth.setNote(this.note);
    }
    if(!this.isPlaying){
      this.synth.triggerAttack();
      this.isPlaying = true;
    }
  }

  stopNotes(){
    this.note = 500;
    this.lastNote = 500;
    this.synth.triggerRelease();
    this.isPlaying = false;
  }

  announce(){
    console.log('hey');
  }


}