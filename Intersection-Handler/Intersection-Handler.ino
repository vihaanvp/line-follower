// Define IR sensor pins
#define LEFT_IR_PIN 7
#define RIGHT_IR_PIN 8

// Define motor pins
#define MOTOR1_PIN1 3
#define MOTOR1_PIN2 2
#define MOTOR2_PIN1 5
#define MOTOR2_PIN2 4

int leftSensor = digitalRead(LEFT_IR_PIN);
int rightSensor = digitalRead(RIGHT_IR_PIN);
int y;

enum RobotState { FOLLOW_LINE, INTERSECTION, FOLLOW_LINE_AGAIN, STOP };

RobotState CurrentState = FOLLOW_LINE;

void setup() {
  // Initialize IR sensor pins as inputs
  pinMode(LEFT_IR_PIN, INPUT);
  pinMode(RIGHT_IR_PIN, INPUT);

  // Initialize motor pins as outputs
  pinMode(MOTOR1_PIN1, OUTPUT);
  pinMode(MOTOR1_PIN2, OUTPUT);
  pinMode(MOTOR2_PIN1, OUTPUT);
  pinMode(MOTOR2_PIN2, OUTPUT);

  Serial.begin(9600);
}

void loop() {
  int leftSensor = digitalRead(LEFT_IR_PIN);
  int rightSensor = digitalRead(RIGHT_IR_PIN);

  switch (CurrentState) {
    case FOLLOW_LINE:
      y=1;
      if (leftSensor == LOW && rightSensor == LOW) {
        moveForward();
      }

      else if (leftSensor == LOW && rightSensor == HIGH) {
        turnRight();
      }

      else if (leftSensor == HIGH && rightSensor == LOW) {
        turnLeft();
      }

      else if(leftSensor == HIGH && rightSensor == HIGH) {
        CurrentState = INTERSECTION;
      }
      break;

    case INTERSECTION:
      y=2;
      stopMoving();
      delay(2000);
      moveForward();
      delay(500);
      stopMoving();
      delay(30);
      CurrentState = FOLLOW_LINE_AGAIN;
      break;

    case FOLLOW_LINE_AGAIN:
      y=3;
      if (leftSensor == LOW && rightSensor == LOW) {
        moveForward();
      }

      else if (leftSensor == LOW && rightSensor == HIGH) {
        turnRight();
      }

      else if (leftSensor == HIGH && rightSensor == LOW) {
        turnLeft();
      }

      else if(leftSensor == HIGH && rightSensor == HIGH) {
        CurrentState = STOP;
      }
      break;

    case STOP:
      y=4;
      stopMoving();
      break;
  }

  Serial.println(y);
}

void moveForward() {
  digitalWrite(MOTOR1_PIN1, LOW);
  digitalWrite(MOTOR1_PIN2, HIGH);
  digitalWrite(MOTOR2_PIN1, LOW);
  digitalWrite(MOTOR2_PIN2, HIGH);
}

// Function to turn the robot left
void turnLeft() {
  digitalWrite(MOTOR1_PIN1, HIGH);
  digitalWrite(MOTOR1_PIN2, HIGH);
  digitalWrite(MOTOR2_PIN1, LOW);
  digitalWrite(MOTOR2_PIN2, HIGH);
}

// Function to turn the robot right
void turnRight() {
  digitalWrite(MOTOR1_PIN1, LOW);
  digitalWrite(MOTOR1_PIN2, HIGH);
  digitalWrite(MOTOR2_PIN1, HIGH);
  digitalWrite(MOTOR2_PIN2, HIGH);
}

// Function to stop the robot
void stopMoving() {
  digitalWrite(MOTOR1_PIN1, HIGH);
  digitalWrite(MOTOR1_PIN2, HIGH);
  digitalWrite(MOTOR2_PIN1, HIGH);
  digitalWrite(MOTOR2_PIN2, HIGH);
}

void FollowLine() {
  if (leftSensor == LOW && rightSensor == LOW) {
    moveForward();
  }

  else if (leftSensor == LOW && rightSensor == HIGH) {
    turnRight();
  }

  else if (leftSensor == HIGH && rightSensor == LOW) {
    turnLeft();
  }
}