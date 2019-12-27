const fps = 30  //frames per second
const upf = 10   //updates per frame
const scale = 50 //pixels per meter
const size = 1  //size of car and trailer in meters

var car
var trailer1
var trailer2
var trailer3
var trailer4
var trailer5

function setup(){
  createCanvas(1500,750)
  frameRate(fps)

  car = new Car()
  car.body.ppm = scale  //scale lengths
  car.body.ups = upf*fps  //scale time

  car.length = size * scale
  car.wheelBase = size * scale * 1/2
  car.body.pos.x = width/2
  car.body.pos.y = height/2
  car.towPoint = new Point(car.body, createVector(-(car.length - car.wheelBase)/2, 0))

  trailer1 = new Trailer()
  trailer1.car = car
  trailer1.wheelBase = size * scale
  trailer1.towPoint = new Point(trailer1.body, createVector(-trailer1.wheelBase/4, 0))

  trailer2 = new Trailer()
  trailer2.car = trailer1
  trailer2.wheelBase = size * scale
  trailer2.towPoint = new Point(trailer2.body, createVector(-trailer2.wheelBase/4, 0))

  trailer3 = new Trailer()
  trailer3.car = trailer2
  trailer3.wheelBase = size * scale
  trailer3.towPoint = new Point(trailer3.body, createVector(-trailer2.wheelBase/4, 0))

  trailer4 = new Trailer()
  trailer4.car = trailer3
  trailer4.wheelBase = size * scale
  trailer4.towPoint = new Point(trailer4.body, createVector(-trailer2.wheelBase/4, 0))

  trailer5 = new Trailer()
  trailer5.car = trailer4
  trailer5.wheelBase = size * scale
  trailer5.towPoint = new Point(trailer5.body, createVector(-trailer2.wheelBase/4, 0))

}

function draw(){
  background(0)

  for(let i = 0; i < upf; i++){ // higher upf approximates the derivatives closer because time step between updates is less
    car.update()
    trailer1.update()
    trailer2.update()
    trailer3.update()
    trailer4.update()
    trailer5.update()
  }

  car.show()
  trailer1.show()
  trailer2.show()
  trailer3.show()
  trailer4.show()
  trailer5.show()
}

function Car() {
  this.body = new Body()
  this.towPoint
  this.length = 1
  this.wheelBase = 1
  this.speed = 1
  this.currentTurnAngle = 0
  this.maxTurnAngle = Math.PI / 4

  this.update = function() {
    this.body.vel = createVector(0, 0)
    this.currentTurnAngle = 0
    if(keyIsDown(UP_ARROW)){
      this.body.setVel(createVector(this.speed, 0).rotate(this.body.heading))
    }
    else if(keyIsDown(DOWN_ARROW)){
      this.body.setVel(createVector(-this.speed, 0).rotate(this.body.heading))
    }

    if(keyIsDown(LEFT_ARROW)){
      this.currentTurnAngle = -this.maxTurnAngle * Math.cos(this.body.vel.heading() - this.body.heading)
    }
    else if(keyIsDown(RIGHT_ARROW)){
      this.currentTurnAngle = this.maxTurnAngle * Math.cos(this.body.vel.heading() - this.body.heading)
    }
    this.body.angleV = (this.body.vel.mag() *  Math.tan(this.currentTurnAngle)) / this.wheelBase
    this.body.update()
  }

  this.show = function() {
    push()
    noStroke()
    translate(this.body.pos.x,this.body.pos.y)
    rotate(this.body.heading)
    rectMode(CORNER)
    fill(255)
    rect(-(this.length - this.wheelBase)/2, -1/4 * this.length, this.length, 1/2 * this.length)
    fill(127)
    rect(-(this.length - this.wheelBase)/2 + 3/4 * this.length, -1/4 * this.length, 1/4 * this.length, 1/2 * this.length)

    stroke(0,255,0)
    fill(0,255,0)
    ellipse(0,0,5,5)
    pop()

    stroke(255,0,0)
    fill(255,0,0)
    ellipse(this.towPoint.pos().x,this.towPoint.pos().y,5,5)
  }
}

function Trailer() {
  this.body = new Body //need a full body so that we can have a towPoint to tow multiple trailers
  this.car  //The car that is towing the trailer (must have a towPoint)
  this.towPoint //The tow point of the trailer i.e. the point from which the trailer would tow another trailer
  this.wheelBase = 1 //distance from the wheels to where the trailer meets the car (not the trailer's tow point)


  this.update = function() {
    this.body.heading += Math.sin(this.car.towPoint.vel().heading() - this.body.heading) * this.car.towPoint.vel().mag() / this.wheelBase
    this.body.pos = this.car.towPoint.pos().sub(createVector(this.wheelBase,0).rotate(this.body.heading))
    this.body.update() //do this to update the tow points
  }

  this.show = function() {

    push()
    stroke(255)
    translate(this.body.pos.x,this.body.pos.y)
    rotate(this.body.heading)
    rectMode(CENTER)
    fill(127)
    rect(0, 0, 1/2 * this.wheelBase, 1/2 * this.wheelBase)
    line(1/4 * this.wheelBase, 1/4 * this.wheelBase, this.wheelBase, 0)
    line(1/4 * this.wheelBase, -1/4 * this.wheelBase, this.wheelBase, 0)
    stroke(0,255,0)
    fill(0,255,0)
    ellipse(0,0,5,5)
    pop()

    stroke(255,0,0)
    fill(255,0,0)
    ellipse(this.towPoint.pos().x,this.towPoint.pos().y,5,5)
  }
}
