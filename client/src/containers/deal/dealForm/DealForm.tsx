import { useCallback, useEffect, useState } from "react";
import { Formik, Form, ErrorMessage } from "formik";
import { toast } from "react-toastify";

import ComponentCard from "../../../components/common/ComponentCard";
import DropzoneComponent from "../../common/DropZone";
import FormikFormField from "../../common/FormikFormField";
import TextArea from "../../../components/form/input/TextArea";
import Button from "../../../components/ui/button/Button";
import dealValidationSchema from "./dealValidationSchema";
import Label from "../../../components/form/Label";
import Select from "../../../components/form/Select";
import endpoints from "../../../helper/endpoints";
import { CategoryType, DealType } from "../../../helper/types";
import { sortByDate } from "../../../helper/utils";
import { useDebounce } from "use-debounce";
import { DEAL_TYPES } from "../../../helper/constants";
import FormikFormNumField from "../../common/FormikFormNumField";
import { apiGet, apiPost } from "../../../services/apiMethods";

type OptionType = {
  value: string;
  label: string;
};

type PropsType = {
  setDeals: Function;
  fetchDeals: Function;
  selectedDeal: DealType;
  setSelectedDeal: Function;
  toggleDealForm: () => void;
};

export default function DealForm({
  fetchDeals,
  toggleDealForm,
  selectedDeal,
  setSelectedDeal,
}: PropsType) {
  const [categoryLoading, setCategoryLoading] = useState(false);
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [categoryOptions, setCategoryOptions] = useState<OptionType[]>([]);

  const initialValues = {
    title: selectedDeal?.title ?? "",
    price: selectedDeal?.price ?? "",
    merchant: selectedDeal?.merchant ?? "",
    categoryId: selectedDeal?.category_id ?? "",
    // subcategoryId: selectedDeal?.subcategory_id ?? "",
    description: selectedDeal?.description_html ?? "",
    dealLink: selectedDeal?.deal_link ?? "",
    images:
      selectedDeal?.deal_images?.map((img) => ({ preview: img?.image_url })) ??
      [],

    // new fields
    discount: selectedDeal?.discount_price ?? "",
    discountCode: selectedDeal?.discount_code ?? "",
    additionalCharges: selectedDeal?.delivery_charges ?? "",
    expireDate: selectedDeal?.expire_date ?? "",
    storeName: selectedDeal?.store_name ?? "",
    type: selectedDeal?.type ?? "",
  };

  const fetchCategories = async () => {
    setCategoryLoading(true);

    apiGet({
      endpoint: endpoints.getCategory,
      onSuccess: (data: any) => {
        const fetchedCategories = data.data || [];
        setCategories(fetchedCategories);
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

  const getSubCategories = useCallback(
    (categoryId: string | number) => {
      const selected = categories.find(
        (cat) => String(cat.id) === String(categoryId)
      );
      return (
        selected?.sub_category?.map((item) => ({
          value: String(item.id),
          label: item.name,
        })) || []
      );
    },
    [categories]
  );

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

    formData.append("title", values.title);
    formData.append("price", values.price);
    formData.append("merchant", values.merchant);
    formData.append("description_html", values.description);
    formData.append("deal_url", values.dealLink);
    formData.append("deal_link", values.dealLink);
    // @ts-ignore
    formData.append("category_id", values.categoryId);
    // @ts-ignore
    formData.append("subcategory_id", values.subcategoryId);
    formData.append("posted", new Date().toISOString());

    values.images?.forEach((img: any, index: number) => {
      if (img.file) {
        formData.append(`images[${index}]`, img.file);
      }
    });

    // new values start
    formData.append("discount_price", values.discount ?? "");
    formData.append("discount_code", values.discountCode ?? "");
    formData.append("delivery_charges", values.additionalCharges ?? "");
    formData.append("expire_date", values.expireDate ?? "");
    formData.append("store_name", values.storeName ?? "");
    formData.append("type", values.type ?? "");
    // new values end

    try {
      if (selectedDeal?.id) {
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

  const handleCheckIsUniqueTitle = async (title: string) => {
    apiPost({
      endpoint: endpoints.uniqueTitle,
      payload: { title },
      onSuccess: (data: any) => {
        toast.success(data?.message);
      },
      onFinally: () => {
        setCategoryLoading(false);
      },
    });
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <ComponentCard
      title={`${selectedDeal?.id ? "Edit" : "Create"} Deal`}
      className="max-w-2xl mx-auto"
    >
      <Formik
        validateOnBlur={true}
        validateOnChange={true}
        initialValues={initialValues}
        validationSchema={dealValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue, values }) => {
          const [debouncedTitle] = useDebounce(values.title, 500);

          useEffect(() => {
            if (debouncedTitle) {
              handleCheckIsUniqueTitle(debouncedTitle);
            }
          }, [debouncedTitle]);

          return (
            <Form className="space-y-4">
              <div>
                <DropzoneComponent name="images" />
                <ErrorMessage
                  name="images[0].preview"
                  component="div"
                  className="text-red-500 text-xs mt-1"
                />
              </div>

              {/* common Fields */}
              <>
                <FormikFormField
                  isRequired
                  label="Title"
                  name="title"
                  placeholder="Deal Title"
                />

                {/* deal type */}
                <div>
                  <Label>
                    Deal Type <span className="text-error-500">*</span>
                  </Label>
                  <Select
                    options={DEAL_TYPES}
                    onChange={(value: string) => setFieldValue("type", value)}
                    className="dark:bg-dark-900"
                    placeholder="Select a Type"
                    // @ts-ignore
                    defaultValue={values.type}
                  />
                  <ErrorMessage
                    name="type"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <FormikFormField
                  isRequired
                  label="Merchant"
                  name="merchant"
                  placeholder="Amazon"
                />

                {/* Category Select */}
                <div>
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
                    placeholder="Select a category"
                    // @ts-ignore
                    defaultValue={values.categoryId}
                  />
                  <ErrorMessage
                    name="categoryId"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                {/* SubCategory Select */}
                <div>
                  <Label>Select Sub Category</Label>
                  <Select
                    // @ts-ignores
                    options={
                      categoryLoading
                        ? [{ label: "Loading...", value: "" }]
                        : getSubCategories(values.categoryId) || []
                    }
                    placeholder="Select a sub category"
                    // @ts-ignore
                    defaultValue={values.subcategoryId}
                    // value={values.subcategoryId}
                    onChange={(value: string) =>
                      setFieldValue("subcategoryId", value)
                    }
                    className="dark:bg-dark-900"
                  />
                  <ErrorMessage
                    name="subcategoryId"
                    component="div"
                    className="text-red-500 text-xs mt-1"
                  />
                </div>

                <FormikFormNumField
                  isRequired
                  name="price"
                  label="Price"
                  placeholder="$99.99"
                />
              </>

              {(values.type === "With_Discount" ||
                values.type === "With_RRP" ||
                values.type === "Discount_Only") && (
                <FormikFormNumField
                  label="Discount"
                  name="discount"
                  placeholder="10%"
                />
              )}

              {values.type === "Discount_Only" && (
                <FormikFormField
                  label="Discount Code"
                  name="discountCode"
                  placeholder={`Kbhv<1`}
                />
              )}

              {values.type === "With_PNP" && (
                <FormikFormNumField
                  label="Additional Charges"
                  name="additionalCharges"
                  placeholder="$99.99"
                />
              )}

              {(values.type === "With_PNP" || values.type === "With_RRP") && (
                <FormikFormField
                  label="Deal Link"
                  name="dealLink"
                  placeholder="https://..."
                />
              )}

              {values.type === "In_Store" && (
                <FormikFormField
                  label="Store Name"
                  name="storeName"
                  placeholder="xyz"
                />
              )}

              {/* common fields */}
              <>
                <FormikFormField
                  type="date"
                  label="Expire Date"
                  name="expireDate"
                  placeholder="--/--/--"
                />

                <div>
                  <Label>
                    Description <span className="text-error-500">*</span>
                  </Label>
                  <TextArea
                    rows={7}
                    placeholder="Description here"
                    value={values.description}
                    onChange={(value) => setFieldValue("description", value)}
                  />
                  <p className="-mt-1 text-end text-sm text-gray-700 dark:text-gray-400">
                    {values?.description?.length ?? 0}/500
                  </p>
                  <ErrorMessage
                    name="description"
                    component="div"
                    className="text-red-500 text-xs -mt-1"
                  />
                </div>
              </>

              <div className="flex justify-center">
                <Button
                  size="sm"
                  type="submit"
                  loading={isSubmitting}
                  className="bg-gradient"
                >
                  {isSubmitting
                    ? "Submitting..."
                    : selectedDeal?.id
                    ? "Update Deal"
                    : "Create Deal"}
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </ComponentCard>
  );
}
