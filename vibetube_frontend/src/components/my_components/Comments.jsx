// Comments.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Comments({ videoId }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchComments();
  }, [videoId]);

  async function fetchComments() {
    try {
      const res = await axios.get(`http://localhost:8000/comments/${videoId}`);
      setComments(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  async function postComment(e) {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      if (!token) {
        navigate("/login", { replace: true });
      }
      const res = await axios.post(
        "http://localhost:8000/comment",
        { video_id: videoId, text: text },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setText("");
      // append new comment
      setComments((prev) => [res.data, ...prev]);
    } catch (err) {
      console.error(err);
      alert("Failed to post comment");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form onSubmit={postComment} className="flex-row gap-3 items-start">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="flex-1 p-2 border rounded w-full bg-input mb-1 text-amber-50"
          rows={2}
          placeholder="Add a public comment..."
        />
        <button
          disabled={loading}
          className="px-3 py-1  bg-primary text-white rounded w-full cursor-pointer"
        >
          Post Comment
        </button>
      </form>

      <div className="mt-5 space-y-3">
        {comments.map((c) => (
          <div key={c.id} className="flex gap-3">
            <img
              src={c.user?.avatar || "https://placehold.co/40x40"}
              className="h-8 w-8 rounded-full object-cover"
              alt={c.user?.username}
            />
            <div>
              <div className="text-sm font-semibold">{c.user?.username}</div>
              <div className="text-sm text-muted-foreground">{c.text}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
