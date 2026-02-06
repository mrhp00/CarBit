# CarBit

CarBit is a comprehensive car maintenance tracking application built with **React Native** and **Expo**. It allows users to manage multiple vehicles, track service history, expenses, and receive maintenance reminders.

The application is fully localized for both **English** and **Persian (Farsi)** users, featuring RTL support, Persian calendar (Shamsi), and currency handling.

## Features

- 🚗 **Garage Management**: Add and manage multiple cars with details like Make, Model, Year, and Nickname.
- 🔧 **Service Logging**: Record maintenance services (Oil Change, Brake Pads, etc.) with detailed costs, mileage, and notes.
- 📅 **Advanced Localization**:
  - Full **RTL (Right-to-Left)** layout support.
  - **Persian Calendar (Shamsi)** support for dates.
  - **Persian Digits & Currency**: Auto-formatting for Toman and Persian numbers.
- ⏰ **Smart Reminders**: Set mileage-based reminders. The app calculates overdue distance and notifies you when updating current mileage.
- 💰 **Expense Tracking**: Visualize total maintenance costs per vehicle.
- 📤 **Data Export/Import**: Backup your data to valid JSON files and restore them anytime.
- 🎨 **Modern UI**: Built with **React Native Paper** for a clean, material design experience.

## Screenshots

*(Add screenshots of your app here)*

## Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/CarBit.git
    cd CarBit
    ```

2.  **Install Dependencies**:
    ```bash
    npm install
    ```

3.  **Start the App**:
    ```bash
    npx expo start
    ```

4.  **Run on Device**:
    - Install **Expo Go** on your Android/iOS device.
    - Scan the QR code displayed in the terminal.

## Project Structure

- `app/`: Application screens and navigation logic (Expo Router).
- `store/`: State management using **Zustand** (with Async Storage persistence).
- `utils/`: Helper functions for localization (`formatters.ts`) and translations (`translations.ts`).
- `types/`: TypeScript type definitions.

## Tech Stack

- **React Native** & **Expo**
- **TypeScript**
- **Expo Router**
- **React Native Paper** (UI Component Library)
- **Zustand** (State Management)
- **AsyncStorage** (Local Data Persistence)

## Credits

**CarBit** is designed and developed by **Rayan Code**.

- **Company**: Rayan Code
- **Address**: Sina Alley, Shariati St., Langroud, Guilan, Iran
- **Contact**: +98 (0) 9111447446

---
© 2026 Rayan Code. All rights reserved.
