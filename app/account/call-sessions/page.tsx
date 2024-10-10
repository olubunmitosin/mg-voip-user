"use client";
import * as React from "react";
import { sessionListProps, ApiResponseInterface } from "@/types";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, Chip, Link} from "@nextui-org/react";
import { makeRequest } from "@/helpers/request";


export default function CallSessionPage() {

    const [loading, setLoading] = React.useState(false);
    const [sessions, setSessions] = React.useState<sessionListProps[]>([]);

    const columns = [
        { name: "DIRECTION", uid: "direction" },
        { name: "SESSION ID", uid: "session_id" },
        { name: "FROM", uid: "from" },
        { name: "TO", uid: "to" },
        { name: "CALL STATE", uid: "call_state" },
        { name: "CARRIER NAME", uid: "carrier_name" },
        { name: "DURATION", uid: "duration" },
        { name: "RECORD URL", uid: "record_url" },
        { name: "STATUS", uid: "status" },
    ];


    // Fetch and set call sessions data
    const fetchCallSessions = async () => {
        // Make get request
        const sessionResponse: ApiResponseInterface = await makeRequest(
            "/api/account/call/sessions",
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

    const renderCell = React.useCallback((session: any, columnKey: any) => {
        const cellValue = session[columnKey];

        switch (columnKey) {
            case "record_url":
                return (
                    <Link isBlock color="foreground" isExternal showAnchorIcon href={session.record_url}>Download</Link>
                );
            case "call_state":
                return (
                    <Chip className="capitalize" color="default" size="sm" variant="flat">
                        <span className="font-bold">{session.call_state}</span>
                    </Chip>
                );
            case "status":
                return (
                    <Chip className="capitalize" color="default" size="sm" variant="flat">
                        <span className="font-bold">{session.status}</span>
                    </Chip>
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
                            <TableBody isLoading={loading} emptyContent={"No call sessions found"} items={sessions}>
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
        </>
    );
}
