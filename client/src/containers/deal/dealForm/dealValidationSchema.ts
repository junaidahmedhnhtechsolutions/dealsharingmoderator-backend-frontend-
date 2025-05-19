import * as Yup from "yup";

const dealValidationSchema = Yup.object().shape({
  // Common Fields
  title: Yup.string().required("Title is required"),
  type: Yup.string().required("Deal type is required"),
  price: Yup.number()
    .typeError("Price must be a number")
    .positive("Price must be positive")
    .required("Price is required"),
  expireDate: Yup.date()
    .typeError("Please enter a valid date")
    .min(new Date(), "Expire date must be in the future"),
  merchant: Yup.string()
    .min(2, "Merchant name must be at least 2 characters")
    .max(50, "Merchant name must be less than 50 characters")
    .required("Merchant name is required"),
  categoryId: Yup.string().required("Category is required"),
  subcategoryId: Yup.string(),
  description: Yup.string()
    .min(10, "Description must be at least 10 characters")
    .max(500, "Description must be less than 500 characters")
    .required("Description is required"),

  // Conditionally Required Fields
  storeName: Yup.string()
    .trim()
    .min(2, "Store name must be at least 2 characters")
    .max(50, "Store name must be less than 50 characters")
    .when("type", {
      is: "In_Store",
      then: (schema) => schema.required("Store name is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

  discount: Yup.number()
    .typeError("Discount must be number")
    .min(0, "Discount cannot be negative")
    .max(100, "Discount cannot exceed 100%")
    .when("type", {
      is: (val: string) =>
        ["With_Discount", "With_RRP", "Discount_Only"].includes(val),
      then: (schema) => schema.required("Discount is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

  discountCode: Yup.string().when("type", {
    is: "Discount_Only",
    then: (schema) => schema.required("Discount code is required"),
    otherwise: (schema) => schema.notRequired(),
  }),

  deliveryCharges: Yup.number()
    .typeError("Additional charges must be number")
    .positive("Additional charges must be positive")
    .when("type", {
      is: "With_PNP",
      then: (schema) => schema.notRequired(),
      otherwise: (schema) => schema.notRequired(),
    }),
  // deliveryCharges: Yup.number()
  //   .typeError("Additional charges must be number")
  //   .positive("Additional charges must be positive")
  //   .when("type", {
  //     is: "With_PNP",
  //     then: (schema) => schema.required("Additional charges are required"),
  //     otherwise: (schema) => schema.notRequired(),
  //   }),

  dealLink: Yup.string()
    .url("Please enter a valid URL")
    .when("type", {
      is: (val: string) => ["With_PNP", "With_RRP"].includes(val),
      then: (schema) => schema.required("Deal link is required"),
      otherwise: (schema) => schema.notRequired(),
    }),

  // Optional
  images: Yup.array()
    .of(
      Yup.object().shape({
        preview: Yup.string().required(),
      })
    )
    .notRequired(),
});

export default dealValidationSchema;
