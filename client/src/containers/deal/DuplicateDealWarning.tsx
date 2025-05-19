import Button from "../../components/ui/button/Button";
import { DealType } from "../../helper/types";

const title = "Has this already been posted?";
const description =
  "It looks like this deal was already posted or is in review. Duplicate deals are usually merged.";

type PropsType = {
  deal?: DealType;
  onCancel?: (deal?: DealType) => void;
  onProceed?: (deal?: DealType) => void;
};

const DuplicateDealWarning = (props: PropsType) => {
  const { deal, onCancel, onProceed } = props;

  return (
    <div className="p-4 border shadow-xl rounded-2xl dark:bg-[var(--color-gray-900)] dark:border-[var(--color-gray-700)] dark:text-[var(--color-white)] text-[var(--color-black)]">
      <div title={title}>
        <h3 className="text-xl">{title}</h3>
        <p className="text-base opacity-70">{description}</p>
        <div className="flex items-center gap-4 my-6 p-2 rounded-md bg-white/10">
          <img
            alt="Deal image"
            src={
              deal?.deal_images && deal?.deal_images[0]?.image_url
                ? deal?.deal_images[0]?.image_url
                : "/assets/images/placeholderImg.jpg"
            }
            className="w-20 h-20 rounded-md"
          />
          <div className="flex flex-col">
            <h3 className="text-xl font-bold line-clamp-1">{deal?.title}</h3>
            <div
              className="text-base line-clamp-2"
              dangerouslySetInnerHTML={{
                __html: deal?.description_html ?? "",
              }}
            />
          </div>
        </div>

        <div className="flex items-center justify-end gap-4">
          <Button variant="outline" onClick={() => onProceed?.(deal)}>
            No, proceed to the next step
          </Button>
          <Button className="bg-gradient" onClick={() => onCancel?.(deal)}>
            Yes, cancel submission
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DuplicateDealWarning;
