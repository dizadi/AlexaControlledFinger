
int servoPin = A7;
double FINGER_VOLTS = 5;
Servo fingerServo;

void setup(){
  fingerServo.attach(servoPin);
  Particle.function("servoUp", servoUp);
  Particle.function("servoDown", servoDown);
  openFinger();
}

void closeFinger(){
  fingerServo.write(0);
}

void openFinger(){
  fingerServo.write(180);
}

//invoked by alexa skill

int servoDown(String Command) {
  closeFinger();
  return 1;
}

int servoUp(String Command){
  openFinger();
  return 1;
}
