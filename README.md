# 🎮 ExpoPlay Dashboard

**Version:** 1.5.2
**Author:** Nils Utiger (UTN)
**Organization:** SUVA | Rösslimatt Luzern

---

## 📘 Overview

The **ExpoPlay Dashboard** is a centralized administration platform for managing the **ExpoPlay Quiz System** — an interactive exhibition experience that uses **Microsoft Kinect™ gesture control technology**.
This dashboard serves as the main control center for all system components, allowing administrators to manage consoles, exhibitions, players, and quizzes, as well as analyze gameplay statistics.

---
## 📊 Dashboard Overview

The dashboard homepage provides a **real-time overview of key system metrics**:

* 🕹️ Active consoles
* 🏛️ Ongoing exhibitions
* 👤 Registered players
* ❓ Available quizzes
* 📈 Average score rate (0–100%)
* 🎯 Total quizzes played

Additionally, two analytical charts display data from the last 7 days:

* Daily number of quizzes played
* Average daily score rate
---

## 🧩 Console Management

Administrators can view, manage, and maintain all registered **ExpoPlay Consoles**.

### ➕ Add Console

To add a new console, the following information is required:

* Console name
* Assigned exhibition (Expo)
* Assigned quiz

---

## 🏟️ Exhibition Management

The exhibitions section allows administrators to manage all **events, fairs, and shows** where ExpoPlay is used.

### ➕ Add Exhibition

Required parameters:

* Official exhibition name
* Start and end dates
* Venue location
* Welcome message for visitors
* Subtitle

---

## 🧑‍🤝‍🧑 Player Management

All players are automatically registered when starting a quiz.
This section provides insights into participant data.

### Accessible Information

* First and last name
* Email address
* Marketing consent status
* Number of games played

---

## ❓ Quiz Management

Administrators can view and manage all available quizzes from one place.
Each quiz includes its **maximum possible score**.

### ➕ Create Quiz

To create a quiz, simply provide a unique name.
Questions can then be added with support for three formats:

* ✅ Yes/No questions
* 📝 Multiple choice (text)
* 🖼️ Multiple choice with images

Each question can have its own **custom score weight**.

---

## 📈 Played Quiz Overview

This section provides detailed **analytics and statistics** for all completed quizzes:

* Player results
* Scores
* Play time
* Linked exhibitions

This enables in-depth performance evaluation across all events.

---

## 👨‍💼 User Management (Admins Only)

Exclusive to administrators, this section allows:

* Creating new user accounts
* Managing access permissions
* Assigning administrative roles

### ➕ Add User

Admins can add new dashboard users with the appropriate privileges to ensure only authorized personnel have system access.

---

## 👤 Profile Settings

Every user can access their **profile page** to update personal information:

* Change name and password
* (Email cannot be modified for security reasons)

---

## 🧱 Tech Stack

* **Frontend:** React
* **Backend:** PHP / Laravel
* **Database:** MariaDB
* **Auth:** session-based authentication
