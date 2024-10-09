"use client";
import { toast } from "react-toastify";
import { useState, useEffect } from "react";
import { makeRequest } from "@/helpers/request";
import { LoadingContainer } from "@/components/loading-container";
import { Tabs, Tab, User, Button, Input } from "@nextui-org/react";
import { ApiResponseInterface, voipProviderListProps } from "@/types";



export default function ProviderSettingsPage() {

    const [loading, setLoading] = useState(false);
    const [pageLoading, setPageLoading] = useState(false);
    const [providers, setProviders] = useState<voipProviderListProps[]>([]);
    const [voipFormValues, setVipFormValues] = useState<any[]>([]);

    // Fetch and set providers data
    const fetchProviders = async () => {
        setPageLoading(true);
        // Make get request
        const providersResponse: ApiResponseInterface = await makeRequest(
            "/api/account/voip-providers",
            "GET",
            {},
            true
        );

        if (providersResponse.status == true) {
            // save user profile data to state
            setProviders(providersResponse.data.response)
        }
        setPageLoading(false);
    }

    const setInitialFormValues = async () => {
        if (providers.length > 0) {
            providers.map((provider, index) => {
                let pCredentials: any = {}, exists: boolean = false;
                provider.parameters.map((parameter) => {
                    pCredentials[parameter.field] = parameter.value;
                });

                // check if provider not already exists
                if(voipFormValues.length) {
                    const existingProvider = voipFormValues.find(value => value.provider_id == provider.id);
                    if (existingProvider) {
                        exists = true;
                    }
                }
                if (!exists) {
                    setVipFormValues(prevItems => [...prevItems, {
                        provider_id: provider.id,
                        credentials: pCredentials
                    }]);
                }
            });
        }
    }

    const handleFormChange = (event: any) => {
        const targetName = event.target.name;
        const value = event.target.value;

        const fieldSplit = targetName.split('.');
        const name = fieldSplit[2];
        const providerId = parseInt(fieldSplit[1]);

        // Create a new array by mapping over the existing one
        setVipFormValues(prevItems => prevItems.map(item => {
            // If the item matches the ID, update its name
            if (item.provider_id === providerId) {
                return { ...item, credentials: {...item.credentials, [name] : value} };
            } else {
                // Otherwise, return the item unchanged
                return item;
            }
        }));
    }


    // Handle form submission
    const handleForm = async (e: any) => {
        e.preventDefault();
        setLoading(true);

        // Make get request
        const submissionResponse: ApiResponseInterface = await makeRequest(
            "/api/account/providers/create",
            "POST",
            {settings: voipFormValues},
            true
        );

        if (submissionResponse.status == false) {
            toast.dismiss();
            toast.error(submissionResponse.data.message, {
              position: "bottom-right",
            });
            setLoading(false);
        } else {
            toast.dismiss();
            toast.success(submissionResponse.data.message, {
              position: "bottom-right",
            });
            setLoading(false);
        }
    }

    // Fetch providers
    useEffect(() => {
        fetchProviders();
    }, []);

    // build form initial values once poviders are loaded
    useEffect(() => {
        setInitialFormValues();
    }, [providers]);

    return (
        <div className="card">
            <div className="p-1.5">
                <div className="flex-center-between">
                    <div className="flex items-center gap-5">
                        <h6 className="leading-none text-[28px] font-semibold text-heading hidden md:block">Providers Settings</h6>
                    </div>
                </div>

                {pageLoading ? (<LoadingContainer />) : (
                    <div className="mt-8">
                        <div className="flex mt-4 w-full flex-col">
                            <Tabs aria-label="Providers" variant="underlined"
                            classNames={{
                                tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
                                cursor: "w-full bg-primary",
                                tab: "max-w-fit px-0 h-12",
                                tabContent: "group-data-[selected=true]:text-primary"
                              }}>
                            {providers.map((provider: voipProviderListProps, index) => (
                                <Tab
                                key={provider.slug}
                                title={
                                    <div className="flex items-center space-x-2">
                                        <User
                                            avatarProps={{ radius: "lg", src: `${process.env.NEXT_PUBLIC_APP_BACKEND_URL}${provider.image}` }}
                                            name={provider.name}>
                                            {provider.slug}
                                        </User>
                                    </div>
                                }
                                >
                                    <form className="flex flex-col gap-4 mt-5" method="post" onSubmit={handleForm}>
                                        <input type="hidden" name="provider_id" value={voipFormValues[index]?.provider_id}/>
                                        {provider.parameters.map((parameter: any, pIndex: number) => (
                                            <Input
                                                key={pIndex}
                                                isRequired
                                                label={parameter.label}
                                                placeholder={parameter.description}
                                                type="text"
                                                name={`name.${provider.id}.${parameter.field}`}
                                                labelPlacement="outside"
                                                variant="bordered"
                                                onChange={handleFormChange}
                                                value={voipFormValues[index]?.credentials[parameter.field]}
                                                classNames={{
                                                    label: "form-label",
                                                    inputWrapper: "form-input px-4 py-3.5 rounded-lg"
                                                }}
                                            />
                                        ))}
                                        
                                        <div className="flex gap-2 justify-end">
                                            <Button isLoading={loading ? true : false} fullWidth color="primary" type="submit"> Update Credentials </Button>
                                        </div>
                                    </form>
                                </Tab>
                            ))}
                            </Tabs>
                        </div>  
                    </div>
                )}
            </div>
        </div>
    );
}
