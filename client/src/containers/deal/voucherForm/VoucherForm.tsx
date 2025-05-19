import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import Label from "../../../components/form/Label";
import Select from "../../../components/form/Select";
import DropzoneComponent from "../../common/DropZone";
import Button from "../../../components/ui/button/Button";
import FormikFormField from "../../common/FormikFormField";
import ComponentCard from "../../../components/common/ComponentCard";
import { sortByDate } from "../../../helper/utils";
import { CategoryType, DealType, LocationType } from "../../../helper/types";
import { useCheckDuplicateDeal } from "../../../hooks/useCheckDuplicateDeal";
import DealFormOfflineSection from "../dealForm/DealFormOfflineSection";
import DealFormOnlineSection from "../dealForm/DealFormOnlineSection";
import FormikFormNumField from "../../common/FormikFormNumField";
import voucherValidationSchema from "./voucherValidationSchema";
import Checkbox from "../../../components/form/input/Checkbox";
import DuplicateDealWarning from "../DuplicateDealWarning";
import TextEditor from "../../textEditor/TextEditor";
import Tabs from "../../../components/common/Tabs";
import endpoints from "../../../helper/endpoints";
import { useNavigate } from "react-router";
import _ from "lodash";
import { apiGet, apiPost } from "../../../services/apiMethods";

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

export default function VoucherForm(props: PropsType) {
  const { fetchDeals, toggleDealForm, selectedDeal, setSelectedDeal } = props;

  const navigate = useNavigate();

  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categoryOptions, setCategoryOptions] = useState<OptionType[]>([]);

  const isForEdit = selectedDeal?.id;

  const initialValues = {
    code: selectedDeal?.discount_code ?? "",
    link: selectedDeal?.deal_link ?? "",
    title: selectedDeal?.title ?? "",
    type: selectedDeal?.voucher_type ?? "",
    merchant: selectedDeal?.merchant ?? "",
    categoryId: selectedDeal?.category_id ?? "",
    description: selectedDeal?.description_html ?? "",
    discount: selectedDeal?.discount_price ?? "", // for "Discount"
    reduction: selectedDeal?.reduction_price ?? "", // for "Reduction"
    shippingCost: selectedDeal?.delivery_charges ?? "",
    shippingCountry: selectedDeal?.shipping_country ?? "",
    isOnline: true,
    locations: selectedDeal?.deal_locations ?? [], // required if not online
    images:
      selectedDeal?.deal_images?.map((img) => ({ preview: img?.image_url })) ??
      [],
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

  const handleSubmit = async (
    values: typeof initialValues,
    { setSubmitting }: { setSubmitting: (bool: boolean) => void }
  ) => {
    const formData = new FormData();

    formData.append("discount_code", values.code);
    formData.append("deal_link", values.link);
    formData.append("title", values.title);
    formData.append("type", "Discount_Only");
    formData.append("merchant", values.merchant);
    // @ts-ignore
    formData.append("category_id", values.categoryId || "");
    formData.append("description_html", values.description || "");
    formData.append("voucher_type", values.type || "");

    if (values.type === "Discount") {
      formData.append("discount_price", values.discount);
    } else if (values.type === "Reduction") {
      // @ts-ignore
      formData.append("reduction_price", values.reduction);
    }

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

    if (isForEdit) formData.append("_method", "PUT");

    const endpoint = isForEdit
      ? endpoints.updateDeal(selectedDeal?.id ?? "")
      : endpoints.createDeal;

    apiPost({
      endpoint,
      payload: formData,
      onSuccess: (data: any) => {
        if (isForEdit) setSelectedDeal({});
        toast.success(data?.message);
        fetchDeals?.();
        toggleDealForm();
      },
      onFinally: () => {
        setSubmitting(false);
      },
    });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <ComponentCard
      title={`${isForEdit ? "Edit" : "Create"} Voucher`}
      className="max-w-2xl mx-auto"
    >
      <Formik
        validateOnBlur={true}
        validateOnChange={true}
        initialValues={initialValues}
        validationSchema={voucherValidationSchema}
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

          const handleVoucherTypeChange = (selectedType: string) => {
            setFieldValue("type", selectedType);
            if (selectedType !== "Discount") {
              setFieldValue("discount", "");
              // setFieldError("discount", "");
            }

            if (selectedType !== "Reduction") {
              setFieldValue("reduction", "");
              // setFieldError("reduction", "");
            }
          };

          return (
            <Form className="space-y-4">
              {isDuplicate && (
                <DuplicateDealWarning
                  deal={duplicateDeal}
                  onProceed={() => setIsDuplicate(false)}
                  onCancel={() => navigate(-1)}
                />
              )}

              <FormikFormField
                label="Voucher Code"
                name="code"
                placeholder="Provide a short description of your voucher"
              />

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

              <FormikFormField
                isRequired
                label="Title"
                name="title"
                placeholder="Provide a short description of your voucher"
              />

              <div>
                <Label>
                  Voucher Type <span className="text-error-500">*</span>
                </Label>
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col gap-4">
                    <div className="flex sm:items-center sm:flex-row flex-col gap-2">
                      <div className="flex-1">
                        <Checkbox
                          label="Discount (%)"
                          checked={values.type === "Discount"}
                          onChange={(val) =>
                            handleVoucherTypeChange(val ? "Discount" : "")
                          }
                        />
                      </div>
                      {values.type === "Discount" && (
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <div className="w-20">
                              <FormikFormNumField
                                name="discount"
                                hideErrorMsg
                              />
                            </div>
                            <span className="text-xs text-gray-700 dark:text-gray-400">
                              % - enter discount
                            </span>
                          </div>
                          <ErrorMessage
                            name="discount"
                            component="div"
                            className="text-red-500 text-xs mt-1"
                          />
                        </div>
                      )}
                    </div>

                    <div className="flex sm:items-center sm:flex-row flex-col gap-2">
                      <div className="flex-1">
                        <Checkbox
                          label="Reduction (AED)"
                          checked={values.type === "Reduction"}
                          onChange={(val) =>
                            handleVoucherTypeChange(val ? "Reduction" : "")
                          }
                        />
                      </div>

                      {values.type === "Reduction" && (
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <div className="w-20">
                              <FormikFormNumField
                                name="reduction"
                                hideErrorMsg
                              />
                            </div>
                            <span className="text-xs text-gray-700 dark:text-gray-400">
                              0.00 – enter reduction amount
                            </span>
                          </div>
                          <ErrorMessage
                            name="reduction"
                            component="div"
                            className="text-red-500 text-xs mt-1"
                          />
                        </div>
                      )}
                    </div>

                    <Checkbox
                      label="Free Shipping"
                      checked={values.type === "Free_Shipping"}
                      onChange={(val) =>
                        handleVoucherTypeChange(val ? "Free_Shipping" : "")
                      }
                    />
                    <Checkbox
                      label="Freebie"
                      checked={values.type === "Freebie"}
                      onChange={(val) =>
                        handleVoucherTypeChange(val ? "Freebie" : "")
                      }
                    />
                  </div>
                </div>
                <ErrorMessage
                  name="type"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              {/* category & subcategory */}
              <div className="flex gap-2 sm:flex-row flex-col">
                <FormikFormField
                  isRequired
                  label="Retailer/Merchant"
                  name="merchant"
                  placeholder="Enter the retailer or merchant offering your voucher"
                />
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
                  <>
                    <DealFormOnlineSection />
                  </>
                ) : (
                  <DealFormOfflineSection
                    locations={values?.locations}
                    setFieldValue={setFieldValue}
                  />
                )}
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <Label className="!mb-0">Voucher Information</Label>
                  <button
                    type="button"
                    className="text-sm font-medium text-gray-700/50 dark:text-gray-400/50 hover:text-gray-700 dark:hover:text-gray-400/50"
                    onClick={() => {
                      setFieldValue("description", "");
                    }}
                  >
                    Clear
                  </button>
                </div>
                <TextEditor
                  value={values.description}
                  onChange={(value) => setFieldValue("description", value)}
                  placeholder={"Provide relevant details for your voucher"}
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
