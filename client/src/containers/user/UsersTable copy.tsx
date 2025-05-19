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
import { getModeratorRole } from "../../helper/utils";
import UsersTableWrapper from "./UsersTableWrapper";
import Switch from "../../components/form/switch/Switch";
import PermissionModal from "../common/PermissionModal";
import { useState } from "react";
import { apiDelete, apiGet } from "../../services/apiMethods";

type PropsType = {
  isLoading: boolean;
  users: UserType[];
  setUsers: Function;
  fetchUsers: Function;
};

export default function UsersTable(props: PropsType) {
  const { isLoading, users, setUsers, fetchUsers } = props;

  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType>({});

  const togglePermissionModal = () => {
    setShowModal((prev) => !prev);
  };

  const handleUserPermissions = async (data: UserType) => {
    setSelectedUser(data);
    togglePermissionModal();
  };

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
      <PermissionModal
        isOpen={showModal}
        onSuccess={fetchUsers}
        selectedUser={selectedUser}
        onClose={togglePermissionModal}
      />

      <div className="space-y-6">
        <UsersTableWrapper>
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white dark:border-white/[0.05] dark:bg-white/[0.03]">
            <div className="max-w-full overflow-x-auto">
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
                        Role
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                      >
                        Active/Deactive
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                      >
                        Permissions
                      </TableCell>
                    </TableRow>
                  </TableHeader>

                  {/* Table Body */}
                  <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                    {isLoading ? (
                      <p className="p-4 text-center font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        Loading...
                      </p>
                    ) : _.isEmpty(users) ? (
                      <p className="p-4 text-center font-medium text-gray-800 text-theme-sm dark:text-white/90">
                        Empty List
                      </p>
                    ) : (
                      users?.map((item, index) => (
                        <TableRow key={`${item.id}_${index}`}>
                          <TableCell className="px-5 py-3 font-medium text-gray-800 text-theme-sm dark:text-white/90 capitalize">
                            {`${item?.first_name} ${item?.last_name}`}
                          </TableCell>
                          <TableCell className="px-5 py-3 font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {item?.username}
                          </TableCell>
                          <TableCell className="px-5 py-3 font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {item?.email}
                          </TableCell>
                          <TableCell className="px-5 py-3 font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {getModeratorRole(item)}
                          </TableCell>
                          <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                            <Switch
                              defaultChecked={item?.is_active}
                              label={item?.is_active ? "Active" : "Deactive"}
                              onChange={(checked: boolean) => {
                                handleActiveDeactiveUser(item, checked);
                              }}
                            />
                          </TableCell>
                          <TableCell className="px-4 py-3 text-gray-500 text-start text-theme-sm dark:text-gray-400">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleUserPermissions(item)}
                            >
                              Permissions
                            </Button>
                          </TableCell>
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
                        </TableRow>
                      ))
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
