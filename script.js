var i;

var INC = 0.5;
var CAP = 2;
var FPS = 60; //DEFAULT
var RATE = 0.005;
var layer_cap = 10;


var INIT_BOUNDARY;
var te;
var C;

var xR = 0;
var yR = 0;
var zR = 0;
var ac = [];
var ace = [];
var weight = [];
var flip = [];
var gravity = [];
var impulse = 0;
var sp = 0;
var speed = 0;
var z = 0;

var init = false;

function setup(){
  //size(1280, 960, P3D);
  canv = createCanvas(windowWidth, windowHeight, WEBGL);
  canv.position(0,0);
  canv.style('z-index', '-1');

  //surface.setResizable(true);
  
  C = CAP/INC;
  INIT_BOUNDARY = (2*PI)*((C-1)/C);
  i = INIT_BOUNDARY*(2/3);
  for(var i = 0; i < layer_cap; i++){
    ac.push(0);
    ace.push(0);
    weight.push(0);
    flip.push(pow(-1, i));
    gravity.push(0);
  }
  
  te = 0;
}

//60fps
function draw(){
  background(0);
  fill(0, 0, 0);
  
  translate(0, 0, zR);
  zR += (z-zR)/(FPS);
  z = constrain(z, -400, 400);
  
  var xT = map(mouseX, 0, width, 0, 2*PI);
  xR += (xT-xR)/(10*FPS);
  
  var yT = map(mouseY, 0, height, 0, 2*PI);
  yR += (yT-yR)/(10*FPS);
  
  //rotateY(xR);
  for(var layer = 1; layer < layer_cap; layer++){
    rotateX(yR*flip[layer]);
    rotateZ(xR*flip[layer]);
    for(var x = 0; x < CAP; x+=INC){
      
      stroke(255);
      //stroke(255, 255-(255*abs(ac[layer]/PI)), 255-(255*abs(ac[layer]/PI)));
      strokeWeight(2);
      var r = constrain(te/INIT_BOUNDARY, 0.01, 1);
      var b = 1-(1.0*layer/layer_cap);
      line(height*r*b+impulse, 0, 0, 0, height*r*b+impulse, 0);
      
      
      if(i < INIT_BOUNDARY+RATE && !init){ te = i; }else{ init = true; te = INIT_BOUNDARY; }
      
      rotateZ(weight[layer]+ace[layer]); 
      var movement = map(mouseX-pmouseX, -100, 100, -50*PI/CAP, 50*PI/CAP);
      gravity[layer] += (movement-gravity[layer])/(10*FPS);
      ac[layer] = gravity[layer];
      ace[layer] += (ac[layer]-ace[layer])/(10*FPS);
      weight[layer] += (te-weight[layer])/(10*FPS);
    }
  }
  
  //if(i < (2*PI) && !init){
  i = (i+RATE)%(2*PI);
  //}else{
  //  i = (2*PI);
  //}
}

function mouseWheel(event){
  var e = -event.delta;
  z+=(e*20);
}

function windowResized(){
    resizeCanvas(windowWidth, windowHeight);
}