const int AirValue = 410; 
const int WaterValue = 188;
const int serialSendTime = 5000;
const int moistureSampleRate = 1200;
const int pumpWaterTime = 75;
const int pumpPin = 2;
const int pumpPrimeButtonPin = 4;
const int fanPin = 6;
const byte DATA_MAX_SIZE = 32;
char data[DATA_MAX_SIZE]; 

int soilMoistureArray[] = {0,0,0,0,0,0,0,0,0,0,0,0,0,0,0};
int soilMoistureArrayLength = 15;
unsigned long serialSendTimer = 0;
int pumpPrimeButtonState = 0;


void setup() {
  pinMode(fanPin, OUTPUT);
  pinMode(pumpPin, OUTPUT);
  pinMode(pumpPrimeButtonPin, INPUT_PULLUP);
  Serial.begin(9600);
}
void loop() {
  int currentSoilMoisture = getCurrentSoilMoisture();
  if(millis() > serialSendTimer || millis() < (serialSendTimer - serialSendTime)){
    Serial.print("m="); 
    Serial.println(currentSoilMoisture); 
    serialSendTimer = millis() + serialSendTime; 
  }
  receiveData();
  handlePump();
  handleFan();
  delay(moistureSampleRate);
}

void handleFan(){
  if(String(data) == "fanon"){
    //fan on command received
    digitalWrite(fanPin, HIGH);
  }
  if(String(data) == "fanoff"){
    //fan on command received
    digitalWrite(fanPin, LOW);
  }
}

void handlePump(){
  if(digitalRead(pumpPrimeButtonPin) == HIGH){
    if(pumpPrimeButtonState == 1){
      digitalWrite(pumpPin, LOW);
      pumpPrimeButtonState = 0;
    }
    if(String(data) == "wtr"){
      //water command received
      digitalWrite(pumpPin, HIGH);
      delay(pumpWaterTime);
      digitalWrite(pumpPin, LOW);
    }
  }else{
    if(pumpPrimeButtonState == 0){
      digitalWrite(pumpPin, HIGH);
      pumpPrimeButtonState = 1;
    }
  }
}

int getCurrentSoilMoisture(){
  int soilMoistureValue = analogRead(A0);
  Serial.println(soilMoistureValue);
  int soilMoisturePercent = map(soilMoistureValue, AirValue, WaterValue, 0, 100);
  if(soilMoisturePercent >= 100){
    soilMoisturePercent = 100;
  }else if(soilMoisturePercent <=0){
    soilMoisturePercent = 0;
  }
  //push the new value to the moisture array
  for (int i = soilMoistureArrayLength-1; i > 0; i--) {
    soilMoistureArray[i] = soilMoistureArray[i - 1];
  }
  soilMoistureArray[0] = soilMoisturePercent;
  //return array average
  int soilMoisturePercentAverage = 0;
  for (int i = 0; i < soilMoistureArrayLength; i++) {
    soilMoisturePercentAverage += soilMoistureArray[i];
    //Serial.print(soilMoistureArray[i]);
    //Serial.print(",");
  }
  //Serial.println("]");
  soilMoisturePercentAverage = soilMoisturePercentAverage / soilMoistureArrayLength;
  return soilMoisturePercentAverage;
}

void receiveData() {
  static char endMarker = '\n'; 
  char receivedChar; 
  int ndx = 0; 
  // clean data buffer
  memset(data, 32, sizeof(data));
  while(Serial.available() > 0) {
    receivedChar = Serial.read();
    if (receivedChar == endMarker) {
      data[ndx] = '\0'; 
      return;
    }
    data[ndx] = receivedChar;
    ndx++;
    if (ndx >= DATA_MAX_SIZE) {
      break;
    }
  }
  memset(data, 32, sizeof(data));
}
