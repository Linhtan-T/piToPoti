// Processing (Java mode)
// Sketch: Potentiometer controls a circle X-position and size

import processing.serial.*;

Serial ser;
String PORT_NAME = "/dev/ttyUSB0";  // CHANGE THIS if needed
int BAUD = 115200;

int raw = 0;          // last raw value 0..1023
float mappedX = 0;    // mapped 0..width
float mappedSize = 50;

void setup() {
  size(800, 400);
  surface.setTitle("Potentiometer Visualizer (Processing Java)");
  
  // Uncomment to print ports first run; then set PORT_NAME and restart
  // println(Serial.list());
  // exit();
  
  try {
    ser = new Serial(this, PORT_NAME, BAUD);
    ser.bufferUntil('\n');
  } catch (Exception e) {
    println("Could not open serial port: " + PORT_NAME);
    println("Available ports:");
    println(Serial.list());
  }
}

void draw() {
  background(245);
  
  // Map 0..1023 to screen coordinates/size
  mappedX = map(raw, 0, 1023, 50, width-50);
  mappedSize = map(raw, 0, 1023, 20, 200);
  
  // Axis
  stroke(200);
  line(50, height/2, width-50, height/2);
  
  // Circle
  noStroke();
  fill(50, 150, 255, 220);
  ellipse(mappedX, height/2, mappedSize, mappedSize);
  
  // HUD
  fill(30);
  text("Raw: " + raw, 10, 20);
  text("Port: " + PORT_NAME, 10, 40);
  text("Tip: press 'p' to list ports in console", 10, 60);
}

void serialEvent(Serial s) {
  String line = s.readStringUntil('\n');
  if (line == null) return;
  line = trim(line);
  if (line.length() == 0) return;
  try {
    raw = constrain(Integer.parseInt(line), 0, 1023);
  } catch (Exception e) {
    // ignore malformed lines
  }
}

void keyPressed() {
  if (key == 'p' || key == 'P') {
    println("Ports:");
    println(Serial.list());
  }
}
