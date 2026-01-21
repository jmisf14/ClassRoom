import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { CreateButton } from "@/components/refine-ui/buttons/create";
import { DataTable } from "@/components/refine-ui/data-table/data-table";
import { ListView } from "@/components/refine-ui/views/list-view";
import { DEPARTMENT_OPTIONS } from "@/constants";
import { useState } from "react";
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
};

const SubjectsList = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedDepartment, setSelectedDepartment] = useState("all");

    const columns: ColumnDef<Subject>[] = [
        { accessorKey: "id", header: "ID" },
        { accessorKey: "name", header: "Name" },
        { accessorKey: "department", header: "Department" },
    ];

    const subjectTable = useTable<Subject>({
        refineCoreProps: { resource: "subjects" },
        columns,
    });

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
    )
}

export default SubjectsList;