import GradientText from "../../components/common/GradientText";
import { DealType } from "../../helper/types";

type PropsType = {
  deal: DealType;
};

const DescriptionSection = ({ deal }: PropsType) => {
  return (
    <div>
      <h3 className="mb-2 font-semibold text-2xl text-gray-800 dark:text-white/90">
        <GradientText>About this Deal</GradientText>
      </h3>
      {deal.description_html && (
        <div
          className="prose max-w-none text-gray-800 dark:text-white/90"
          dangerouslySetInnerHTML={{ __html: deal.description_html }}
        />
      )}
    </div>
  );
};

export default DescriptionSection;
