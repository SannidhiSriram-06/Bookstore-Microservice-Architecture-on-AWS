# 📚 Bookstore Microservice on AWS (Serverless)

A cloud architecture case study demonstrating how a traditional Node.js Express REST API can be translated into a serverless AWS deployment using Lambda, API Gateway, and MongoDB Atlas.

## 🎯 Objective

To understand how application components (compute, routing, storage, monitoring) map to managed cloud services.

## 🏗️ Architecture Overview

Client → API Gateway → Lambda → MongoDB Atlas → CloudWatch

## 🛠️ Stack

- AWS Lambda (Node.js 20.x)
- API Gateway (REST)
- MongoDB Atlas (M0 free tier)
- CloudWatch Logs
- Region: us-east-1

## 📡 API

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | /books | List books |
| POST | /books | Add book |

## 💰 Cost

Runs fully in AWS & MongoDB free tiers → **$0/month for low traffic**

## 📂 Documentation

- [Architecture Decisions](./ARCHITECTURE.md)
- [Deployment Steps](./DEPLOYMENT.md)
- [Key Learnings & Interview Points](./LEARNINGS.md)

---

**Author**: Sannidhi Sriram  
CSE (Cloud Minor) | Azure & Oracle Cloud Certified
