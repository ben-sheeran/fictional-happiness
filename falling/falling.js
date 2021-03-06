var envelope, fft;


var oscArray = [new p5.SinOsc(),new p5.SinOsc(),new p5.SinOsc(),new p5.SinOsc(),new p5.SinOsc()];

var major = [0,4,7,11,14];
var dim = [0,3,6,9,13];
var minor = [0,3,7,10,14];
var seven = [0,4,7,10,14];
var majsix = [0,4,7,9,21];

var c = 60;
var dflat = 61;
var bflat = 58;
var aflat = 56;
var eflat = 63;
var f = 65;
var gflat = 66;

//12 chords
var progBase = [dflat,c,bflat,aflat,eflat,aflat,eflat,f,bflat,gflat,bflat,aflat];
var progTypes  = [major,dim,minor,major,minor,major,minor,major,minor,majsix,seven,seven];
var chordIndex;

var oscIndex;

function setup() {
  createCanvas(710, 200);

  // Instantiate the envelope
  envelope = new p5.Env();

  // set attackTime, decayTime, sustainRatio, releaseTime
  envelope.setADSR(0.001, 0.3, 0.1, 0.3);

  // set attackLevel, releaseLevel
  envelope.setRange(1, 0);

  oscIndex = 0;  
  chordIndex = 0;


  fft = new p5.FFT();
  noStroke();
}

function keyTyped() {
  if(keyCode === ENTER || key === '`') {
    oscArray[0].stop();
    oscArray[1].stop();
    oscArray[2].stop();
    oscArray[3].stop();
    oscArray[4].stop();
    chordIndex = (chordIndex + 1) %12;
    var base = progBase[chordIndex];
    var midiValue = base - 12;
    var freqValue = midiToFreq(midiValue);
    var osc = oscArray[oscIndex]
    osc.freq(freqValue);
    osc.start();
    oscIndex = (oscIndex + 1)%5;
  } else {
  if(Math.random() > .9) {
    chordIndex = (chordIndex + 1) %12;
  }
    if(Math.random() > .4) {
      return;
    }
  var note = Math.floor(Math.random() * 5);
  var base = progBase[chordIndex];
  var ch = progTypes[chordIndex];
  var midiValue = base + ch[note] - 12 + 12 * Math.floor(Math.random() * 3);
  var freqValue = midiToFreq(midiValue);
  var osc = oscArray[oscIndex]
  osc.freq(freqValue);
  osc.start();

  oscIndex = (oscIndex + 1)%5;
  oscArray[oscIndex].stop();    

  }

  
}

