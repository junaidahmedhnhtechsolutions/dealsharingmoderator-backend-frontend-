import FormikFormField from "../../common/FormikFormField";
import FormikFormNumField from "../../common/FormikFormNumField";

const DealFormOnlineSection = () => {
  return (
    <div className="flex gap-2 sm:flex-row flex-col">
      <FormikFormNumField
        label="Shipping Cost"
        name="shippingCost"
        placeholder="0.00"
        startContent="AED"
      />
      <FormikFormField
        label="Shipping Country"
        name="shippingCountry"
        placeholder="Enter the country"
      />
    </div>
  );
};

export default DealFormOnlineSection;
