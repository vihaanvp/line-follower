// Define the pins for the IR sensors
#define LEFTMOST_SENSOR_PIN 7
#define MIDDLE_LEFT_SENSOR_PIN 9
#define MIDDLE_RIGHT_SENSOR_PIN 12
#define RIGHTMOST_SENSOR_PIN 2

// Define the pins for the motors
#define MOTOR_A1_PIN 4
#define MOTOR_A2_PIN 3
#define MOTOR_B1_PIN 6
#define MOTOR_B2_PIN 5
#define ENA1 10
#define ENA2 11

void setup() {
  // Set the IR sensor pins as inputs
  pinMode(LEFTMOST_SENSOR_PIN, INPUT);
  pinMode(MIDDLE_LEFT_SENSOR_PIN, INPUT);
  pinMode(MIDDLE_RIGHT_SENSOR_PIN, INPUT);
  pinMode(RIGHTMOST_SENSOR_PIN, INPUT);

  // Set the motor pins as outputs
  pinMode(MOTOR_A1_PIN, OUTPUT);
  pinMode(MOTOR_A2_PIN, OUTPUT);
  pinMode(MOTOR_B1_PIN, OUTPUT);
  pinMode(MOTOR_B2_PIN, OUTPUT);
  pinMode(ENA1, OUTPUT);
  pinMode(ENA2, OUTPUT);

  // Initialize serial communication
  Serial.begin(9600);
}

void loop() {
  digitalWrite(ENA1, HIGH);
  digitalWrite(ENA2, HIGH);
  // Read the sensor values
  int leftmostSensorValue = digitalRead(LEFTMOST_SENSOR_PIN);
  int middleLeftSensorValue = digitalRead(MIDDLE_LEFT_SENSOR_PIN);
  int middleRightSensorValue = digitalRead(MIDDLE_RIGHT_SENSOR_PIN);
  int rightmostSensorValue = digitalRead(RIGHTMOST_SENSOR_PIN);

  // Check sensor values and perform actions accordingly
  if (leftmostSensorValue == LOW && middleLeftSensorValue == LOW && middleRightSensorValue == LOW && rightmostSensorValue == LOW) {
    // All sensors detect the line, move forward
    moveForward();
  } else if (leftmostSensorValue == HIGH && middleLeftSensorValue == LOW && middleRightSensorValue == LOW && rightmostSensorValue == LOW) {
    // Only leftmost sensor is off the line, turn left
    turnLeft();
  } else if (leftmostSensorValue == LOW && middleLeftSensorValue == LOW && middleRightSensorValue == LOW && rightmostSensorValue == HIGH) {
    // Only rightmost sensor is off the line, turn right
    turnRight();
  } else {
    // Default behavior: stop
    stopMotors();
  }
}

// Function to move the robot forward
void moveForward() {
  digitalWrite(MOTOR_A1_PIN, HIGH);
  digitalWrite(MOTOR_A2_PIN, LOW);
  digitalWrite(MOTOR_B1_PIN, HIGH);
  digitalWrite(MOTOR_B2_PIN, LOW);
}

// Function to turn the robot left
void turnLeft() {
  digitalWrite(MOTOR_A1_PIN, LOW);
  digitalWrite(MOTOR_A2_PIN, HIGH);
  digitalWrite(MOTOR_B1_PIN, HIGH);
  digitalWrite(MOTOR_B2_PIN, LOW);
}

// Function to turn the robot right
void turnRight() {
  digitalWrite(MOTOR_A1_PIN, HIGH);
  digitalWrite(MOTOR_A2_PIN, LOW);
  digitalWrite(MOTOR_B1_PIN, LOW);
  digitalWrite(MOTOR_B2_PIN, HIGH);
}

// Function to stop the motors
void stopMotors() {
  digitalWrite(MOTOR_A1_PIN, LOW);
  digitalWrite(MOTOR_A2_PIN, LOW);
  digitalWrite(MOTOR_B1_PIN, LOW);
  digitalWrite(MOTOR_B2_PIN, LOW);
}
