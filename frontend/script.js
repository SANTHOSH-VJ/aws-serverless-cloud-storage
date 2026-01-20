const API_URL = "YOUR_API_GATEWAY_URL";

async function uploadFile() {

  const file = document.getElementById("fileInput").files[0];

  const res = await fetch(API_URL + "/upload", {
    method: "POST",
    body: JSON.stringify({ fileName: file.name })
  });

  const data = await res.json();

  await fetch(data.uploadUrl, {
    method: "PUT",
    body: file
  });

  alert("Upload Successful");
  loadFiles();
}

async function loadFiles() {

  const res = await fetch(API_URL + "/files");
  const files = await res.json();

  let list = document.getElementById("fileList");
  list.innerHTML = "";

  files.forEach(file => {

    let li = document.createElement("li");

    li.innerHTML = `
      ${file}
      <button onclick="downloadFile('${file}')">Download</button>
      <button onclick="deleteFile('${file}')">Delete</button>
    `;

    list.appendChild(li);
  });
}

async function downloadFile(fileKey) {

  const res = await fetch(API_URL + `/download?fileKey=${fileKey}`);
  const data = await res.json();

  window.open(data.downloadUrl);
}

async function deleteFile(fileKey) {

  await fetch(API_URL + "/delete", {
    method: "DELETE",
    body: JSON.stringify({ fileKey })
  });

  alert("Deleted");
  loadFiles();
}

loadFiles();
