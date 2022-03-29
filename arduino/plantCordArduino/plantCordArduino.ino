const int AirValue = 440; 
const int WaterValue = 196;
const int serialSendTime = 5000;
const int moistureSampleRate = 250;
const int pumpWaterTime = 1000;
const int pumpPin = 2;
const byte DATA_MAX_SIZE = 32;
char data[DATA_MAX_SIZE];   // an array to store the received data

int soilMoistureArray[] = {0,0,0,0,0,0,0,0};
int soilMoistureArrayLength = 8;
unsigned long serialSendTimer = 0;


void setup() {
  pinMode(pumpPin, OUTPUT);
  Serial.begin(9600);
}
void loop() {
  int currentSoilMoisture = getCurrentSoilMoisture();
  if(millis() > serialSendTimer || millis() < (serialSendTimer - serialSendTime)){
    Serial.print("m="); 
    Serial.println(currentSoilMoisture); 
    serialSendTimer = millis() + serialSendTime; 
  }
  delay(moistureSampleRate);
  //test
  receiveData();
  handlePump();
}

void handlePump(){
  if(String(data) == "wtr"){
    //water command received
    digitalWrite(pumpPin, HIGH);
    delay(pumpWaterTime);
    digitalWrite(pumpPin, LOW);
  }
}

int getCurrentSoilMoisture(){
  int soilMoistureValue = analogRead(A0);
  //Serial.println(soilMoistureValue);
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
