import json
import boto3
import os
from botocore.client import Config

s3 = boto3.client("s3", config=Config(signature_version="s3v4"))
BUCKET = os.environ.get("BUCKET_NAME", "personal-cloud-storage-clouddrive")

# =======================
# GLOBAL CORS HEADERS
# =======================
CORS_HEADERS = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "http://localhost:3000",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Methods": "GET,POST,OPTIONS"
}

# =======================
# UPLOAD HANDLER
# =======================
def upload_handler(event, context):
    body = json.loads(event.get("body", "{}"))

    username = body.get("username")
    filename = body.get("filename")

    if not username or not filename:
        return {
            "statusCode": 400,
            "headers": CORS_HEADERS,
            "body": json.dumps({"message": "username and filename are required"})
        }

    file_key = f"{username}/{filename}"

    upload_url = s3.generate_presigned_url(
        "put_object",
        Params={"Bucket": BUCKET, "Key": file_key},
        ExpiresIn=3600
    )

    return {
        "statusCode": 200,
        "headers": CORS_HEADERS,
        "body": json.dumps({
            "uploadUrl": upload_url,
            "fileKey": file_key
        })
    }


# =======================
# LIST FILES HANDLER
# =======================
def list_files_handler(event, context):
    params = event.get("queryStringParameters") or {}
    username = params.get("username")

    if not username:
        return {
            "statusCode": 400,
            "headers": CORS_HEADERS,
            "body": json.dumps({"message": "username is required"})
        }

    response = s3.list_objects_v2(
        Bucket=BUCKET,
        Prefix=f"{username}/"
    )

    files = [obj["Key"] for obj in response.get("Contents", [])]

    return {
        "statusCode": 200,
        "headers": CORS_HEADERS,
        "body": json.dumps({"files": files})
    }


# =======================
# DOWNLOAD HANDLER
# =======================
def download_handler(event, context):
    params = event.get("queryStringParameters") or {}
    file_key = params.get("fileKey")

    if not file_key:
        return {
            "statusCode": 400,
            "headers": CORS_HEADERS,
            "body": json.dumps({"message": "fileKey is required"})
        }

    download_url = s3.generate_presigned_url(
        "get_object",
        Params={"Bucket": BUCKET, "Key": file_key},
        ExpiresIn=3600
    )

    return {
        "statusCode": 200,
        "headers": CORS_HEADERS,
        "body": json.dumps({"downloadUrl": download_url})
    }