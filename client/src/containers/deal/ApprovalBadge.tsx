import Badge from "../../components/ui/badge/Badge";
// import { DealApprovalStatusType } from "../../helper/types";

// const STATUS_COLORS: Record<
//   NonNullable<DealApprovalStatusType>,
//   "primary" | "error" | "success"
// > = {
//   Pending: "primary",
//   Rejected: "error",
//   Approved: "success",
// };

const ApprovalBadge = ({ status }: { status?: boolean }) => {
  // const badgeColor = status ? STATUS_COLORS[status] || "primary" : "primary";

  return (
    <Badge size="md" color={status ? "success" : "error"}>
      <span className="capitalize">{status ? "Active" : "Inactive"}</span>
    </Badge>
  );
};

export default ApprovalBadge;
