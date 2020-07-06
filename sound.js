//TODO
//add sounds modes
// - slide
// - note
// - perc
// - sample
// - grid notes

'use strict';
class Sound{
  constructor(synth){
    this.synth = synth;
    this.note = '';
    this.lastNote = '';
  }

  playNote(){
    this.note = map(getNormMouse().x, 0, 1, 400, 2000);
    if(this.note != this.lastNote){
      this.lastNote = this.note;
      this.synth.triggerAttack(this.note);
    }

  }

  stopNotes(){
    this.note = '';
    this.lastNote = '';
    this.synth.triggerRelease();
  }

  announce(){
    console.log('hey');
  }


}