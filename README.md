# Line Follower Robot

This project was originally created for the TechRadiance 8th and 9th edition competitions. It controls a line follower robot using IR sensors and basic logic implemented in Embedded C via the Arduino IDE.

> ⚠️ The code may need some modifications to work properly depending on your hardware setup, as this is code that I have previously used for some competitions and testing.

## Technology Utilized

- **Language:** Embedded C
- **IDE:** Arduino IDE
- **Hardware:** Arduino Uno, IR sensors, motors, motor driver (L293D / Adafruit Motor Shield)

---

## Sketch Categories & Feature Comparison

---

### 2-IR

| Feature | `Line_Follower_2IR` | `Line_Follower_2IR_PWM` |
|---|---|---|
| **Speed control** | Full speed only | ✅ Adjustable motor speed via PWM (~22%) |
| **Motor interface** | Direct L293D pin control | Direct L293D pin control |
| **Line following** | Standard 2-IR (forward / turn / stop) | Standard 2-IR (forward / turn / stop) |
| **Code quality** | Clean, minimal, no issues | Clean, minimal, no issues |
| **Best for** | Simple, proven 2-IR line following | When you need to slow the robot down via PWM |

---

### 3-IR-L293D-Shield

| Feature | `Maze_Solver_3IR` | `Line_Follower_3IR` |
|---|---|---|
| **Hardware required** | Adafruit Motor Shield + 3 analog IR sensors | Adafruit Motor Shield + 3 analog IR sensors |
| **Maze solving** | ✅ Full pipeline: explore → record path → optimize → solve | ❌ Line following only |
| **Path optimization** | ✅ Simplifies LUR sequences (LUS→R, LUL→S, etc.) | ❌ None |
| **Mode switching** | ✅ Physical switch (exploration vs solve mode) | ❌ No |
| **Serial debug** | Extensive path and state output | Basic |
| **Code quality** | Functional but messy — duplicate conditions, cryptic variable names | Has a duplicate dead-code block (double 011 case), misleading debug label |
| **Best for** | Maze-solving competitions requiring path optimization | Simple 3-IR line tracking |

---

### 4-IR

| Feature | `Line_Follower_4IR` | `4IR_Second_PWM` |
|---|---|---|
| **Speed control** | Full speed only | ✅ Adjustable motor speed via PWM (~39%) |
| **Tracking logic** | Aggressive — only 3 patterns, stops for anything unusual | Gradual — middle sensors for gentle turns, outer sensors for sharp corrections |
| **Stop method** | Coast (motors free) | Brake (motors held) |
| **Code quality** | ✅ Clean, well-commented, straightforward | ⚠️ `adjustLeft`/`adjustRight` are duplicates of `turnLeft`/`turnRight` — misleading naming |
| **Best for** | Simple, reliable 4-IR tracking | When you want both PWM speed control and 4 sensors |

---

### Intersection-Handler

| Feature | `Intersection-Handler` |
|---|---|
| **Unique ability** | ✅ Detects line junctions (both sensors go off-line) and treats them as intersections |
| **Behavior** | Follows line → at intersection, stop 2s → forward 0.5s → resume → at next intersection, stop permanently |
| **State machine** | 4 states: FOLLOW_LINE → INTERSECTION → FOLLOW_LINE_AGAIN → STOP |
| **Serial debug** | Prints current state number |
| **Best for** | Grid-based tracks with junctions where the robot must stop or turn at each crossing |

---

### Line-Followers-And-Obstacle-Avoidance

| Feature | `Line_Follower_Obstacle_Sweep` | `Line_Follower_Ultrasonic` | `Line_Follower_Obstacle_IR` |
|---|---|---|---|
| **Obstacle sensor** | Ultrasonic (HC-SR04) | Ultrasonic (HC-SR04) | IR proximity pair |
| **Avoidance style** | ✅ Intelligent sweep: turn around obstacle, actively scan for the line, re-acquire | ❌ Rigid pre-set 14-step sequence (~13s, blocking) | ❌ Stop + wait 1.5s, then resume — no actual navigation |
| **Non-blocking** | ✅ Yes (millis-based, stays responsive) | ❌ No (relies on delay(), freezes robot) | ❌ No (relies on delay()) |
| **Line re-acquisition** | ✅ Sweep scan + 120ms confirmation debounce | ❌ None (assumes line is still ahead) | ❌ None (just resumes) |
| **Line polarity** | Standard (LOW = on line) | ⚠️ Inverted (HIGH = on line) | Standard (LOW = on line) |
| **Speed control** | Full speed only | Full speed only | ✅ PWM (~20% duty) |
| **State machine** | ✅ 2 states (FOLLOW_LINE / AVOIDING) | ✅ 5 states (hard-coded for exactly 2 obstacles) | ❌ Simple if/else |
| **Extra features** | Configurable timing constants | LDR + LED light sensor | — |
| **Code quality** | ✅ Excellent — clean, organized, well-commented | Fair — large commented blocks, redundant reads | Poor — misleading comments ("backup and turn" but doesn't), redundant logic |
| **Best for** | Reliable autonomous obstacle navigation that actually works | Courses with at most 2 known obstacles, and you can tolerate a freeze | Quick stop-and-go with PWM, no real obstacle navigation needed |

---

## Author

**Vihaan Parlikar**  
GitHub: [vihaanvp](https://github.com/vihaanvp)
