import json
import boto3

s3 = boto3.client('s3')
BUCKET_NAME = "YOUR_BUCKET_NAME"

def lambda_handler(event, context):

    response = s3.list_objects_v2(Bucket=BUCKET_NAME)

    files = []

    if 'Contents' in response:
        for obj in response['Contents']:
            files.append(obj['Key'])

    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin": "*"
        },
        "body": json.dumps(files)
    }
