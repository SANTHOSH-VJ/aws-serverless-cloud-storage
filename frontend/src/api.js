// ===============================
// AWS API CONFIGURATION
// ===============================

// Replace with your deployed API Gateway URL
const BASE_URL = "https://YOUR_API_ID.execute-api.YOUR_REGION.amazonaws.com/prod";


// ===============================
// UPLOAD FILE (Generate Pre-Signed URL)
// ===============================

export async function getUploadUrl(fileName) {

    const response = await fetch(`${BASE_URL}/upload`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            fileName: fileName
        })
    });

    return await response.json();
}


// ===============================
// LIST FILES
// ===============================

export async function getFiles() {

    const response = await fetch(`${BASE_URL}/files`);
    return await response.json();
}


// ===============================
// DOWNLOAD FILE
// ===============================

export async function getDownloadUrl(fileKey) {

    const response = await fetch(
        `${BASE_URL}/download?fileKey=${encodeURIComponent(fileKey)}`
    );

    return await response.json();
}


// ===============================
// DELETE FILE
// ===============================

export async function deleteFile(fileKey) {

    const response = await fetch(`${BASE_URL}/delete`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            fileKey: fileKey
        })
    });

    return await response.json();
}
