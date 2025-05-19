import * as Yup from "yup";

const today = new Date();

const newDealValidationSchema = Yup.object().shape({
  // Basic Required Fields
  title: Yup.string().required("Title is required"),

  price: Yup.number()
    .typeError("Price must be a number")
    .min(0, "Price cannot be negative")
    .required("Price is required"),

  nextPrice: Yup.number()
    .typeError("Next available price must be a number")
    .positive("Next available price must be positive")
    .notRequired()
    .when("price", (price, schema) =>
      price != null
        ? schema.moreThan(
            // @ts-ignore
            price,
            "Next price must be greater than price"
          )
        : schema
    ),

  merchant: Yup.string()
    .min(2, "Retailer/Merchant name must be at least 2 characters")
    .required("Retailer/Merchant name is required"),

  voucher: Yup.string().notRequired(),

  categoryId: Yup.string().required("Category is required"),

  description: Yup.string().notRequired(),

  startDate: Yup.date()
    .typeError("Start date is invalid")
    .min(today, "Start date must be in the future"),

  endDate: Yup.date()
    .typeError("End date is invalid")
    .min(Yup.ref("startDate"), "End date cannot be earlier than start date")
    .min(today, "End date must be in the future"),

  // Shipping Info
  shippingCost: Yup.number()
    .typeError("Shipping cost must be a number")
    .min(0, "Shipping cost cannot be negative")
    .notRequired(),

  shippingCountry: Yup.string()
    .max(100, "Country name is too long")
    .notRequired(),

  // Deal link
  link: Yup.string().url("Please enter a valid URL"),

  // Boolean
  isOnline: Yup.boolean(),

  // Images
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
});

export default newDealValidationSchema;
