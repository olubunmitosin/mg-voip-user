"use client";

import Link from "next/link";
import { useFormik } from "formik";
import { Icon } from "@iconify/react";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import { ApiResponseInterface } from "@/types";
import { makeRequest } from "@/helpers/request";
import { callSchema } from "@/helpers/validators";
import { useAuthStateStore } from "@/hooks/authStateStore";
import { checkBoolean, todayDate } from "@/helpers/common";
import { Button, Input, Tooltip, User } from "@nextui-org/react";
import { LoadingContainer } from "@/components/loading-container";


declare global {
    interface Window {
        Africastalking : any;
    }
}

export default function Home() {

    // Get user instance
    const user = useAuthStateStore((state) => state.user);

    // wss://webrtc.africastalking.com/connect

    // let client: any = null;
    const [pageLoading, setPageLoading] = useState(true);
    const [client, setClient] = useState<any>(null);
    const [credentials, setCredentials] = useState<any>(null);
    const [token, setToken] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [calling, setCalling] = useState(false);
    const [ringing, setRinging] = useState(false);
    const [callStatus, setCallStatus] = useState<any>(null);
    const [mute, setMute] = useState(false);
    const [hasCredentials, setHasCredentials] = useState(false);

    const addUser = useAuthStateStore((state) => state.addUser);
    const today = todayDate();

    // fetch provider credentials
    const fetchProviderCredentials = async () => {
        const credentialResponse: ApiResponseInterface = await makeRequest(
            "/api/account/providers/details",
            "GET",
            {},
            true
        );
        if (credentialResponse.status == true) {
            setHasCredentials(true);
            setCredentials(credentialResponse.data.response);
        } else {
            setHasCredentials(false);
        }

        setPageLoading(false);
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

    const makeCall = (callClient:any, phone: string) => {
        // define local call client holder
        let localClient: any;
        // first assign local call client to global call client
        localClient = client;
        // If global call client is not yet initialized, set local call client to argument call client
        if (!client) localClient = callClient;

        if (localClient) {
            // client has been initialized
            localClient.call(phone);
            setTimeout(() => {
                setLoading(false);
            }, 500);

        } else {
            setLoading(false);
        }
    }

    // Handle Hangup events
    const onHandUp = () => {
        if (client) {
            client.hangup();
            setCalling(false);
            setRinging(false);
            setCallStatus(null);
            toast.dismiss();
            toast.success("Call ended!", {
                position: "bottom-right",
            });
        } else {
            toast.dismiss();
            toast.error("Call service has been properly initialized. Kindly wait a min!", {
                position: "bottom-right",
            });
        }
    }

    // Handle Mute events
    const onHandleMute = () => {
        if (client) {
            if (!mute) {
                client.muteAudio();
                setMute(true);
                toast.dismiss();
                toast.success("Call muted", {
                    position: "bottom-right",
                }); 

            } else {
                client.unmuteAudio();
                setMute(false);
                toast.success("Call unmuted", {
                    position: "bottom-right",
                }); 
            }
        } else {
            toast.dismiss();
            toast.error("Call service has been properly initialized. Kindly wait a min!", {
                position: "bottom-right",
            });
        }
    }

   
    // Use Formik hook
    const formik = useFormik({
        initialValues: {
            to: "",
        },
        validationSchema: callSchema,
        onSubmit: async (values) => makeOutgoingCall(values),
    });

    const { errors, touched, values, handleChange, handleSubmit } = formik;

    // Handle form submission (Make Call)
    const makeOutgoingCall = async (values: any) => {
        setLoading(true);
        let currentToken = token;

        if (!token) {
            const tokenResponse: ApiResponseInterface = await makeRequest(
                "/api/account/call/token",
                "GET",
                {},
                true
            );
    
            if (tokenResponse.status == false) {
                toast.dismiss();
                toast.error(`${tokenResponse?.data.message ?? "Could not get token"}`, {
                    position: "bottom-right",
                });
                setLoading(false);
                return;
            }
            
            const callTokenData = tokenResponse.data.response;
            setToken(callTokenData.token);
            currentToken = callTokenData.token;
        }
        
        // Check instance of client sdk
        if (typeof window !== "undefined") {
             // initialize call sdk
            let Africastalking = window.Africastalking;
            let tempClient = client;
            if (!client) {
                tempClient = new Africastalking.Client(currentToken);
                setClient(tempClient);
            }
            // const tempClient = new Africastalking.Client(currentToken);
            // setClient(tempClient);
            
            setTimeout(() => {
                makeCall(tempClient, `+${values.to}`);
            }, 8000);

        } else {
            toast.dismiss();
            toast.error("Call service has been properly initialized. Kindly wait a min!", {
                position: "bottom-right",
            });
            setLoading(false);
        }
    };

    // Handle call events
    const handleCallEvents = () => {
        if (client) {
            
            client.on("calling", function () {
                setMute(false);
                setCalling(true);
                setRinging(true);
                setCallStatus("Calling...");
            }, false);

            client.on("hangup", function (event: any) {
                setCalling(false);
                setRinging(false);
                setCallStatus(null);
                toast.dismiss();
                toast.info(`${event.reason ?? "Call Terminated or number not reachable"}`, {
                    position: "bottom-right",
                });
            }, false);

            client.on("callaccepted", function () {
                setRinging(false);
                setCallStatus("Call Accepted");
            }, false);

            client.on("incomingcall", function () {
                client.answer();
            }, false);
        }
    }


    // Call once
    useEffect(() => {
        fetchProviderCredentials();
        fetchUserProfile();
    }, []);


    useEffect(() => {
        handleCallEvents();
    }, [client]);

    if (pageLoading) {
        return (<LoadingContainer/>);
    } else {
        return (
            <>
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

                {!hasCredentials ? (
                    <div className="col-span-full">
                        <div className="col-span-8 card text-center min-h-52">
                            <p>Sorry! You do not have any VoIP credentials set. Kindly <Link className="font-bold text-primary" href="/account/provider-settings">click here</Link> to set your own credentials.</p>
                        </div>
                    </div>
                ) : (
                    <>
                    {calling && (
                        <div className="col-span-full">
                            <div className="*:p-7 grid grid-cols-12 gap-5 mb-3">
                                <div className="col-span-8 card min-h-32 text-white bg-success *:rounded-15 dark:bg-primary-500">
                                    <div className="flex flex-col justify-center items-center">
                                        <span>{callStatus}</span>
                                    </div>
                                </div>
                                <div className="col-span-4 card *:rounded-15">
                                    <div className="flex flex-row flex-wrap gap-5">
                                        <Tooltip content="End Call">
                                            <Button onClick={onHandUp} isIconOnly type="button" color="danger" aria-label="End Call">
                                                <Icon icon="solar:end-call-linear" fontSize={30} />
                                            </Button>
                                        </Tooltip>
                                        <Tooltip content={mute ? "Unmute": "Mute"}>
                                            <Button onClick={onHandleMute} disabled={ringing} isIconOnly type="button" color={mute? "primary": "default"} aria-label="Mute">
                                                {mute? <Icon icon="octicon:unmute-24" fontSize={30} /> : <Icon icon="octicon:mute-24" fontSize={30} />}
                                            </Button>
                                        </Tooltip>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="col-span-full card">
                        <div className="*:p-7 *:rounded-15 grid grid-cols-12 gap-4 mb-4">
                            <div className="col-span-12">
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
                                                placeholder="234xxxxxxxxx"
                                                isInvalid={checkBoolean(errors.to, touched.to)}
                                                value={values.to}
                                                errorMessage={errors.to}
                                                classNames={{
                                                    label: "form-label",
                                                    inputWrapper: "form-input px-4 py-3.5 rounded-lg"
                                                }}
                                            />
                                        </div>

                                        <Button disabled={ringing} isLoading={loading ? true : false} className="btn b-solid btn-primary-solid font-bold w-full" type="submit">{<Icon icon="mdi:call" fontSize={20} />} Call Now</Button>
                                    </form>
                                </div>
                            </div>
                            <div className="col-span-12">
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
                )}
            </>
        );
    }
}
