export type MockSubject = {
    id: number;
    courseCode: string;
    name: string;
    department: string;
    description: string;
};

export const mockSubjects: MockSubject[] = [
    {
        id: 1,
        courseCode: "CS101",
        name: "Introduction to Computer Science",
        department: "CS",
        description:
            "Foundations of programming, algorithms, and computational thinking using practical exercises.",
    },
    {
        id: 2,
        courseCode: "MATH201",
        name: "Calculus II",
        department: "Math",
        description:
            "Techniques of integration, sequences and series, and applications in science and engineering.",
    },
    {
        id: 3,
        courseCode: "ENG150",
        name: "Academic Writing",
        department: "English",
        description:
            "Develops research, argumentation, and writing skills for academic and professional contexts.",
    },
];

