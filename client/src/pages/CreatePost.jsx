import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextInput, Select, Button } from "flowbite-react";
import Editor from "../components/Editor";

export default function CreatePost() {
  const [editorContent, setEditorContent] = useState("");
  const [formData, setFormData] = useState({});
  const [publishError, setPublishError] = useState(null);
  console.log(formData);

  const [category, setCategory] = useState("uncategorized");
  const navigate = useNavigate();

  const handlePublish = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/post/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) {
        setPublishError(data.message);
        return;
      }

      if (res.ok) {
        setPublishError(null);
        navigate(`/publish-post/${data.slug}`);
      }
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };
  return (
    <div className="p-3 max-w-3xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl font-semibold">Create Post</h1>
      <form className="flex flex-col gap-4">
        <div className="flex items-center justify-center">
          <Editor
            onChange={(content) => {
              // Parse the HTML content
              const parser = new DOMParser();
              const doc = parser.parseFromString(content, "text/html");

              // Extract the first <h1> tag
              const h1 = doc.querySelector("h1");
              const title = h1 ? h1.textContent : `draft_${Date.now()}`;

              // Update the formData state
              setFormData({ ...formData, content: content, title });
            }}
          />
        </div>
        <div className="flex flex-col gap-4  justify-center items-center">
          <Select
            value={category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
          >
            <option value="uncategorized">Select a category </option>
            <option value="cat1">Option 1</option>
            <option value="cat2">Option 2</option>
            <option value="cat3">Option 3</option>
            <option value="cat4">Option 4</option>
          </Select>
        </div>
        <Button
          type="submit"
          onClick={handlePublish}
          gradientDuoTone="purpleToPink"
        >
          Publish
        </Button>
      </form>
    </div>
  );
}
