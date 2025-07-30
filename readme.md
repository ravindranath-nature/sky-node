# Skynode: Blockchain-Backed Aerial Data Storage in a Web 3.0 Framework

![License](https://img.shields.io/badge/license-MIT-blue.svg)  
![Build](https://img.shields.io/badge/build-passing-brightgreen)  
![Web3.0](https://img.shields.io/badge/Web-3.0-blueviolet)

## 📌 Title

**Optimized Chunking and Blockchain-Backed Storage of Aerial Data in a Web 3.0 Architecture**

## 🛰️ Introduction

**Skynode** is a robust and secure framework developed for managing aerial and geospatial data using cutting-edge Web 3.0 technologies. With the exponential growth of drone-captured data in fields such as remote sensing and environmental monitoring, there's a pressing need to ensure data authenticity, decentralized storage, and fine-grained access control.

Skynode addresses these challenges through:

- Decentralized data storage using **IPFS (InterPlanetary File System)**
- Immutable verification and logging using **blockchain**
- Optimized **chunking** of large datasets for efficient storage and retrieval
- Secure user authentication using **two-step OTP verification** and **JWT-based session management**

Only authenticated users are granted access to the platform, ensuring secure interaction and data integrity.

---

## 🧠 Features

- 🔐 **Two-Step Authentication** (OTP + JWT)
- 🧩 **Optimized Chunking** of aerial data files
- 📦 **Decentralized Storage** using IPFS
- ⛓️ **Blockchain Integration** for verifiable access logs and metadata
- 🌐 **Web 3.0 Ready** infrastructure
- 👥 Role-based access control

---

## 🏗️ Architecture Overview

```plaintext
[User]
   │
   ├──→ OTP Auth + JWT Session
   │
   └──→ [Frontend UI]
            │
            └──→ [Backend Server]
                       ├──→ Chunking & Upload Service
                       ├──→ Blockchain Smart Contract (e.g., Ethereum)
                       └──→ IPFS Node / Gateway
