import { Link } from "react-router";
import Button from "../../components/ui/button/Button";
import { DealType } from "../../helper/types";
import { calculateDiscountPercentage, getDealUser } from "../../helper/utils";

type PropsType = {
  data: DealType;
  isLoading?: boolean;
};

export default function DealCard(props: PropsType) {
  const { data } = props;

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03] p-4 md:p-4 flex sm:flex-row flex-col items-center gap-4">
      <div className="flex items-center justify-center min-w-60 w-60 h-60 rounded-xl">
        <img
          alt="icon"
          className="w-60 h-60 rounded-xl object-cover object-center"
          src={
            data?.deal_images && data?.deal_images[0].image_url
              ? data?.deal_images[0].image_url
              : "/images/placeholderImg.jpg"
          }
        />
      </div>
      <div className="flex-1 space-y-2">
        <h4 className="font-bold text-gray-800 text-theme-xl dark:text-white/90 line-clamp-2">
          {data?.title}
        </h4>

        {data?.type === "Discount_Only" ? (
          <p className="flex items-center gap-2 mb-2">
            {data?.voucher_type === "Discount" && (
              <span className="text-title-sm font-bold text-transparent bg-clip-text bg-gradient">
                {data?.discount_price}% Off
              </span>
            )}

            {data?.voucher_type === "Reduction" && (
              <span className="text-title-sm font-bold text-transparent bg-clip-text bg-gradient">
                {data?.reduction_price} AED
              </span>
            )}

            {data?.voucher_type === "Free_Shipping" && (
              <span className="text-title-sm font-bold text-transparent bg-clip-text bg-gradient">
                Free Shipping
              </span>
            )}

            {data?.voucher_type === "Freebie" && (
              <span className="text-title-sm font-bold text-transparent bg-clip-text bg-gradient">
                Freebie
              </span>
            )}
          </p>
        ) : (
          <p className="flex items-center gap-2">
            {data?.next_price ? (
              <>
                <span className="text-title-sm font-bold text-transparent bg-clip-text bg-gradient">
                  {data?.price} AED
                </span>
                <span className="text-xl font-semibold line-through">
                  &nbsp;{data?.next_price}&nbsp;
                </span>
                <span>
                  <span>
                    -
                    {calculateDiscountPercentage(data?.price, data?.next_price)}
                    %
                  </span>
                </span>
              </>
            ) : (
              <span className="text-title-sm font-bold text-transparent bg-clip-text bg-gradient">
                {data?.price} AED
              </span>
            )}
          </p>
        )}

        <div
          className="text-base text-gray-500 dark:text-gray-400 line-clamp-3"
          dangerouslySetInnerHTML={{ __html: data?.description_html ?? "" }}
        />

        <div className="flex items-center justify-between">
          <div className="flex flex-col items-start text-theme-sm text-gray-500 dark:text-gray-400">
            <span>{getDealUser(data)?.username}</span>
            <span className="font-normal">{getDealUser(data)?.email}</span>
          </div>

          <Link to={data?.deal_link ?? "#"}>
            <Button size="sm" className="bg-gradient !py-2">
              Redirect to link
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
