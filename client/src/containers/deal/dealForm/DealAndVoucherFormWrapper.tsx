import { useEffect } from "react";
import Tabs from "../../../components/common/Tabs";
import { DealType } from "../../../helper/types";
import NewDealForm from "./NewDealForm";
import VoucherForm from "../voucherForm/VoucherForm";

type TabType = "deal" | "voucher";

const tapOptions = [
  { label: "Deal", value: "deal" },
  { label: "Voucher", value: "voucher" },
];

type PropsType = {
  tab: TabType | string;
  handleSelectTab?: (tab: TabType | string) => void;

  setDeals: Function;
  fetchDeals: Function;
  selectedDeal: DealType;
  setSelectedDeal: Function;
  toggleDealForm: () => void;
};

const DealAndVoucherFormWrapper = (props: PropsType) => {
  const {
    tab,
    handleSelectTab,

    fetchDeals,
    toggleDealForm,
    selectedDeal,
    setSelectedDeal,
  } = props;

  useEffect(() => {
    if (selectedDeal?.type === "Discount_Only") {
      handleSelectTab?.("voucher");
    }
  }, [selectedDeal]);

  return (
    <div>
      {!selectedDeal?.id && (
        <div className="max-w-sm mx-auto mb-4">
          <Tabs
            value={tab}
            options={tapOptions}
            onChange={(val) => handleSelectTab?.(val)}
          />
        </div>
      )}
      <div className={tab === "deal" ? "block" : "hidden"}>
        <NewDealForm
          fetchDeals={fetchDeals}
          selectedDeal={selectedDeal}
          toggleDealForm={toggleDealForm}
          setSelectedDeal={setSelectedDeal}
        />
      </div>
      <div className={tab === "voucher" ? "block" : "hidden"}>
        <VoucherForm
          fetchDeals={fetchDeals}
          selectedDeal={selectedDeal}
          toggleDealForm={toggleDealForm}
          setSelectedDeal={setSelectedDeal}
        />
      </div>
    </div>
  );
};

export default DealAndVoucherFormWrapper;
