export type TeacherSeed = {
    id: number;
    name: string;
};

export type SubjectSeed = {
    id: number;
    name: string;
    code: string;
};

function shortenSubjectCode(name: string) {
    const cleaned = name
        .trim()
        .replace(/[^a-zA-Z0-9\s]/g, "")
        .replace(/\s+/g, " ");

    const words = cleaned.split(" ").filter(Boolean);
    if (words.length === 0) return "SUBJ";

    const base =
        words.length === 1
            ? words[0]!.slice(0, 6)
            : words.map((w) => w.slice(0, 3)).join("");

    return base.toUpperCase();
}

export const teachers: TeacherSeed[] = [
    { id: 1, name: "Dr. Rivera" },
    { id: 2, name: "Prof. Ahmed" },
    { id: 3, name: "Ms. Chen" },
];

const subjectNames: Array<Omit<SubjectSeed, "code">> = [
    { id: 1, name: "Introduction to Biology" },
    { id: 2, name: "Data Structures" },
    { id: 3, name: "Calculus II" },
];

export const subjects: SubjectSeed[] = subjectNames.map((s) => ({
    ...s,
    code: shortenSubjectCode(s.name),
}));

