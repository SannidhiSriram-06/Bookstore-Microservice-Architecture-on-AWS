# System Architecture - Bookstore Microservice on AWS

## Overview

This document explains the technical architecture decisions and how traditional application components were mapped to AWS cloud services.

## Architecture Diagram

```
┌─────────────────┐
│   Client        │
│   (Browser/API) │
└────────┬────────┘
         │
         │ HTTPS Request
         ▼
┌─────────────────────────────────────┐
│   AWS API Gateway (REST API)        │
│   • Endpoint: /prod/books           │
│   • Methods: GET, POST, OPTIONS     │
│   • HTTPS termination               │
│   • Request validation              │
│   • CORS handling                   │
└────────┬────────────────────────────┘
         │
         │ Lambda Proxy Integration
         ▼
┌─────────────────────────────────────┐
│   AWS Lambda Function               │
│   • Runtime: Node.js 20.x           │
│   • Memory: 128 MB (default)        │
│   • Timeout: 30 seconds             │
│   • Handler: index.handler          │
│   • Execution: Stateless            │
└────────┬────────────────────────────┘
         │
         │ MongoDB Driver
         │ (via MONGO_URI env var)
         ▼
┌─────────────────────────────────────┐
│   MongoDB Atlas                     │
│   • Tier: M0 (Free)                 │
│   • Storage: 512 MB                 │
│   • Region: AWS us-east-1           │
│   • Connection: TLS/SSL             │
└─────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│   AWS CloudWatch                    │
│   • Lambda execution logs           │
│   • API Gateway access logs         │
│   • Metrics & monitoring            │
└─────────────────────────────────────┘
```

## Component Details

### 1. AWS API Gateway (REST API)

**Purpose**: Provides a managed HTTPS endpoint for the REST API.

**Configuration**:
- API Type: REST API (not HTTP API)
- Protocol: HTTPS only
- Stage: `prod`
- Invoke URL: `https://gkpr0sgbr9.execute-api.us-east-1.amazonaws.com/prod`

**Resources**:
```
/
└── /books
    ├── GET (list books)
    ├── POST (add book)
    └── OPTIONS (CORS preflight)
```

**Key Features**:
- Automatic HTTPS certificate management
- Built-in request/response transformation
- CloudWatch integration for logging
- CORS support for web applications

**Why API Gateway?**
- No need to manage SSL certificates
- Handles routing and HTTP protocol details
- Integrates directly with Lambda
- Provides monitoring and rate limiting out-of-the-box

### 2. AWS Lambda

**Purpose**: Serverless compute for handling API requests.

**Configuration**:
- Runtime: Node.js 20.x
- Architecture: x86_64
- Memory: 128 MB
- Timeout: 30 seconds
- Handler: `index.handler`

**Environment Variables**:
- `MONGO_URI`: MongoDB Atlas connection string (stored securely)

**Execution Model**:
1. API Gateway receives request
2. Invokes Lambda function
3. Lambda processes request
4. Returns JSON response
5. API Gateway forwards to client

**Why Lambda?**
- **No server management**: AWS handles infrastructure
- **Auto-scaling**: Handles 1 request or 1000 requests automatically
- **Cost-efficient**: Pay only for execution time (free tier: 1M requests/month)
- **Cold starts**: Trade-off for serverless (first request may be slower)

**Lambda Proxy Integration**:
- API Gateway passes the entire HTTP request to Lambda
- Lambda has full control over the response (status codes, headers, body)
- Simplifies development vs. custom request/response mapping

### 3. MongoDB Atlas

**Purpose**: Managed database service for storing book data.

**Configuration**:
- Cluster Tier: M0 (Free Forever)
- Provider: AWS
- Region: us-east-1 (same as Lambda for low latency)
- Storage: 512 MB
- Connections: Up to 500 concurrent

**Security**:
- Database user authentication (SCRAM)
- IP whitelist: 0.0.0.0/0 (allows access from Lambda)
- TLS/SSL encrypted connections

**Why MongoDB Atlas?**
- **Managed service**: No database server to maintain
- **Free tier**: Sufficient for learning projects
- **Cross-cloud**: Can be used with AWS, Azure, or GCP
- **Familiar**: NoSQL document model fits JSON APIs well

**Alternative Considered**: AWS DynamoDB
- Fully AWS-native
- Might be better for production AWS-only systems
- MongoDB chosen for familiarity and portability

### 4. AWS CloudWatch

**Purpose**: Centralized logging and monitoring.

**Automatic Features**:
- Lambda execution logs (console.log output)
- Lambda metrics (invocations, duration, errors)
- API Gateway access logs
- Error tracking

**Why CloudWatch?**
- Automatically integrated with Lambda
- No additional setup required
- Helps debug issues in production

## Data Flow

### GET /books Request

```
1. Client → HTTPS GET /prod/books → API Gateway
2. API Gateway validates request
3. API Gateway invokes Lambda function
4. Lambda handler:
   - Parses event.resource = '/books'
   - Parses event.httpMethod = 'GET'
   - Returns books array
5. Lambda → JSON response → API Gateway
6. API Gateway → HTTPS response → Client
```

### POST /books Request

```
1. Client → HTTPS POST /prod/books + JSON body → API Gateway
2. API Gateway validates request
3. API Gateway invokes Lambda function
4. Lambda handler:
   - Parses event.resource = '/books'
   - Parses event.httpMethod = 'POST'
   - Parses event.body (JSON string)
   - Adds book to array (in-memory demo)
   - Returns success response
5. Lambda → JSON response → API Gateway
6. API Gateway → HTTPS response → Client
```

## Scalability & Performance

### Lambda Scaling
- **Concurrent executions**: Up to 1000 by default
- **Cold start**: ~1-2 seconds for first request
- **Warm execution**: ~10-50ms
- **For this demo**: Cold starts acceptable (low traffic)

### API Gateway Limits
- **Requests per second**: 10,000 (default)
- **Burst**: 5,000 requests
- **For this demo**: Far exceeds expected load

### MongoDB Atlas M0 Limits
- **Storage**: 512 MB
- **RAM**: Shared
- **Connections**: 500 concurrent
- **For this demo**: Sufficient for 100s of users

## Cost Breakdown

### AWS Lambda
- Free tier: 1M requests/month + 400,000 GB-seconds/month
- Beyond free tier: $0.20 per 1M requests
- **For 100 users (~1000 requests/month)**: $0

### API Gateway
- Free tier: 1M API calls/month (12 months)
- Beyond free tier: $3.50 per 1M requests
- **For 100 users**: $0

### MongoDB Atlas
- M0 tier: Free forever
- **Cost**: $0

### CloudWatch
- Free tier: 5 GB logs/month
- **For this demo**: $0

### Total Monthly Cost
**$0** for development/low-traffic scenarios

## Security Considerations

### Current Implementation
- ✅ HTTPS encryption via API Gateway
- ✅ MongoDB connection over TLS
- ✅ Environment variables for secrets
- ✅ IP whitelisting on MongoDB

### Production Improvements Needed
- ❌ Authentication (AWS Cognito, API keys)
- ❌ Authorization (IAM roles, JWT)
- ❌ Rate limiting per user
- ❌ Input validation and sanitization
- ❌ VPC for Lambda (private networking)
- ❌ Secrets Manager instead of env vars

## Trade-offs & Design Decisions

### Serverless vs. Traditional EC2
**Chose: Serverless (Lambda)**
- ✅ No server management
- ✅ Auto-scaling
- ✅ Cost-efficient for low traffic
- ❌ Cold starts
- ❌ Limited execution time (15 min max)

### REST API vs. HTTP API (API Gateway)
**Chose: REST API**
- ✅ More features (resource policies, caching)
- ✅ Better for learning full capabilities
- ❌ Slightly more expensive than HTTP API
- ❌ More complex than HTTP API

### MongoDB Atlas vs. DynamoDB
**Chose: MongoDB Atlas**
- ✅ Familiar NoSQL database
- ✅ Free tier
- ✅ Cross-cloud portability
- ❌ Not fully AWS-native
- ❌ External dependency

## Lessons Learned

1. **Lambda Proxy Integration**: Simplifies API Gateway setup by giving Lambda full control over responses
2. **Cold Starts**: First Lambda invocation is slower; subsequent calls are fast
3. **Environment Variables**: Good for development; use AWS Secrets Manager for production
4. **Statelessness**: Lambda functions are stateless; each invocation is independent
5. **CloudWatch**: Essential for debugging serverless applications
6. **Free Tier Optimization**: Careful service selection keeps costs at $0 for learning

## Future Enhancements

**For Production Readiness**:
1. Add authentication (AWS Cognito)
2. Implement proper error handling
3. Add input validation
4. Use DynamoDB for full AWS integration
5. Set up CI/CD pipeline (AWS CodePipeline)
6. Add automated tests
7. Implement Infrastructure as Code (CloudFormation/CDK)
8. Configure VPC for security
9. Add CloudFront for CDN
10. Implement database connection pooling

**This is a learning project** - the focus is understanding cloud architecture mapping, not building production software.

## References

- [AWS Lambda Documentation](https://docs.aws.amazon.com/lambda/)
- [API Gateway REST API](https://docs.aws.amazon.com/apigateway/latest/developerguide/apigateway-rest-api.html)
- [MongoDB Atlas Documentation](https://www.mongodb.com/docs/atlas/)
- [AWS Free Tier](https://aws.amazon.com/free/)

---

**Last Updated**: February 2, 2026
