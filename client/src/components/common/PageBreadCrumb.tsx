import { Link, useNavigate } from "react-router";
import { IoIosArrowBack } from "react-icons/io";
import GradientText from "./GradientText";

interface BreadcrumbProps {
  pageTitle: string;
  hideBackBtn?: boolean;
  onBack?: () => void;
}

const PageBreadcrumb: React.FC<BreadcrumbProps> = ({
  pageTitle,
  hideBackBtn,
}) => {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
      <div className="flex items-center gap-1">
        {!hideBackBtn && (
          <button onClick={goBack} className="text-2xl font-semibold text-pink">
            <IoIosArrowBack />
          </button>
        )}
        <h2 className="text-xl font-semibold" x-text="pageName">
          <GradientText>{pageTitle}</GradientText>
        </h2>
      </div>
      <nav>
        <ol className="flex items-center gap-1.5">
          <li>
            <Link
              className="inline-flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400"
              to="/"
            >
              Home
              <svg
                className="stroke-current"
                width="17"
                height="16"
                viewBox="0 0 17 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.0765 12.667L10.2432 8.50033L6.0765 4.33366"
                  stroke=""
                  strokeWidth="1.2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </li>
          <li className="text-sm text-gray-800 dark:text-white/90">
            {pageTitle}
          </li>
        </ol>
      </nav>
    </div>
  );
};

export default PageBreadcrumb;
