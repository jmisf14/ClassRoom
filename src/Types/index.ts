export type Department = {
    id: number;
    code: string;
    name: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
};

export type Subject = {
    id: number;
    departmentId: number;
    name: string;
    code: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
    department: Department;
};

export type Pagination = {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
};

export type ApiListResponse<T> = {
    data: T[];
    pagination: Pagination;
};

export type SignupPayload = {
    email: string;
    password: string;
    image?: string;
    imageCldPubId?: string;
    role: "student" | "teacher" | "admin";

};