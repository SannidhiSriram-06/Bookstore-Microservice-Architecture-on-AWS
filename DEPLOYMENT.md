# 🚀 Deployment Process

## 1. MongoDB Atlas

- Created M0 cluster
- Database user with read/write
- IP whitelist (0.0.0.0/0 for dev)
- Retrieved connection string

## 2. AWS Lambda

- Node.js 20.x runtime
- Environment variable: MONGO_URI
- Execution role with CloudWatch logs
- Uploaded handler code

## 3. API Gateway

- REST API with `/books`
- GET and POST methods
- Lambda Proxy Integration
- CORS enabled
- Deployed to `prod` stage

## 4. Testing

```bash
curl https://<invoke-url>/books
