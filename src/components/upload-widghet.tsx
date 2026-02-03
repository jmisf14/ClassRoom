import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    CLOUDINARY_UPLOAD_PRESET,
    CLOUDINARY_UPLOAD_URL,
    MAX_FILE_SIZE,
    ALLOWED_TYPES,
} from "@/constants";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";

type UploadWidgetProps = {
    value?: string;
    onChange: (url: string) => void;
    onPublicIdChange?: (publicId: string) => void;
    className?: string;
};

type CloudinaryUploadResponse = {
    secure_url?: string;
    public_id?: string;
};

export function UploadWidget({
    value,
    onChange,
    onPublicIdChange,
    className,
}: UploadWidgetProps) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const canUpload = Boolean(CLOUDINARY_UPLOAD_URL && CLOUDINARY_UPLOAD_PRESET);

    const handlePick = () => inputRef.current?.click();

    const handleFile: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
        setError(null);
        const file = e.target.files?.[0];
        if (!file) return;

        if (ALLOWED_TYPES.length > 0 && !ALLOWED_TYPES.includes(file.type)) {
            setError("Unsupported file type");
            return;
        }
        if (file.size > MAX_FILE_SIZE) {
            setError("File is too large");
            return;
        }
        if (!canUpload) {
            setError(
                "Cloudinary is not configured. Set VITE_CLOUDINARY_UPLOAD_URL and VITE_CLOUDINARY_UPLOAD_PRESET.",
            );
            return;
        }

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("upload_preset", String(CLOUDINARY_UPLOAD_PRESET));

            const resp = await fetch(String(CLOUDINARY_UPLOAD_URL), {
                method: "POST",
                body: formData,
            });

            if (!resp.ok) {
                setError("Upload failed");
                return;
            }

            const payload = (await resp.json()) as CloudinaryUploadResponse;
            if (!payload.secure_url) {
                setError("Upload failed");
                return;
            }

            onChange(payload.secure_url);
            if (payload.public_id && onPublicIdChange) {
                onPublicIdChange(payload.public_id);
            }
        } catch {
            setError("Upload failed");
        } finally {
            setIsUploading(false);
            // allow re-selecting same file
            if (inputRef.current) inputRef.current.value = "";
        }
    };

    return (
        <div className={cn("flex flex-col gap-2", className)}>
            <div className="flex items-center gap-2">
                <Button
                    type="button"
                    variant="secondary"
                    onClick={handlePick}
                    disabled={isUploading}
                >
                    {isUploading ? "Uploading..." : "Upload"}
                </Button>
                <Input
                    ref={inputRef}
                    type="file"
                    accept={ALLOWED_TYPES.join(",")}
                    className="hidden"
                    onChange={handleFile}
                />
                {value ? (
                    <a
                        className="text-sm underline text-muted-foreground"
                        href={value}
                        target="_blank"
                        rel="noreferrer"
                    >
                        View uploaded image
                    </a>
                ) : (
                    <span className="text-sm text-muted-foreground">
                        No image selected
                    </span>
                )}
            </div>
            {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </div>
    );
}

