// this contains our general use library, including buttons, timers, delayed execution, 2D raycasting/vector math, and a few other things
// if you're not me, feel free to use this, idc :3

// UPDATE 0.2
// create time values inside v5js instead of writing them manually every time
// added TransValue class for cleaner animation code

let noFlashingLights = false

// 7vector's button system V2
// now better in every way!
// (theres definitely better ones, but the old one sucked)

// download and documentation for this is availible at https://github.com/yetyeeter1337/p5.Modbuttons
let time = 0 // total time elapsed in seconds
let dt = 0 // deltatime in seconds

p5.prototype.updateTime = function(){
  dt = round(deltaTime/1000,3)
  time += dt
}

p5.prototype.registerMethod("pre",p5.prototype.updateTime)

p5.prototype.buttons = []

class Button {
  constructor (type, x, y){
    
    this.pressed = false
    this.hover = false
    
    this.type = type.toUpperCase()
    if(this.type != "BOX" && this.type != "CIRCLE") this.type = "BOX" // default to a box button
    this.x = x
    this.y = y
    
    this.width = 100
    this.height = 100
    this.radius = 100
    
    this.drawn = false
    this.updated = false
    
    this.hidden = false
    this.active = true
    
    this.timeSinceHoverChange = 0
    this.timeSincePressedChange = 0
    
    this.fill = [255,255,255]
    this.stroke = [0,0,0]
    this.strokeWeight = 1
    
    p5.prototype.buttons.push(this)
    
    
  }
  onHover(){
    
  }
  onHoverBegin(){
    cursor(HAND)
  }
  onHoverEnd(){
    cursor()
  }
  onPress(){
    
  }
  onPressBegin(){
    
  }
  onPressEnd(){
    
  }
  check(){ // check for mouse interaction
    if(this.type == "BOX"){
      
      if(mouseX >= this.x && mouseY >= this.y 
          && mouseX < this.x + this.width && mouseY < this.y + this.height){
        if(this.hover == false){ this.onHoverBegin(); this.timeSinceHoverChange = 0 }
        
        this.hover = true
        if(mouseIsPressed) {
          if(this.pressed == false) {this.onPressBegin(); this.timeSincePressedChange = 0 }
          this.pressed = true
          this.onPress()
        } else {
          if(this.pressed == true) { this.onPressEnd(); this.timeSincePressedChange = 0 }
          this.pressed = false
        }
        
        this.onHover()
      }else{
        if(this.hover == true) { this.onHoverEnd(); this.timeSinceHoverChange = 0 }
        
        this.hover = false
        this.pressed = false
      }
      
    }else if(this.type == "CIRCLE"){
      if(dist(this.x, this.y, mouseX, mouseY) <= this.radius){
        if(this.hover == false) { this.onHoverBegin(); this.timeSinceHoverChange = 0 }

          this.hover = true
          if(mouseIsPressed) {
            if(this.pressed == false) { this.onPressBegin(); this.timeSincePressedChange = 0 }
            this.pressed = true
            this.onPress()
          } else {
            if(this.pressed == true) { this.onPressEnd(); this.timeSincePressedChange = 0 }
            this.pressed = false
          }

          this.onHover()
      }else{
        if(this.hover == true) { this.onHoverEnd(); this.timeSinceHoverChange = 0 }
        
        this.hover = false
        this.pressed = false
      }
    }
    
    this.timeSinceHoverChange += round(deltaTime/1000,3)
    this.timeSincePressedChange += round(deltaTime/1000,3)
  }
  onUpdate(){

  }
  update(){
    this.updated = true
    if(this.active){ 
      this.check() 
      this.onUpdate()
    }
  
  }
  render(){ 
    if(this.type == "BOX"){
      fill(this.fill)
      stroke(this.stroke)
      strokeWeight(this.strokeWeight)
      rect(this.x, this.y, this.width, this.height)
    }else if(this.type == "CIRCLE"){
      fill(this.fill)
      stroke(this.stroke)
      strokeWeight(this.strokeWeight)
      circle(this.x, this.y, this.radius * 2)
    }
  }
  draw(){
    this.drawn = true
    if(!this.hidden) this.render()
  }
  enable(){
    this.active = true
    this.hidden = false
  }
  disable(){
    this.active = false
    this.hidden = true
  }
}

function saveButtonStatus(){ // returns an array that can be used in the following function
    let status = []
    for(let i = 0; i < p5.prototype.buttons.length; i++){
        let button = p5.prototype.buttons[i]
        status[i] = [button.hidden, button.enabled]
    }
    return status
}

function loadButtonStatus(status){
    for(let i = 0; i < p5.prototype.buttons.length; i++){
        let button = p5.prototype.buttons[i]
        button.hidden = status[i][0]
        button.active = status[i][1]
    }
}

function disableAllButtons(){
    for(let i = 0; i < p5.prototype.buttons.length; i++){
        let button = p5.prototype.buttons[i]
        button.disable()
    }
}

p5.prototype.updateButtons = function(){
  for(let button of p5.prototype.buttons){
    if(!button.updated) button.update()
    button.updated = false
    
    if(!button.drawn) button.draw()
    button.drawn = false
    
  }
}


class Slider extends Button{
    constructor(type,vertical, x, y){
      super(type,x,y)
      
      this.width = 20
      this.height = 20
      this.radius = 20

      this.vertical = vertical

      this.Slength = 100

      this.smooth = true
      this.segments = 5
      this.value = 0
      this.prevValue = this.value
      
      this.timeSinceValueChange = 0
    }

    check(){
      let ygtv = this
      ;(()=>{
        var thos = new Proxy({},{
        has(_, key){
          return key in this
        },
        get(_, key) {
          console.error("YOU USED THOS AGAIN YOU DORK")
          return ygtv[key]
        },
        set(_, key, value){
          console.error("YOU USED THOS AGAIN YOU DORK")
          ygtv[key] = value
        }
      })
        })(this)
      // unessasary arcane wizardry to berate me whenever I misspell this
      
      
      let Soffset = this.vertical?(this.smooth?(-this.value):(-(this.value*(this.Slength/this.segments)))):(this.smooth?(this.value):((this.value*(this.Slength/this.segments)))) // yolo
      
//poopy woopie fartie warty please work for doc and marty      
        if(this.type == "BOX"){
      
      if(mouseX >= this.x - this.width/2 + (this.vertical?0:Soffset) && mouseY >= this.y - this.height/2 + (this.vertical?Soffset:0)
          && mouseX < this.x + this.width/2 + (this.vertical?0:Soffset) && mouseY < this.y + this.height/2 + (this.vertical?Soffset:0)){
        if(this.hover == false){ this.onHoverBegin(); this.timeSinceHoverChange = 0 }
        
        this.hover = true
        if(mouseIsPressed) {
          if(this.pressed == false) {this.onPressBegin(); this.timeSincePressedChange = 0 }
          this.pressed = true
          this.onPress()
        }
        
        this.onHover()
      }else{
        if(this.hover == true) { this.onHoverEnd(); this.timeSinceHoverChange = 0 }
        
        this.hover = false
      }
      
    }else if(this.type == "CIRCLE"){
      if(dist(this.x + (this.vertical?0:Soffset), this.y + (this.vertical?Soffset:0), mouseX, mouseY) <= this.radius/2){
        if(this.hover == false) { this.onHoverBegin(); this.timeSinceHoverChange = 0 }

          this.hover = true
          if(mouseIsPressed) {
            if(this.pressed == false) { this.onPressBegin(); this.timeSincePressedChange = 0 }
            this.pressed = true
            this.onPress()
          }
          
          this.onHover()
      }else{
        if(this.hover) this.onHoverEnd()
        this.hover = false
      }
    }
      
      if(this.pressed){
        if(mouseIsPressed){
          
          if(this.vertical){
            if(this.smooth){
              this.value = max(min(this.y - mouseY, this.Slength),0)
            }else{
              this.value = max(min(round(((this.y - mouseY)/this.Slength)*this.segments), this.segments),0)
            }
          }else{
            if(this.smooth){
              this.value = max(min(mouseX - this.x, this.Slength),0)
            }else{
              this.value = max(min(round(((mouseX - this.x)/this.Slength)*this.segments), this.segments),0)
            }
          }
          
        }else{
          if(this.pressed == true) { this.onPressEnd(); this.timeSincePressedChange = 0 }
          this.pressed = false
        }
      }
      
    if(this.prevValue != this.value){ 
      this.onValueChange(this.value - this.prevValue) 
      this.timeSinceValueChange = 0
    }
      
    this.prevValue = this.value
    
    this.timeSinceHoverChange += round(deltaTime/1000,3)
    this.timeSincePressedChange += round(deltaTime/1000,3)
    this.timeSinceValueChange += round(deltaTime/1000,3)
  }
  render(){ 
    if(this.type == "BOX"){
      fill(this.hover?this.fill:this.stroke)
      stroke(this.hover?this.stroke:this.fill)
      strokeWeight(this.strokeWeight)
      if(this.vertical){
        line(this.x,this.y,this.x,this.y - this.Slength)
        if(this.smooth){
          rect(this.x - this.width/2, this.y - this.height/2 - this.value, this.width, this.height)
        }else{
          rect(this.x - this.width/2, this.y - this.height/2 - (this.value * (this.Slength / this.segments)), this.width, this.height)
        }
      }else{
        line(this.x,this.y,this.x + this.Slength,this.y)
        if(this.smooth){
          rect(this.x - this.width/2 + this.value, this.y - this.height/2, this.width, this.height)
        }else{
          rect(this.x - this.width/2 + (this.value * (this.Slength / this.segments)), this.y - this.height/2, this.width, this.height)
        }
      }
    }else if(this.type == "CIRCLE"){
      fill(this.hover?this.fill:this.stroke)
      stroke(this.hover?this.stroke:this.fill)
      strokeWeight(this.strokeWeight)
      if(this.vertical){
        line(this.x,this.y,this.x,this.y - this.Slength)
        if(this.smooth){
          circle(this.x, this.y - this.value, this.radius)
        }else{
          circle(this.x, this.y - (this.value * (this.Slength / this.segments)), this.radius)
        }
      }else{
        line(this.x,this.y,this.x + this.Slength,this.y)
        if(this.smooth){
          circle(this.x + this.value, this.y, this.radius)
        }else{
          circle(this.x + (this.value * (this.Slength / this.segments)), this.y, this.radius)
        }
      }
    }
  }
  onValueChange(deltaValue){
    
  }
  
}


class Dial extends Button{
  constructor(continuous,x,y){
    super("circle",x,y)
    this.value = 0
    this.prevValue = this.value
    
    this.continuous = continuous // whether the button's value can go beyond 0-360
    this.minAngle = 0 // the minimum and maximum angles of the button
    this.maxAngle = 360 // ignored if contintinuous mode is enabled
    this.segments = 0 // if 0 or less, will be smooth,
    this.originOffset = 90 // where the button starts
    
    this.timeSincevalueChange = 0
    
    this.cos = 0
    this.sin = -1
  }
  check(){
    angleMode(DEGREES)
    
    if(dist(this.x, this.y, mouseX, mouseY) <= this.radius){
        if(this.hover == false) { this.onHoverBegin(); this.timeSinceHoverChange = 0 }

          this.hover = true
          if(mouseIsPressed) {
            if(this.pressed == false) { this.onPressBegin(); this.timeSincePressedChange = 0 }
            this.pressed = true
            this.onPress()
          }
          
          this.onHover()
      }else{
        if(this.hover) this.onHoverEnd()
        this.hover = false
      }
    
    if(this.pressed){
      
      let angle = (atan2(mouseY - this.y, mouseX - this.x) + 180 + this.originOffset)%360
      
      
      let tempValue = this.segments<=0?angle:round(angle/this.segments)
      
      if(this.continuous){
        
        let prevAngle = this.segments<=0?(this.value%360):(((this.value%this.segments)/this.segments)*360)
        
        
        let Dangle = angle - prevAngle
        
        
        if(angle < 90 && prevAngle > 270){
          Dangle += 360
        }else if(angle > 270 && prevAngle < 90){
          Dangle -= 360
        }
        
        if(Dangle >= 180) Dangle -= 360 // very good
        
        
        if(this.segments <= 0){
          this.value += Dangle
        }else{
          this.value += round(Dangle/(360/this.segments))
        }
        
        
      }else{
        angle = min(max(angle, this.minAngle), this.maxAngle)
        
        if(this.segments <= 0){
          tempValue = angle
          this.value = tempValue
        }else{
          tempValue = round(((angle - this.minAngle)/(this.maxAngle-this.minAngle))*this.segments)
          this.value = tempValue
        }
      }
      
      if(!mouseIsPressed){
        this.pressed = false
        this.onPressEnd()
      }
      
    }
    
    if(this.prevValue != this.value){
      this.timeSinceValueChange = 0
      this.onValueChange(this.value - this.prevValue)
    }
    
    this.prevValue = this.value
    
    this.timeSinceHoverChange += round(deltaTime/1000,3)
    this.timeSincePressedChange += round(deltaTime/1000,3)
    this.timeSinceValueChange += round(deltaTime/1000,3)
    
    // horrible math slop oh ew
    this.cos = cos(this.segments<=0?(this.value + this.originOffset):-(this.minAngle + ((this.maxAngle-this.minAngle)/this.segments)*(this.value%(this.segments + 1))) + 180 + this.originOffset)
    if(this.continuous) this.cos = cos(this.segments<=0?(this.value + this.originOffset):-((360/this.segments)*(this.value%(this.segments))) + 180 + this.originOffset)
    this.sin = sin(this.segments<=0?(this.value + this.originOffset):-(this.minAngle + ((this.maxAngle-this.minAngle)/this.segments)*(this.value%(this.segments + 1))) + 180 - this.originOffset)
    if(this.continuous) this.sin = sin(this.segments<=0?(this.value + this.originOffset):-((360/this.segments)*(this.value%(this.segments))) + this.originOffset)
    
    angleMode(RADIANS)
  }
  render(){
    angleMode(DEGREES)
    
    fill(this.hover?this.stroke:this.fill)
    stroke(this.hover?this.fill:this.stroke)
    strokeWeight(this.strokeWeight)
    circle(this.x, this.y, this.radius*2)
    
    let C = this.cos
    let S = this.sin
    
    line(this.x + C*(this.radius/2), this.y + S*(this.radius/2),
        this.x + C*(this.radius), this.y + S*(this.radius))
    
    angleMode(RADIANS)
  }
  onValueChange(deltaValue){
    
  }
}

p5.prototype.Clerp = function(a, b, l){
  return lerp(a,b,min(1,max(0, l)))
}

p5.prototype.ClerpColor = function(col1, col2, l){
  return lerpColor(color(col1),color(col2),min(1,max(0, l)))
}

p5.prototype.registerMethod("post",p5.prototype.updateButtons)


// better timer system
let timers = [];

class Timer {
  constructor(){
    this.value = 0
    this.paused = false

    timers.push(this)
  }
  update(){
    if(!this.paused) this.value += round(deltaTime/1000,3)
  }
  reset(){
    this.value = 0
  }
}

p5.prototype.updateTimers = function(){
  for(let clock of timers){
    clock.update()
  }
}

p5.prototype.registerMethod("pre",p5.prototype.updateTimers)

let flickers = []

class flicker{
  constructor(chance, minLight, minFlicker, maxFlicker, duration){
    this.chance = chance
    this.minLight = minLight
    this.minFlicker = minFlicker
    this.maxFlicker = maxFlicker
    this.duration = duration

    this.paused = false

    this.sound = false

    this.value = true // the output value

    this.timer = new timer()
    this.durationTimer = new timer()

    flickers.push(this)
  }
  update(){
    let dt = round(deltaTime/1000,3)
    if(!this.paused || this.durationTimer.value > this.duration){
      this.timer.paused = false
      this.durationTimer.paused = false
      if(this.value){
        if(random() <= this.chance * dt && this.timer.value > this.minLight){
          this.value = false
          this.timer.value = 0
        }
      }else{
        if(random() <= this.chance * dt){
          if(this.timer.value > this.minFlicker){
            this.value = true
            this.timer.value = 0
            print(this.sound)
            if(this.sound) {
              
              this.sound.play()
            }
            
          }
        }
        if(this.timer.value > this.maxFlicker) {
          this.value = true
          this.sound.play()
        }
      }
    } else{
      this.timer.paused = true
      this.durationTimer.paused = true
    }
    
  }
}

let exeQueue = []

function executeDelayed(func, delay){
  exeQueue.push({
    run: func,
    time: delay
  })
}

function updateDelayedExecution(){
  for(let i = 0; i < exeQueue.length; i++){
    let exe = exeQueue[i]
    exe.time -= round(deltaTime/1000,3)
    if(exe.time <= 0){
      exe.run()
      exeQueue.splice(i,1)
    }
  }
}

// puppeteer (joint library)
// this probably needs to get reworked at some point, it uses starMap era code (janky array bs instead of classes and objects)

function deepCopy(array) {
  return JSON.parse(JSON.stringify(array));
}

let joints = []; // [0 = name, 1 = rotation, 2 = X, 3 = Y]

function jointOffset(name, X, Y) {
  let joint;
  for (let i = 0; i < joints.length; i++) {
    if (joints[i][0] == name) {
      joint = joints[i];
    }
  }
  if (joint == null) return;

  let Jr = joint[1];
  let Jx = joint[2];
  let Jy = joint[3];

  let x = cos(Jr) * Y + cos(Jr + PI / 2) * X + Jx;
  let y = sin(Jr) * Y + sin(Jr + PI / 2) * X + Jy;
  return [x, y];
}

function createJoint(name, R, X, Y) {
  joints[joints.length] = [name, R, X, Y];
}

function setJoint(name, R, X, Y) {
  for (let i = 0; i < joints.length; i++) {
    if (joints[i][0] == name) {
      joints[i] = [name, R, X, Y];
    }
  }
}

function linkJoint(name, linkName, R, L) {
  let joint;
  for (let i = 0; i < joints.length; i++) {
    if (joints[i][0] == name) {
      joint = i;
    }
  }
  if (joint == null) {
    print("no joint");
    return;
  }

  let link;
  for (let i = 0; i < joints.length; i++) {
    if (joints[i][0] == linkName) {
      link = i;
    }
  }
  if (link == null) {
    print("no link");
    return;
  }

  let r = joints[link][1] + R;
  let x = cos(r) * L + joints[link][2];
  let y = sin(r) * L + joints[link][3];

  joints[joint] = [name, r, x, y];

  if (debug) {
    line(joints[link][2], joints[link][3], joints[joint][2], joints[joint][3]);
  }
}

function pointsLine(POINT1, POINT2) {
  line(POINT1[0], POINT1[1], POINT2[0], POINT2[1]);
}

function pointsTriangle(POINT1,POINT2,POINT3){
  triangle(POINT1[0], POINT1[1], POINT2[0], POINT2[1], POINT3[0], POINT3[1])
}



// 7vector's vector library

// creates a vector from a direction and magnitude
function createvector(direction,magnitude){ // OHH YEAH
  var x = Math.cos(direction) * magnitude;
  var y = Math.sin(direction) * magnitude;
  
  return [x,y];
}

// takes a vector (in format [x,y]) and makes its magnitude zero
function normalize(vector){
  var x = vector[0];
  var y = vector[1];
  var magnitude = Math.sqrt( x*x + y*y);
  
  return [x/magnitude,y/magnitude];
}


// adds two vectors together
function addVectors(vec1,vec2){
  return [vec1[0]+vec2[0],vec1[1]+vec2[1]];
}

// subtracts a vector from a vector
function subtractVectors(vec1,vec2){
  return [vec1[0]-vec2[0],vec1[1]-vec2[1]]
}


// multiplies a vector by a scalar (number)
function multiplyVector(vector,scalar){
  return [ vector[0] * scalar, vector[1] * scalar];
}



// returns the direction of a vector
function getDirection(vector){
  return Math.atan2(vector[1],vector[0]) + Math.PI;
}

// returns the magnitude of a vector
function getMagnitude(vector){
  return Math.sqrt(vector[0]*vector[0]+vector[1]*vector[1]);
}

// offsets the position of a vector
function offsetVector(vector, x, y){
  return [vector[0] + x, vector[1] + y];
}



// returns a vector with the same magnitude, but new direction
function setDirection(vector, direction){
  var magnitude = getMagnitude(vector);
  var x = Math.cos(direction) * magnitude;
  var y = Math.sin(direction) * magnitude;
  
  return [x,y];
}


// returns a vector with the same direction, but new magnitude
function setMagnitude(vector, magnitude){
  var tempVector = normalize(vector);
  
  return [tempVector[0] * magnitude, tempVector[1] * magnitude];
}

// vec#pos is the origin position of the vector, vec# is the component form of the vector
// returns the point where two vectors intersect, returns false if they do not
function getIntersect(vec1pos, vec1, vec2pos, vec2){
  // do meth- I mean meth- I mean math
  // calculate the slopes of the lines
  var vec1slope = (vec1[1])/(vec1[0]);
  var vec2slope = (vec2[1])/(vec2[0]);

  vec1slope = (vec1[1])/(vec1[0]);
  vec2slope = (vec2[1])/(vec2[0]);
  
  // step one: get the X area where the two vectors both exist, return false if there is none
  var vec1xMin = vec1pos[0] < vec1[0] + vec1pos[0] ? vec1pos[0] : vec1[0] + vec1pos[0];
  var vec1xMax = vec1pos[0] > vec1[0] + vec1pos[0] ? vec1pos[0] : vec1[0] + vec1pos[0];
  
  var vec2xMin = vec2pos[0] < vec2[0] + vec2pos[0] ? vec2pos[0] : vec2[0] + vec2pos[0];
  var vec2xMax = vec2pos[0] > vec2[0] + vec2pos[0] ? vec2pos[0] : vec2[0] + vec2pos[0];
  
  if( (vec1xMax >= vec2xMin && vec1xMax <= vec2xMax) || (vec2xMax >= vec1xMin && vec2xMax <= vec1xMax)){
    
    
    // the lines are unable to intersect if they are parallel, also prevents division by zero
    if (vec1slope == vec2slope) return false;
    
    // calculate the y intercepts of the lines
    var vec1y = vec1pos[1] - (vec1pos[0] * vec1slope);
    var vec2y = vec2pos[1] - (vec2pos[0] * vec2slope);
    
    // the big one: calculate the x intercept of the two lines
    // (I did not copy this formula off of stack overflow, I figured it out myself :D)
    var xInt = -1 * (vec1y - vec2y) / (vec1slope - vec2slope);
    
    // check if the xIntercept is within both vectors
    if ( (xInt > vec1xMin && xInt < vec1xMax) && ( xInt > vec2xMin && xInt < vec2xMax) ){
      
      // calculate the y value of the x intercept
      var yInt = vec1y + ( xInt * vec1slope );
      
      // return the coordinates of the intersection
      return [xInt, yInt];
      
    } else {
      
      // return false if the xIntercept is not within both vectors
      return false;
      
    }
    
  } else {
    // the vectors do not have any x intersection, so they do not intersect
    return false;
  }
}

// intersect function but in an easier to use format
function intersectPoints(vec1,vec2,vec3,vec4){
  if(vec1[0] == vec2[0]) vec1[0] += 0.01
  if(vec1[1] == vec2[1]) vec1[1] += 0.01
  if(vec3[0] == vec4[0]) vec3[0] += 0.01
  if(vec3[1] == vec4[1]) vec3[1] += 0.01
  return getIntersect(vec1, subtractVectors(vec2,vec1), vec3, subtractVectors(vec4,vec3))
}

// adds a list vectors together, should be formatted as [ [x,y], [x,y], [x,y], ... ]
function addSeveralVectors(vectors){ 
  
  var outputVector = [0,0];
  
  for(var i = 0; i < vectors.length; i++){
    outputVector = addVectors(outputVector, vectors[i]);
  }
  
  return outputVector;
  
}

function mouseInRect(x,y,w,h){
  return (mouseX >= x && mouseX <= x + w) && (mouseY >= y && mouseY <= y + h)
}


// class specifically for easy transitioning between values (aka tweening)
// tween functions can be swapped (must follow func(begin, end, pos))
// currently accepts numbers ("number") or colors ("color")
// also trans rights mfs

let TRANSVALUE_VALID_TYPES = ["number", "color"]

class transValue{
  constructor(oValue, type){
    
    let valid = false;
    for(let i = 0; i < TRANSVALUE_VALID_TYPES.length; i++){
      if(TRANSVALUE_VALID_TYPES[i] == type) valid = true
    }
    
    if(!valid) print("WARNING: transValue does not support type \"" + type + "\"")
    
    this.oValue = oValue
    this.type = type
    this.prevValue = oValue
    this.duration = 0
    this.destination = oValue
    
    this.timer = new Timer()
    
    this.tweenFunction = p5.prototype.Clerp
    this.colorTweenFunction = p5.prototype.ClerpColor
    
  }
  
  value(){
    if(this.type == "number"){
      return this.tweenFunction(this.oValue, this.destination, this.timer.value / this.duration)
    }else if(this.type == "color"){
      return this.colorTweenFunction(this.oValue, this.destination, this.timer.value / this.duration)
    }
  }
  
  resetTimer(){
    this.timer.reset()
  }
  reset(){
    this.oValue = this.value()
    this.timer.reset()
  }
  setDestination(dest){
    this.destination = dest
  }
  setDuration(dur){
    this.duration = dur
  }
  setStart(val){
    this.oValue = val
  }
  done(){
    if(this.timer.value > this.duration){
      return true;
    }else{
      return false;
    }
  }
}

// it feels so weird coding in js after using C++
// where are my pointers??
// types????
// WHY CAN I LITERALLY ADD ANYTHING TO OBJECTS
// PRIVACY IS AN ILLUSION
