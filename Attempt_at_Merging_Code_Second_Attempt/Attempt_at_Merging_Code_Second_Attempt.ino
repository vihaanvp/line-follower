#include <SoftwareSerial.h>
#include <AFMotor.h>

AF_DCMotor motorleft(4);
AF_DCMotor motorright(3);
int mode = 0;

int LS = 4;

int RS = 6;
int MS = 5;
int pin = 3;
int l = 0;
int r = 0;
int m = 0;
int pwmR = 10;
int dirR = 12;
int pwmL = 11;
int dirL = 13;
int c = 0;
char a[100], b[100], e[50];
int flag = 0;
int i = 0, q = 0;
int j = 0;
int d = 0;


void setup() {
  // put your setup code here, to run
  pinMode(LS, INPUT);
  pinMode(RS, INPUT);
  pinMode(MS, INPUT);
  pinMode(pin, INPUT_PULLUP);
  pinMode(14, OUTPUT);
  pinMode(19, OUTPUT);
  digitalWrite(14, HIGH);
  digitalWrite(19, LOW);
  pinMode(dirL, OUTPUT);
  pinMode(dirR, OUTPUT);
  pinMode(pwmL, OUTPUT);
  pinMode(pwmR, OUTPUT);
  
	motorleft.setSpeed(200);
	motorleft.run(RELEASE);

  motorright.setSpeed(200);
	motorright.run(RELEASE);

  Serial.begin(9600);
}
void loop() {

  int IR1 = analogRead(A5);
  int IR2 = analogRead(A4);
  int IR3 = analogRead(A3);

  Serial.print("AIR1: ");
  Serial.print(IR1);
  Serial.print("  AIR2: ");
  Serial.print(IR2);
  Serial.print("  AIR3: ");
  Serial.print(IR3);

  if(IR1 > 400)
  IR1 = HIGH;
  else
  IR1 = LOW;

  if(IR2 > 400)
  IR2 = HIGH;
  else
  IR2 = LOW;

  if(IR3 > 400)
  IR3 = HIGH;
  else
  IR3 = LOW;

  // l, r, m allotment
  if(IR1 == HIGH)
  l = 0;
  else
  l = 1;

  if(IR2 == HIGH)
  m = 0;
  else
  m = 1;

  if(IR3 == HIGH)
  r = 0;
  else
  r = 1;

  
  //explore the maze

  if (digitalRead(pin) == HIGH) {
    c = 1;
  } else {
    c = 0;
  }
  if (c == 0) {
    l = digitalRead(LS);
    r = digitalRead(RS);
    m = digitalRead(MS);



    if (l == 1 && m == 0 && r == 1) {
      d = 1;
      //forward

      motorright.run(FORWARD);
      motorleft.run(FORWARD);
      Serial.println("movi3ng forward just");
      a[i] = 'S';
      i++;
    }
    /*if (l == 1 && m == 1 && r == 1 && d == 1) {

      digitalWrite(dirR, HIGH);
      digitalWrite(dirL, HIGH);
      analogWrite(pwmL, 100);
      analogWrite(pwmR, 100);
      Serial.println("U turn");
      a[i] = 'U';
      i++;
    }*/
    if (l == 0 && m == 0 && r == 1) {
      motorleft.run(RELEASE);
      motorright.run(FORWARD);
      Serial.println("moving leftrrrrr");
      a[i] = 'L';
      i++;
    }
    if (l == 1 && m == 0 && r == 0) {
      motorleft.run(FORWARD);
      motorright.run(RELEASE);
      Serial.println("moving right");
      a[i] = 'R';
      i++;
    }


    if (l == 1 && m == 0 && r == 0) {
      //rightq
      motorright.run(FORWARD);
      motorleft.run(RELEASE);
      Serial.println("forward just");
      if (l == 1 && m == 1 && r == 1) {
        motorleft.run(FORWARD);
        motorright.run(RELEASE);
        Serial.println("moving right");
        a[i] = 'R';
        i++;
      }
    } else if (l == 0 && m == 0 && r == 0)

    {
      //forward with low speed
      //left
      motorright.run(FORWARD);
      motorleft.run(RELEASE);
      Serial.println("forward just");
      if (l == 1 && m == 1 && r == 1) {
        motorleft.run(RELEASE);
        motorright.run(FORWARD);
        Serial.print("moving left");
        a[i] = 'L';
        i++;
      }
      if (l == 1 && m == 0 && r == 1) {

        motorleft.run(RELEASE);
        motorright.run(FORWARD);
        Serial.print("mo ving left");
        a[i] = 'L';
        i++;
      }
    }

    /*else if (l == 1 && m == 1 && r == 1) {
      //u turn
      if (d == 0) {

        //forward
        motorleft.run(FORWARD);
        motorright.run(FORWARD);
        Serial.println("movi3ng forward just");
        a[i] = 'S';
        i++;
      }
      digitalWrite(dirR, HIGH);
      digitalWrite(dirL, HIGH);
      analogWrite(pwmL, 100);
      analogWrite(pwmR, 100);
      Serial.println("U turn");
      a[i] = 'U';
      i++;
    }*/
  }
  if (c == 1) {
    for (int i = 0; i < sizeof(a); i++) {
      Serial.println(a[i]);
    }
    //change array
    while (flag == 0) {
      while (j < sizeof(a)) {
        if (a[j] == 'L' && a[j + 1] == 'U' && a[j + 2] == 'S') {
          b[q] = 'R';
          j = j + 3;
          q++;
        } else if (a[j] == 'L' && a[j + 1] == 'U' && a[j + 2] == 'L') {
          b[q] = 'S';
          j = j + 3;
          q++;
        } else if (a[j] == 'L' && a[j + 1] == 'U' && a[j + 2] == 'R') {
          b[q] = 'U';
          j = j + 3;
          q++;
        } else if (a[j] == 'S' && a[j + 1] == 'U' && a[j + 2] == 'L') {
          b[q] = 'R';
          j = j + 3;
          q++;
        }

        else if (a[j] == 'S' && a[j + 1] == 'U' && a[j + 2] == 'S') {
          b[q] = 'U';
          j = j + 3;
          q++;
        } else if (a[j] == 'R' && a[j + 1] == 'U' && a[j + 2] == 'L') {
          b[q] = 'U';
          j = j + 3;
          q++;
        }
      }
      for (int k = 0; k < sizeof(b); k++) {
        if (b[k] != 'U') {
          flag = 1;
        } else {
          flag = 0;
          break;
        }
      }
      Serial.println("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
      for (int k = 0; k < sizeof(b); k++) {
        Serial.println(b[k]);
      }
    }
    if (b[i] == 'R')  //move right..........
    {

      motorleft.run(FORWARD);
      motorright.run(RELEASE);
      Serial.println("moving right real maze");
    }
    if (b[i] == 'S')  //move straight......
    {
      motorleft.run(FORWARD);
      motorright.run(FORWARD);
      Serial.println("moving forward real maze");
    }
    if (b[i] == 'L')  //move left.......
    {

      motorleft.run(RELEASE);
      motorright.run(FORWARD);
      Serial.print("moving left real maze");
    }
  }
}