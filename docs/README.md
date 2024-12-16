# UID Validation Service

A robust service to validate UID numbers for Switzerland and the European Union by interacting with external web services.

---

## 📖 Introduction
This service validates UID numbers by routing requests to appropriate external services for Switzerland and the EU. It ensures seamless integration, consistent responses, and reliable error handling, providing a dependable validation mechanism.

---

## 🎯 Purpose
The service acts as a unified interface for interacting with multiple external web services. It simplifies UID validation, reduces redundancy, and ensures consistent implementation across regions.

---

## 🚀 Features
- **Country-Based Routing**: Directs requests to the relevant external service based on the `countryCode`.
- **UID Validation**: Checks format and existence of UID numbers.
- **Error Handling**: Provides standardized error responses.
- **Extensibility**: Easily expandable to support additional regions.
- **Stateless API**: Designed for scalability and performance.

---

## 🛠️ Usage
### Prerequisites
- **Node.js** (version 20.18 recommended)
- All dependencies installed (`npm install`).

### Installation
1. Clone the repository:
   ```bash
   git clone <repository_url>
   cd <repository_name>
2. Install dependencies
    `npm install`