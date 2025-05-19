import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import "./styles.css";

type PropsType = {
  value: string;
  placeholder?: string;
  onChange: (text?: string) => void;
};

const TextEditor = (props: PropsType) => {
  const { value, onChange, placeholder } = props;

  return (
    <div id="textEditor">
      <ReactQuill value={value} onChange={onChange} placeholder={placeholder} />
    </div>
  );
};

export default TextEditor;
