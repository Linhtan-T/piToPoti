const int potPin1 = 36; // Analog pin
const int potPin2 = 39;
const int potPin3 = 34;
const int potPin4 = 35;

int potValue1;
int potValue2;
int potValue3;
int potValue4;

void setup() {
  Serial.begin(115200);
  analogReadResolution(10);   // 0–1023
}

void loop() {
  potValue1 = analogRead(potPin1);
  potValue2 = analogRead(potPin2);
  potValue3 = analogRead(potPin3);
  potValue4 = analogRead(potPin4);

  // send all 4 values in ONE line
  Serial.print(potValue1);
  Serial.print(" ");
  Serial.print(potValue2);
  Serial.print(" ");
  Serial.print(potValue3);
  Serial.print(" ");
  Serial.println(potValue4);

  delay(5); // smooth + fast
}
