// import "react-image-gallery/styles/css/image-gallery.css";
// import ImageGallery from "react-image-gallery";
import { DealType } from "../../helper/types";
import { useMemo } from "react";
import _ from "lodash";

type PropsType = {
  deal?: DealType;
};

const DetailImages = ({ deal }: PropsType) => {
  const images = useMemo(() => {
    return (
      deal?.deal_images?.map((item) => ({
        original: item?.image_url,
        thumbnail: item?.image_url,
      })) || []
    );
  }, [deal]);

  return (
    <div className="flex flex-wrap items-center justify-center gap-4">
      {images?.map((image) => (
        <img
          src={image.original}
          alt="Deal Image"
          className="w-40 h-40 rounded-lg"
        />
      ))}
    </div>
  );

  // return (
  //   <div
  //     id="ImageGallery"
  //     className="w-full flex items-center"
  //     // className="w-full max-h-[500px] overflow-hidden rounded-lg"
  //   >
  //     {_.isEmpty(images) ? (
  //       <img
  //         alt="Product"
  //         src="/assets/images/placeholderImg.jpg"
  //         className="w-full sm:max-h-80 max-h-60 rounded-lg object-cover"
  //       />
  //     ) : (
  //       <ImageGallery
  //         showBullets
  //         // @ts-ignore
  //         items={images}
  //         showThumbnails={true}
  //         showPlayButton={false}
  //       />
  //     )}
  //   </div>
  // );
};

export default DetailImages;
