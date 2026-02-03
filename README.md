# 📚 Bookstore Microservice Architecture on AWS

A cloud architecture case study demonstrating the translation of a traditional Node.js Express application into a serverless AWS deployment using Lambda, API Gateway, and MongoDB Atlas.

## 🎯 Project Overview

This project demonstrates practical cloud service mapping by taking a basic bookstore REST API and deploying it using AWS managed services. The focus is on understanding how traditional application components map to cloud-native services.

**Key Learning**: How to translate application requirements (compute, routing, storage, monitoring) into appropriate AWS service selections.

## 🏗️ Architecture

### Traditional Application → Cloud Services Mapping

| Application Component | AWS Service | Reason |
|----------------------|-------------|---------|
| Express Server (compute) | AWS Lambda | Serverless, auto-scaling, pay-per-request |
| HTTP Routing | API Gateway | Managed REST API with HTTPS, routing, monitoring |
| Database | MongoDB Atlas | Free tier managed database, no infrastructure |
| Static Assets | Amazon S3 | Durable object storage (not implemented in this demo) |
| Logging | CloudWatch | Automatic Lambda log collection |

### Architecture Diagram

```
Client Request (HTTPS)
    ↓
API Gateway (REST API)
    ├── GET /books
    └── POST /books
         ↓
    AWS Lambda
    (Node.js 20.x)
         ↓
MongoDB Atlas
(M0 Free Tier)
         ↓
    CloudWatch Logs
```

## 🛠️ Tech Stack

- **Compute**: AWS Lambda (Node.js 20.x)
- **API Management**: AWS API Gateway (REST API)
- **Database**: MongoDB Atlas (M0 Free Tier - 512MB)
- **Monitoring**: AWS CloudWatch
- **Region**: us-east-1

## 📡 API Endpoints

The deployed API supports basic CRUD operations:

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/books` | List all books |
| POST | `/books` | Add a new book |

**Note**: This is a proof-of-concept. A production system would include UPDATE, DELETE, authentication, and input validation.

## 💰 Cost Analysis

### Why This Architecture is Cost-Efficient

**Monthly costs for ~100 users:**

- **Lambda**: Free tier covers 1M requests/month → $0
- **API Gateway**: Free tier covers 1M API calls/month → $0
- **MongoDB Atlas**: M0 tier is permanently free → $0
- **CloudWatch**: 5GB logs free tier → $0

**Total: $0/month** for development and low-traffic scenarios.

This demonstrates understanding of AWS Free Tier optimization for student/learning projects.

## 🚀 Deployment Process

### 1. MongoDB Atlas Setup
- Created M0 free tier cluster (512MB storage)
- Configured database user with read/write permissions
- Whitelisted IP addresses (0.0.0.0/0 for development)
- Retrieved connection string

### 2. AWS Lambda Configuration
- Created function with Node.js 20.x runtime
- Configured environment variable: `MONGO_URI`
- Deployed function code with API handlers
- Set up execution role with CloudWatch permissions

### 3. API Gateway Integration
- Created REST API with `/books` resource
- Configured GET and POST methods
- Enabled Lambda Proxy Integration for request/response handling
- Enabled CORS for web access
- Deployed to `prod` stage

### 4. Testing & Validation
Verified functionality using curl:
```bash
# Get all books
curl https://gkpr0sgbr9.execute-api.us-east-1.amazonaws.com/prod/books

# Add a book
curl -X POST https://gkpr0sgbr9.execute-api.us-east-1.amazonaws.com/prod/books \
  -H "Content-Type: application/json" \
  -d '{"title":"Cloud Computing","author":"AWS Expert","price":29.99}'
```

## 📸 Implementation Screenshots

All deployment steps are documented in the `/screenshots` folder:

1. MongoDB Atlas cluster configuration
2. Database user setup
3. Network access whitelist
4. Lambda function creation and code
5. Environment variable configuration
6. API Gateway resource structure
7. Method integration with Lambda
8. Deployed API stage with invoke URL
9. Successful API testing

## 🎓 Key Learnings

### Cloud Service Mapping
- **Compute**: Serverless (Lambda) vs. traditional servers (EC2)
- **Why Lambda**: No server management, automatic scaling, pay-per-execution
- **Trade-off**: Cold starts vs. always-on instances

### API Gateway Benefits
- HTTPS endpoint without certificate management
- Built-in request routing
- Integrated with CloudWatch for monitoring
- Rate limiting and throttling capabilities

### MongoDB Atlas Integration
- Managed database service eliminates server maintenance
- Connection string-based access
- IP whitelisting for security
- Free tier suitable for learning/development

### Lambda Proxy Integration
- API Gateway passes entire request to Lambda
- Lambda controls response format
- Simplifies integration vs. custom mapping

## 🔧 Project Structure

```
bookstore-aws-microservice/
├── README.md                 # This file
├── ARCHITECTURE.md           # Detailed architecture documentation
├── lambda-code/
│   ├── index.mjs            # Lambda function handler
│   └── package.json         # Node.js dependencies
└── screenshots/             # Deployment screenshots
    ├── 01-mongodb-cluster.png
    ├── 02-database-users.png
    ├── 03-network-access.png
    ├── 04-lambda-overview.png
    ├── 05-lambda-code.png
    ├── 06-env-variables.png
    ├── 07-lambda-test.png
    ├── 08-api-gateway-resources.png
    ├── 09-get-method-integration.png
    ├── 10-api-stages.png
    └── 11-post-method-integration.png
```

## ⚠️ Limitations & Future Enhancements

**Current State**: Proof-of-concept demonstrating cloud architecture mapping

**Not Implemented** (but would be needed for production):
- Authentication/Authorization (AWS Cognito or API keys)
- Input validation and error handling
- Database connection pooling optimization
- UPDATE and DELETE endpoints
- CI/CD pipeline (AWS CodePipeline)
- Infrastructure as Code (CloudFormation/Terraform)
- VPC configuration for database security
- DynamoDB alternative for full AWS-native stack

**This is intentional** - the focus is on understanding core cloud service mapping, not building production-grade software.

## 🎯 Interview Talking Points

If asked about this project, I can discuss:

1. **Why serverless?** → Cost efficiency, auto-scaling, no server management for low-traffic apps
2. **Why API Gateway?** → Managed HTTPS endpoints, built-in monitoring, integrates with Lambda
3. **Why MongoDB Atlas vs. DynamoDB?** → Familiar with MongoDB, free tier sufficient, cross-cloud portability
4. **Trade-offs**: Lambda cold starts, vendor lock-in, debugging complexity vs. traditional servers
5. **What I learned**: Mapping application components to cloud services, understanding managed service benefits

## 👨‍💻 Author

**Sannidhi Sriram**
- 3rd Year CSE Student @ Lovely Professional University
- Minor: Cloud Computing
- Certifications: Azure AZ-900, AI-900, Oracle Cloud (Gen AI, Multicloud Architect)

## 📝 Acknowledgments

This project was created as a learning exercise to understand:
- AWS Lambda and serverless computing
- API Gateway for REST API management
- MongoDB Atlas cloud database hosting
- Cloud architecture design principles

Built as part of coursework demonstrating practical cloud deployment skills.

---

**Note**: This repository contains deployment documentation and code. AWS resources have been deleted after testing to avoid unnecessary costs. Screenshots demonstrate the working implementation.
