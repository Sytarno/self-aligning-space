let i;

let INC = 0.5;
let CAP = 2;
let FPS = 3; //DEFAULT
let RATE = 0.002;
let layer_cap = 10;
let SMOOTH_WEIGHT = 200;

let INIT_BOUNDARY;
let te;
let C;

let xR = 0;
let yR = 0;
let zR = 0;
let ac = [];
let ace = [];
let weight = [];
let flip = [];
let gravity = [];
let impulse = 0;
let sp = 0;
let speed = 0;
let z = 0;

let init = false;
let aud;

function setup(){
  //size(1280, 960, P3D);
  canv = createCanvas(windowWidth, windowHeight, WEBGL);
  canv.position(0,0);
  canv.style('z-index', '-1');
  frameRate(120);

  //surface.setResizable(true);
  //i = INIT_BOUNDARY*(2/3);
  C = CAP/INC;
  INIT_BOUNDARY = (2*PI)*((C-1)/C);
  i = 0;
  for(let i = 0; i < layer_cap; i++){
    ac.push(0);
    ace.push(0);
    weight.push(0);
    flip.push(pow(1, i));
    gravity.push(0);
  }
  
  te = 0;
}

//60fps
function draw(){
  background(20);
  fill(0, 0, 0);
  
  translate(0, 0, zR);
  zR += (z-zR)/(SMOOTH_WEIGHT/5*FPS);
  z = constrain(z, -1400, 600);
  
  let xT = map(mouseX-width/2, -width/2, width/2, -5*PI, 5*PI);
  xR += (xT-xR)/(SMOOTH_WEIGHT*5*FPS);
  
  let yT = map(mouseY-height/2, -height/2, height/2, -5*PI, 5*PI);
  yR += (yT-yR)/(SMOOTH_WEIGHT*5*FPS);
  
  let movement = map(mouseX-pmouseX, -100, 100, -1*PI/CAP, 1*PI/CAP);

  //rotateY(xR);
  for(let layer = 1; layer < layer_cap; layer++){
    rotateX(yR*flip[layer]);
    rotateZ(xR*flip[layer]);
    for(let x = 0; x < CAP; x+=INC){
      
      stroke(255);
      //stroke(255, 255-(255*abs(ac[layer]/PI)), 255-(255*abs(ac[layer]/PI)));
      strokeWeight(3);
      let r = constrain(te/INIT_BOUNDARY, 0.01, 1)
      let b = pow(map(1-(1.0*layer/layer_cap), 0, 1, 0, 2), 1);
      line(height*r*b+impulse, 0, 0, 0, height*r*b+impulse, 0);
      //gravity[layer]*height*(layer_cap-layer)*2
      
      if(i < INIT_BOUNDARY+RATE && !init){ te = i; }else{ init = true; te = INIT_BOUNDARY; }
      
      rotateZ(weight[layer]+ace[layer]); 
      gravity[layer] += (movement-gravity[layer])/(SMOOTH_WEIGHT*FPS);
      
      ac[layer] = gravity[layer];
      ace[layer] += (ac[layer]-ace[layer])/(SMOOTH_WEIGHT*FPS);
      weight[layer] += (te-weight[layer])/(SMOOTH_WEIGHT*FPS);
    }
  }
  
  //if(i < (2*PI) && !init){
  i = (i+RATE)%(2*PI);
  //}else{
  //  i = (2*PI);
  //}
  //var spectrum = aud.analyze();
  //console.log(spectrum);
}

function mouseWheel(event){
  let e = -event.delta;
  z+=(e);
}

function mousePressed(){
    if (mouseButton === LEFT) {
      CAP = constrain(CAP+2, 2, 900);
    }
    if (mouseButton === RIGHT) {
      CAP = constrain(CAP-2, 2, 900);
    }

    C = CAP/INC;
  	INIT_BOUNDARY = (2*PI)*((C-1)/C);
}

function keyPressed(){
	if(key == 'q'){
		//aud = new p5.FFT();
	}
}

function windowResized(){
    resizeCanvas(windowWidth, windowHeight);
}

window.addEventListener('contextmenu', function (e) { 
  // do something here... 
  e.preventDefault(); 
}, false);