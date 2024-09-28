import { useEffect, useState, useRef } from "react";
import { AxiosResponse, AxiosError } from "axios";
import axiosInstance from "./axiosInstance";
import { useAuthStateStore } from "./authStateStore";

const useApi = <T>(
    url: string,
    method: string,
    payload: {},
    requiredAuth: boolean = false,
) => {
    const [data, setData] = useState<any | null>(null);
    const [error, setError] = useState<AxiosError>();
    const [loaded, setLoaded] = useState(false);

    const controllerRef = useRef(new AbortController());
    const cancel = () => {
        controllerRef.current.abort();
    };

    useEffect(() => {
        (async () => {
            try {
                // If it requires authentication, obtain token
                let tokenResponse: any = null;

                if (requiredAuth) {
                    tokenResponse = useAuthStateStore.getState().access_token;
                }

                if (requiredAuth == true && tokenResponse !== "") {
                    // Set auth header
                    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${tokenResponse}`;
                }

                const response: AxiosResponse<T> = await axiosInstance.request({
                    data: payload,
                    signal: controllerRef.current.signal,
                    method,
                    url,
                });

                setData(response.data);
            } catch (error: any) {
                setError(error);
            } finally {
                setLoaded(true);
            }
        })();
    }, []);

    return { cancel, data, error, loaded };
};

export default useApi;
