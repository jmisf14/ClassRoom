import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { CreateView } from "@/components/refine-ui/views/create-view";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { UploadWidget } from "@/components/upload-widghet";
import { classSchema } from "@/lib/schema";
import { useBack, useSelect, type BaseRecord, type HttpError } from "@refinedev/core";
import { useForm } from "@refinedev/react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Separator } from "@/components/ui/separator";
import * as z from "zod";

const Create = () => {
    const back = useBack();

    type ClassFormValues = z.infer<typeof classSchema>;

    const subjectSelect = useSelect({
        resource: "subjects",
        optionLabel: "name",
        optionValue: "id",
    });

    const teacherSelect = useSelect({
        resource: "teachers",
        optionLabel: "name",
        optionValue: "id",
    });

    const form = useForm<BaseRecord, HttpError, ClassFormValues>({
        resolver: zodResolver(classSchema),
        refineCoreProps: {
            resource: "classes",
            action: "create",
        },
        defaultValues: {
            name: "",
            description: "",
            subjectId: 0,
            teacherId: 0,
            capacity: 30,
            status: "active",
            joinCode: "",
            bannerImage: "",
        },
    });

    const onSubmit = (values: ClassFormValues) => form.refineCore.onFinish(values);

    return (
        <CreateView className="class-view">
            <Breadcrumb />

            <h1 className="page-title">Create a Class</h1>

            <div className="intro-row flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p>Provide the required information below to add a class.</p>
                <Button type="button" className="sm:w-auto w-full" onClick={() => back()}>
                    Go Back
                </Button>
            </div>

            <Separator />

            <div className="my-4 flex items-center justify-center">
                <Card className="class-form-card w-full max-w-2xl">
                    <CardHeader className="relative z-10">
                        <CardTitle className="text-2xl pb-0 font-bold">
                            Fill out the form
                        </CardTitle>
                    </CardHeader>

                    <Separator />

                    <CardContent className="mt-7">
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-5"
                            >
                                <div className="grid sm:grid-cols-2 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="bannerImage"
                                        render={({ field }) => (
                                            <FormItem className="sm:col-span-2">
                                                <FormLabel>
                                                    Banner Image{" "}
                                                    <span className="text-orange-600">*</span>
                                                </FormLabel>
                                                <div className="text-sm text-muted-foreground">
                                                    Upload image widget
                                                </div>
                                                <FormControl>
                                                    <UploadWidget
                                                        value={field.value}
                                                        onChange={field.onChange}
                                                        onPublicIdChange={(publicId) =>
                                                            form.setValue(
                                                                "bannerCldPubId",
                                                                publicId,
                                                                {
                                                                    shouldDirty: true,
                                                                    shouldValidate: true,
                                                                },
                                                            )
                                                        }
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Class Name{" "}
                                                    <span className="text-orange-600">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Introduction to Biology - Section A"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="subjectId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Subject{" "}
                                                    <span className="text-orange-600">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Select
                                                        value={
                                                            field.value
                                                                ? String(field.value)
                                                                : ""
                                                        }
                                                        onValueChange={(value) =>
                                                            field.onChange(
                                                                value === ""
                                                                    ? 0
                                                                    : Number(value),
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select a subject" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {(subjectSelect.options ?? []).map(
                                                                (opt) => (
                                                                    <SelectItem
                                                                        key={String(opt.value)}
                                                                        value={String(opt.value)}
                                                                    >
                                                                        {opt.label}
                                                                    </SelectItem>
                                                                ),
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="teacherId"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Teacher{" "}
                                                    <span className="text-orange-600">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Select
                                                        value={
                                                            field.value
                                                                ? String(field.value)
                                                                : ""
                                                        }
                                                        onValueChange={(value) =>
                                                            field.onChange(
                                                                value === ""
                                                                    ? 0
                                                                    : Number(value),
                                                            )
                                                        }
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select a teacher" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {(teacherSelect.options ?? []).map(
                                                                (opt) => (
                                                                    <SelectItem
                                                                        key={String(opt.value)}
                                                                        value={String(opt.value)}
                                                                    >
                                                                        {opt.label}
                                                                    </SelectItem>
                                                                ),
                                                            )}
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="capacity"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Capacity</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        inputMode="numeric"
                                                        placeholder="30"
                                                        value={String(field.value ?? "")}
                                                        onChange={(e) =>
                                                            field.onChange(
                                                                e.target.value === ""
                                                                    ? 0
                                                                    : Number(e.target.value),
                                                            )
                                                        }
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="status"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Status{" "}
                                                    <span className="text-orange-600">*</span>
                                                </FormLabel>
                                                <FormControl>
                                                    <Select
                                                        value={field.value}
                                                        onValueChange={field.onChange}
                                                    >
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select status" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="active">
                                                                Active
                                                            </SelectItem>
                                                            <SelectItem value="inactive">
                                                                Inactive
                                                            </SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>
                                            <FormControl>
                                                <Textarea
                                                    placeholder="Optional description..."
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="joinCode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Join code (optional)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="e.g. ABCD1234"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button
                                    type="submit"
                                    className="w-full"
                                    disabled={form.refineCore.formLoading}
                                >
                                    {form.refineCore.formLoading ? "Saving..." : "Create Class"}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </CreateView>
    );
};

export default Create;