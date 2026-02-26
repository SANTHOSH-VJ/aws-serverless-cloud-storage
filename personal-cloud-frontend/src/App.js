import { withAuthenticator } from "@aws-amplify/ui-react";
import { useEffect, useState } from "react";
import { fetchAuthSession } from "aws-amplify/auth";
import "@aws-amplify/ui-react/styles.css";
import "./App.css";

function App({ signOut }) {
  const [email, setEmail] = useState("");
  const [files, setFiles] = useState([]);

  const API_BASE =
    "https://9t38vahg3f.execute-api.us-east-1.amazonaws.com/Prod";

  useEffect(() => {
    initializeUser();
  }, []);

  async function initializeUser() {
    const session = await fetchAuthSession();
    const userEmail = session.tokens.idToken.payload.email;
    setEmail(userEmail);
    loadFiles(userEmail);
  }

  async function getAuthToken() {
    const session = await fetchAuthSession();
    return session.tokens.idToken.toString();
  }

  // =========================
  // LOAD FILES
  // =========================
  async function loadFiles(userEmailParam) {
    try {
      const token = await getAuthToken();
      const userEmail = userEmailParam || email;

      const response = await fetch(
        `${API_BASE}/list?username=${encodeURIComponent(userEmail)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch files");
      }

      const data = await response.json();
      setFiles(data.files || []);
    } catch (error) {
      console.error("Load files error:", error);
    }
  }

  // =========================
  // UPLOAD FILE
  // =========================
  async function handleUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    try {
      const token = await getAuthToken();

      // Step 1: Get presigned URL
      const uploadResponse = await fetch(`${API_BASE}/upload`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          username: email,
          filename: file.name,
        }),
      });

      if (!uploadResponse.ok) {
        throw new Error("Failed to get upload URL");
      }

      const uploadData = await uploadResponse.json();

      // Step 2: Upload to S3
      const s3Response = await fetch(uploadData.uploadUrl, {
        method: "PUT",
        headers: {
          "Content-Type": file.type || "application/octet-stream",
        },
        body: file,
      });

      if (!s3Response.ok) {
        throw new Error("S3 upload failed");
      }

      alert("Upload successful!");
      loadFiles(); // refresh list
    } catch (error) {
      console.error("Upload error:", error);
      alert("Upload failed. Check console.");
    }
  }

  // =========================
  // DOWNLOAD FILE
  // =========================
  async function handleDownload(fileKey) {
    try {
      const token = await getAuthToken();

      const response = await fetch(
        `${API_BASE}/download?fileKey=${encodeURIComponent(fileKey)}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get download URL");
      }

      const data = await response.json();

      window.open(data.downloadUrl, "_blank");
    } catch (error) {
      console.error("Download error:", error);
      alert("Download failed.");
    }
  }

  return (
    <div style={{ padding: 20 }} className="home">
      <h2 className="heading">Welcome {email}</h2>
      <div className="home-container">
        <h3>Upload File</h3>
        <div className="input-container">
          <input type="file" onChange={handleUpload} />
        </div>
        <h3 className="your-files">Your Files</h3>
        {files.length === 0 ? (
          <p>No files uploaded yet.</p>
        ) : (
          <ul className="list">
            {files.map((file, index) => (
              <li key={index} className="list-item">
                {file}
                <button
                  style={{ marginLeft: 10 }}
                  onClick={() => handleDownload(file)}
                  className="download-button"
                >
                  Download
                </button>
              </li>
            ))}
          </ul>
        )}

        <br />
        <div className="sign-out-container">
          <button onClick={signOut} className="sign-out-button">Sign Out</button>
        </div>
      </div>
    </div>
  );
}

export default withAuthenticator(App);