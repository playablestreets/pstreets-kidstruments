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
  constructor(){
    this.sound = new Tone.Synth(	{
      portamento: 0.01,
      volume: -6,
      oscillator: { type: 'triangle' },
      envelope: { attack: 0.03, decay: 0.3, sustain: 0.4, release: 0.02 }
    });
    this.sound.toMaster();
    this.notes = ["G4", "D4", "F#4", "G5", "D5", "F#5","G4", "A4", "B4",  "B3", "G3", "A3", "D3", "F#3", ];

    this.note = 500;
    this.lastNote = 500;
    this.isPlaying = false;
  }

  play(){
    // let note = getNormMouse()
    let note = parseInt((getNormMouse().x + getNormMouse().y) * this.notes.length);
    note %= this.notes.length - 1;
    note = this.notes[note];
    // console.log(note);
    if(note != this.lastNote && note != null){
      this.sound.triggerAttack(note);
      this.lastNote = note;
    }
  }

  stop(){
    this.lastNote = "";
    this.sound.triggerRelease(4, 0.3);
  }

  announce(){
    console.log('hey');
  }


}