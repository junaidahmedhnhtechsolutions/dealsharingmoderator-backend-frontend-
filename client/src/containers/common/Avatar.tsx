interface AvatarProps {
  src: string; // URL of the avatar image
  alt?: string; // Alt text for the avatar
  size?:
    | "xs"
    | "sm"
    | "md"
    | "lg"
    | "xl"
    | "2xl"
    | "3xl"
    | "4xl"
    | "5xl"
    | "6xl"; // Avatar size
  status?: "online" | "offline" | "busy" | "none"; // Status indicator
}

const sizeClasses = {
  xs: "h-6 w-6 max-w-6",
  sm: "h-8 w-8 max-w-8",
  md: "h-10 w-10 max-w-10",
  lg: "h-12 w-12 max-w-12",
  xl: "h-14 w-14 max-w-14",
  "2xl": "h-16 w-16 max-w-16",
  "3xl": "h-20 w-20 max-w-20",
  "4xl": "h-24 w-24 max-w-24",
  "5xl": "h-28 w-28 max-w-28",
  "6xl": "h-32 w-32 max-w-32",
};

const statusSizeClasses = {
  xs: "h-1.5 w-1.5 max-w-1.5",
  sm: "h-2 w-2 max-w-2",
  md: "h-2.5 w-2.5 max-w-2.5",
  lg: "h-3 w-3 max-w-3",
  xl: "h-3.5 w-3.5 max-w-3.5",
  "2xl": "h-4 w-4 max-w-4",
  "3xl": "h-4.5 w-4.5 max-w-4.5",
  "4xl": "h-5 w-5 max-w-5",
  "5xl": "h-5.5 w-5.5 max-w-5.5",
  "6xl": "h-6 w-6 max-w-6",
};

const statusColorClasses = {
  online: "bg-success-500",
  offline: "bg-error-400",
  busy: "bg-warning-500",
};

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = "User Avatar",
  size = "md",
  status = "none",
}) => {
  return (
    <div className={`relative shadow-2xl rounded-full ${sizeClasses[size]}`}>
      {/* Avatar Image */}
      <img
        src={src}
        alt={alt}
        className={`object-cover object-center rounded-full ${sizeClasses[size]}`}
      />

      {/* Status Indicator */}
      {status !== "none" && (
        <span
          className={`absolute bottom-0 right-0 rounded-full border-[1.5px] border-white dark:border-gray-900 ${
            statusSizeClasses[size]
          } ${statusColorClasses[status] || ""}`}
        ></span>
      )}
    </div>
  );
};

export default Avatar;
