import _ from "lodash";
import Button from "../../components/ui/button/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { UserType } from "../../helper/types";
import { GoTrash } from "react-icons/go";
import endpoints from "../../helper/endpoints";
import { toast } from "react-toastify";
import UsersTableWrapper from "./UsersTableWrapper";
import Switch from "../../components/form/switch/Switch";
import { TbMailUp } from "react-icons/tb";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { apiDelete, apiGet } from "../../services/apiMethods";

type PropsType = {
  isLoading: boolean;
  users: UserType[];
  setUsers: Function;
  fetchUsers: Function;
};

export default function UsersTable(props: PropsType) {
  const { isLoading, users, setUsers, fetchUsers } = props;
  const { user } = useAuth();

  const handleDeleteUser = (obj: UserType) => {
    apiDelete({
      endpoint: endpoints.deleteUser(obj.id ?? ""),
      onSuccess: (data: any) => {
        setUsers((prev: UserType[]) =>
          prev.filter((item) => item.id !== obj.id)
        );
        toast.success(data?.message);
        fetchUsers?.();
      },
    });
  };

  const handleActiveDeactiveUser = (user: UserType, checked: boolean) => {
    console.log({ checked });

    apiGet({
      endpoint: endpoints.activeUser(user?.id ?? ""),
      onSuccess: (data: any) => {
        toast.success(data?.message);
        fetchUsers?.();
      },
    });
  };

  return (
    <>
      <div className="space-y-6">
        <UsersTableWrapper>
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="relative max-w-full overflow-x-auto">
              {isLoading && (
                <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center py-10">
                  <LoadingSpinner size="lg" />
                </div>
              )}
              <div>
                <Table>
                  {/* Table Header */}
                  <TableHeader className="border-b border-gray-100 dark:border-white/[0.05]">
                    <TableRow>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                      >
                        Name
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                      >
                        Username
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                      >
                        Email
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                      >
                        Active/Deactive
                      </TableCell>
                    </TableRow>
                  </TableHeader>

                  {/* Table Body */}
                  <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                    {isLoading ? (
                      <div className="py-20 w-full" />
                    ) : _.isEmpty(users) ? (
                      <p className="p-4 text-center font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        Empty List
                      </p>
                    ) : (
                      users?.map((item, index) => {
                        const isLoggedInUser = item?.email === user?.email;
                        return (
                          <TableRow key={`${item.id}_${index}`}>
                            <TableCell className="px-5 py-3 font-medium text-gray-800 text-theme-sm dark:text-white/90 capitalize text-nowrap">
                              {`${item?.first_name} ${item?.last_name}`}
                            </TableCell>
                            <TableCell className="px-5 py-3 font-medium text-gray-800 text-theme-sm dark:text-white/90">
                              {item?.username}
                            </TableCell>
                            <TableCell className="px-5 py-3 font-medium text-gray-800 text-theme-sm dark:text-white/90">
                              <a
                                href={`mailto:${item?.email}`}
                                className="flex items-center gap-1 hover:underline"
                              >
                                <TbMailUp size={20} />{" "}
                                <span>{item?.email}</span>
                              </a>
                            </TableCell>
                            <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                              {isLoggedInUser ? (
                                <div />
                              ) : (
                                <Switch
                                  defaultChecked={item?.is_active}
                                  label={
                                    item?.is_active ? "Active" : "Deactive"
                                  }
                                  onChange={(checked: boolean) => {
                                    handleActiveDeactiveUser(item, checked);
                                  }}
                                />
                              )}
                            </TableCell>
                            {isLoggedInUser ? (
                              <TableCell className="px-5 py-3 font-medium text-gray-800 text-theme-sm dark:text-white/90">
                                (You)
                              </TableCell>
                            ) : (
                              <TableCell className="px-4 py-3">
                                <div className="flex items-center justify-end gap-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="!rounded-full w-10 h-10 flex items-center justify-center !p-1"
                                    onClick={() => handleDeleteUser(item)}
                                  >
                                    <GoTrash />
                                  </Button>
                                </div>
                              </TableCell>
                            )}
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </UsersTableWrapper>
      </div>
    </>
  );
}
