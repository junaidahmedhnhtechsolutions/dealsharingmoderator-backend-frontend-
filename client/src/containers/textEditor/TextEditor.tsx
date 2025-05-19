import React, { useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./styles.css";

type PropsType = {
  value: string;
  placeholder?: string;
  onChange: (text: string) => void;
};

const TextEditor: React.FC<PropsType> = ({ value, onChange, placeholder }) => {
  const quillRef = useRef<ReactQuill | null>(null);

  const imageHandler = () => {
    const input: HTMLInputElement = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = async () => {
      const file: File | null = input.files ? input.files[0] : null;
      if (file) {
        const reader: FileReader = new FileReader();
        reader.onload = () => {
          const quill = quillRef.current?.getEditor();
          const range = quill?.getSelection();
          if (range && typeof reader.result === "string") {
            quill?.insertEmbed(range.index, "image", reader.result);
          }
        };
        reader.readAsDataURL(file);
      }
    };
  };

  const modules = {
    toolbar: {
      container: [
        [{ header: [1, 2, false] }],
        ["bold", "italic", "underline"],
        ["image", "code-block"],
      ],
      handlers: {
        image: imageHandler,
      },
    },
  };

  return (
    <div id="textEditor">
      <ReactQuill value={value} onChange={onChange} placeholder={placeholder} />
    </div>
  );

  return (
    <div id="textEditor">
      <ReactQuill value={value} onChange={onChange} placeholder={placeholder} />
      <ReactQuill
        ref={quillRef}
        value={value}
        onChange={onChange}
        modules={modules}
        theme="snow"
        placeholder={placeholder}
      />
    </div>
  );
};

export default TextEditor;
