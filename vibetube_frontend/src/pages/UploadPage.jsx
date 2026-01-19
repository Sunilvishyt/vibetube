import React, { useState } from "react";
import {
  Upload,
  X,
  Loader2,
  CheckCircle,
  AlertTriangle,
  Video,
  Image,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
// IMPORTANT: Replace this with the actual URL of your FastAPI endpoint
const UPLOAD_URL = `${BASE_URL}/upload-video`;

const UploadPage = () => {
  // State for form inputs and file
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(""); // New: Category state
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null); // New: Thumbnail file state

  // State for UI/Feedback
  const [isUploading, setIsUploading] = useState(false);
  const [status, setStatus] = useState(null); // {type: 'success' | 'error' | 'info', message: string}
  const navigate = useNavigate();

  const CATEGORIES = [
    { value: "", label: "Select Category" },
    { value: "education", label: "Education" },
    { value: "gaming", label: "Gaming" },
    { value: "vlogs", label: "Vlogs" },
    { value: "music", label: "Music" },
    { value: "tech", label: "Tech & Science" },
    { value: "entertainment", label: "Entertainment" },
    { value: "news", label: "News & Politics" },
  ];

  const uploadVideo = async (e) => {
    e.preventDefault();

    if (!videoFile) {
      setStatus({ type: "error", message: "Please select a video file." });
      return;
    }
    if (!title.trim()) {
      setStatus({ type: "error", message: "Title is required." });
      return;
    }
    // Thumbnail is often optional, but we can enforce it if needed.
    if (!thumbnailFile) {
      setStatus({ type: "error", message: "Please select a thumbnail image." });
      return;
    }

    setIsUploading(true);
    setStatus({
      type: "info",
      message:
        "Preparing and uploading... This may take a moment for large files.",
    });

    // 1. Create a FormData object for multipart/form-data
    const formData = new FormData();

    // 2. Append the fields. Keys MUST match FastAPI parameters:
    // File 1: 'video'
    formData.append("video", videoFile, videoFile.name);

    // NEW: File 2: 'thumbnail'.
    // NOTE: You must update your FastAPI endpoint to accept this field:
    // thumbnail: UploadFile = File(...)

    formData.append("thumbnail", thumbnailFile, thumbnailFile.name);

    // Form fields
    formData.append("title", title.trim());
    if (description.trim()) {
      formData.append("description", description.trim());
    }
    // NEW: Category field
    formData.append("category", category);

    const accessToken = localStorage.getItem("access_token");

    if (!accessToken) {
      setStatus({
        type: "error",
        message: "Authentication failed: Access token not found.",
      });
      setIsUploading(false);
      navigate("/auth/login");
    }

    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    try {
      // 3. Send the request
      const response = await fetch(UPLOAD_URL, {
        method: "POST",
        body: formData,
        headers: headers,
      });

      const result = await response.json();

      if (response.ok) {
        setStatus({
          type: "success",
          message: "Video uploaded successfully!",
        });
        // Clear form after success
        setTitle("");
        setDescription("");
        setCategory("");
        setVideoFile(null);
        setThumbnailFile(null);
      } else {
        // Handle API error messages
        const detail = result.detail || JSON.stringify(result);
        setStatus({ type: "error", message: `Upload Failed: ${detail}` });
      }
    } catch (error) {
      setStatus({
        type: "error",
        message: `Network Error: Could not connect to the server. ${error.message}`,
      });
    } finally {
      setIsUploading(false);
    }
  };

  // Helper component to render file input area
  const FileInputArea = ({ file, setFile, id, label, icon: Icon, accept }) => (
    <div
      className="border-2 border-dashed rounded-lg p-6 transition duration-150"
      style={{
        borderColor: "var(--border)",
        backgroundColor: "var(--muted)",
        cursor: "pointer",
      }}
    >
      <label
        htmlFor={id}
        className="block text-sm font-medium mb-2"
        style={{ color: "var(--foreground)" }}
      >
        {label}
      </label>
      <input
        type="file"
        id={id}
        accept={accept}
        onChange={(e) => setFile(e.target.files[0] || null)}
        className="hidden"
      />

      <div className="flex flex-col items-center justify-center space-y-3">
        <Icon className="w-8 h-8" style={{ color: "var(--primary)" }} />
        <p
          className="text-center text-sm"
          style={{ color: "var(--muted-foreground)" }}
        >
          {file ? (
            <span className="font-semibold" style={{ color: "var(--primary)" }}>
              {file.name}
            </span>
          ) : (
            `Click to select ${label.toLowerCase()}`
          )}
        </p>

        <label
          htmlFor={id}
          className="cursor-pointer px-4 py-2 text-sm font-semibold rounded-lg transition duration-150"
          style={{
            backgroundColor: "var(--primary)",
            color: "var(--primary-foreground)",
          }}
        >
          {file ? `Change ${label}` : `Select ${label}`}
        </label>
      </div>
      {file && (
        <button
          type="button"
          onClick={() => setFile(null)}
          className="mt-3 w-full text-sm flex justify-center items-center space-x-1"
          style={{ color: "var(--destructive)" }}
        >
          <X className="w-4 h-4" />
          <span>Remove {label}</span>
        </button>
      )}
    </div>
  );

  // Helper component to render status messages
  const StatusDisplay = ({ status }) => {
    if (!status) return null;

    const baseClass = "p-3 rounded-lg flex items-center space-x-3";
    let icon, style;

    switch (status.type) {
      case "success":
        icon = <CheckCircle className="w-5 h-5" />;
        // Using chart-1 as a distinct success color, with a muted background
        style = {
          backgroundColor: "oklch(0.3 0.05 43)",
          color: "var(--chart-1)",
        };
        break;
      case "error":
        icon = <AlertTriangle className="w-5 h-5" />;
        style = {
          backgroundColor: "oklch(0.3 0.05 25.33)",
          color: "var(--destructive)",
        };
        break;
      case "info":
        icon = <Loader2 className="w-5 h-5 animate-spin" />;
        style = {
          backgroundColor: "oklch(0.3 0.05 38.76)",
          color: "var(--primary)",
        };
        break;
      default:
        return null;
    }

    return (
      <div className={`${baseClass}`} style={style}>
        {icon}
        <span className="text-sm font-medium">{status.message}</span>
      </div>
    );
  };

  return (
    <>
      <div>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full relative left-50 top-20 z-50 hover:bg-muted/50 scale-120"
          onClick={() => navigate("/")}
        >
          <ArrowLeft size={48} />
        </Button>
      </div>
      <div
        style={{ backgroundColor: "var(--background)" }}
        className="min-h-screen flex items-center justify-center p-4"
      >
        <div
          className="w-full max-w-lg p-8 rounded-xl shadow-2xl"
          style={{
            backgroundColor: "var(--popover)", // Use popover for card background
            color: "var(--card-foreground)", // Use card-foreground for text
            borderRadius: "var(--radius)",
          }}
        >
          <h1
            className="text-3xl font-extrabold mb-8 text-center"
            style={{ color: "var(--foreground)" }}
          >
            VibeTube Video Uploader
          </h1>

          <form onSubmit={uploadVideo} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Video File Input */}
              <FileInputArea
                id="video-upload"
                label="Video File"
                icon={Video}
                accept="video/*"
                file={videoFile}
                setFile={setVideoFile}
              />

              {/* Thumbnail File Input */}
              <FileInputArea
                id="thumbnail-upload"
                label="Thumbnail Image"
                icon={Image}
                accept="image/*"
                file={thumbnailFile}
                setFile={setThumbnailFile}
              />
            </div>

            {/* Title Input */}
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--foreground)" }}
              >
                Video Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="A concise, engaging title"
                required
                className="w-full p-3 rounded-lg focus:ring-2 focus:ring-offset-2"
                style={{
                  backgroundColor: "var(--card)",
                  color: "var(--card-foreground)",
                  borderColor: "var(--border)",
                  borderWidth: "1px",
                  borderRadius: "var(--radius)",
                  boxShadow: "none",
                  "--tw-ring-color": "var(--ring)",
                  "--tw-ring-offset-color": "var(--popover)",
                }}
              />
            </div>

            {/* Category Dropdown */}
            <div>
              <label
                htmlFor="category"
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--foreground)" }}
              >
                Category
              </label>
              <select
                id="category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full p-3 rounded-lg focus:ring-2 focus:ring-offset-2"
                style={{
                  backgroundColor: "var(--card)",
                  color: "var(--card-foreground)",
                  borderColor: "var(--border)",
                  borderWidth: "1px",
                  borderRadius: "var(--radius)",
                  boxShadow: "none",
                  "--tw-ring-color": "var(--ring)",
                  "--tw-ring-offset-color": "var(--popover)",
                }}
              >
                {CATEGORIES.map((cat) => (
                  <option
                    key={cat.value}
                    value={cat.value}
                    style={{
                      backgroundColor: "var(--card)",
                      color: "var(--card-foreground)",
                    }}
                  >
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Description Input */}
            <div>
              <label
                htmlFor="description"
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--foreground)" }}
              >
                Description (Optional)
              </label>
              <textarea
                id="description"
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell viewers what your video is about"
                className="w-full p-3 rounded-lg focus:ring-2 focus:ring-offset-2"
                style={{
                  backgroundColor: "var(--card)",
                  color: "var(--card-foreground)",
                  borderColor: "var(--border)",
                  borderWidth: "1px",
                  borderRadius: "var(--radius)",
                  boxShadow: "none",
                  "--tw-ring-color": "var(--ring)",
                  "--tw-ring-offset-color": "var(--popover)",
                }}
              ></textarea>
            </div>

            {/* Status Area */}
            <StatusDisplay status={status} />

            {/* Upload Button */}
            <button
              type="submit"
              disabled={
                isUploading ||
                !videoFile ||
                !title.trim() ||
                !thumbnailFile ||
                !category
              }
              className="w-full py-3 px-4 text-white font-semibold rounded-lg transition duration-150 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                backgroundColor: "var(--primary)",
                color: "var(--primary-foreground)",
                borderRadius: "var(--radius)",
              }}
            >
              {isUploading && <Loader2 className="w-5 h-5 animate-spin" />}
              <span>{isUploading ? "Processing..." : "Start Upload"}</span>
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default UploadPage;
