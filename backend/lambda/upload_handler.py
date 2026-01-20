import json
import boto3
import uuid

s3 = boto3.client('s3')

BUCKET_NAME = "YOUR_BUCKET_NAME"

def lambda_handler(event, context):
    
    body = json.loads(event['body'])
    file_name = body['fileName']

    unique_name = str(uuid.uuid4()) + "-" + file_name

    url = s3.generate_presigned_url(
        ClientMethod='put_object',
        Params={
            'Bucket': BUCKET_NAME,
            'Key': unique_name
        },
        ExpiresIn=3600
    )

    return {
        "statusCode": 200,
        "headers": {
            "Access-Control-Allow-Origin": "*"
        },
        "body": json.dumps({
            "uploadUrl": url,
            "fileKey": unique_name
        })
    }
