import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import "../styles/ckeditor5-content.css";
import { TextInput, Datepicker, ToggleSwitch, Button } from "flowbite-react";

const PublishPost = () => {
  const { postSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [postContent, setPostContent] = useState("");
  const [title, setTitle] = useState("");
  const [images, setImages] = useState([]);
  const [defaultImage, setDefaultImage] = useState("");
  const [leftWidth, setLeftWidth] = useState("50%");
  const [isResizing, setIsResizing] = useState(false);
  const containerRef = useRef(null);
  const [scheduleDate, setScheduleDate] = useState(null);

  const minLeftWidth = 200;
  const minRightWidth = 200;

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
          setImages(data.images || "");
        }
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPost();
  }, [postSlug]);

  useEffect(() => {
    if (postContent) {
      // Extract the first <h1> tag as the title
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = postContent;
      const h1 = tempDiv.querySelector("h1");
      setTitle(h1 ? h1.textContent : "");

      // Extract all images
      const imgTags = tempDiv.querySelectorAll("img");
      const imgSrcs = Array.from(imgTags).map((img) => img.src);
      setImages(imgSrcs);
    }
  }, [postContent]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isResizing) return;

      const containerOffsetLeft = containerRef.current.offsetLeft;
      const pointerRelativeXpos = e.clientX - containerOffsetLeft;
      const containerWidth = containerRef.current.clientWidth;

      const newLeftWidth = Math.max(
        (pointerRelativeXpos / containerWidth) * 100,
        (minLeftWidth / containerWidth) * 100
      );
      const newRightWidth = Math.max(
        ((containerWidth - pointerRelativeXpos) / containerWidth) * 100,
        (minRightWidth / containerWidth) * 100
      );

      if (newLeftWidth + newRightWidth <= 100) {
        setLeftWidth(`${newLeftWidth}%`);
      }

      console.log("leftWidth:", newLeftWidth, "rightWidth:", newRightWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  const handleMouseDown = () => {
    setIsResizing(true);
  };

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

  const handleDelete = async () => {};
  return (
    <div className="min-h-screen">
      <h1 className="text-center text-3xl font-semibold">Publish Post</h1>
      <div ref={containerRef} className="h-screen flex">
        <div
          className={`m-3 no-scrollbar flex-shrink-0 flex items-center justify-center overflow-auto border-4
             border-[#3B3B98] rounded-lg ${isResizing ? "unselectable" : ""}`}
          style={{ width: leftWidth }}
        >
          <div className="p-4 h-full w-full ck-content no-tailwindcss-base">
            <div
              className="p-4 h-full"
              dangerouslySetInnerHTML={{ __html: postContent }}
            />
          </div>
        </div>

        <div
          className="w-5 bg-black cursor-col-resize"
          onMouseDown={handleMouseDown}
        ></div>
        <div className="flex flex-col">
          <div
            className={`m-3 flex-grow flex justify-center ${
              isResizing ? "unselectable" : ""
            } border-4
             border-[#3B3B98] rounded-lg `}
          >
            <div className="p-4 text-xl font-bold mt-7 overflow-auto">
              <h3 className="text-lg font-semibold mb-2">Post Title</h3>
              <TextInput
                id="title"
                label="Title"
                value={title}
                required
              ></TextInput>

              <div className="mb-4 ">
                <h3 className="mt-4 text-lg font-semibold mb-2">
                  Default Image:
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  {images.length > 0 ? (
                    images.map((src, index) => (
                      <div key={index} className="flex flex-col items-center">
                        <img
                          src={src}
                          alt={`Image ${index}`}
                          className="w-28 h-Wauto mb-2 "
                        />
                        <input
                          type="radio"
                          name="defaultImage"
                          value={src}
                          onChange={() => setDefaultImage(src)}
                        />
                      </div>
                    ))
                  ) : (
                    <img src="https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png" />
                  )}
                </div>
                {/*To-DO Add schdule post functionality*/}
                {/* <div>
                <ToggleSwitch></ToggleSwitch>
                <h3 className="mt-4 text-lg font-semibold mb-2">
                  Schedule Date:
                </h3>
                <Datepicker
                  autoHide={false}
                  minDate={new Date()}
                  weekStart={1}
                  selected={scheduleDate}
                  onChange={(date) => setScheduleDate(date)}
                  className="w-full"
                />
              </div> */}
              </div>
            </div>
          </div>
          <div className="mt-auto flex space-x-4 justify-between p-3">
            <Button
              onClick={() => {
                /* Handle edit logic */
              }}
              className="flex-grow"
            >
              Edit
            </Button>
            <Button
              onClick={handlePublish}
              color="success"
              className="flex-grow"
            >
              Publish
            </Button>
            <Button
              onClick={handleDelete}
              color="failure"
              className="flex-grow"
            >
              Delete
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PublishPost;
