var wind;
var up = true;
var centre;
var oscillator;
var angle;

var balls = [];


function setup() {

	createCanvas(600, 600);
	background(0);
	
	//making the oscillator to swing from the centre...

	wind = createVector (0,0);


	var howManyBalls = int(random(10));
	for(var i = 0; i < howManyBalls; i++){
		balls[i] = new Mover (width/2, random(height), random(-5,5), random(-5,5)); 
		balls[i].weight = 2;
		balls[i].tall = 10;
		balls[i].fat = 10;
	}

	centre = new Mover (300, 300,0,0);
	centre.weight = 2;
	centre.tall = 10;
	centre.fat = 10;
	oscillator = new Mover(300, 450, 0, 0);
	oscillator.weight = 2;
	oscillator.tall = 10;
	oscillator.fat = 10;
	
}

function draw () {
	background(0,20);
	for(var i = 0; i < balls.length; i++){ //bouncy balls!
		balls[i].update ();
		balls[i].edgeCollide();
		balls[i].show();
		balls[i].applyForce(wind);
	};

	//oscillator.update();
	oscillator.tetherUpdate(centre);
	//oscillator.edgeCollide();
	oscillator.applyForce(wind);
	//oscillator.pos.set(width/2+cos(angle)*height/4, height/2+sin(angle)*height/4);
	oscillator.show();

	//print(wind.x);

	
	if(up){
		wind.x += 0.003;
	}else{
		wind.x -= 0.003;
	};

	if(wind.x >= .1){
		up=false;
	};

	if(wind.x <= -.1){
		up=true;
	};

};

			//physics object class
			function Mover (x, y, vx, vy) {
				this.pos = createVector(x, y); 
				this.vel = createVector (vx, vy);
				this.accel = createVector (0,0);  
				this.weight;
				this.tall;
				this.fat;
				this.tethered = false;

				this.applyForce = function (force) {
					var f = p5.Vector.div(force,this.weight);
					this.accel.add(f);
					
					/*
					//line for troubleshooting velocity	
					stroke(255,225,50);
					line(this.pos.x, this.pos.y, this.pos.x+(10*this.vel.x), this.pos.y+(10*this.vel.y));
					noStroke(); 
					*/
				};


				this.show = function () { //displays physics object as a firefly
					stroke(color(255, 220, 50));
					strokeWeight(1);
					fill(color(255, 150));
					ellipse(this.pos.x, this.pos.y, this.fat, this.tall);
					ellipse(this.pos.x, this.pos.y, 1, 1);
					noStroke();  	
				};

				this.update = function () {  //manages acceleration, speed, position for untethered objects
					this.vel.add(this.accel);
					this.accel.set(0,0);
					this.pos.add(this.vel);
				};

				this.edgeCollide = function () { //bounces off the edges of the canvas
					if ((this.pos.x<=0 && this.vel.x<0)||(this.pos.x>=width && this.vel.x>0)) {
						this.vel.x=this.vel.x*-1;
					};

						if ((this.pos.y<=0 && this.vel.y<0)||(this.pos.y>=height && this.vel.y>0)) {
							this.vel.y=this.vel.y*-1;

					};
				};
				

				this.tetherUpdate = function (tether) { //this is for tethered objects to be accelerated orbitally. "Tether" must be a mover.
					tether.show();			
					this.vel.add(this.accel);
					this.accel.set(0,0);
					


					var angVel;
					var r = tether.pos.dist(this.pos);
					var mouseAngle = atan2(mouseY-tether.pos.y, mouseX-tether.pos.x);
					var angle = atan2(this.pos.y-tether.pos.y, this.pos.x-tether.pos.x);
					
					//print(sin(angle));

					angVel = (this.vel.x*-sin(angle)+this.vel.y*cos(angle))/r;
					
					//the x component of the velocity should be multiplied by -sin(angle),

					if(millis()>4000){
						angle += angVel;
					}else{
						angle += PI/120;
					}
					




					var oldPos =  createVector(this.pos.x, this.pos.y);
					this.pos.set(tether.pos.x+cos(angle)*r, tether.pos.y+sin(angle)*r);
					this.vel.set(this.pos.x-oldPos.x, this.pos.y-oldPos.y);

					print(this.vel.y/(cos(angle)*this.vel.mag()));


					//draw a triangle between the vertical line down the middle of the background, the mover and the centre
					/*
					stroke(255,225,50);
					triangle(width/2,height/2, width/2, height/2+sin(angle)*height/4, width/2+cos(angle)*height/4, height/2+sin(angle)*height/4);
					noStroke(); 
					*/

					
					
					//Angular accel needs to be converted to radians - 2PIr radians in 360 degrees so we just need to divide angularAccel by the radius
				
					
					
					};
					
				
			};
