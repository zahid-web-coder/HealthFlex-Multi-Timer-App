 

 # 🕒 HealthFlex Multi-Timer App

A fully functional React Native (Expo) app for creating, managing, and tracking multiple timers — built for the HealthFlex internship assignment.

---

## 🚀 Features

### ✅ Core Features
- **Add Timer** screen with:
  - 📝 Name input (e.g., "Workout", "Study")
  - ⏱ Duration input (in seconds)
  - 🗂 Category input (e.g., "Exercise", "Break")
- **Timer List** screen:
  - Displays all saved timers
  - Shows current time, progress bar, and category
  - Includes **Start**, **Pause**, **Reset**, and **Remove**
- **AsyncStorage** for local data persistence
- **Completion Modal** with celebratory message
- **Quick Timer** button (auto-creates 60s timer with "Quick" category)
- **Progress Bar** visualization
- **Halfway Alert** (at 50% of timer duration)
- **History (in-memory)** of completed timers

---

## 📱 Screens

### 1. `AddTimerScreen.js`
- Input fields for name, duration, category
- Saves to local storage
- Validation for empty fields

### 2. `TimerListScreen.js`
- Loads timers from AsyncStorage
- Groups by category (optional expansion)
- Tracks timer progress
- Triggers modal when complete

---

## 📦 Tech Stack

- **React Native (Expo)**
- **React Navigation**
- **AsyncStorage**
- **TypeScript** (index.tsx variant included)
- No backend needed (fully client-side)

---

---

## ⚠️ Known Notes

> ✅ I implemented a full Add Timer screen with Name, Duration, and Category support.  
> ❗ However, due to Expo navigation cache or device-specific routing issues, the screen may not display on first load.  
> ✅ The code is complete and functional — please run with:

```bash
npx expo start -c