# AWS Serverless Cloud Storage

> Your own personal cloud storage — like a simplified Google Drive, but you own it.

Hey there! This is my personal cloud storage project built entirely on AWS serverless services. I wanted to create something practical while learning cloud architecture, and what better way than building my own file storage system?

## What Does It Do?

Simply put, it lets you:
- **Upload files** securely to the cloud
- **Download them** whenever you need
- **Browse and manage** your files through a clean web interface
- **Delete stuff** you no longer need

All of this runs without any servers to manage — it scales automatically and you only pay for what you use.

## The Tech Behind It

| What | How |
|------|-----|
| Frontend | React with AWS Amplify |
| Backend | AWS Lambda (Python) |
| Storage | Amazon S3 |
| API | AWS API Gateway |
| Infrastructure | AWS SAM |
| Security | IAM Roles & Policies |

### How It All Connects

```
You (Browser) → React Frontend → API Gateway → Lambda Functions → S3 Bucket
```

Pretty straightforward, right? The frontend talks to API Gateway, which triggers Lambda functions that handle all the S3 operations.

## Project Structure

```
├── personal-cloud-backend/    # The serverless backend
│   ├── hello_world/           # Lambda function code
│   ├── template.yaml          # SAM infrastructure template
│   └── tests/                 # Unit & integration tests
│
└── personal-cloud-frontend/   # The React web app
    ├── src/                   # React components
    ├── public/                # Static assets
    └── amplify/               # AWS Amplify config
```

## Getting Started

### Backend Setup

1. **Install AWS SAM CLI** if you haven't already
2. Navigate to `personal-cloud-backend/`
3. Build and deploy:
   ```bash
   sam build
   sam deploy --guided
   ```

### Frontend Setup

1. Navigate to `personal-cloud-frontend/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Update the API endpoint in your config
4. Run locally:
   ```bash
   npm start
   ```

## Security Notes

I've tried to follow AWS best practices here:
- S3 buckets are private by default
- Pre-signed URLs for secure file uploads
- IAM roles with minimal permissions
- No credentials hardcoded anywhere

## Why I Built This

Honestly? To learn. Cloud computing is fascinating, and building something real is the best way to understand how all these AWS services work together. Plus, now I have my own cloud storage that I actually use!

---

**Built by [Santhosh V](https://github.com/SANTHOSH-VJ)** — Cloud Enthusiast & AWS Learner

Feel free to fork, improve, or just poke around the code. Happy building!

