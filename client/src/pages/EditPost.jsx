import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Select, Button } from "flowbite-react";
import Editor from "../components/Editor";
import "../styles/ckeditor5-content.css";
import { useSelector } from "react-redux";

export default function EditPost() {
  const editorRef = useRef(null);
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [postContent, setPostContent] = useState("");
  const { currentUser } = useSelector((state) => state.user);
  const { postId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  console.log(formData);

  const handlePublish = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `/api/post/editpost/${postId}/${currentUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      setPublishError(null);
      navigate(`/publish-post/${formData.slug}`);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(
        `/api/post/editpost/${postId}/${currentUser._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }
      setPublishError(null);

      if (fromPublish) {
        navigate(`/publish-post/${formData.slug}`);
      } else {
        navigate(
          `${
            formData.isDraft ? "/dashboard?tab=drafts" : "/dashboard?tab=posts"
          }`,
          { state: { message: "Post saved successfully" } }
        );
      }
    } catch (error) {
      console.error("Error editing post:", error);
    }
  };

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/post/getpost?postId=${postId}`);
        const data = await res.json();

        if (!res.ok) {
          setError(true);
          setLoading(false);
          return;
        }
        setError(null);
        setLoading(false);
        setPostContent(data.posts[0].content);
        setFormData({
          _id: data.posts[0]._id,
          title: data.posts[0].title,
          category: data.posts[0].category,
          content: data.posts[0].content,
          isDraft: data.posts[0].isDraft,
          slug: data.posts[0].slug,
        });
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    fetchPost();
  }, [postId]);

  const fromPublish = location.state?.fromPublish;
  console.log(fromPublish);

  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl font-semibold">Edit Post</h1>
      <form className="flex flex-col gap-4" onSubmit={handlePublish}>
        <div className="flex items-center justify-center">
          <Editor
            data={postContent}
            onChange={(content) => {
              const parser = new DOMParser();
              const doc = parser.parseFromString(content, "text/html");
              const h1 = doc.querySelector("h1");
              const title = h1 ? h1.textContent : `draft_${Date.now()}`;
              setFormData((prevData) => ({ ...prevData, content, title }));
            }}
          />
        </div>
        <div className="flex flex-col gap-4 justify-center items-center">
          <Select
            className=""
            value={formData.category || "uncategorized"}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <option value="uncategorized">Select a category</option>
            <option value="cat1">Option 1</option>
            <option value="cat2">Option 2</option>
            <option value="cat3">Option 3</option>
            <option value="cat4">Option 4</option>
          </Select>
        </div>
        <div className=" mt-auto flex space-x-4 justify-between p-3">
          <Button
            onClick={(e) => {
              e.preventDefault();
              navigate(-1);
            }}
            className="flex-grow"
            type="submit"
            gradientDuoTone="purpleToPink"
          >
            Cancel
          </Button>
          <Button
            className="flex-grow"
            onClick={handleSave}
            type="submit"
            gradientDuoTone="purpleToPink"
          >
            Save
          </Button>
          {formData.isDraft && !fromPublish && (
            <Button
              className="flex-grow"
              onClick={handlePublish}
              type="submit"
              gradientDuoTone="purpleToPink"
            >
              Publish
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
