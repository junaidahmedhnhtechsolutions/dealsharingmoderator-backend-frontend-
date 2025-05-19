import { useEffect, useMemo, useState } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import { toast } from "react-toastify";
import { calculateDiscountPercentage, sortByDate } from "../../../helper/utils";
import {
  CategoryType,
  LocationType,
  DealType,
  MetaType,
} from "../../../helper/types";
import ComponentCard from "../../../components/common/ComponentCard";
import FormikFormField from "../../common/FormikFormField";
import Button from "../../../components/ui/button/Button";
import DropzoneComponent from "../../common/DropZone";
import Select from "../../../components/form/Select";
import Label from "../../../components/form/Label";
import endpoints from "../../../helper/endpoints";
import newDealValidationSchema from "./newDealValidationSchema";
import DealFormOfflineSection from "./DealFormOfflineSection";
import DealFormOnlineSection from "./DealFormOnlineSection";
import TextEditor from "../../textEditor/TextEditor";
import Tabs from "../../../components/common/Tabs";
import { apiGet, apiPost, fetchMetadata } from "../../../services/apiMethods";
import { useCheckDuplicateDeal } from "../../../hooks/useCheckDuplicateDeal";
import FormikFormNumField from "../../common/FormikFormNumField";
import DuplicateDealWarning from "../DuplicateDealWarning";
import { useNavigate } from "react-router";
import _ from "lodash";

type OptionType = {
  value: string;
  label: string;
};

type PropsType = {
  fetchDeals: Function;
  selectedDeal: DealType;
  setSelectedDeal: Function;
  toggleDealForm: () => void;
};

export default function NewDealForm(props: PropsType) {
  const { fetchDeals, toggleDealForm, selectedDeal, setSelectedDeal } = props;

  const navigate = useNavigate();

  const [meta, setMeta] = useState<MetaType>({});
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState<OptionType[]>([]);

  const isForEdit = selectedDeal?.id;

  const editInitialValues = {
    link: selectedDeal?.deal_link ?? "",
    title: selectedDeal?.title ?? "",
    price: selectedDeal?.price ?? "",
    nextPrice: selectedDeal?.next_price ?? "",
    merchant: selectedDeal?.merchant ?? "",
    voucher: selectedDeal?.discount_code ?? "",
    categoryId: selectedDeal?.category_id ?? "",
    isOnline: true,
    description: selectedDeal?.description_html ?? "",
    startDate: selectedDeal?.start_date ?? "",
    endDate: selectedDeal?.expire_date ?? "",
    shippingCost: selectedDeal?.delivery_charges ?? "",
    shippingCountry: selectedDeal?.shipping_country ?? "",
    locations: selectedDeal?.deal_locations ?? [],
    images:
      selectedDeal?.deal_images?.map((img) => ({ preview: img?.image_url })) ??
      [],
  };

  const initialValues = useMemo(
    () => ({
      link: "",
      price: "",
      nextPrice: "",
      merchant: "",
      voucher: "",
      categoryId: "",
      isOnline: true,
      startDate: "",
      endDate: "",
      shippingCost: "",
      shippingCountry: "",
      locations: [],
      title: meta?.title ?? "",
      description: meta?.description ?? "",
      images: meta?.image
        ? _.isArray(meta?.image)
          ? meta?.image?.map((img) => ({ preview: img }))
          : [{ preview: meta?.image }]
        : [],
    }),
    [meta]
  );

  const handleFetchMeta = async (url: string) => {
    fetchMetadata({
      url,
      onSuccess: (data: any) => {
        setMeta(data);
      },
    });
  };

  const fetchCategories = async () => {
    setCategoryLoading(true);

    apiGet({
      endpoint: endpoints.getCategory,
      onSuccess: (data: any) => {
        const fetchedCategories = data.data || [];
        setCategoryOptions(
          // @ts-ignore
          sortByDate(
            fetchedCategories.map((item: CategoryType) => ({
              value: String(item.id),
              label: item.name,
            }))
          )
        );
      },
      onFinally: () => {
        setCategoryLoading(false);
      },
    });
  };

  const handleCreateDeal = async (formData: FormData) => {
    apiPost({
      endpoint: endpoints.createDeal,
      payload: formData,
      onSuccess: (data: any) => {
        toast.success(data?.message);
        fetchDeals?.();
        toggleDealForm();
      },
    });
  };

  const handleEditDeal = async (formData: FormData) => {
    apiPost({
      endpoint: endpoints.updateDeal(selectedDeal?.id ?? ""),
      payload: formData,
      onSuccess: (data: any) => {
        toast.success(data?.message);
        setSelectedDeal({});
        fetchDeals?.();
        toggleDealForm();
      },
    });
  };

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: { setSubmitting: (bool: boolean) => void }
  ) => {
    const formData = new FormData();

    formData.append("deal_link", values.link);
    formData.append("title", values.title);
    formData.append("price", values.price);
    // @ts-ignore
    formData.append("next_price", values?.nextPrice);
    formData.append("merchant", values.merchant);
    formData.append("discount_code", values.voucher || "");
    // @ts-ignore
    formData.append("category_id", values?.categoryId || "");
    // @ts-ignore
    formData.append("description_html", values.description || "");
    formData.append("start_date", values.startDate || "");
    formData.append("expire_date", values.endDate || "");

    if (values?.isOnline) {
      formData.append("delivery_charges", values.shippingCost || "");
      formData.append("shipping_country", values.shippingCountry || "");
    } else {
      values.locations?.forEach((loc: LocationType, index: number) => {
        if (loc?.address && loc?.lat && loc?.lng) {
          // @ts-ignore
          formData.append(`locations[${index}][address]`, loc?.address);
          // @ts-ignore
          formData.append(`locations[${index}][lat]`, loc?.lat);
          // @ts-ignore
          formData.append(`locations[${index}][lng]`, loc?.lng);
        }
      });
    }

    // Images
    values.images?.forEach((img: any, index: number) => {
      if (img?.file) {
        formData.append(`images[${index}]`, img.file);
      }
    });

    try {
      if (isForEdit) {
        formData.append("_method", "PUT");
        await handleEditDeal(formData);
      } else {
        await handleCreateDeal(formData);
      }
    } catch (error) {
      console.error("Deal form submit error:", error);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <ComponentCard
      title={`${isForEdit ? "Edit" : "Create"} Deal`}
      className="max-w-2xl mx-auto"
    >
      <Formik
        // @ts-ignore
        initialValues={isForEdit ? editInitialValues : initialValues}
        validateOnBlur
        validateOnChange
        enableReinitialize
        validationSchema={newDealValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue, values }) => {
          const { isDuplicate, duplicateDeal, setIsDuplicate } =
            useCheckDuplicateDeal({
              link: values.link,
              title: values?.title,
              isCallable: !Boolean(isForEdit),
            });

          useEffect(() => {
            if (_.isEmpty(selectedDeal?.deal_locations)) return;

            setFieldValue("isOnline", false);
          }, [selectedDeal?.deal_locations]);

          return (
            <Form className="space-y-4">
              {isDuplicate && (
                <DuplicateDealWarning
                  deal={duplicateDeal}
                  onProceed={() => setIsDuplicate(false)}
                  onCancel={() => navigate(-1)}
                />
              )}

              {!isForEdit && (
                <div className="flex items-center gap-2 w-full">
                  <div className="flex-1">
                    <FormikFormField
                      label="Link"
                      name="link"
                      placeholder="https://"
                    />
                    <p className="text-xs mt-1 block text-gray-700 dark:text-gray-400">
                      If you do not have a link proceed as below
                    </p>
                  </div>
                  <Button
                    size="sm"
                    isDisabled={!values.link}
                    className="bg-gradient h-fit"
                    onClick={() => handleFetchMeta(values.link)}
                  >
                    Extract
                  </Button>
                </div>
              )}

              <FormikFormField
                isRequired
                label="Title"
                name="title"
                placeholder="Provide a short description of your deal"
              />

              <div className="flex gap-2 sm:flex-row flex-col">
                <FormikFormNumField
                  label="Price"
                  name="price"
                  placeholder="0.00"
                  startContent="AED"
                />
                <FormikFormNumField
                  startContent="AED"
                  label="Next Available Price"
                  name="nextPrice"
                  placeholder="0.00"
                  endContent={
                    <>
                      <span>
                        {calculateDiscountPercentage(
                          Number(values?.price),
                          Number(values?.nextPrice)
                        )}
                      </span>
                      <span> % </span>
                    </>
                  }
                />
              </div>

              <div className="flex gap-2 sm:flex-row flex-col">
                <FormikFormField
                  isRequired
                  label="Retailer/Merchant"
                  name="merchant"
                  placeholder="Enter the retailer or merchant offering your deal"
                />
                <FormikFormField
                  label="Voucher"
                  name="voucher"
                  placeholder="Enter any applicable voucher codes relevant to your deal"
                />
              </div>

              {/* category */}
              <div className="w-full">
                <Label>
                  Select Category <span className="text-error-500">*</span>
                </Label>
                <Select
                  options={
                    categoryLoading
                      ? [{ label: "Loading...", value: "" }]
                      : categoryOptions
                  }
                  onChange={(value: string) =>
                    setFieldValue("categoryId", value)
                  }
                  className="dark:bg-dark-900"
                  placeholder="Select a category most applicable to your deal"
                  // @ts-ignore
                  defaultValue={values.categoryId}
                />
                <ErrorMessage
                  name="categoryId"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              <div className="space-y-4 my-6">
                <Tabs
                  value={values.isOnline ? "online" : "offline"}
                  options={[
                    { label: "Online", value: "online" },
                    { label: "Offline", value: "offline" },
                  ]}
                  onChange={(val) =>
                    setFieldValue("isOnline", val === "online")
                  }
                />
                {values.isOnline ? (
                  <DealFormOnlineSection />
                ) : (
                  <>
                    <DealFormOfflineSection
                      setFieldValue={setFieldValue}
                      locations={values?.locations}
                    />
                  </>
                )}
              </div>

              <div className="">
                <div className="flex items-center justify-between mb-1.5">
                  <Label className="!mb-0">Deal Information</Label>
                  <button
                    type="button"
                    className="text-sm font-medium text-gray-700/50 dark:text-gray-400/50 hover:text-gray-700 dark:hover:text-gray-400/50"
                    onClick={() => setFieldValue("description", "")}
                  >
                    Clear
                  </button>
                </div>
                <TextEditor
                  value={values.description}
                  onChange={(value) => setFieldValue("description", value)}
                  placeholder={"Provide relevant details for your deal"}
                />
              </div>

              {/* dropzone */}
              <div>
                <Label>Images</Label>
                <DropzoneComponent name="images" />
                <ErrorMessage
                  name="images"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              {/* dates */}
              <div className="flex gap-2 sm:flex-row flex-col">
                <FormikFormField
                  // type="date"
                  type="datetime-local"
                  label="Start Date"
                  name="startDate"
                  placeholder="--/--/--"
                />
                <FormikFormField
                  // type="date"
                  type="datetime-local"
                  label="End Date"
                  name="endDate"
                  placeholder="--/--/--"
                />
              </div>

              <div className="flex justify-center">
                <Button
                  size="sm"
                  type="submit"
                  loading={isSubmitting}
                  className="bg-gradient px-10"
                >
                  {isSubmitting ? "Yalla!..." : "Yalla!"}
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </ComponentCard>
  );
}
