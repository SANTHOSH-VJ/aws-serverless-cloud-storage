import json
import boto3
import os

s3 = boto3.client("s3")
BUCKET = os.environ["BUCKET_NAME"]

def lambda_handler(event, context):
    user_prefix = "santhosh/"

    response = s3.list_objects_v2(
        Bucket=BUCKET,
        Prefix=user_prefix
    )

    files = []

    if "Contents" in response:
        for obj in response["Contents"]:
            files.append(obj["Key"])

    return {
        "statusCode": 200,
        "headers": {
            "Content-Type": "application/json"
        },
        "body": json.dumps({
            "files": files
        })
    }
