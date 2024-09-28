"use client"
import Image from "next/image";
import {useState} from 'react';
import { useFormik } from "formik";
import { Icon } from "@iconify/react";
import { toast } from "react-toastify";
import { Input } from "@nextui-org/input";
import { useRouter } from 'next/navigation';
import { Button } from '@nextui-org/button';
import { ApiResponseInterface } from "@/types";
import { Checkbox } from "@nextui-org/checkbox";
import { loginSchema } from "@/helpers/validators";
import { useAuthStateStore } from "@/hooks/authStateStore";
import { makeRequest } from "@/helpers/request";
import { checkBoolean } from "@/helpers/common";

export default function LoginPage() {

  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const [loading, setLoading] = useState(false);
  const addToken = useAuthStateStore((state) => state.addToken);

  // Use Formik hook
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
      access: "user"
    },
    validationSchema: loginSchema,
    onSubmit: async (values) => handleFormSubmit(values),
  });

  // Deconstruct Formik object
  const { errors, touched, values, handleChange, handleSubmit } = formik;

  // Handle form submission
  const handleFormSubmit = async (values: any) => {
    setLoading(true);

    // Submit form
    const formResponse: ApiResponseInterface = await makeRequest(
      "/api/auth/login",
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

      // Set access token and redirect to dashboard
      addToken(
        formResponse.data.response.access_token,
        formResponse.data.response.refresh_token,
        formResponse.data.response.token_type,
        formResponse.data.response.expires_at,
      )
      // perform redirect
      setTimeout(() => {
        setLoading(false);
        router.replace('/account/home');
      }, 1000);
    }
  };

  return (
    <>
      <div className="col-span-full lg:col-span-6">
        <div className="flex flex-col items-center justify-center gap-10 text-center">
          <div className="hidden sm:block">
            <Image src={`/assets/images/loti/loti-auth.svg`} width={400} height={500} alt="banner" style={{ width: "auto", height: "auto" }} className="group-data-[theme-mode=dark]:hidden" priority={true} />
            <Image src={`/assets/images/loti/loti-auth-dark.svg`} width={400} height={500} alt="banner" style={{ width: "auto", height: "auto" }} className="group-data-[theme-mode=light]:hidden" priority={true} />
          </div>
          <div>
            <h3 className="text-xl md:text-[28px] leading-none font-semibold text-heading">
              Welcome back!
            </h3>
            <p className="font-medium text-gray-500 dark:text-dark-text mt-4 px-[10%]">
              Access your phone and make calls anywhere, anytime!
            </p>
          </div>
        </div>
      </div>

      <div className="col-span-full lg:col-span-6 w-full lg:max-w-[600px]">
        <div className="border border-form dark:border-dark-border p-5 md:p-10 rounded-20 md:rounded-30">
          <h3 className="text-xl md:text-[28px] leading-none font-semibold text-heading">
            Sign In
          </h3>
          <p className="font-medium text-gray-500 dark:text-dark-text mt-4">
            Welcome Back! Log in to your account
          </p>

          <form className="leading-none mt-8" onSubmit={handleSubmit}>
            <div className="mb-2.5 pt-1">
              <Input
                isRequired
                type="email"
                name="email"
                variant="bordered"
                label="Email"
                labelPlacement="outside"
                onChange={handleChange}
                placeholder="my@example.com"
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
                type={isVisible ? "text" : "password"}
                name="password"
                variant="bordered"
                label="Password"
                labelPlacement="outside"
                onChange={handleChange}
                placeholder="Password"
                isInvalid={checkBoolean(errors.password, touched.password)}
                value={values.password}
                errorMessage={errors.password}
                classNames={{
                  label: "form-label",
                  inputWrapper: "form-input px-4 py-3.5 rounded-lg"
                }}
                endContent={(
                  <label data-for="toggleInputType" className="size-8 rounded-md flex-center hover:bg-gray-200 dark:hover:bg-dark-icon foucs:bg-gray-200 dark:foucs:bg-dark-icon position-center left-[95%]">
                    <input type="checkbox" id="toggleInputType" onClick={toggleVisibility} className="inputTypeToggle peer/it" hidden />
                    <i className="ri-eye-off-line text-gray-500 dark:text-dark-text peer-checked/it:before:content-['\ecb5']"></i>
                  </label>
                )}
              />
            </div>

            <div className="flex items-center justify-between pt-3 pb-7">
              <div className="flex items-center gap-1 select-none">
                <Checkbox classNames={{
                  label: "font-spline_sans text-sm leading-none text-gray-900 dark:text-dark-text cursor-pointer"
                }}>
                  Remember me
                </Checkbox>
              </div>
              <a href="/auth/forgot-password" className="text-xs leading-none text-primary-500 font-semibold">Forgot password?</a>
            </div>

            <Button isLoading={loading ? true : false} className="btn b-solid btn-primary-solid font-bold w-full" type="submit">Sign In {<Icon icon="mdi:send" fontSize={20} />}</Button>
          </form>
          <div className="text-gray-900 dark:text-dark-text flex flex-col justify-center items-center font-medium leading-none mt-5">
            <p>Don't have an account yet?</p> <br />
            <a href="/auth/register" className="text-primary-500 font-semibold">Sign Up</a>
          </div>
        </div>
      </div>
    </>
  );
}
