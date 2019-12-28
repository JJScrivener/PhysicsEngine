function Body() {
  this.pos = createVector(0, 0) //location of the center of mass of the body (pixels)
  this.vel = createVector(0, 0) //velocity of the center of mass of the body (pixels per update)
  this.acc = createVector(0, 0) //acceleration of the center of mass of the body (pixels per update^2)

  this.heading = 0  //heading of the body (positive = clockwise) (radians)
  this.angleV = 0 //angular velocity of the body (radians per update)
  this.angleA = 0 //angular acceleration of the body (radians per update^2)

  this.mass = 1    //mass of the body (kg)
  this.inertia = 1 //inertia of the body about the center of mass (kg * meter^2)

  this.ppm = 1 //the number of pixels per meter
  this.ups = 1 //the number of updates per second

  this.points = [] //array of special points on the body

  this.getPos = function(){ //Returns the position in meters
    return this.pos.copy().mult(1 / this.ppm)
  }
  this.getVel = function(){ //returns the velocity in meters per second
    return this.vel.copy().mult(this.ups / this.ppm)
  }
  this.getAcc = function(){ //returns the acceleration in meters per second^2
    return this.acc.copy().mult(this.ups * this.ups / this.ppm)
  }

  this.setPos = function(p) { //sets the body's position by, taking a new position in meters and converting to pixels.
    this.pos = p.copy().mult(this.ppm)
  }
  this.setVel = function(v) { //sets the body's velocity by, taking a new velocity in meters per second and converting to pixels per update
    this.vel = v.copy().mult(this.ppm / this.ups)
  }
  this.setAcc = function(a) { //sets the body's acceleration by, taking a new acceleration in meters per second^2 and converting it to pixels per update^2
    this.acc = a.copy().mult(this.ppm / (this.ups * this.ups))
  }

  this.applyForce = function(force, location) { //Apply a force(kg * meters per sec^2(N)) to the body at a location(meters) relative to the center of mass and heading of the body
    if(force.mag() > 0) {
      this.acc.add(force.copy().rotate(this.heading).mult(this.ppm /(this.ups * this.ups * this.mass)))
      let rad = 0
      if(location && location.mag() > 0){
        rad = location.mag() * this.ppm * Math.sin(location.angleBetween(force))
        this.angleA += force.mag() * (this.ppm / (this.ups * this.ups)) * rad / (this.inertia * (this.ppm * this.ppm))
      }
    }
  }

  this.applyMoment = function(moment) { //Apply a moment (kg * meters^2 per sec^2(Nm))
    this.angleA += moment * (this.ppm * this.ppm / (this.ups * this.ups)) / (this.inertia * (this.ppm * this.ppm))
  }

  this.update = function() { //Updates the pos vel acc etc. The position is updated first because the velocity is considered to be constant since the PREVIOUS update.

    this.pos.add(this.vel)
    this.vel.add(this.acc)
    this.acc = createVector(0, 0)

    this.heading += this.angleV
    this.angleV += this.angleA
    this.angleA = 0

    for(let i = 0; i < this.points.length; i++){
      this.points[i].update()
    }
  }
}

function Point(body, posRel) {
  this.body = body  //body that the point is part of
  this.posRel = posRel.copy()    //position of the point on the body relative to the body's pos
  this.p = createVector(0, 0)   //absolute position of the point
  this.pp = createVector(0, 0)  //previous absolute position of the point
  this.ppp = createVector(0, 0) //previos previous absolute position of the point

  this.update = function(){
    this.ppp = this.pp.copy()
    this.pp = this.p.copy()
    this.p = this.body.pos.copy().rotate(-this.body.heading).add(this.posRel).rotate(this.body.heading)
  }

  this.pos = function(){ //Returns the position of the point in pixels.
    return this.p.copy()
  }

  this.vel = function(){ //Returns the average velocity of the point over the last update, in pixels per update.
    return this.p.copy().sub(this.pp)
  }

  this.acc = function(){ //Returns the average acceleration of the point over the last two updates, in pixels per update^2.
    return this.p.copy().sub(this.pp).sub(this.pp).add(this.ppp)
  }

  this.body.points.push(this)
}
