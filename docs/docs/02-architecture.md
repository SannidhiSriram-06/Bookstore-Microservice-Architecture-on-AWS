# 🏗️ Architecture

## Traditional → Cloud Mapping

| Application Component | AWS Service | Reason |
|----------------------|-------------|--------|
| Express Server | AWS Lambda | Serverless compute |
| HTTP Routing | API Gateway | Managed REST endpoints |
| Database | MongoDB Atlas | Managed DB, free tier |
| Logging | CloudWatch | Automatic log capture |

## Architecture Flow

Client → API Gateway → Lambda → MongoDB Atlas → CloudWatch Logs
