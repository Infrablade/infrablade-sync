# Infrablade Sync (Community Edition)

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Docker](https://img.shields.io/badge/docker-ready-green.svg)
![Status](https://img.shields.io/badge/status-stable-blue.svg)

**The Self-Hosted Sync Engine for Salesforce & Firebase.**

Infrablade Sync is a lightweight, deployable Docker container that acts as a real-time bridge between Salesforce and Firebase Firestore. It runs on your own infrastructure (Azure, AWS, On-Prem), ensuring zero data exfiltration.

---

## 🚀 Features

* **🔒 Zero-Trust Architecture:** Data flows directly from Salesforce to Firebase. It never touches 3rd party servers.
* **⚡ Real-Time:** Uses Salesforce Apex Triggers for instant updates (no polling).
* **🐳 Docker Native:** Deploy anywhere Docker runs.
* **🔄 Bi-Directional Ready:** Designed for extensibility.

---

## 🛠️ Architecture

```mermaid
graph LR
    A[Salesforce] -- Webhook (JSON) --> B(Infrablade Container)
    B -- Authenticated Write --> C[Firebase Firestore]
    style B fill:#f9f,stroke:#333,stroke-width:4px