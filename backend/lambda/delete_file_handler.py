import json
import boto3

s3 = boto3.client('s3')
BUCKET_NAME = "YOUR_BUCKET_NAME"

def lambda_handler(event, context):

    body = json.loads(event['body'])
    file_key = body['fileKey']

    s3.delete_object(Bucket=BUCKET_NAME, Key=file_key)

    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin": "*"
        },
        "body": json.dumps({"message": "File deleted successfully"})
    }
