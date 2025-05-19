export type DealActiveStatusType =
  | "Active"
  | "Inactive"
  | "Expired"
  | "Rejected";
export type DealStatusType = "Popular" | "Hottest" | "Trending" | "All";
export type DealApprovalStatusType = "Pending" | "Rejected" | "Approved";
export type PermissionType =
  | "review_deals"
  | "review_comments"
  | "user_management";

export type DealTypeType =
  | ""
  | "In_Store"
  | "With_Discount"
  | "With_PNP"
  | "With_RRP"
  | "Discount_Only";
export type VoucherTypeType =
  | "Discount"
  | "Reduction"
  | "Free_Shipping"
  | "Freebie";

export type MetaType = {
  title?: string;
  description?: string;
  image?: string | string[];
};

// location Type
export type LocationType = {
  address?: string;
  lat?: number;
  lng?: number;
};

// user Type
export type UserType = {
  email?: string;
  password?: string;
  created_at?: string;
  updated_at?: string;
  is_active?: boolean;
  id?: number | string;
  username?: string;
  last_name?: string;
  first_name?: string;
  email_verified_at?: string | null;
  role?: "Master_Vendor" | "Vendor";
  permissions?: PermissionType[];
};

// Image Type
export type ImageType = {
  name?: string;
  image_url: string;
  created_at?: string;
  updated_at?: string;
  id?: number | string;
  deal_id: number | string;
};

// Category Type
export type CategoryType = {
  id?: number | string;
  name?: string;
  created_at?: string;
  updated_at?: string;
  sub_category?: CategoryType[];
};

// Sub Category Type
export type SubCategoryType = {
  id?: number | string;
  name?: string;
  created_at?: string;
  updated_at?: string;
  // category?: string;
  category?: CategoryType;
};

export type ReportType = {
  id?: number;
  user_id?: number;
  deal_id?: number;
  report?: string;
  reason_for_report?: string;
  created_at?: string;
  updated_at?: string;
  users?: UserType;
};

export type CommentReportType = {
  id?: number;
  user_id?: number;
  comment_id?: number;
  report?: string;
  reason_for_report?: string;
  created_at?: string;
  updated_at?: string;
  users?: UserType;
};

export type CommentType = {
  id?: number;
  user_id?: number;
  product_id?: number;
  parent_id?: number;
  comment?: string;
  created_at?: string;
  updated_at?: string;
  users?: UserType;
  reported_comments?: CommentReportType[];
};

// Deal type
export type DealType = {
  // subcategory_id?: number;
  // subcategory?: SubCategoryType;
  is_expire?: boolean;
  is_active?: DealActiveStatusType;
  status?: DealStatusType;
  id?: number;
  user_id?: number;
  vendor_id?: number;
  admin_id?: number;
  category_id?: number;
  created_at?: string;
  updated_at?: string;
  title?: string;
  price?: string;
  posted?: string;
  merchant?: string;
  votes?: string;
  comments?: CommentType[];
  deal_link?: string;
  images?: string[];
  description_html?: string;
  category?: CategoryType;
  deal_images?: { image_url?: string }[];
  // new fields
  discount_price?: string;
  discount_code?: string;
  delivery_charges?: string;
  // additional_charges?: string;
  store_name?: string;
  edit_reason?: string;
  approval_status?: DealApprovalStatusType;
  users?: UserType;
  vendors?: UserType;
  admins?: UserType;
  type?: DealTypeType;
  approve_date?: string;

  // new
  reduction_price?: number;
  voucher_type?: VoucherTypeType;
  start_date?: string;
  expire_date?: string;
  shipping_country?: string;
  next_price?: number;
  // locations?: LocationType[];
  deal_locations?: LocationType[];

  reported_deals?: ReportType[];
};
