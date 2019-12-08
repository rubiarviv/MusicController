import { initialize } from '@muzilator/sdk';

var midiChannel;
var selectedKnob='knob1';
var knobsToCircles = {};
var checked = false;


const circles = [
  {
    id: -1,
    x: 150,
    y: 70,
    radius: 10,
    color: 'rgb(251, 228, 204)',
    dx: 5,
    dy: 5
  },
  {
    id: -1,
    x: 100,
    y: 170,
    radius: 10,
    color: 'rgb(85, 141, 233)',
    dx: 10,
    dy: 5
  },
  {
    id: -1,
    x: 120,
    y: 200,
    radius: 10,
    color: 'rgb(11, 83, 147)',
    dx: 5,
    dy: 5
  },
  {
    id: -1,
    x: 270,
    y: 160,
    radius: 10,
    color: '#DDDDDD',
    dx: 10,
    dy: 10
  }
];

var context;
var x=100;
var y=200;
var dx=5;
var dy=10;

const commands = {
  NOTE_ON: 'note-on',
  NOTE_OFF: 'note-off'
};

window.addEventListener('load', () => {
  async function init() {
    console.log('start');
    var platform = await initialize()
    midiChannel = await platform.createChannel('midi')
    midiChannel.start()
    console.log(midiChannel);
  }
  var myCanvas = document.getElementById("myCanvas");
  context= myCanvas.getContext('2d');
  var i=1;
  circles.forEach(circle => {
    knobsToCircles['knob'+i] = circle;
    i++;
  });
  init();
});

function isIntersect(point, circle) {
  return Math.sqrt((point.x-circle.x) ** 2 + (point.y - circle.y) ** 2) < circle.radius;
}

function getCurrentPosition(event) {
  return {
    x: event.clientX,
    y: event.clientY
  };
}

function onClick(e, id)
{
    selectedKnob=id;
}

function draw() {

    context.clearRect(0,0, 300,200);
    
    circles.forEach(circle => {
      context.beginPath();
      context.arc(circle.x, circle.y, circle.radius, 0, 2 * Math.PI, false);
      context.fillStyle = circle.color;
      context.closePath();
      context.fill();
      // Boundary Logic
      if( circle.x<0 || circle.x>300) 
      { 
          circle.dx=-circle.dx; 
          if(circle.id != -1) {
              console.log(circle.id);
              midiChannel.postMessage({type: commands.NOTE_ON, pitch: circle.id, velocity: 100});
              setTimeout(FireEvent,500,circle.id);
          }
      }
      if( circle.y<0 || circle.y>200)
      { 
          circle.dy=-circle.dy; 
          if(circle.id != -1) {
              console.log(circle.id);
              midiChannel.postMessage({type: commands.NOTE_ON, pitch: circle.id, velocity: 100});
              setTimeout(FireEvent,500,circle.id);
          }
      }
      circle.x+=circle.dx; 
      circle.y+=circle.dy;
    });
 

    // context.onmousedown = function(e) { sendUserEvent(e, commands.NOTE_ON) };
    // context.onmouseup = function(e) { sendUserEvent(e, commands.NOTE_OFF) };
    // context.addEventListener("touchstart", function(e) {
    //   sendUserEvent(e.touches[0], commands.NOTE_ON)
    // }, false);

    // context.addEventListener("touchend", function (e) {
    //   sendUserEvent(e.touches[0], commands.NOTE_OFF)
    // }, false);
}


var keys = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'a#', 'c#', 'd#', 'f#', 'g#'];
var keysToMidi = {'C': 60,'C#':61,'D':62,'D#':63,'F':64,'F#':65,'G':66,'G#':67,'A':68,'A#':69,'B':70};

// var synth = new AudioSynth;
// synth.setVolume(0.1337); // Recommended volume setting
// var piano = synth.createInstrument('piano');
// var raygun = synth.createInstrument('raygun');
// var acoustic = synth.createInstrument('acoustic');
// var organ = synth.createInstrument('organ');
// var instruments = [piano, acoustic, organ, raygun];
// var instrument = 0;

function FireEvent(pitch)
{
  console.log(midiChannel);
  if(midiChannel!=null){  
    midiChannel.postMessage({type: commands.NOTE_OFF, pitch: pitch, velocity: 100});
  }
}
function Key(note, keyEl) {
    this.note = note;
    this.keyEl = keyEl;
    var that = this;
    this.addListener = function() {
        if (typeof this.keyEl === "undefined") return;
        if(this.keyEl == null) return;
        this.keyEl.addEventListener('click', function(event) {
            console.log(selectedKnob)
            event.preventDefault();
            var knob = document.getElementById(selectedKnob);
            console.log(this.innerText)
            knob.innerText = this.innerText;
            console.log(knob.innerText)     
            knobsToCircles[selectedKnob].id = keysToMidi[knob.innerText];
            console.log(keysToMidi[knob.innerText])  
            console.log(midiChannel);
            if(midiChannel!=null){
              midiChannel.postMessage({type: commands.NOTE_ON, pitch: knobsToCircles[selectedKnob].id, velocity: 100});
            }
            setTimeout(FireEvent,500,knobsToCircles[selectedKnob].id);
        });
    };
    // this.keyBoard = function() {
    //     document.addEventListener('keydown', function(event) {
    //     event.preventDefault();
    //     switch (event.code) {
    //         case 'KeyA':
    //         new newCircle('F');
    //         break;
    //         case 'KeyS':
    //         new newCircle('G');
    //         break;
    //         case 'KeyD':
    //         new newCircle('A');
    //         break;
    //         case 'KeyF':
    //         new newCircle('B');
    //         break;
    //         case 'KeyJ':
    //         new newCircle('C');
    //         break;
    //         case 'KeyK':
    //         new newCircle('D');
    //         break;
    //         case 'KeyL':
    //         new newCircle('E');
    //         break;
    //         case 'KeyW':
    //         new newCircle('F#');
    //         break;
    //         case 'KeyE':
    //         new newCircle('G#');
    //         break;
    //         case 'KeyR':
    //         new newCircle('A#');
    //         break;
    //         case 'KeyI':
    //         new newCircle('C#');
    //         break;
    //         case 'KeyO':
    //         new newCircle('D#');
    //         break;
    //         default:
    //     }
    //     });
    // }
}

for (var i = 0; i < keys.length; i++) {
  var key = new Key(keys[i].toUpperCase(), document.getElementById(keys[i] + 'Key'));
  key.addListener();
};
// key.keyBoard();

function Knob(knobEl) {
  this.knobEl = knobEl;
  this.addListener = function() {
    this.knobEl.addEventListener('click', function(event) {
      event.preventDefault();
      var knobClicked = event.target.id;
      switch (knobClicked) {
        // Reverse spin direction
        case 'knob1':
            selectedKnob='knob1';
          // angle*=-1;
          break;
        // Remove side of square.
        case 'knob2':
            selectedKnob='knob2';
          // removeSide();
          break;
        // Instrument changer
        case 'knob3':
            selectedKnob='knob3';
          // instrument = randNum(0,instruments.length);
          break;
        // Reset
        case 'knob4':
            selectedKnob='knob4';
          // window.location.reload();
          break;
        case 'knob5':
          if(checked==false){
            setInterval(draw,75);
            checked = true
          }
          // window.location.reload();
          break;
      }
    });
  };
}

for (var i = 0; i < 5; i++) {
  var knob = new Knob(document.getElementById('knob'+(i+1)));
  knob.addListener();
}

function randNum(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}