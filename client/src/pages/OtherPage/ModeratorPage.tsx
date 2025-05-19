import { useEffect, useState, useMemo } from "react";
import ModeratorTable from "../../containers/moderator/ModeratorTable";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import { apiGet } from "../../services/apiMethods";
import { sortByDate } from "../../helper/utils";
import endpoints from "../../helper/endpoints";
import { useSearchParams } from "react-router";
import { UserType } from "../../helper/types";

export default function ModeratorPage() {
  const [searchParams] = useSearchParams();
  const searchValue = searchParams.get("search")?.toLowerCase() || "";

  const [isLoading, setIsLoading] = useState(false);
  const [moderators, setModerators] = useState<UserType[]>([]);
  const [selectedModerator, setSelectedModerator] = useState<UserType>({});

  const fetchModerators = () => {
    setIsLoading(true);

    apiGet({
      endpoint: endpoints.getModerator,
      onSuccess: (data: any) => {
        setModerators(sortByDate(data?.data || []));
      },
      onFinally: () => setIsLoading(false),
    });
  };

  useEffect(() => {
    fetchModerators();
  }, []);

  const filteredModerators = useMemo(() => {
    return moderators.filter((moderator: UserType) =>
      moderator.username?.toLowerCase().includes(searchValue)
    );
  }, [moderators, searchValue]);

  return (
    <>
      <PageBreadcrumb pageTitle={"Moderators"} />

      <ModeratorTable
        isLoading={isLoading}
        moderators={filteredModerators}
        setModerators={setModerators}
        fetchModerators={fetchModerators}
        selectedModerator={selectedModerator}
        setSelectedModerator={setSelectedModerator}
      />
    </>
  );
}
