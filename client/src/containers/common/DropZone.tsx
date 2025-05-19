import { useDropzone } from "react-dropzone";
import { useFormikContext } from "formik";
import { LuUpload } from "react-icons/lu";
import { IoClose } from "react-icons/io5";
import _ from "lodash";

type DropzoneProps = {
  name: string;
};

const DropzoneComponent: React.FC<DropzoneProps> = ({ name }) => {
  const { setFieldValue, values } = useFormikContext<any>();

  const onDrop = async (acceptedFiles: File[]) => {
    const mappedFiles = await Promise.all(
      acceptedFiles.map(async (file) => ({
        file: file,
        preview: URL.createObjectURL(file),
      }))
    );
    setFieldValue(name, [...values[name], ...mappedFiles]);
  };

  const handleRemove = (index: number) => {
    const updatedImages = [...values[name]];
    const removed = updatedImages.splice(index, 1);
    // Clean up memory
    URL.revokeObjectURL(removed[0].preview);
    setFieldValue(name, updatedImages);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [],
      "image/jpeg": [],
      "image/webp": [],
      "image/svg+xml": [],
    },
  });

  // Clean up on unmount
  // useEffect(() => {
  //   return () => {
  //     values[name]?.forEach((img: any) => URL.revokeObjectURL(img.preview));
  //   };
  // }, [values, name]);

  return (
    <div className="transition border border-gray-300 border-dashed cursor-pointer dark:hover:border-brand-500 dark:border-gray-700 rounded-xl hover:border-brand-500">
      <div
        {...getRootProps()}
        className={`dropzone rounded-xl border-dashed border-gray-300 p-7 lg:p-10 ${
          isDragActive
            ? "border-brand-500 bg-gray-100 dark:bg-gray-800"
            : "border-gray-300 bg-gray-50 dark:border-gray-700 dark:bg-gray-900"
        }`}
        id="demo-upload"
      >
        <input {...getInputProps()} />

        {_.isEmpty(values[name]) ? (
          <div className="dz-message flex flex-col items-center m-0!">
            <div className="mb-[22px] flex justify-center">
              <div className="flex h-[68px] w-[68px] items-center justify-center rounded-full bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-400">
                <LuUpload />
              </div>
            </div>
            <h4 className="mb-3 font-semibold text-gray-800 text-theme-xl dark:text-white/90">
              {isDragActive ? "Drop Files Here" : "Drag & Drop Files Here"}
            </h4>
            <span className="text-center mb-5 block w-full max-w-[290px] text-sm text-gray-700 dark:text-gray-400">
              Drag & drop your PNG, JPG, WebP, SVG images here or browse
            </span>
          </div>
        ) : (
          <div className="flex gap-3 flex-wrap">
            {values[name]?.map(
              ({ preview }: { preview: string }, index: number) => (
                <div
                  key={index}
                  onClick={(e) => e.stopPropagation()}
                  className="relative min-w-24 max-w-24 h-24"
                >
                  <img
                    src={preview}
                    // src={img.preview}
                    alt="preview"
                    className="w-full h-full rounded-md object-cover border"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemove(index)}
                    className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-red-500 transition"
                  >
                    <IoClose />
                  </button>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DropzoneComponent;
