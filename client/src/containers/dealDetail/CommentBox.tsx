import { useState } from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import OutsideClickHandler from "react-outside-click-handler";
import { LuReply } from "react-icons/lu";
import { GoTrash } from "react-icons/go";
import { IoSend } from "react-icons/io5";

import Button from "../../components/ui/button/Button";
import FormikFormField from "../common/FormikFormField";
import { CommentType } from "../../helper/types";

const initialValues = {
  reply: "",
};

const validationSchema = Yup.object({
  reply: Yup.string().required("Reply cannot be empty."),
});

type PropsType = {
  data: CommentType;
  handleReplyOnComment: (
    values: { reply: string },
    formikHelpers: {
      setSubmitting: (isSubmitting: boolean) => void;
      resetForm: () => void;
    }
  ) => void;
  handleDeleteComment?: (comment: CommentType) => void;
  setReplyComment?: (comment: CommentType) => void;
};

const CommentBox = ({
  data,
  handleReplyOnComment,
  handleDeleteComment,
  setReplyComment,
}: PropsType) => {
  const [showReplyInput, setShowReplyInput] = useState(false);

  const toggleReplyInput = () => {
    setShowReplyInput((prev) => !prev);
  };

  return (
    <div>
      <div className="flex items-center gap-3 text-gray-700 dark:text-gray-400">
        <img
          alt="User"
          src="/images/userPlaceholder.png"
          className="rounded-full h-11 w-11"
        />
        <div className="flex flex-col">
          <span className="font-medium text-theme-sm">
            {data?.users?.username}
          </span>
          <span className="text-theme-sm">{data?.users?.email}</span>
        </div>
      </div>

      <p className="mt-2 text-base text-gray-800 dark:text-white/80">
        {data?.comment}
      </p>

      <div className="flex items-center gap-4 mt-2">
        <button
          onClick={() => {
            toggleReplyInput();
            setReplyComment?.(data);
          }}
          className="flex items-center gap-1 text-base dark:text-white/50 hover:text-pink dark:hover:text-pink"
        >
          <LuReply />
          <span>Reply</span>
        </button>

        <button
          onClick={() => handleDeleteComment?.(data)}
          className="flex items-center gap-1 text-base dark:text-white/50 hover:text-pink dark:hover:text-pink"
        >
          <GoTrash />
          <span>Delete</span>
        </button>
      </div>

      {showReplyInput && (
        <OutsideClickHandler onOutsideClick={() => setShowReplyInput(false)}>
          <Formik
            validateOnBlur={true}
            validateOnChange={true}
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleReplyOnComment}
          >
            {({ isSubmitting }) => (
              <Form className="flex items-center gap-2 my-2">
                <FormikFormField name="reply" hideErrorMsg />
                <Button
                  size="sm"
                  type="submit"
                  loading={isSubmitting}
                  className="bg-gradient !rounded-full !p-1 w-10 h-10"
                >
                  <IoSend className="text-lg text-white" />
                </Button>
              </Form>
            )}
          </Formik>
        </OutsideClickHandler>
      )}
    </div>
  );
};

export default CommentBox;
