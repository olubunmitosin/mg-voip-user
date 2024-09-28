"use client"

import Link from "next/link";
import Image from "next/image";
import { useState } from 'react';
import { useFormik } from "formik";
import { toast } from "react-toastify";
import {Input} from "@nextui-org/input";
import { Button } from '@nextui-org/button';
import { useRouter } from 'next/navigation';
import { ApiResponseInterface } from '@/types';
import { emailSchema } from "@/helpers/validators";
import { checkBoolean } from "@/helpers/common";
import { useGeneralStateStore } from "@/hooks/generalStateStore";
import { makeRequest } from "@/helpers/request";


export default function ForgotPasswordPage() {

  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const insertItem = useGeneralStateStore((state) => state.insertItem);

  // Use Formik hook
  const formik = useFormik({
    initialValues: {
      email: "",
      access: "user"
    },
    validationSchema: emailSchema,
    onSubmit: async (values) => handleFormSubmit(values),
  });

  // Deconstruct Formik object
  const { errors, touched, values, handleChange, handleSubmit } = formik;

  // Handle form submission
  const handleFormSubmit = async (values: any) => {
    setLoading(true);

    // Submit form
    const formResponse: ApiResponseInterface = await makeRequest(
      "/api/auth/send-pass-reset-email",
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
      insertItem('email', values.email);
      // perform redirect to reset password screen
      setTimeout(() => {
        setLoading(false);
        router.replace('/auth/reset-password');
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
                We will email you a reset token to your registered email address. 
            </p>
          </div>
        </div>
      </div>

      <div className="col-span-full lg:col-span-6 w-full lg:max-w-[600px]">
        <div className="border border-form dark:border-dark-border p-5 md:p-10 rounded-20 md:rounded-30">
          <h3 className="text-xl md:text-[28px] leading-none font-semibold text-heading">
              Forgot Password
          </h3>
          <p className="font-medium text-gray-500 dark:text-dark-text mt-4">
              Reset your password to gain access to your account
          </p>

          <form className="leading-none mt-8" onSubmit={handleSubmit}>
            <div className="mb-2.5 pt-1 pb-8">
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

            <Button isLoading={loading ? true : false} className="btn b-solid btn-primary-solid font-bold w-full" type="submit">Send Reset Token</Button>
          </form>
          <div className="text-gray-900 dark:text-dark-text flex flex-col justify-center items-center font-medium leading-none mt-5">
              <Link href="/auth/login" className="text-primary-500 font-semibold">Back to Sign In</Link>
          </div>
        </div>
      </div>
    </>
  );
}
