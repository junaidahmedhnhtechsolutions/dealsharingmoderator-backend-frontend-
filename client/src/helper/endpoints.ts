const endpoints = {
  // auth //
  login: "/vendor/login",
  register: "/vendor/register",
  changePassword: `/vendor/change/password`,
  forgetPassword: "/vendor/forget/password",
  resetPassword: "/vendor/reset/password",

  // dashboard
  allCount: "/vendor/allCount",
  uniqueTitle: "/user/deal/title",

  // profile
  updateProfile: (id: string | number) => `/vendor/update/profile/${id}`,

  // category //
  getCategory: "/vendor/category/view",

  // subcategory //
  getSubcategory: "/vendor/subcategory/view",

  // deals //
  getDeals: "/vendor/deal/view",
  getDealById: (id: string | number) => `vendor/single/deal/${id}`,
  createDeal: "/vendor/deal/store",
  dealEditRequest: (id: string | number) => `/vendor/deal/edit/request/${id}`,
  // set the proper endpoint
  updateDeal: (id: string | number) => `/vendor/deal/update/${id}`,
  deleteDeal: (id: string | number) => `/vendor/deal/delete/${id}`,
  updateDealStatus: (id: string | number) => `/vendor/deal/status/update/${id}`,
  expireDeal: (id: string | number) => `/vendor/deal/expire/${id}`,
  approveDeal: (id: string | number) => `/vendor/deal/approval/${id}`,

  // moderator
  getModerator: "/vendor/convert/vendors",
  createModerator: "/vendor/vendor/store",
  getModeratorById: (id: number | string) => `/vendor/convert/vendors/${id}`,
  updateModerator: (id: string | number) => `/vendor/vendor/update/${id}`,
  deleteModerator: (id: string | number) => `/vendor/vendor/delete/${id}`,
  updatePermissions: (id: string | number) =>
    `/vendor/update/vendor/${id}/permission`,

  // user // put the exact vendor endpoints
  getUsers: "/vendor/users",
  activeUser: (id: string | number) => `/vendor/user/${id}/activate`,
  deleteUser: (id: string | number) => `/vendor/user/${id}/delete`,
  deleteReport: (id: string | number) => `/vendor/report/deal/${id}/delete`,
  deleteComment: (id: string | number) => `/vendor/comment/${id}/delete`,
  replyToComment: (id: string | number) => `/vendor/comment/store/${id}`,

  deleteCommentReport: ({
    commentId,
    reportId,
  }: {
    commentId: string | number;
    reportId: string | number;
  }) => `/vendor/comment/${commentId}/report/${reportId}/delete`,
};

export default endpoints;
