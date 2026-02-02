import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { CreateButton } from "@/components/refine-ui/buttons/create";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { ListView } from "@/components/refine-ui/views/list-view";
import { DEPARTMENT_OPTIONS } from "@/constants";
import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useTable } from "@refinedev/react-table";
import type { ColumnDef } from "@tanstack/react-table";

type Subject = {
    id: number;
    name?: string;
    department?: string;
    description?: string;
};

const SubjectsList = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState("all");
    const departmentFilters = selectedDepartment === 'all' ? [] : [{
        field: 'department',
        operator: 'eq' as const,
        value: selectedDepartment,
    }];
    const searchFilters = searchQuery ? [{
        field: 'name',
        operator: 'contains' as const,
        value: searchQuery,
    }] : [];

    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/6dac1f6a-680b-4e0b-87b2-f441b05623e3", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            sessionId: "debug-session",
            runId: "pre-fix",
            hypothesisId: "H2",
            location: "src/pages/subjects/list.tsx:beforeUseTable",
            message: "SubjectsList render before useTable",
            data: { searchQuery, selectedDepartment },
            timestamp: Date.now(),
        }),
    }).catch(() => { });
    // #endregion agent log

    const subjectTable = useTable<Subject>({
        columns: useMemo<ColumnDef<Subject>[]>(
            () => [
                {
                    id: "name",
                    accessorKey: "name",
                    size: 200,
                    header: () => <p className="column-title">Name</p>,
                    cell: ({ getValue }) => (
                        <span className="text-left">{getValue<string>()}</span>
                    ),
                    filterFn: "includesString",
                },
                {
                    id: "department",
                    accessorKey: "department",
                    header: () => <p className="column-title">Department</p>,
                    cell: ({ getValue }) => (
                        <span className="text-left">{getValue<string>()}</span>
                    ),
                },
                {
                    id: "departmentBadge",
                    accessorKey: "department",
                    header: () => <p className="column-title">Department</p>,
                    cell: ({ getValue }) => (
                        <Badge variant="secondary">{getValue<string>()}</Badge>
                    ),
                    filterFn: "includesString",
                },
                {
                    id: "description",
                    accessorKey: "description",
                    size: 300,
                    header: () => <p className="column-title">Description</p>,
                    cell: ({ getValue }) => (
                        <span className="truncate line-clamp-2">
                            {getValue<string>()}
                        </span>
                    ),
                },
                {
                    id: "placeholder",
                    header: () => null,
                    cell: () => null,
                }
            ],
            [],
        ),
        refineCoreProps: {
            resource: "subjects",
            pagination: { pageSize: 10, mode: "server" },
            // These must be objects (not `{}`) if you include them.
            filters: {
                permanent: [...departmentFilters, ...searchFilters],
                mode: "server"
            },
            sorters: {
                initial: [{ field: 'id', order: 'desc' },

                ], mode: "server"
            },
        },
    });

    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/6dac1f6a-680b-4e0b-87b2-f441b05623e3", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            sessionId: "debug-session",
            runId: "pre-fix",
            hypothesisId: "H5",
            location: "src/pages/subjects/list.tsx:afterUseTable",
            message: "SubjectsList render after useTable",
            data: {
                hasTable: Boolean(subjectTable),
                tableKeys: subjectTable ? Object.keys(subjectTable as object).slice(0, 20) : [],
            },
            timestamp: Date.now(),
        }),
    }).catch(() => { });
    // #endregion agent log

    return (
        <ListView>
            <Breadcrumb />

            <h1 className="page-title"> Subjects </h1>
            <div className="intro-row">
                <p> Quick access to essential metrics and management tools </p>
                <p> Track progress, manage resources, and make informed decisions with ease. </p>

            </div>
            <div className="actions-row">
                <div className="flex gap-2 w-full sm:w-auto">
                    <div className="relative w-full sm:w-80">
                        <Search className="search-icon absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 opacity-60" />
                        <Input
                            type="text"
                            placeholder="Search by name..."
                            className="pl-10 w-full"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                        <SelectTrigger className="w-full sm:w-60">
                            <SelectValue placeholder="Filter by department" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Departments</SelectItem>
                            {DEPARTMENT_OPTIONS.map((department) => (
                                <SelectItem key={department.value} value={department.value}>
                                    {department.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <CreateButton resource="subjects" />
                </div>
            </div>

            <DataTable table={subjectTable} />


        </ListView>
    );
}

export default SubjectsList;