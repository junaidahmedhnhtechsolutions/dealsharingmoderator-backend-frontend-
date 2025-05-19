import { useState } from "react";
import _ from "lodash";
import { toast } from "react-toastify";
import { Filter } from "bad-words";

import GradientText from "../../components/common/GradientText";
import CommentReportsModal from "../common/CommentReportsModal";
import CommentBox from "./CommentBox";
import endpoints from "../../helper/endpoints";

import { CommentType, DealType } from "../../helper/types";
import { useAuth } from "../../context/AuthContext";
import { apiPost } from "../../services/apiMethods";

type PropsType = {
  deal: DealType;
  fetchDealById: () => void;
};

const CommentSection = ({ deal, fetchDealById }: PropsType) => {
  const { user } = useAuth();
  const isVendor = user?.role === "Vendor";
  const isReviewComments = user?.permissions?.includes("review_comments");

  const filter = new Filter();

  const [selectedComment, setSelectedComment] = useState<CommentType>(
    {} as CommentType
  );
  const [replyComment, setReplyComment] = useState<CommentType>(
    {} as CommentType
  );

  const handleDeleteComment = async (comment: CommentType) => {
    if (isVendor && !isReviewComments) {
      return toast.info("You don't have permission to review comments.");
    }

    apiPost({
      endpoint: endpoints.deleteComment(comment?.id ?? ""),
      payload: {},
      onSuccess: (data: any) => {
        toast.success(data?.message);
        fetchDealById();
      },
    });
  };

  const handleReplyOnComment = async (
    { reply }: { reply: string },
    {
      setSubmitting,
      resetForm,
    }: { setSubmitting: (bool: boolean) => void; resetForm: () => void }
  ) => {
    if (isVendor && !isReviewComments) {
      return toast.info("You don't have permission to review comments.");
    }

    const payload = {
      product_id: deal?.id,
      comment: filter.clean(reply),
    };

    apiPost({
      endpoint: endpoints.replyToComment(replyComment?.id ?? ""),
      payload,
      onSuccess: (data: any) => {
        toast.success(data.message);
        resetForm();
        fetchDealById();
      },
      onFinally: () => {
        setSubmitting(false);
      },
    });
  };

  return (
    <>
      <CommentReportsModal
        selectedComment={selectedComment}
        isOpen={Boolean(selectedComment?.comment)}
        onClose={() => setSelectedComment({} as CommentType)}
      />

      <div>
        <h3 className="mb-4 font-semibold text-2xl text-gray-800 dark:text-white/90">
          <GradientText>Comments</GradientText>
        </h3>

        <div className="space-y-4">
          {deal?.comments?.map((item, index) => {
            // const isLastIndex = index === deal?.comments?.length - 1;
            const isLastIndex = deal?.comments?.length === index + 1;

            return (
              <div key={item.id}>
                <CommentBox
                  data={item}
                  setReplyComment={setReplyComment}
                  handleDeleteComment={handleDeleteComment}
                  handleReplyOnComment={handleReplyOnComment}
                />

                {!_.isEmpty(item.reported_comments) && (
                  <button
                    className="font-semibold mt-2"
                    onClick={() => setSelectedComment(item)}
                  >
                    <GradientText>
                      {`${item?.reported_comments?.length} Reports`}
                    </GradientText>
                  </button>
                )}

                {!isLastIndex && (
                  <div className="border-b border-gray-200 dark:border-gray-800 mt-4" />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default CommentSection;
