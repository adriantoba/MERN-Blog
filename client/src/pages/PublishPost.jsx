import { set } from "mongoose";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const PublishPost = () => {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [postContent, setPostContent] = useState("");
  const [title, setTitle] = useState("");
  const [images, setImages] = useState([]);
  const [defaultImage, setDefaultImage] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/getdrafts?slug=${postSlug}`);
        const data = await res.json();
        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        if (res.ok) {
          setError(null);
          setLoading(false);
          setPostContent(data.drafts[0].content);
          setTitle(data.title);
          setImages(data.images);

          // Extract the first <h1> tag as the title
          const tempDiv = document.createElement("div");
          tempDiv.innerHTML = postContent;
          const h1 = tempDiv.querySelector("h1");
          setTitle(h1 ? h1.textContent : "");

          // Extract all images
          const imgTags = tempDiv.querySelectorAll("img");
          const imgSrcs = Array.from(imgTags).map((img) => img.src);
          setImages(imgSrcs);

          console.log(postContent);
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPost();
  }, [postSlug]);

  if (loading) return <p>Loading...</p>;

  const handlePublish = async () => {
    try {
      const response = await fetch("/api/post/publish", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content: postContent, defaultImage }),
      });
      const result = await response.json();
      if (response.ok) {
        // Navigate to the published post or another page
      } else {
        console.error(result.message);
      }
    } catch (error) {
      console.error("Error publishing post:", error);
    }
  };

  return (
    <div>
      <h1>Publish Post</h1>
      <div dangerouslySetInnerHTML={{ __html: postContent }}></div>
      <h2>Title: {title}</h2>
      <h3>Select Default Image</h3>
      {images.map((src, index) => (
        <div key={index}>
          <img src={src} alt={`Image ${index}`} width="100" />
          <input
            type="radio"
            name="defaultImage"
            value={src}
            onChange={() => setDefaultImage(src)}
          />
        </div>
      ))}
      <button onClick={handlePublish}>Publish</button>
    </div>
  );
};

export default PublishPost;
