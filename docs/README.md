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
- **UID Pre-Validation**: Checks format of UID numbers before sending the requests.
- **UID Validation**: Checks the existance of UID numbers in official sources.
- **Error Handling**: Provides standardized error responses.

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
3. Build and run the app 
      `npm run start`

### Example Usage
Send a POST request to the /validation endpoint:

   ```bash
   curl -X POST http://localhost:3000/validation \
   -H "Content-Type: application/json" \
   -d '{
      "countryCode": "CH",
      "uid": "123456789"
      }'
   ```

#### Request Parameters:

`countryCode (string)`: The country code in ISO 2 format (e.g., CH for Switzerland).
`uid (string)`: The UID number to be validated.

#### Example Response

```json
{
    "validated": true,
    "details": "UID is valid for the given country code"
}
```

#### Example Error Response

```json
{
    "code": 400,
    "message": "Bad request"
}
```