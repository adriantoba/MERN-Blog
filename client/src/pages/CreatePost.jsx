import { useEffect, useMemo, useRef } from "react";
import { TextInput, Select, Button } from "flowbite-react";
import Editor from "../components/Editor";

const savePost = function saveContent() {
  const editorData = Editor.getData(); // Get the data from CKEditor

  // Create a downloadable HTML file
  const blob = new Blob([editorData], { type: "text/html" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "editor-content.html";
  link.click();
};

export default function CreatePost() {
  return (
    <div className="p-2 max-w-5xl mx-auto min-h-screen">
      <h1 className="text-center text-3xl font-semibold">Create Post</h1>
      <form>
        <div className="flex flex-col gap-4 sm:flex-row justify-between">
          <TextInput
            type="text"
            placeholder="Title"
            required
            id="title"
            className="flex-1"
          />
          <Select>
            <option value="uncategorized">Unecategorized </option>
            <option value="cat1">Option 1</option>
            <option value="cat2">Option 2</option>
            <option value="cat3">Option 3</option>
            <option value="cat4">Option 4</option>
          </Select>
        </div>
        <div className="flex items-center justify-center">
          <Editor />
        </div>
      </form>
      <Button type="submit" onClick={savePost}>
        Save
      </Button>
    </div>
  );
}
