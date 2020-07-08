//TODO
//add sounds modes
// - slide
// - note
// - perc
// - sample
// - grid notes

//current sliding implementation is spitting out too many notes i suspect.

'use strict';
class SliderSynth{
  constructor(synth){
    this.synth = new Tone.synth(	{
      portamento: 0.2,
      oscillator: { type: 'sawtooth' },
      envelope: { attack: 0.03, decay: 0.1, sustain: 0.2, release: 0.02 }
    });
    this.note = 500;
    this.lastNote = 500;
    this.isPlaying = false;
  }

  play(){
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

  stop(){
    this.note = 500;
    this.lastNote = 500;
    this.synth.triggerRelease();
    this.isPlaying = false;
  }

  announce(){
    console.log('hey');
  }


}