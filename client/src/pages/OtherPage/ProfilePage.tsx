import PageBreadcrumb from "../../components/common/PageBreadCrumb";
import ChangePasswordForm from "../../containers/profile/ChangePasswordForm";
import PersonalInfoForm from "../../containers/profile/PersonalInfoForm";

export default function ProfilePage() {
  return (
    <>
      <PageBreadcrumb pageTitle="Profile" />
      <div className="md:space-y-6 space-y-4">
        <PersonalInfoForm />
        <ChangePasswordForm />
      </div>
    </>
  );
}
