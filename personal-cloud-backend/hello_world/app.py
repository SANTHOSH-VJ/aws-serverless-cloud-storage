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
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type,Authorization",
    "Access-Control-Allow-Methods": "GET,POST,DELETE,OPTIONS"
}

def get_user_email(event):
    try:
        claims = event.get("requestContext", {}).get("authorizer", {}).get("claims", {})
        return claims.get("email")
    except Exception:
        return None

# =======================
# UPLOAD HANDLER
# =======================
def upload_handler(event, context):
    body = json.loads(event.get("body", "{}"))
    filename = body.get("filename")
    
    # Use the authenticated user's email instead of client-provided username
    user_email = get_user_email(event)

    if not user_email or not filename:
        return {
            "statusCode": 400,
            "headers": CORS_HEADERS,
            "body": json.dumps({"message": "Unauthorized or missing filename"})
        }

    file_key = f"{user_email}/{filename}"

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
    user_email = get_user_email(event)

    if not user_email:
        return {
            "statusCode": 401,
            "headers": CORS_HEADERS,
            "body": json.dumps({"message": "Unauthorized"})
        }

    response = s3.list_objects_v2(
        Bucket=BUCKET,
        Prefix=f"{user_email}/"
    )

    files = [obj["Key"] for obj in response.get("Contents", [])]

    return {
        "statusCode": 200,
        "headers": CORS_HEADERS,
        "body": json.dumps({"files": files})
    }


# =======================
# DOWNLOAD / SHARE HANDLER
# =======================
def download_handler(event, context):
    params = event.get("queryStringParameters") or {}
    file_key = params.get("fileKey")
    is_share = params.get("share") == "true"
    user_email = get_user_email(event)

    if not user_email:
        return {
            "statusCode": 401,
            "headers": CORS_HEADERS,
            "body": json.dumps({"message": "Unauthorized"})
        }

    if not file_key:
        return {
            "statusCode": 400,
            "headers": CORS_HEADERS,
            "body": json.dumps({"message": "fileKey is required"})
        }

    if not file_key.startswith(f"{user_email}/"):
        return {
            "statusCode": 403,
            "headers": CORS_HEADERS,
            "body": json.dumps({"message": "Forbidden: You do not own this file"})
        }

    expires_in = 86400 if is_share else 3600

    download_url = s3.generate_presigned_url(
        "get_object",
        Params={"Bucket": BUCKET, "Key": file_key},
        ExpiresIn=expires_in
    )

    return {
        "statusCode": 200,
        "headers": CORS_HEADERS,
        "body": json.dumps({"downloadUrl": download_url})
    }


# =======================
# DELETE HANDLER
# =======================
def delete_handler(event, context):
    params = event.get("queryStringParameters") or {}
    file_key = params.get("fileKey")
    user_email = get_user_email(event)

    if not user_email:
        return {
            "statusCode": 401,
            "headers": CORS_HEADERS,
            "body": json.dumps({"message": "Unauthorized"})
        }

    if not file_key:
        return {
            "statusCode": 400,
            "headers": CORS_HEADERS,
            "body": json.dumps({"message": "fileKey is required"})
        }

    if not file_key.startswith(f"{user_email}/"):
        return {
            "statusCode": 403,
            "headers": CORS_HEADERS,
            "body": json.dumps({"message": "Forbidden: You do not own this file"})
        }

    try:
        s3.delete_object(Bucket=BUCKET, Key=file_key)
        return {
            "statusCode": 200,
            "headers": CORS_HEADERS,
            "body": json.dumps({"message": "File deleted successfully"})
        }
    except Exception as e:
        return {
            "statusCode": 500,
            "headers": CORS_HEADERS,
            "body": json.dumps({"message": str(e)})
        }