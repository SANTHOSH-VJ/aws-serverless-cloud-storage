import json
import boto3

s3 = boto3.client('s3')
BUCKET_NAME = "YOUR_BUCKET_NAME"

def lambda_handler(event, context):

    file_key = event['queryStringParameters']['fileKey']

    url = s3.generate_presigned_url(
        'get_object',
        Params={
            'Bucket': BUCKET_NAME,
            'Key': file_key
        },
        ExpiresIn=3600
    )

    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin": "*"
        },
        "body": json.dumps({"downloadUrl": url})
    }
