const int AirValue = 440; 
const int WaterValue = 196;
const int serialSendTime = 5000;
const int moistureSampleRate = 250;

int soilMoistureArray[] = {0,0,0,0,0,0,0,0};
int soilMoistureArrayLength = 8;
unsigned long serialSendTimer = 0;


void setup() {
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
