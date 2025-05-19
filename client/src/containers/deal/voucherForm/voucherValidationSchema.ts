import * as Yup from "yup";

const voucherValidationSchema = Yup.object().shape({
  code: Yup.string().max(30, "Voucher code is too long").notRequired(),

  title: Yup.string().required("Title is required"),

  type: Yup.string().required("Voucher type is required"),

  merchant: Yup.string()
    .min(2, "Retailer/Merchant name must be at least 2 characters")
    .required("Retailer/Merchant name is required"),

  categoryId: Yup.string().required("Category is required"),

  link: Yup.string().url("Please enter a valid URL").notRequired(),

  isOnline: Yup.boolean(),

  description: Yup.string().notRequired(),

  discount: Yup.number()
    .min(1, "Discount must be at least 1%")
    .max(100, "Discount can't exceed 100%")
    .when("type", {
      is: "Discount",
      then: (schema) => schema.required("Discount value is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

  reduction: Yup.number()
    .min(0.01, "Reduction must be at least 0.01 AED")
    .when("type", {
      is: "Reduction",
      then: (schema) => schema.required("Reduction value is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

  images: Yup.array()
    .of(
      Yup.object().shape({
        preview: Yup.string().required("Image preview is required"),
      })
    )
    .min(1, "At least one image is required"),

  locations: Yup.array()
    .of(
      Yup.object().shape({
        address: Yup.string().required("Address is required"),
        lat: Yup.number().required("Latitude is required"),
        lng: Yup.number().required("Longitude is required"),
      })
    )
    .when("isOnline", {
      is: false,
      then: (schema) => schema.min(1, "At least one location is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

  shippingCost: Yup.number()
    .typeError("Shipping cost must be a number")
    .min(0, "Shipping cost cannot be negative")
    .notRequired(),

  shippingCountry: Yup.string()
    .max(100, "Country name is too long")
    .notRequired(),
});

export default voucherValidationSchema;
