import { withAuthenticator } from "@aws-amplify/ui-react";
import { useEffect, useState, useMemo } from "react";
import { fetchAuthSession } from "aws-amplify/auth";
import "@aws-amplify/ui-react/styles.css";
import "./App.css";

// Components
import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import UploadCard from "./components/UploadCard";
import StatsCards from "./components/StatsCards";
import FileList from "./components/FileList";
import EmptyState from "./components/EmptyState";
import { ToastProvider, useToast } from "./components/ToastContext";

function Dashboard({ signOut }) {
  const [email, setEmail] = useState("");
  const [files, setFiles] = useState([]);
  
  // UI States
  const [searchTerm, setSearchTerm] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [deletingFiles, setDeletingFiles] = useState(new Set());
  const [sharingFiles, setSharingFiles] = useState(new Set());
  
  const { addToast } = useToast();

  const API_BASE = "https://9t38vahg3f.execute-api.us-east-1.amazonaws.com/Prod";

  useEffect(() => {
    initializeUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      addToast("Failed to load files", "error");
    }
  }

  // =========================
  // UPLOAD FILE
  // =========================
  async function handleUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
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

      addToast("File uploaded successfully");
      loadFiles(); // refresh list
    } catch (error) {
      console.error("Upload error:", error);
      addToast("Upload failed", "error");
    } finally {
      setIsUploading(false);
      event.target.value = null; // reset input
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
      addToast("Download failed", "error");
    }
  }

  // =========================
  // SHARE FILE
  // =========================
  async function handleShare(fileKey) {
    setSharingFiles(prev => new Set(prev).add(fileKey));
    try {
      const token = await getAuthToken();

      const response = await fetch(
        `${API_BASE}/download?fileKey=${encodeURIComponent(fileKey)}&share=true`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to get share URL");
      }

      const data = await response.json();
      await navigator.clipboard.writeText(data.downloadUrl);
      addToast("Share link copied!");
    } catch (error) {
      console.error("Share error:", error);
      addToast("Failed to copy share link", "error");
    } finally {
      setSharingFiles(prev => {
        const next = new Set(prev);
        next.delete(fileKey);
        return next;
      });
    }
  }

  // =========================
  // DELETE FILE
  // =========================
  async function handleDelete(fileKey) {
    if (!window.confirm("Are you sure you want to delete this file?")) return;

    setDeletingFiles(prev => new Set(prev).add(fileKey));
    try {
      const token = await getAuthToken();

      const response = await fetch(
        `${API_BASE}/delete?fileKey=${encodeURIComponent(fileKey)}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to delete file");
      }

      addToast("File deleted successfully!");
      loadFiles(); // Refresh the list
    } catch (error) {
      console.error("Delete error:", error);
      addToast(`Delete failed: ${error.message}`, "error");
    } finally {
      setDeletingFiles(prev => {
        const next = new Set(prev);
        next.delete(fileKey);
        return next;
      });
    }
  }

  // Client-side search logic
  const filteredFiles = useMemo(() => {
    if (!searchTerm) return files;
    const lowerTerm = searchTerm.toLowerCase();
    return files.filter(f => f.toLowerCase().includes(lowerTerm));
  }, [files, searchTerm]);

  return (
    <div className="app-container">
      <Sidebar />
      <div className="main-content">
        <Header 
          email={email} 
          signOut={signOut} 
          searchTerm={searchTerm} 
          setSearchTerm={setSearchTerm} 
        />
        
        <div className="dashboard-content">
          <div className="dashboard-scroll-container">
            <div className="welcome-section">
              <h1>Welcome, {email ? email.split('@')[0] : 'User'} 👋</h1>
              <p>Manage your files securely in the cloud.</p>
            </div>

            <UploadCard onUpload={handleUpload} isUploading={isUploading} />
            
            <StatsCards totalFiles={files.length} />

            {files.length === 0 ? (
              <EmptyState onUpload={handleUpload} isUploading={isUploading} />
            ) : (
              <FileList 
                files={filteredFiles} 
                onDownload={handleDownload}
                onShare={handleShare}
                onDelete={handleDelete}
                deletingFiles={deletingFiles}
                sharingFiles={sharingFiles}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function App({ signOut }) {
  return (
    <ToastProvider>
      <Dashboard signOut={signOut} />
    </ToastProvider>
  );
}

export default withAuthenticator(App);