import * as yup from "yup";

const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;


export const loginSchema = yup.object().shape({
    email: yup
      .string()
      .required("Email address field is required")
      .email("Invalid email address"),
    password: yup.string().required("Password field is required"),
  });

  export const registerSchema = yup.object().shape({
    email: yup.string().required("Email address field is required").email("Invalid email address"),
    first_name: yup.string().required("First name field is required")
    .test(
      "len",
      "First name must not be less than 3 characters",
      (val) => val.length > 3,
    ),
    last_name: yup.string().required("Last name field is required")
    .test(
      "len",
      "Last Name must not be less than 3 characters",
      (val) => val.length > 3,
    ),
    phone: yup.string().required("Phone number field is required")
    .matches(phoneRegExp, "Phone number is not valid"),
    password: yup.string().required("Password field is required")
      .min(8, 'Password is too short - should be 8 chars minimum.')
      .matches(/[a-zA-Z]/, 'Password can only contain Latin letters.'),
  });

export const emailSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email address field is required")
    .email("Invalid email address")
});

export const resetFormSchema = yup.object().shape({
  email: yup
    .string()
    .required("Email address field is required")
    .email("Invalid email address"),
  token: yup.number().required("Token field is required").test(
    "maxDigits",
    "Token field must have exactly 6 digits",
    (number) => String(number).length === 6
  ),
  password: yup.string().required("Password field is required")
    .min(8, 'Password is too short - should be 8 chars minimum.')
    .matches(/[a-zA-Z]/, 'Password can only contain Latin letters.'),
});

export const callSchema = yup.object().shape({
  to: yup.string().required("Phone number field is required")
    .matches(phoneRegExp, "Phone number is not valid"),
});

  