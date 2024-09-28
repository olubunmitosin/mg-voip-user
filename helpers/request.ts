import { useAuthStateStore } from "@/hooks/authStateStore";
import axiosInstance from "../hooks/axiosInstance";

export const makeRequest = async (
  url: string,
  method: string,
  data: any,
  requiredAuth: boolean = false,
): Promise<any> => {
  let tokenResponse: any = null;

  if (requiredAuth) {
    tokenResponse =  useAuthStateStore.getState().access_token;
  }

  if (requiredAuth == true && tokenResponse !== "" ) {
    // Set auth header
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${tokenResponse}`;
  }

  return await axiosInstance
    .request({
      data: data,
      method,
      url,
    })
    .then((response) => {
      let status = true;

      if (response && response.data) {
        status = response.data.status;
      }

      return {
        status: status,
        data: response.data,
      };
    })
    .catch((error) => {
      return {
        status: false,
        data: error.message,
      };
    });
};


export const makeFormDataRequest = async (
  url: string,
  method: string,
  data: FormData,
  requiredAuth: boolean = false,
): Promise<any> => {
  let tokenResponse: any = null;

  if (requiredAuth) {
    tokenResponse =  useAuthStateStore.getState().access_token;
  }

  if (requiredAuth == true && tokenResponse !== "" ) {
    // Set auth header
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${tokenResponse}`;
  }

  return await axiosInstance
    .request({
      data,
      method,
      url,
      headers: {
        'Content-Type': 'multipart/form-data',
      }
    })
    .then((response) => {
      let status = true;

      if (response && response.data) {
        status = response.data.status;
      }

      return {
        status: status,
        data: response.data,
      };
    })
    .catch((error) => {
      return {
        status: false,
        data: error.message,
      };
    });
};
