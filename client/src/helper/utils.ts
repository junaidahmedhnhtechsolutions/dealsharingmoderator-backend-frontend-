import moment from "moment";
import { toast } from "react-toastify";
import { DealType, PermissionType, UserType } from "./types";

export const getErrorMessage = (error: any) => {
  if (!error) return "Unknown error occurred.";

  if (error instanceof Error) {
    return error.message; // Standard JS Error
  }

  if (typeof error === "string") {
    return error; // If error is already a string
  }

  if (typeof error === "object") {
    if (error.message) return error.message; // Error object with message property
    if (error.error) return error.error; // API responses with "error" field
    if (error.statusText) return error.statusText; // Fetch API response errors
  }

  return "An unexpected error occurred.";
};

export const handleShowErrorToast = (error: Error | unknown | any) => {
  toast.error(getErrorMessage(error));
};

export const blobUrlToFile = async (
  blobUrl: string,
  fileName: string
): Promise<File> => {
  const response = await fetch(blobUrl);
  const blob = await response.blob();
  return new File([blob], fileName, { type: blob.type });
};

export const sortByDate = (data: { created_at?: string }[]) => {
  return data?.sort(
    (a, b) =>
      new Date(b?.created_at ?? "")?.getTime() -
      new Date(a?.created_at ?? "")?.getTime()
  );
};

export const calculateDiscountPercentage = (
  price?: number | string,
  nextPrice?: number | string
) => {
  const priceNum = typeof price === "string" ? parseFloat(price) : price;
  const nextPriceNum =
    typeof nextPrice === "string" ? parseFloat(nextPrice) : nextPrice;

  if (
    typeof priceNum === "number" &&
    typeof nextPriceNum === "number" &&
    !isNaN(priceNum) &&
    !isNaN(nextPriceNum) &&
    nextPriceNum > priceNum
  ) {
    const percentage = ((nextPriceNum - priceNum) / nextPriceNum) * 100;
    // return parseFloat(percentage.toFixed(2)); // returns a number with 2 decimal points
    return Math.floor(percentage); // ✅ whole number
  }
  return 0;
};

export const copyToClipboard = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  } catch (err) {
    toast.error("Failed to copy");
  }
};

export const handleFormatDate = (date: string) => {
  return moment(date).format("DD/MM/YYYY hh:mm A");
};

export const getDealUser = (deal?: DealType) => {
  return deal?.vendor_id ? deal?.vendors : deal?.user_id ? deal?.users : {};
};

export const getModeratorRole = (user: UserType) => {
  if (user?.role === "Master_Vendor") {
    return "Master Moderator";
  } else if (user?.role == "Vendor") {
    return "Moderator";
  } else {
    return "User";
  }
};

export const getUpdatedVendorOnly = (
  obj:
    | {
        vendor?: UserType;
        permissions?: PermissionType[];
      }
    | any
) => {
  if (!obj?.vendor) return null;

  return {
    ...obj.vendor,
    permissions: obj.permissions ?? [],
  };
};

// password checker
export type PasswordCriteria = {
  length: boolean;
  lowercase: boolean;
  uppercase: boolean;
  digit: boolean;
  // specialChar: boolean;
};

export const getPasswordCriteria = (password: string): PasswordCriteria => {
  return {
    length: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    digit: /\d/.test(password),
    // specialChar: /[@$!%*?&]/.test(password),
  };
};
