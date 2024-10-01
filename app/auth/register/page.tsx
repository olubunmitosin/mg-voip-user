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
import { registerSchema } from "@/helpers/validators";
import { makeRequest } from "@/helpers/request";
import { checkBoolean } from "@/helpers/common";

export default function RegisterPage() {

  const router = useRouter();
  const [isVisible, setIsVisible] = useState(false);
  const toggleVisibility = () => setIsVisible(!isVisible);

  const [loading, setLoading] = useState(false);

  // Use Formik hook
  const formik = useFormik({
    initialValues: {
      first_name: "",
      last_name: "",
      phone: "",
      email: "",
      password: "",
      access: "user"
    },
    validationSchema: registerSchema,
    onSubmit: async (values) => handleFormSubmit(values),
  });

  // Deconstruct Formik object
  const { errors, touched, values, handleChange, handleSubmit } = formik;

  // Handle form submission
  const handleFormSubmit = async (values: any) => {
    setLoading(true);

    // Submit form
    const formResponse: ApiResponseInterface = await makeRequest(
      "/api/auth/register",
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
      // perform redirect
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
            <Image src={`/assets/images/loti/loti-auth.svg`} width={400} height={500} alt="banner" style={{ width: "auto", height: "auto" }} className="group-data-[theme-mode=dark]:hidden" priority={true} />
            <Image src={`/assets/images/loti/loti-auth-dark.svg`} width={400} height={500} alt="banner" style={{ width: "auto", height: "auto" }} className="group-data-[theme-mode=light]:hidden" priority={true} />
          </div>
          <div>
            <h3 className="text-xl md:text-[28px] leading-none font-semibold text-heading">
              MG VoIP
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
            Sign Up
          </h3>
          <p className="font-medium text-gray-500 dark:text-dark-text mt-4">
            Welcome! create an account today
          </p>

          <form className="leading-none mt-8" onSubmit={handleSubmit}>

            <div className="lg:flex lg:flex-row lg:gap-3 block mb-2.5 pt-1">
                <Input
                  isRequired
                  type="text"
                  name="first_name"
                  variant="bordered"
                  label="First Name"
                  labelPlacement="outside"
                  onChange={handleChange}
                  placeholder="John"
                  isInvalid={checkBoolean(errors.first_name, touched.first_name)}
                  value={values.first_name}
                  errorMessage={errors.first_name}
                  classNames={{
                    label: "form-label",
                    inputWrapper: "form-input px-4 py-3.5 rounded-lg mt-3"
                  }}
                />
                <Input
                  isRequired
                  type="text"
                  name="last_name"
                  variant="bordered"
                  label="Last Name"
                  labelPlacement="outside"
                  onChange={handleChange}
                  placeholder="Doe"
                  isInvalid={checkBoolean(errors.last_name, touched.last_name)}
                  value={values.last_name}
                  errorMessage={errors.last_name}
                  classNames={{
                    label: "form-label",
                    inputWrapper: "form-input px-4 py-3.5 rounded-lg mt-3"
                  }}
                />
              </div>
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

            <div className="mb-2.5 pt-2">
              <Input
                isRequired
                type="number"
                name="phone"
                variant="bordered"
                label="Phone Number"
                labelPlacement="outside"
                onChange={handleChange}
                placeholder="xxxxxxxxxxxxx"
                isInvalid={checkBoolean(errors.phone, touched.phone)}
                value={values.phone}
                errorMessage={errors.phone}
                classNames={{
                  label: "form-label",
                  inputWrapper: "form-input px-4 py-3.5 rounded-lg"
                }}
              />
            </div>

            <div className="pt-2.5 pb-8">
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

            <Button isLoading={loading ? true : false} className="btn b-solid btn-primary-solid font-bold w-full" type="submit">Sign Up {<Icon icon="mdi:send" fontSize={20} />}</Button>
          </form>
          <div className="text-gray-900 dark:text-dark-text flex flex-col justify-center items-center font-medium leading-none mt-5">
            <p>Already have an account?</p> <br />
            <a href="/auth/login" className="text-primary-500 font-semibold">Sign In</a>
          </div>
        </div>
      </div>
    </>
  );
}
