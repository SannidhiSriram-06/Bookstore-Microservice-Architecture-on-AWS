📌 Overview

This project demonstrates how a simple Node.js + Express bookstore microservice can be translated into a cost-effective, scalable AWS cloud architecture.

Rather than focusing on application code, this case study focuses on:

Mapping application requirements → AWS services → architectural reasoning

This mirrors how cloud architects evaluate and design solutions during real customer engagements.

🎯 Objective

Design a cloud architecture that can host a bookstore microservice for ~100 users using mostly free tier / low-cost AWS services while ensuring:

Scalable compute

Secure API exposure

Durable storage for static assets

Managed database hosting

Monitoring and observability

🧠 Architecture Thinking Demonstrated

For each part of the application, the following mapping is performed:

Code responsibility → Cloud requirement → AWS service → Why this service over alternatives

This approach reflects practical cloud architecture decision-making rather than code implementation.

🏗️ AWS Services Used
Application Need	AWS Service	Reason for Selection
Express server hosting	AWS Lambda	Serverless compute, no server management, free tier friendly
REST API exposure	AWS API Gateway	HTTPS endpoints, routing, security, rate limiting
Static assets (images/JSON)	Amazon S3	Durable, highly available object storage
Application logs & monitoring	Amazon CloudWatch	Automatic logging and metrics for Lambda & API Gateway
Managed database	MongoDB Atlas (Free Tier)	Cloud-hosted MongoDB without self-management
Alternative compute option	EC2 t3.micro	Free tier VM if serverless is not preferred
⚙️ Compute Requirement – Why Lambda over EC2?
AWS Lambda	EC2 t3.micro
Fully serverless	Requires OS management
Auto-scaling	Manual scaling
Pay per execution	Always running
Ideal for APIs	Overhead for small service

Lambda allows hosting the Express application without worrying about infrastructure.

🌐 API Requirement – Why API Gateway?

API Gateway provides:

HTTPS endpoints

Request routing

Security and throttling

Integration with Lambda

Monitoring via CloudWatch

This removes the need to expose EC2 instances directly to the internet.

🗄️ Storage Requirement – Why S3?

Static assets are offloaded to S3 to:

Reduce load on compute layer

Ensure durability

Minimize cost

Improve performance

📊 Observability – Why CloudWatch?

CloudWatch automatically collects logs and metrics from Lambda and API Gateway, enabling:

Error tracking

Performance monitoring

Usage insights

🧩 Database Requirement – Why MongoDB Atlas?

MongoDB Atlas Free Tier provides:

Managed MongoDB hosting

Sufficient storage for small workloads

No server/database maintenance

Easy connection with Node.js applications

🔁 Cost-Aware Design

This architecture is intentionally designed to stay within:

AWS Free Tier limits

Minimal operational cost

Low management overhead

Making it ideal for student projects and low-traffic microservices.

📄 Documentation

The full architecture mapping document is available here:

Bookstore_AWS_MongoDB_Assignment_Updated.docx

This document explains how each part of the code maps to a cloud service requirement.

🧩 Key Takeaway

This project demonstrates practical cloud architecture thinking by translating application responsibilities into appropriate AWS services with clear justification.
