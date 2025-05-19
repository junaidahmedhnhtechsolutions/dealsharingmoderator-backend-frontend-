import _ from "lodash";
import Button from "../../components/ui/button/Button";
import {
  Table,
  TableHeader,
  TableBody,
  TableCell,
  TableRow,
} from "../../components/ui/table";
import endpoints from "../../helper/endpoints";
import { UserType } from "../../helper/types";
import { GoTrash } from "react-icons/go";
import { toast } from "react-toastify";
import { getModeratorRole } from "../../helper/utils";
import ModeratorTableWrapper from "./ModeratorTableWrapper";
import PermissionModal from "../common/PermissionModal";
import { useState } from "react";
import { TbMailUp } from "react-icons/tb";
import LoadingSpinner from "../../components/common/LoadingSpinner";
import { apiDelete } from "../../services/apiMethods";

type PropsType = {
  isLoading: boolean;
  moderators: UserType[];
  setModerators: Function;
  fetchModerators: Function;
  selectedModerator: UserType;
  setSelectedModerator: Function;
};

export default function ModeratorTable(props: PropsType) {
  const {
    isLoading,
    moderators,
    setModerators,
    fetchModerators,
    // setSelectedModerator,
  } = props;

  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserType>({});

  const togglePermissionModal = () => {
    setShowModal((prev) => !prev);
  };

  const handleUserPermissions = async (data: UserType) => {
    setSelectedUser(data);
    togglePermissionModal();
  };

  const handleDeleteModerator = async (obj: UserType) => {
    // setSelectedModerator(obj);

    apiDelete({
      endpoint: endpoints.deleteModerator(obj.id ?? ""),
      onSuccess: (data: any) => {
        setModerators((prev: UserType[]) =>
          prev.filter((item) => item.id !== obj.id)
        );
        toast.success(data?.message);
        fetchModerators?.();
      },
    });
  };

  return (
    <>
      {showModal && (
        <PermissionModal
          isOpen={showModal}
          onSuccess={fetchModerators}
          selectedUser={selectedUser}
          onClose={togglePermissionModal}
        />
      )}

      <div className="space-y-6">
        <ModeratorTableWrapper>
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
                        Role
                      </TableCell>
                      <TableCell
                        isHeader
                        className="px-5 py-3 font-medium text-gray-500 text-start text-theme-xs dark:text-gray-400"
                      >
                        Permissions
                      </TableCell>
                    </TableRow>
                  </TableHeader>

                  {isLoading ? (
                    <div className="py-20 w-full" />
                  ) : _.isEmpty(moderators) ? (
                    <p className="sticky left-0 p-4 text-center font-medium text-gray-800 text-theme-sm dark:text-white/90">
                      Empty List
                    </p>
                  ) : (
                    <TableBody className="divide-y divide-gray-100 dark:divide-white/[0.05]">
                      {moderators?.map((item, index) => (
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
                              <TbMailUp size={20} /> <span>{item?.email}</span>
                            </a>
                          </TableCell>
                          <TableCell className="px-5 py-3 font-medium text-gray-800 text-theme-sm dark:text-white/90">
                            {getModeratorRole(item)}
                          </TableCell>
                          <TableCell className="px-5 py-3 font-medium text-gray-800 text-theme-sm dark:text-white/90">
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
                                onClick={() => handleDeleteModerator(item)}
                              >
                                <GoTrash />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  )}
                </Table>
              </div>
            </div>
          </div>
        </ModeratorTableWrapper>
      </div>
    </>
  );
}
