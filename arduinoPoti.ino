// Arduino UNO: Pot on A0 -> prints 0..1023 at 115200 baud
const int POT = A0;

void setup() {
  Serial.begin(115200);
  // Optional: small settle delay
  delay(100);
}

void loop() {
  int v = analogRead(POT);     // 0..1023
  Serial.println(v);           // one value per line
  delay(10);                   // ~100 Hz
}
