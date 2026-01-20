# personal-cloud-storage
☁️ Personal Cloud Storage Application (AWS Serverless)  A secure, scalable, serverless cloud storage application built using AWS services. This project allows users to upload, download, manage, and organize files through a web-based interface — similar to a simplified Google Drive.

🚀 Features
--------------

✔ Secure file upload and download
✔ Serverless backend architecture
✔ Scalable cloud storage using Amazon S3
✔ REST API powered by API Gateway
✔ AWS Lambda for backend logic
✔ IAM-based access control
✔ Pre-signed URL uploads for high performance
✔ Event-driven processing support
✔ Cost-optimized architecture
✔ Web-based frontend interface

🏗 Architecture Overview

| Layer      | Technology             |
| ---------- | ---------------------- |
| Frontend   | HTML, CSS, JavaScript  |
| Backend    | AWS Lambda (Python)    |
| Storage    | Amazon S3              |
| API        | AWS API Gateway        |
| Security   | IAM Roles & Policies   |
| Monitoring | CloudWatch             |
| Deployment | Manual / CLI / Console |

Architecture Flow:
-------------------

User Browser
     |
     v
Frontend Web App
     |
     v
API Gateway
     |
     v
AWS Lambda Functions
     |
     v
Amazon S3 Bucket

📁 Project Structure
----------------------
personal-cloud-storage-app/
├── backend/           # Lambda functions
├── frontend/          # Web UI
├── infrastructure/    # AWS policies & architecture
├── screenshots/       # Application UI images
├── README.md
└── LICENSE

🔐 Security Implementation
----------------------------
This project follows AWS security best practices:

IAM Role-based access control

Least privilege permissions

Private S3 buckets

Controlled public access

Pre-signed URLs for secure uploads

API Gateway authorization support

Bucket policy restrictions

⚙ Backend Setup (AWS)
------------------------

1️⃣ Create S3 Bucket

Enable versioning (recommended)

Block public access

Enable server-side encryption

2️⃣ Create IAM Role for Lambda

Attach policies:
AmazonS3FullAccess (or custom minimal policy)
CloudWatchLogsFullAccess

3️⃣ Create Lambda Functions

Functions included:

Upload Handler

Download Handler

List Files Handler

Delete File Handler

Runtime: Python 3.10

4️⃣ Configure API Gateway

Create REST API:

Routes:
POST    /upload
GET     /download
GET     /files
DELETE  /delete

5️⃣ Enable Pre-Signed URL Uploads

Used to:

Improve upload speed

Reduce Lambda execution cost

Avoid file data passing through backend

💻 Frontend Setup
Open Frontend
frontend/index.html

Update API endpoint in:

frontend/src/api.js

Example:

const API_URL = "https://your-api-id.execute-api.region.amazonaws.com/prod";

------------------------------------------------------------------------------------
👨‍💻 Author

SANTHOSH V
Cloud Enthusiast | AWS Learner 

GitHub: https://github.com/SANTHOSH-VJ

------------------------------------------------------------------------------------

