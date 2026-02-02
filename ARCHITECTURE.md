# 🏗️ Architecture & Service Mapping

This project focuses on translating a traditional Express application into AWS managed services.

## Application → AWS Mapping

| Application Component | AWS Service | Reason |
|----------------------|-------------|--------|
| Express Server | AWS Lambda | Serverless compute, auto-scale |
| HTTP Routing | API Gateway | Managed REST endpoints with HTTPS |
| Database | MongoDB Atlas | Free tier managed DB |
| Logging | CloudWatch | Automatic log collection |
| Static Assets | S3 | Durable object storage (not used here) |

## Request Flow

Client Request (HTTPS)
→ API Gateway
→ Lambda (Node.js)
→ MongoDB Atlas
→ CloudWatch Logs

## Why Serverless?

- No server management
- Pay per request
- Auto scaling
- Ideal for low traffic systems

## Trade-offs

- Cold starts
- Debugging complexity
- Vendor lock-in considerations
