import { useEffect, useState, useMemo } from "react";
import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import UsersTable from "../../containers/user/UsersTable";
import { apiGet } from "../../services/apiMethods";
import { sortByDate } from "../../helper/utils";
import { useSearchParams } from "react-router";
import endpoints from "../../helper/endpoints";
import { UserType } from "../../helper/types";

export default function UsersPage() {
  const [searchParams] = useSearchParams();
  const searchValue = searchParams.get("search")?.toLowerCase() || "";

  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<UserType[]>([]);

  const fetchUsers = () => {
    setIsLoading(true);

    apiGet({
      endpoint: endpoints.getUsers,
      onSuccess: (data: any) => {
        setUsers(sortByDate(data?.data || []));
      },
      onFinally: () => setIsLoading(false),
    });
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user: UserType) =>
      user.username?.toLowerCase().includes(searchValue)
    );
  }, [users, searchValue]);

  return (
    <>
      <PageBreadcrumb pageTitle={"Users"} />

      <UsersTable
        isLoading={isLoading}
        users={filteredUsers}
        setUsers={setUsers}
        fetchUsers={fetchUsers}
      />
    </>
  );
}
