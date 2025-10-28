import processing.serial.*;

Serial myPort;
int potValue = 0;

void setup() {
  size(600, 400);
  println(Serial.list());   // shows all available serial ports
  myPort = new Serial(this, Serial.list()[0], 9600);  // choose correct port!
  myPort.bufferUntil('\n');  // read full lines
}

void draw() {
  background(30);

  // Map potentiometer value to x-position
  float x = map(potValue, 0, 1023, 0, width);

  // Draw circle controlled by potentiometer
  fill(255, 100, 100);
  ellipse(x, height/2, 50, 50);

  // Show value for debugging
  fill(255);
  textSize(16);
  text("Pot value: " + potValue, 10, height - 20);
}

void serialEvent(Serial p) {
  String in = p.readStringUntil('\n');
  if (in != null) {
    in = trim(in);
    try {
      potValue = int(in);
    } catch (Exception e) {
      // ignore errors
    }
  }
}
