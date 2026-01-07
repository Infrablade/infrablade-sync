# Infrablade Sync (Community Edition)

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Docker](https://img.shields.io/badge/docker-ready-green.svg)
![Status](https://img.shields.io/badge/status-stable-blue.svg)

**The Self-Hosted Sync Engine for Salesforce & Firebase.**

Infrablade Sync is a lightweight, deployable Docker container that acts as a real-time bridge between Salesforce and Firebase Firestore. It runs on your own infrastructure (Azure, AWS, On-Prem), ensuring zero data exfiltration.

---

## 🚀 Features

🔒 **Zero-Trust Architecture**: Data flows directly from Salesforce to Firebase. It never touches 3rd party servers.

⚡ **Real-Time**: Uses Salesforce Apex Triggers for instant updates (no polling).

🐳 **Docker Native**: Deploy anywhere Docker runs.

🔄 **Live Sync**: Immediately reflects Salesforce Contact changes in Firestore.

---

## 🛠️ Architecture

```
graph LR
    A[Salesforce] -- Webhook (JSON) --> B(Infrablade Container)
    B -- Authenticated Write --> C[Firebase Firestore]
    style B fill:#f9f,stroke:#333,stroke-width:4px
```

---

## 📦 Quick Start (5 Minutes)

### 1. Pull the Image

You do not need to build the code. Pull the official production image directly from Docker Hub:

```bash
docker pull chr16/sync-engine:latest
```

### 2. Prepare Your Credentials

- Download your Service Account Key from the Firebase Console.
- Rename the file to `key.json`.
- Place it in a folder on your server (e.g., `./config`).

### 3. Run the Engine

Run the container, mounting your key file securely:

```bash
docker run -d \
  -p 3000:3000 \
  -v $(pwd)/config/key.json:/app/key.json \
  -e FIREBASE_CREDENTIALS="/app/key.json" \
  chr16/sync-engine
```

The engine is now listening on Port 3000.

---

## ☁️ Salesforce Setup

To start syncing data, you need to tell Salesforce to send data to your engine.

### 1. Whitelist the Endpoint

Go to Setup > Remote Site Settings and add your engine's URL (e.g., your ngrok URL or server IP).

### 2. Add the Apex Class

Create a new Apex Class named `InfrabladeHttpCallout`:

```java
public class InfrabladeHttpCallout {
    @future(callout=true)
    public static void sendToInfrablade(String jsonBody) {
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        
        // REPLACE WITH YOUR SERVER URL
        request.setEndpoint('https://YOUR-SERVER-URL/webhook/salesforce');
        
        request.setMethod('POST');
        request.setHeader('Content-Type', 'application/json');
        request.setBody(jsonBody);
        
        try {
            HttpResponse response = http.send(request);
        } catch(System.CalloutException e) {
            System.debug('Error: ' + e.getMessage());
        }
    }
}
```

### 3. Add the Trigger

Create a new Trigger named `InfrabladeContactSync` on the Contact object:

```java
trigger InfrabladeContactSync on Contact (after insert, after update) {
    for (Contact c : Trigger.new) {
        // Customize the JSON payload here
        String jsonBody = '{"id": "' + c.Id + '", "firstName": "' + c.FirstName + '", "lastName": "' + c.LastName + '", "email": "' + c.Email + '"}';
        InfrabladeHttpCallout.sendToInfrablade(jsonBody);
    }
}
```

---

## 🛡️ Enterprise & Licensing

This is the Community Edition of Infrablade Sync. For Enterprise features (Bi-directional Sync, Audit Logs, SLA Support), please contact hello@infrablade.com

Copyright © 2026 Infrablade. All rights reserved.