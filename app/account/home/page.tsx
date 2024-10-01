"use client";

import axios from 'axios';
import { useFormik } from "formik";
import { Icon } from "@iconify/react";
import useApi from "@/hooks/useApi";
import { toast } from "react-toastify";
import { useEffect, useRef, useState } from "react";
import { ApiResponseInterface } from "@/types";
import { makeRequest } from "@/helpers/request";
import { callSchema } from "@/helpers/validators";
import { useAuthStateStore } from "@/hooks/authStateStore";
import { checkBoolean, todayDate } from "@/helpers/common";
import { Button, Input, Tooltip, User } from "@nextui-org/react";
import { Web } from "sip.js";

import { LoadingContainer } from "@/components/loading-container";

export default function Home() {

    const sipConfigurations = {
        domain: "ng.sip.africastalking.com",
        webSocket: "ng.sip.africastalking.com",
        username: "agent.lagosvoice",
        password: "DOPx_ad5cf82f2e",
        displayName: "Agent 1"
    };

    const audioRef = useRef<HTMLAudioElement | null>(null);
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [calling, setCalling] = useState(false);
    const [callStatus, setCallStatus] = useState(null);
    const [sessionId, setSessionId] = useState<string>();
    const [client, setClient] = useState();

    const initCallSettings = () => {
        // Helper function to get an HTML audio element
        const getAudioElement = (id: string): HTMLAudioElement => {
            const el = audioRef.current;
            if (!(el instanceof HTMLAudioElement)) {
                throw new Error(`Element "${id}" not found or not an audio element.`);
            }
            return el;
        }

        // Options for SimpleUser
        const options: Web.SimpleUserOptions = {
            aor: `sip:${sipConfigurations.username}@${sipConfigurations.domain}`,
            media: {
                constraints: { audio: true, video: false }, // audio only call
                remote: { audio: getAudioElement("remoteAudio") } // play remote audio
            },
            userAgentOptions: {
                authorizationUsername: sipConfigurations.username,
                authorizationPassword: sipConfigurations.password,
                displayName: sipConfigurations.displayName,
                viaHost: `${sipConfigurations.domain}`
            }
        };
        
        // WebSocket server to connect with
        const server = `wss://${sipConfigurations.webSocket}`;
        
        // Construct a SimpleUser instance
        const simpleUser = new Web.SimpleUser(server, options);
        // Connect to server and place call
        simpleUser.connect()
        .then(() => {
            console.log("Connected");
        }).catch((error: Error) => {
            console.log("Error", error);
        });
    }

    const [credentials, setCredentials] = useState<any>(null);

    const addUser = useAuthStateStore((state) => state.addUser);
    const today = todayDate();

    // fetch provider credentials
    const fetchProviderCredentials = async () => {
        const credentialResponse: ApiResponseInterface = await makeRequest(
            "/api/account/providers/details",
            "POST",
            { 'id': 1 },
            true
        );
        if (credentialResponse.status == true) {
            setCredentials(credentialResponse.data.response);
        }

        // TEST
        // setCalling(true);
        // setSessionId('Session849484949');
    }

    // Fetch and set user data
    const fetchUserProfile = async () => {
        // Make get request
        const profileResponse: ApiResponseInterface = await makeRequest(
            "/api/account/profile",
            "GET",
            {},
            true
        );
        if (profileResponse.status == true) {
            // save user profile data to state
            addUser(profileResponse.data.response);
            setLoaded(true);
        }
    }

    // Use Formik hook
    const formik = useFormik({
        initialValues: {
            to: "",
            provider_id: ""
        },
        validationSchema: callSchema,
        onSubmit: async (values) => handleFormSubmit(values),
    });

    const { errors, touched, values, handleChange, handleSubmit } = formik;

    // Handle form submission
    const handleFormSubmit = async (values: any) => {
        setLoading(true);

        values.provider_id = credentials?.id;
        // Submit form
        const formResponse: ApiResponseInterface = await makeRequest(
            "/api/account/call/new",
            "POST",
            values,
            true
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
            setLoading(false);
            // Set calling status

        }
    };

    // Call once
    useEffect(() => {
        fetchProviderCredentials();
        fetchUserProfile();
    }, []);

    useEffect(() => {
        initCallSettings();
    }, []);

    const user = useAuthStateStore((state) => state.user);

    return (
        <>
            <audio ref={audioRef} id="remoteAudio" controls>
                <p>Your browser doesn't support HTML5 audio.</p>
            </audio>
            <div className="col-span-full">
                <div className="relative card bg-heading dark:bg-primary-500 py-7 xl:mb-8">
                    <div className="flex flex-col-reverse sm:flex-row gap-5 justify-between">
                        <div className="shrink-0">
                            <h1 className="text-white text-[25px] leading-none font-semibold flex-center gap-2 justify-start">
                                <span className="shrink-0">Good Day, {user?.last_name}</span>
                                <span className="select-none hidden md:inline-block animate-hand-wave origin-[70%_70%]">👋</span>
                            </h1>
                            <p className="font-spline_sans text-sm text-dark-text dark:text-white mt-2">We're glad to have you back</p>
                        </div>
                        <div className="shrink-0">
                            <p className="font-spline_sans text-sm !leading-none text-white today">Today is {today}</p>
                        </div>
                    </div>
                </div>
            </div>

            {calling && (
                <div className="col-span-full">
                    <div className="*:p-7 grid grid-cols-12 gap-5 mb-3">
                        <div className="col-span-8 card min-h-32 text-white bg-success *:rounded-15 dark:bg-primary-500">
                            <div className="flex flex-col justify-center items-center">
                                <span>{callStatus}</span>
                                <span>{sessionId}</span>
                            </div>
                        </div>
                        <div className="col-span-4 card *:rounded-15">
                            <div className="flex flex-row flex-wrap gap-5">
                                <Tooltip content="End Call">
                                    <Button isIconOnly type="button" color="danger" aria-label="End Call">
                                        <Icon icon="solar:end-call-linear" fontSize={30} />
                                    </Button>
                                </Tooltip>
                                <Tooltip content="Mute">
                                    <Button isIconOnly type="button" color="default" aria-label="Mute">
                                        <Icon icon="quill:mute" fontSize={30} />
                                    </Button>
                                </Tooltip>
                                <Tooltip content="Hold">
                                    <Button isIconOnly type="button" color="default" aria-label="Hold">
                                        <Icon icon="ep:mute" fontSize={30} />
                                    </Button>
                                </Tooltip>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="col-span-full card">
                <div className="*:p-7 *:rounded-15 grid grid-cols-12 gap-4 mb-4">
                    <div className="col-span-6">
                        <div className="">
                            <form className="leading-none mt-8" onSubmit={handleSubmit}>
                                <div className="mb-2.5 pt-1">
                                    <Input
                                        isRequired
                                        type="number"
                                        name="to"
                                        variant="bordered"
                                        label="Phone Number"
                                        labelPlacement="outside"
                                        onChange={handleChange}
                                        placeholder="xxxxxxxxxxxxxxx"
                                        isInvalid={checkBoolean(errors.to, touched.to)}
                                        value={values.to}
                                        errorMessage={errors.to}
                                        classNames={{
                                            label: "form-label",
                                            inputWrapper: "form-input px-4 py-3.5 rounded-lg"
                                        }}
                                    />
                                </div>

                                <Button disabled={calling} isLoading={loading ? true : false} className="btn b-solid btn-primary-solid font-bold w-full" type="submit">Call Now {<Icon icon="mdi:call" fontSize={20} />}</Button>
                            </form>
                        </div>
                    </div>
                    <div className="col-span-6">
                        {!loaded && !credentials ? (<LoadingContainer />) : (
                            <div className="relative w-full">
                                <div className="px-2 py-2 flex flex-row justify-between items-center">
                                    <div className="">Provider</div>
                                    <div className="">
                                        <User
                                            avatarProps={{ radius: "lg", src: `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}${credentials?.provider_image}` }}
                                            description={credentials?.provider_name}
                                            name={credentials?.provider_name}
                                        >
                                            {credentials?.provider_slug}
                                        </User>
                                    </div>
                                </div>
                                <div className="px-2 py-2 flex flex-row justify-between items-center">
                                    <div className="">Phone Number</div>
                                    <div className="">{credentials?.credentials.phone}</div>
                                </div>
                                <div className="px-2 py-2 flex flex-row justify-between items-center">
                                    <div className="">Username</div>
                                    <div className="">{credentials?.credentials.username}</div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );

}
