"use client";
import * as React from "react";
import { Icon } from "@iconify/react";
import { toast } from "react-toastify";
import { Input } from "@nextui-org/input";
import { Switch } from "@nextui-org/switch";
import { Button } from "@nextui-org/button";
import { sessionListProps, ApiResponseInterface } from "@/types";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, useDisclosure, Select, SelectItem, CircularProgress } from "@nextui-org/react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Tooltip } from "@nextui-org/react";
import { makeRequest } from "@/helpers/request";


export default function AdminPage() {

    const [loading, setLoading] = React.useState(false);
    const [sessions, setSessions] = React.useState<sessionListProps[]>([]);
    const [currentSession, setCurrentSession] = React.useState<sessionListProps>();
    const { isOpen: viewModelOpen, onOpen: viewModalOnOpen, onOpenChange: viewModalOpenChange } = useDisclosure();

    const columns = [
        { name: "SESSION ID", uid: "session" },
        { name: "FROM", uid: "from" },
        { name: "TO", uid: "to" },
        { name: "DIRECTION", uid: "direction" },
        { name: "DURATION", uid: "duration" },
        { name: "STATUS", uid: "status" },
        { name: "ACTIONS", uid: "actions" },
    ];

    const openAdminDetails = (session: sessionListProps) => {
        setCurrentSession(session);
        viewModalOnOpen();
    }

    // Fetch and set call sessions data
    const fetchCallSessions = async () => {
        // Make get request
        const sessionResponse: ApiResponseInterface = await makeRequest(
            "/api/admins/list",
            "GET",
            {},
            true
        );

        if (sessionResponse.status == true) {
            // save session data to state
            setSessions(sessionResponse.data.response)
        }
        setLoading(false);
    }

    // Call once
    React.useEffect(() => {
        fetchCallSessions();
    }, []);

    const renderCell = React.useCallback((admin: any, columnKey: any) => {
        const cellValue = admin[columnKey];

        switch (columnKey) {
            case "name":
                return (
                    <h6 className="card-title text-lg line-clamp-1">
                        {cellValue}
                    </h6>
                );
            case "role":
                return (
                    <Chip className="capitalize" color="default" size="sm" variant="flat">
                        <span className="font-bold">{admin.roles[0].name}</span>
                    </Chip>
                );
            case "verified":
                return admin.is_verified == 1 ? "Yes" : "No";
            case "status":
                return (
                    <Chip className="capitalize" color="default" size="sm" variant="flat">
                        <span className="font-bold">{cellValue}</span>
                    </Chip>
                );
            case "actions":
                return (
                    <div className="relative flex items-center gap-2">
                        <Tooltip content="Details">
                            <Button onClick={() => openAdminDetails(admin)} isIconOnly>
                                <span className="text-lg text-default-400 cursor-pointer active:opacity-50">
                                    <Icon icon="mdi:eye" fontSize={20} />
                                </span>
                            </Button>
                        </Tooltip>
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);

    return (
        <>
            <div className="card">
                <div className="p-1.5">
                    <div className="flex-center-between">
                        <div className="flex items-center gap-5">
                            <h6 className="leading-none text-[28px] font-semibold text-heading hidden md:block">Call Sessions</h6>
                        </div>
                    </div>

                    <div className="overflow-x-auto scrollbar-table">
                        <Table
                            isCompact
                            removeWrapper
                            aria-label="Admins List"
                            classNames={{
                                table: "table-auto w-full whitespace-nowrap text-left text-gray-500 dark:text-dark-text font-medium leading-none mt-5",
                                thead: "relative z-[1] before:absolute before:size-full before:bg-[#F4F4F4] dark:before:bg-dark-icon before:rounded-10 before:-z-[1]",
                                th: "font-semibold",
                                tbody: "divide-y divide-gray-200 dark:divide-dark-border-three text-heading dark:text-dark-text"
                            }}>
                            <TableHeader columns={columns}>
                                {(column) => (
                                    <TableColumn key={column.uid} align={column.uid === "actions" ? "center" : "start"}>
                                        {column.name}
                                    </TableColumn>
                                )}
                            </TableHeader>
                            <TableBody isLoading={loading} emptyContent={"No admin users found"} items={sessions}>
                                {(item) => (
                                    <TableRow key={item.id}>
                                        {(columnKey) => <TableCell>{renderCell(item, columnKey)}</TableCell>}
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={viewModelOpen}
                onOpenChange={viewModalOpenChange}
                isDismissable={true}
                size="2xl"
                isKeyboardDismissDisabled={true}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Session Details</ModalHeader>
                            <ModalBody>
                                <div className="px-2 py-2 flex flex-row justify-between items-center">
                                    <div className="">Session ID</div>
                                    <div className="">{currentSession?.session_id}</div>
                                </div>
                                <div className="px-2 py-2 flex flex-row justify-between items-center">
                                    <div className="">Caller</div>
                                    <div className="">{currentSession?.from}</div>
                                </div>
                                <div className="px-2 py-2 flex flex-row justify-between items-center">
                                    <div className="">Destination</div>
                                    <div className="">{currentSession?.to}</div>
                                </div>
                                <div className="px-2 py-2 flex flex-row justify-between items-center">
                                    <div className="">Duration</div>
                                    <div className="">{currentSession?.duration}</div>
                                </div>
                                <div className="px-2 py-2 flex flex-row justify-between items-center">
                                    <div className="">Direction</div>
                                    <div className="">{currentSession?.direction}</div>
                                </div>
                                <div className="px-2 py-2 flex flex-row justify-between items-center">
                                    <div className="">Status</div>
                                    <div className="">
                                        <Chip className="capitalize" size="md" variant="flat">
                                            <span className="font-bold">{currentSession?.status}</span>
                                        </Chip>
                                    </div>
                                </div>
                                <div className="px-2 py-2 flex flex-row justify-between items-center">
                                    <div className="">Joined Date</div>
                                    <div className="">{(new Date(currentSession?.created_at ?? "").toDateString())}</div>
                                </div>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="primary" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
}
