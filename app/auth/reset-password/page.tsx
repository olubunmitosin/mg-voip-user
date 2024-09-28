"use client"

import Link from 'next/link';
import { useState } from 'react';
import Image from "next/image";
import { useFormik } from "formik";
import { toast } from "react-toastify";
import {Input} from "@nextui-org/input";
import { Button } from '@nextui-org/button';
import { useRouter } from 'next/navigation';
import { ApiResponseInterface } from '@/types';
import { resetFormSchema } from '@/helpers/validators';
import { useGeneralStateStore } from '@/hooks/generalStateStore';
import { makeRequest } from '@/helpers/request';
import { checkBoolean } from '@/helpers/common';


export default function ResetPasswordPage() {

  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [resetLoading, setResetLoading] = useState(false);

  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const data: any = useGeneralStateStore((state) => state.data);
  const removeItem = useGeneralStateStore((state) => state.removeItem);

  // Use Formik hook
  const formik = useFormik({
    initialValues: {
      email: `${data.email}`,
      token: "",
      password: "",
      access: "user"
    },
    validationSchema: resetFormSchema,
    onSubmit: async (values) => handleFormSubmit(values),
  });

  // Deconstruct Formik object
  const { errors, touched, values, handleChange, handleSubmit } = formik;

  // reset reset token
  const resendResetToken = async () => {
    setResetLoading(true);
    const resetData = {
      access: "user",
      email: data.email,
    };
    const formResponse: ApiResponseInterface = await makeRequest(
      "/api/auth/send-pass-reset-email",
      "POST",
      resetData,
    );

    if (formResponse.status == false) {
      toast.dismiss();
      setLoading(false);
      toast.error(formResponse.data.message, {
        position: "bottom-right",
      });
      setResetLoading(false);
    } else {
      toast.dismiss();
      toast.success(formResponse.data.message, {
        position: "bottom-right",
      });
      setResetLoading(false);
    }
  }


  // Handle form submission
  const handleFormSubmit = async (values: any) => {
    setLoading(true);

    // Submit form
    const formResponse: ApiResponseInterface = await makeRequest(
      "/api/auth/reset-password",
      "POST",
      values,
    );

    if (formResponse.status == false) {
      toast.dismiss();
      setLoading(false);
      toast.error(formResponse.data.message, {
        position: "bottom-right",
      });
    } else {
      toast.dismiss();
      toast.success(formResponse.data.message, {
        position: "bottom-right",
      });
      // remove item from state
      removeItem('email');
      // perform redirect to login screen
      setTimeout(() => {
        setLoading(false);
        router.replace('/auth/login');
      }, 1000);
    }
  };
  
  return (
    <>
      <div className="col-span-full lg:col-span-6">
        <div className="flex flex-col items-center justify-center gap-10 text-center">
          <div className="hidden sm:block">
            <Image src={`/assets/images/loti/loti-auth.svg`} width={400} height={500} alt="banner" style={{ width: "auto", height: "auto" }} className="group-data-[theme-mode=dark]:hidden" priority={true}/>
            <Image src={`/assets/images/loti/loti-auth-dark.svg`} width={400} height={500} alt="banner" style={{ width: "auto", height: "auto" }} className="group-data-[theme-mode=light]:hidden" priority={true}/>
          </div>
          <div>
            <h3 className="text-xl md:text-[28px] leading-none font-semibold text-heading">
                Welcome back!
            </h3>
            <p className="font-medium text-gray-500 dark:text-dark-text mt-4 px-[10%]">
                Just one step away from regaining access to your administrator account
            </p>
          </div>
        </div>
      </div>

      <div className="col-span-full lg:col-span-6 w-full lg:max-w-[600px]">
        <div className="border border-form dark:border-dark-border p-5 md:p-10 rounded-20 md:rounded-30">
          <h3 className="text-xl md:text-[28px] leading-none font-semibold text-heading">
              Reset Password
          </h3>
          <p className="font-medium text-gray-500 dark:text-dark-text mt-4">
              Reset your password to gain access to your account
          </p>

          <form className="leading-none mt-8" onSubmit={handleSubmit}>
            <div className="pt-1">
              <Input 
              isRequired
              type="email" 
              name="email"
              variant="bordered" 
              label="Email"
              labelPlacement="outside"
              placeholder="my@example.com"
              onChange={handleChange}
              isInvalid={checkBoolean(errors.email, touched.email)}
              value={values.email}
              errorMessage={errors.email}
              classNames={{ 
                label: "form-label",
                inputWrapper: "form-input px-4 py-3.5 rounded-lg"
              }}
              />
            </div>

            <div className="pt-5">
              <Input 
              isRequired
              type="text" 
              name="token"
              variant="bordered" 
              label="Token"
              labelPlacement="outside"
              placeholder="123456"
              onChange={handleChange}
              isInvalid={checkBoolean(errors.token, touched.token)}
              value={values.token}
              errorMessage={errors.token}
              classNames={{ 
                label: "form-label",
                inputWrapper: "form-input px-4 py-3.5 rounded-lg"
              }}
              />
            </div>

            <div className="pt-5 pb-8">
              <Input 
                isRequired
                type={isVisible ? "text" : "password"} 
                name="password"
                variant="bordered" 
                label="New Password"
                labelPlacement="outside"
                placeholder="Enter new password"
                onChange={handleChange}
                isInvalid={checkBoolean(errors.password, touched.password)}
                value={values.password}
                errorMessage={errors.password}
                classNames={{ 
                  label: "form-label",
                  inputWrapper: "form-input px-4 py-3.5 rounded-lg"
                }}
                endContent={(
                  <label data-for="toggleInputType" className="size-8 rounded-md flex-center hover:bg-gray-200 dark:hover:bg-dark-icon foucs:bg-gray-200 dark:foucs:bg-dark-icon position-center left-[95%]">
                    <input type="checkbox" id="toggleInputType" onClick={toggleVisibility} className="inputTypeToggle peer/it" hidden/>
                    <i className="ri-eye-off-line text-gray-500 dark:text-dark-text peer-checked/it:before:content-['\ecb5']"></i>
                  </label>
                )}
                />
            </div>

            <Button isLoading={loading ? true : false} className="btn b-solid btn-primary-solid font-bold w-full" type="submit">Reset Password</Button>
          </form>
          <div className="text-gray-900 dark:text-dark-text flex flex-col justify-center items-center font-medium leading-none mt-5">
              <p className="my-2">Didn't get Token? <Button isLoading={resetLoading ? true : false} type="button" onClick={resendResetToken} variant="light" className="font-semibold">Resend Token</Button></p>
              <Link href="/auth/login" className="text-primary-500 font-semibold">Back to Sign In</Link>
          </div>
        </div>
      </div>
    </>
  );
}
