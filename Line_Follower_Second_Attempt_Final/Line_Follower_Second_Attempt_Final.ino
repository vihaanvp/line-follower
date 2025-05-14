#include <AFMotor.h>

AF_DCMotor motorleft(4);
AF_DCMotor motorright(3);
int IR1,IR2,IR3;
int mode=0;
void setup() {
	motorleft.setSpeed(200);
	motorleft.run(RELEASE);

  motorright.setSpeed(200);
	motorright.run(RELEASE);

  Serial.begin(9600);
}

void readsensors()
{
  
  IR1 = analogRead(A5);
  IR2 = analogRead(A4);
  IR3 = analogRead(A3);
/*
  Serial.print("AIR1: ");
  Serial.print(IR1);
  Serial.print("  AIR2: ");
  Serial.print(IR2);
  Serial.print("  AIR3: ");
  Serial.print(IR3);
*/
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
}

void loop() {

readsensors();
  
/*
  Serial.print("  IR1: ");
  Serial.print(IR1);
  Serial.print("  IR2: ");
  Serial.print(IR2);
  Serial.print("  IR3: ");
  Serial.println(IR3);
*/
 

  /*

  if (IR1 == LOW && IR2 == LOW && IR3 == LOW)  //Straight path
  {
    motorleft.run(FORWARD);
    motorright.run(FORWARD);
  }

  else if(IR1 == LOW && IR2 == LOW && IR3 == HIGH)
  {
    motorleft.run(FORWARD);
    motorright.run(RELEASE);
  }

  else if(IR1 == LOW && IR2 == HIGH && IR3 == LOW)
  {
    motorleft.run(FORWARD);
    motorright.run(FORWARD);
  }

  else if (IR1 == LOW && IR2 == HIGH && IR3 == HIGH)  //Left turn
  {
    motorleft.run(FORWARD);
    motorright.run(RELEASE);
  }

  else if (IR1 == HIGH  && IR2 == LOW && IR3 == LOW)  //Right Turn
  {
    motorleft.run(RELEASE);
    motorright.run(FORWARD);
  }
  
  else if (IR1 == HIGH  && IR2 == LOW && IR3 == HIGH)  //Right Turn
  {
    motorleft.run(RELEASE);
    motorright.run(RELEASE);
  }

  else if (IR1 == HIGH  && IR2 == HIGH && IR3 == LOW)  //Right Turn
  {
    motorleft.run(RELEASE);
    motorright.run(FORWARD);
  }

  else if (IR1 == HIGH  && IR2 == HIGH && IR3 == HIGH)  //Right Turn
  {
    motorleft.run(FORWARD);
    motorright.run(FORWARD);
  }

 /* if (IR1 == LOW && IR2 == HIGH && IR3 == LOW)  //T Intersection
  {
    Left();  // As left is possible
  }

  if (IR1 == LOW && IR2 == LOW && IR3 == HIGH)  //Left T Intersection
  {
    Left();  // As Left is possible
  }

  if (IR1 == HIGH && IR2 == LOW && IR3 == LOW)  //Right T Tntersection
  {
    Forward();  //As Straight path is possible
  }

  /*if (IR1 > 512 && IR2 > 512 && IR3 > 512)  //Dead End
  {
    U_Turn();  //As no other direction is possible
  }

  if (IR1 == LOW && IR2 == LOW && IR3 == LOW )  //4 Lane intersection
  {
    Forward();  //As no other direction is possible
    count = count + 1;
  }

  if (IR1 == HIGH && IR2 == HIGH && IR3 == HIGH )  //End of Maze
  {
    Stop();  //As no other direction is possible
  }
  */
  if(IR1 == HIGH && IR2 == LOW && IR3 == HIGH)
  {
    motorleft.run(RELEASE);
    motorright.run(RELEASE);
    Serial.println("101 - Stop");
  }
  else if(IR2 == HIGH && IR1 == LOW && IR3 == LOW)
  {
    motorleft.run(FORWARD);
    motorright.run(FORWARD);
    Serial.println("010 - Forward");
  }
  else if(IR2 == LOW && IR1 == LOW && IR3 == HIGH)
  {
    motorleft.run(FORWARD);
    motorright.run(RELEASE);
    while(IR2 == LOW)
    {
      Serial.print("001 - Right");
    readsensors();
    if(IR1 == HIGH && IR2 == LOW && IR3 == HIGH)
    {
      break;
    }
    
  }
  }
  else if(IR2 == LOW && IR1 == HIGH && IR3 == LOW)
  {
    motorleft.run(RELEASE);
    motorright.run(FORWARD);
    while(IR2 == LOW)
    {
    Serial.print("100 - Left");
    readsensors();
    if(IR1 == HIGH && IR2 == LOW && IR3 == HIGH)
    {
      break;
    }
    }
  }


  else if(IR1 == LOW && IR2 == HIGH && IR3==HIGH)
  {
    motorleft.run(RELEASE);
    motorright.run(FORWARD);
    Serial.print("011 - Left");
  }
  else if(IR1 == LOW && IR2 == HIGH && IR3==HIGH)
  {
    motorleft.run(RELEASE);
    motorright.run(FORWARD);
    Serial.print("011 - Left");
  }
  else if(IR1 == HIGH && IR2 == HIGH && IR3==LOW)
  {
    motorleft.run(FORWARD);
    motorright.run(RELEASE);
    Serial.print("110 - Right");
  }
    else if(IR2 == LOW && IR1 == LOW && IR3 == LOW)
  {
    motorleft.run(FORWARD);
    motorright.run(RELEASE);
    Serial.print("000 - RIGHT");
  }
  else
  {
    motorleft.run(FORWARD);
    motorright.run(FORWARD);
    Serial.print("111 - Forward");
  }
   delay(10); 

  


}