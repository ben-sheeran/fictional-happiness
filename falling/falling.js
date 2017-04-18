var song;

function preload() {
  song = loadSound('sounds/bonbon2.ogg');
}

function setup() {
  createCanvas(710, 200);
  song.loop(); // song is ready to play during setup() because it was loaded during preload
  background(0,255,0);
}