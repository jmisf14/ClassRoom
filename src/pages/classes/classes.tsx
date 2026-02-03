import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { CreateView } from "@/components/refine-ui/views/create-view";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useBack } from "@refinedev/core";
import { Separator } from "@/components/ui/separator";

const Create = () => {
    const back = useBack();

    return (
        <CreateView className="class-view">
            <Breadcrumb />

            <h1 className="page-title">Create a Class</h1>

            <div className="intro-row">
                <p>Provide the required information below to add a class.</p>
                <Button type="button" onClick={() => back()}>
                    Go Back
                </Button>
            </div>

            <Separator />

            <div className="my-4 flex items-center">
                <Card className="class-form-card">
                    <CardHeader className="relative z-10">
                        <CardTitle className="text-2xl pb-0 font-bold">
                            Fill out the form
                        </CardTitle>
                    </CardHeader>

                    <Separator />

                    <CardContent className="mt-7">
                        {/* TODO: form fields will go here */}
                    </CardContent>
                </Card>
            </div>
        </CreateView>
    );
};

export default Create;