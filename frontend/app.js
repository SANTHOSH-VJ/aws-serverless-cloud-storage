import {
  getUploadUrl,
  getFiles,
  getDownloadUrl,
  deleteFile
} from "./src/api.js";


// ===============================
// UPLOAD FILE
// ===============================

async function uploadFile() {

  const fileInput = document.getElementById("fileInput");
  const file = fileInput.files[0];

  if (!file) {
    alert("Please select a file first");
    return;
  }

  try {

    // Step 1: Get pre-signed upload URL
    const data = await getUploadUrl(file.name);

    // Step 2: Upload file directly to S3
    await fetch(data.uploadUrl, {
      method: "PUT",
      body: file
    });

    alert("File uploaded successfully ✅");

    fileInput.value = "";
    loadFiles();

  } catch (error) {
    console.error(error);
    alert("Upload failed ❌");
  }
}


// ===============================
// LOAD FILE LIST
// ===============================

async function loadFiles() {

  try {

    const files = await getFiles();

    const list = document.getElementById("fileList");
    list.innerHTML = "";

    if (files.length === 0) {
      list.innerHTML = "<li>No files uploaded</li>";
      return;
    }

    files.forEach(file => {

      const li = document.createElement("li");

      li.innerHTML = `
        ${file}
        <button onclick="downloadFile('${file}')">Download</button>
        <button onclick="removeFile('${file}')">Delete</button>
      `;

      list.appendChild(li);
    });

  } catch (error) {
    console.error(error);
    alert("Failed to load files ❌");
  }
}


// ===============================
// DOWNLOAD FILE
// ===============================

async function downloadFile(fileKey) {

  try {

    const data = await getDownloadUrl(fileKey);
    window.open(data.downloadUrl, "_blank");

  } catch (error) {
    console.error(error);
    alert("Download failed ❌");
  }
}


// ===============================
// DELETE FILE
// ===============================

async function removeFile(fileKey) {

  const confirmDelete = confirm("Are you sure you want to delete this file?");

  if (!confirmDelete) return;

  try {

    await deleteFile(fileKey);

    alert("File deleted successfully ✅");
    loadFiles();

  } catch (error) {
    console.error(error);
    alert("Delete failed ❌");
  }
}


// ===============================
// INITIAL LOAD
// ===============================

// Make functions accessible to HTML buttons
window.uploadFile = uploadFile;
window.downloadFile = downloadFile;
window.removeFile = removeFile;

// Load file list on page load
loadFiles();
