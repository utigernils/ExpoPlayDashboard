import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useNotification } from "../context/NotificationContext";
import Header from "../components/Layout/Header";
import { API_BASE_URL } from "../services/api/api";
import axios from "axios";

const PlayerJoin: React.FC = () => {
  const { t } = useTranslation();
  const { notify } = useNotification();
  const [searchParams] = useSearchParams();

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    newsletter: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [joinLink, setJoinLink] = useState("");

  useEffect(() => {
    const link = searchParams.get("join_link");
    if (link) {
      setJoinLink(link);
    } else {
      notify({
        title: t("error"),
        description: t("missingJoinLink"),
        state: "error",
      });
    }
  }, [searchParams, notify, t]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!joinLink) {
      notify({
        title: t("error"),
        description: t("missingJoinLink"),
        state: "error",
      });
      return;
    }

    if (!formData.first_name || !formData.last_name || !formData.email) {
      notify({
        title: t("error"),
        description: t("pleaseCompletAllFields"),
        state: "error",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.post(`${API_BASE_URL}/players/join`, {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        wants_newsletter: formData.newsletter,
        join_link: joinLink,
      });

      notify({
        title: t("success"),
        description: t("playerJoinedSuccessfully"),
        state: "success",
      });

      // Clear form
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        newsletter: false,
      });

      // Optional: Redirect or show success message
      // navigate("/some-success-page");
    } catch (error: any) {
      let errorMessage = t("errorJoiningPlayer");
      
      if (axios.isAxiosError(error)) {
        const message = (error.response?.data as any)?.message;
        if (message) {
          errorMessage = message;
        }
      }

      notify({
        title: t("error"),
        description: errorMessage,
        state: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-suva-bg-grey">
      <Header title={t("joinAsPlayer")} description={t("enterYourDetailsToJoin")} />
      
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-white shadow-lg border border-suva-grey-25 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="first_name" className="block text-sm font-medium text-suva-grey-100 mb-2">
                {t("firstName")}
              </label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder={t("enterFirstName")}
                className="w-full px-4 py-2 border border-suva-grey-25 focus:outline-none focus:ring-2 focus:ring-suva-blue-100 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="last_name" className="block text-sm font-medium text-suva-grey-100 mb-2">
                {t("lastName")}
              </label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder={t("enterLastName")}
                className="w-full px-4 py-2 border border-suva-grey-25 focus:outline-none focus:ring-2 focus:ring-suva-blue-100 focus:border-transparent"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-suva-grey-100 mb-2">
                {t("email")}
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder={t("enterEmailAddress")}
                className="w-full px-4 py-2 border border-suva-grey-25 focus:outline-none focus:ring-2 focus:ring-suva-blue-100 focus:border-transparent"
                required
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="newsletter"
                name="newsletter"
                checked={formData.newsletter}
                onChange={handleChange}
                className="h-4 w-4 text-suva-blue-100 focus:ring-suva-blue-100 border-suva-grey-25"
              />
              <label htmlFor="newsletter" className="ml-2 block text-sm text-suva-grey-100">
                {t("wantsToReceiveNewsletter")}
              </label>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || !joinLink}
              className="w-full bg-suva-blue-100 shadow-lg text-white rounded-full py-3 px-4 hover:bg-suva-blue-75 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isSubmitting ? t("submitting") : t("joinNow")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default PlayerJoin;
