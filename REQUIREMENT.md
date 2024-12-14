# UID checker Requirements

## Overview

The purpose of this Node.js service is to provide a unified interface for interacting with multiple external web services to validate UID numbers. By generalizing the interaction with these services, the service simplifies the process for internal use within the company. It ensures that requests are validated, routed to the appropriate external service, and responses are handled consistently.

## Requirements

### General

- The service must be implemented using Node.js 20.18 and TypeScript.
- The service must use the Express framework to handle REST requests.
- Zod must be used for validating incoming requests.
- Additional packages should not be needed, you can add more but have to give a reason why.
- The folder structure should be followed, own structures can be introduces if they seem better suited for the use-case.
- Use linting and code styling rules you like for this challenge.
- Write unit and api tests with jest and supertest and try to reach at least 80% code coverage and a level of testing you think is appropriate.
- Write a README.md and provide an OpenAPI definition in YAML format.
- Find a proper abstraction how to encapsulate the logic for each service in its own implementation. Find a way how to lookup the correct implementation based on the country code. Use design/patterns if neccessary.

### Request Parameters

- The service must accept two required parameters:
  - `countryCode`: A string representing the country code in ISO 2 format.
  - `uid`: A string representing the UID number.

### Validation

- The service must validate the `countryCode` and `uid` using provided regular expressions.
- If the `countryCode` is invalid, the service must return a `400 Bad Request` error with and error json to describe what happened.
- If the `uid` is invalid, the service must return a `400 Bad Request` error with and error json to describe what happened.

### External Services

- The service must determine which external web service to use based on the `countryCode`:
  - If the `countryCode` is supported by the EU service, the service must make a request to the EU web service.
  - If the `countryCode` is supported by the Switzerland service, the service must make a request to the Switzerland web service.
  - If the `countryCode` is not supported by either service, the service must return a `501 Not Implemented` error.
- The service must evaluate the response from the external web service and return an appropriate response to the caller.

## External Web Services

- EU Web Service:
  - <https://ec.europa.eu/taxation_customs/vies/#/technical-information>
  - <https://ec.europa.eu/assets/taxud/vow-information/swagger_publicVAT.yaml>
- Switzerland Web Service:
  - <https://www.bfs.admin.ch/bfs/de/home/register/unternehmensregister/unternehmens-identifikationsnummer.assetdetail.24605175.html>
  - <https://www.uid-wse-a.admin.ch/V5.0/PublicServices.svc>

## Error Handling

- The service must handle and return appropriate HTTP errors for invalid requests and unsupported country codes.

## Folder Structure

- The service should follow the structure outlined in the source folder. The structure can be modified if necessary.

## Example Request

```json
{
    "countryCode": "DE",
    "uid": "123456789"
}
```

## Example Response

```json
{
    "validated": true,
    "details": "UID is valid for the given country code."
}
```

## Example Error Response

```json
{
    "code": 123,
    "message": "The external service could not be reached."
}
```

## Regular Expressions for Validation

All countries in the list except `CH` are supported by the EU service.

The following regular expressions are used to validate the `countryCode` and `uid` parameters:

```json
[
    {
        "countryCode": "AT",
        "regex": "^ATU[0-9]{8}$"
    },
    {
        "countryCode": "BE",
        "regex": "^BE[01][0-9]{9}$"
    },
    {
        "countryCode": "BG",
        "regex": "^BG[0-9]{9,10}$"
    },
    {
        "countryCode": "CH",
        "regex": "^CHE-[0-9]{3}\\.[0-9]{3}\\.[0-9]{3}$"
    },
    {
        "countryCode": "CY",
        "regex": "^CY[0-9A-Z]{8}[A-Z]{1}$"
    },
    {
        "countryCode": "CZ",
        "regex": "^CZ[0-9]{8,10}$"
    },
    {
        "countryCode": "DE",
        "regex": "^DE[0-9]{9}$"
    },
    {
        "countryCode": "DK",
        "regex": "^DK[0-9]{8}$"
    },
    {
        "countryCode": "EE",
        "regex": "^EE[0-9]{9}$"
    },
    {
        "countryCode": "EL",
        "regex": "^(EL|GR)[0-9]{9}$"
    },
    {
        "countryCode": "ES",
        "regex": "^ES([0-9]{8}[A-Z])|([A-Z][0-9]{8})|([A-Z][0-9]{7}[A-Z])$"
    },
    {
        "countryCode": "FI",
        "regex": "^FI[0-9]{8}$"
    },
    {
        "countryCode": "FR",
        "regex": "^FR[0-9A-Z]{2}[0-9]{9}$"
    },
    {
        "countryCode": "GB",
        "regex": "^GB([0-9]{9}|[0-9]{12}|GD[0-9]{3}|HA[0-9]{3})$"
    },
    {
        "countryCode": "HR",
        "regex": "^HR[0-9]{11}$"
    },
    {
        "countryCode": "HU",
        "regex": "^HU[0-9]{8}$"
    },
    {
        "countryCode": "IE",
        "regex": "^IE[0-9]((([0-9]|[A-Z]|\\+\\*)[0-9]{5}[A-Z])|([0-9]{6}[A-Z]{2}))$"
    },
    {
        "countryCode": "IT",
        "regex": "^IT[0-9]{11}$"
    },
    {
        "countryCode": "LT",
        "regex": "^LT([0-9]{9}|[0-9]{12})$"
    },
    {
        "countryCode": "LU",
        "regex": "^LU[0-9]{8}$"
    },
    {
        "countryCode": "LV",
        "regex": "^LV[0-9]{11}$"
    },
    {
        "countryCode": "MT",
        "regex": "^MT[0-9]{8}$"
    },
    {
        "countryCode": "NL",
        "regex": "^NL[0-9]{9}B[0-9]{2}$"
    },
    {
        "countryCode": "PL",
        "regex": "^PL[0-9]{10}$"
    },
    {
        "countryCode": "PT",
        "regex": "^PT[0-9]{9}$"
    },
    {
        "countryCode": "RO",
        "regex": "^(RO)?[0-9]{2,10}$"
    },
    {
        "countryCode": "SE",
        "regex": "^SE[0-9]{12}$"
    },
    {
        "countryCode": "SI",
        "regex": "^SI[0-9]{8}$"
    },
    {
        "countryCode": "SK",
        "regex": "^SK[0-9]{10}$"
    }
]
```
