import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb";
import { CreateView } from "@/components/refine-ui/views/create-view";
import { Button } from "@/components/ui/button";
import { useBack } from "@refinedev/core";

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
        </CreateView>
    );
};

export default Create;