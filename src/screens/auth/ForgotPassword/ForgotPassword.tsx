import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, IconButton, Input } from "../../../components/atoms";
import { yupResolver } from "@hookform/resolvers/yup";
import yup from "../../../utils/validations/yup";
import { useForm } from "react-hook-form";
import { back } from "../../../assets/icons";
import { useNavigate } from "react-router";
import { ROUTES } from "../../../utils/constants/routes";
import { useForgotPasswordMutation } from "../../../utils/api/baseSlice";
import { MobileContext } from "../../../App";

const ForgotPasswordComponent: React.FC<{}> = ({}) => {
  const [success, setSuccess] = useState({
    userId: null,
    email: "",
    success: false,
  });
  const [forgotPassword, { data: forgotData, isLoading: isUpdating }] =
    useForgotPasswordMutation();

    const value = React.useContext(MobileContext);

  const { t, i18n } = useTranslation("translation", {
    keyPrefix: "pages.forgotPassword",
  });

  const ForgotPasswordSchema = yup.object().shape({
    email: yup
      .string()
      .email(i18n.t("errorMessages.validEmail") || "")
      .required(i18n.t("errorMessages.required") || ""),
  });

  const {
    handleSubmit,
    setError,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(ForgotPasswordSchema),
  });

  const navigate = useNavigate();

  const onSubmit = async (data: any) => {
    let res: any = await forgotPassword(data);
    if (res.data?.success) {
      setSuccess({
        userId: res?.data?.data?.userId || null,
        email: res?.data?.data?.email || "",
        success: true,
      });
    } else {
      if (res.error?.data) {
        // handleInputErrors(res.error?.data, setError);
      }
    }
  };

 

  return (
    <form
      className="flex flex-col justify-between lg:justify-center h-full gap-[45px]"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="flex flex-col mt-[150px] lg:mt-[5px] gap-[30px]">
        <div className="mb-4">
          <IconButton
            icon={back}
            label={i18n.t('common.back')}
            onClick={() => {
              navigate(ROUTES.base);
            }}
            size="small"
          />
        </div>
        <div>
          <p className="text-[#ECBE44]  pb-2 text-start text-[20px] font-bold">
            {t("title")}
          </p>
          <p className="text-[#FFFFFF] text-start text-[14px] ">
            {t("description")}
          </p>
        </div>
        <Input
          error={errors.email}
          name="email"
          placeholder=""
          register={register}
          title={t("email")}
        />
      </div>
      <div className="flex flex-col mb-[50px]">
        <Button
          label={t("button")}
          size="large"
          textColor="#FFFFFF"
          type="submit"
          isLoading={isUpdating}
        />
      </div>
    </form>
  );
};

export default ForgotPasswordComponent;
