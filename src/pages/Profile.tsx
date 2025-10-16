import React, { useState } from "react";
import { useTranslation } from "../hooks/useTranslation";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import { profileApi } from "../services/api/auth/profile";
import Layout from "../components/Layout/Layout";
import { User, Lock, Edit2 } from "lucide-react";
import Header from "../components/Layout/Header";

const Profile: React.FC = () => {
  const { t } = useTranslation();
  const { user, checkAuth } = useAuth();
  const { notify } = useNotification();
  
  const [formData, setFormData] = useState({
    name: user?.name || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  
  const [loading, setLoading] = useState(false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updateData: { name?: string; password?: string; password_confirmation?: string } = {};

      // Check if name changed
      if (formData.name !== user?.name) {
        updateData.name = formData.name;
      }

      // Check if password is being changed
      if (showPasswordSection && formData.newPassword) {
        if (formData.newPassword !== formData.confirmPassword) {
          notify({
            title: t("error"),
            description: t("passwordsDoNotMatch"),
            state: "error",
          });
          setLoading(false);
          return;
        }
        updateData.password = formData.newPassword;
        updateData.password_confirmation = formData.confirmPassword;
      }

      if (Object.keys(updateData).length === 0) {
        notify({
          title: t("noChanges"),
          description: t("noChangesDetected"),
          state: "info",
        });
        setLoading(false);
        return;
      }

      await profileApi.updateProfile(updateData);
      
      // Refresh user data
      await checkAuth();
      
      // Clear password fields
      setFormData((prev) => ({
        ...prev,
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      }));
      setShowPasswordSection(false);

      notify({
        title: t("success"),
        description: t("profileUpdatedSuccessfully"),
        state: "success",
      });
    } catch (error: any) {
      // Check if it's a validation error (422)
      if (error.message && error.message.includes("422")) {
        notify({
          title: t("error"),
          description: t("passwordTooShort"),
          state: "error",
        });
      } else {
        notify({
          title: t("error"),
          description: t("failedToUpdateProfile"),
          state: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>        
        <Header title={t("myProfile")} description={t("manageYourProfileSettings")} />
      <div className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-3xl mx-auto">

          {/* Profile Form */}
          <form onSubmit={handleUpdateProfile} className="space-y-6">
            {/* Basic Information Card */}
            <div className="bg-white shadow-sm border border-suva-grey-25">
              <div className="px-6 py-4 border-b border-suva-grey-25">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-suva-grey-75" />
                  <h2 className="text-lg font-medium text-suva-grey-100">
                    {t("basicInformation")}
                  </h2>
                </div>
              </div>
              <div className="px-6 py-6 space-y-4">
                {/* Name Field */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-suva-grey-100 mb-1"
                  >
                    {t("name")}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="block w-full border border-suva-grey-25 px-3 py-2 text-suva-grey-100 focus:border-suva-blue-100 focus:outline-none focus:ring-1 focus:ring-suva-blue-100"
                    placeholder={t("enterYourName")}
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label
                    className="block text-sm font-medium text-suva-grey-100 mb-1"
                  >
                    {t("email")}
                  </label>
                  <p className="text-sm text-suva-grey-75 px-3 py-2 bg-suva-bg-grey">
                    {user?.email}
                  </p>
                </div>
              </div>
            </div>

            {/* Password Section Card */}
            <div className="bg-white shadow-sm border border-suva-grey-25">
              <div className="px-6 py-4 border-b border-suva-grey-25">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Lock className="h-5 w-5 text-suva-grey-75" />
                    <h2 className="text-lg font-medium text-suva-grey-100">
                      {t("changePassword")}
                    </h2>
                  </div>
                  {!showPasswordSection && (
                    <button
                      type="button"
                      onClick={() => setShowPasswordSection(true)}
                      className="rounded-full text-suva-blue-100 hover:text-suva-interaction-blue transition-colors duration-200"
                    >
                        <Edit2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>

              {showPasswordSection && (
                <div className="px-6 py-6 space-y-4">
                  {/* New Password Field */}
                  <div>
                    <label
                      htmlFor="newPassword"
                      className="block text-sm font-medium text-suva-grey-100 mb-1"
                    >
                      {t("newPassword")}
                    </label>
                    <input
                      type="password"
                      id="newPassword"
                      name="newPassword"
                      value={formData.newPassword}
                      onChange={handleInputChange}
                      className="block w-full border border-suva-grey-25 px-3 py-2 text-suva-grey-100 focus:border-suva-blue-100 focus:outline-none focus:ring-1 focus:ring-suva-blue-100"
                      placeholder={t("enterNewPassword")}
                    />
                  </div>

                  {/* Confirm Password Field */}
                  <div>
                    <label
                      htmlFor="confirmPassword"
                      className="block text-sm font-medium text-suva-grey-100 mb-1"
                    >
                      {t("confirmPassword")}
                    </label>
                    <input
                      type="password"
                      id="confirmPassword"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="block w-full border border-suva-grey-25 px-3 py-2 text-suva-grey-100 focus:border-suva-blue-100 focus:outline-none focus:ring-1 focus:ring-suva-blue-100"
                      placeholder={t("confirmNewPassword")}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setShowPasswordSection(false);
                      setFormData((prev) => ({
                        ...prev,
                        currentPassword: "",
                        newPassword: "",
                        confirmPassword: "",
                      }));
                    }}
                    className="rounded-full px-4 py-2 border-2 border-suva-blue-100  -md shadow-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    {t("cancel")}
                  </button>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3">
              <button
                type="submit"
                disabled={loading}
                className="rounded-full inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium    shadow-lg text-white bg-suva-blue-100 hover:bg-suva-interaction-blue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-suva-blue-100 transition-colors duration-200"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {t("saving")}
                  </>
                ) : (
                  <>
                    {t("saveChanges")}
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Profile;
