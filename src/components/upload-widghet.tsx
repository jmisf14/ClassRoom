import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_UPLOAD_PRESET,
    CLOUDINARY_UPLOAD_URL,
    MAX_FILE_SIZE,
    ALLOWED_TYPES,
} from "@/constants";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
import React from "react";
import { UploadCloud } from "lucide-react";

type UploadWidgetProps = {
    value?: UploadWidgetValue | null;
    onChange: (next: UploadWidgetValue | null) => void;
    className?: string;
    disabled?: boolean;
};

export type UploadWidgetValue = {
    url: string;
    publicId?: string;
    deleteToken?: string;
};

type CloudinaryUploadResponse = {
    secure_url?: string;
    public_id?: string;
    delete_token?: string;
};

type CloudinaryWidgetResult = {
    event?: string;
    info?: CloudinaryUploadResponse;
};

type CloudinaryWidget = {
    open: () => void;
    close: () => void;
};

declare global {
    interface Window {
        cloudinary?: {
            createUploadWidget: (
                options: Record<string, unknown>,
                callback: (error: unknown, result: CloudinaryWidgetResult) => void,
            ) => CloudinaryWidget;
        };
    }
}

export function UploadWidget({
    value = null,
    onChange,
    className,
    disabled = false,
}: UploadWidgetProps) {
    const inputRef = useRef<HTMLInputElement | null>(null);
    const widgetRef = useRef<CloudinaryWidget | null>(null);
    const onChangeRef = useRef(onChange);
    const [isUploading, setIsUploading] = useState(false);
    const [isRemoving, setIsRemoving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [preview, setPreview] = useState<UploadWidgetValue | null>(value);

    const canUseWidget = Boolean(
        CLOUDINARY_CLOUD_NAME &&
        CLOUDINARY_UPLOAD_PRESET &&
        typeof window !== "undefined" &&
        window.cloudinary?.createUploadWidget,
    );

    useEffect(() => {
        setPreview(value);
    }, [value]);

    useEffect(() => {
        onChangeRef.current = onChange;
    }, [onChange]);

    useEffect(() => {
        if (!canUseWidget || widgetRef.current) return;

        widgetRef.current = window.cloudinary!.createUploadWidget(
            {
                cloudName: CLOUDINARY_CLOUD_NAME,
                uploadPreset: CLOUDINARY_UPLOAD_PRESET,
                sources: ["local", "camera", "url"],
                multiple: false,
                maxFileSize: MAX_FILE_SIZE,
                clientAllowedFormats: ["png", "jpg", "jpeg", "webp"],
                showCompletedButton: true,
                return_delete_token: true,
            },
            (err, result) => {
                if (err) {
                    setError("Upload failed");
                    setIsUploading(false);
                    return;
                }

                if (result?.event === "success" && result.info?.secure_url) {
                    const next: UploadWidgetValue = {
                        url: result.info.secure_url,
                        publicId: result.info.public_id,
                        deleteToken: result.info.delete_token,
                    };
                    setPreview(next);
                    onChangeRef.current(next);
                    setIsUploading(false);
                }
            },
        );
    }, [canUseWidget]);

    const handlePick = () => {
        if (disabled || isUploading || isRemoving) return;
        setError(null);

        if (canUseWidget && widgetRef.current) {
            setIsUploading(true);
            widgetRef.current.open();
            return;
        }

        inputRef.current?.click();
    };

    const handleFile: React.ChangeEventHandler<HTMLInputElement> = async (e) => {
        // Fallback when Cloudinary widget is not available
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
        if (!CLOUDINARY_UPLOAD_PRESET) {
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
            // So we can remove it later without server-side signing
            formData.append("return_delete_token", "true");

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

            const next: UploadWidgetValue = {
                url: payload.secure_url,
                publicId: payload.public_id,
                deleteToken: payload.delete_token,
            };
            setPreview(next);
            onChange(next);
        } catch {
            setError("Upload failed");
        } finally {
            setIsUploading(false);
            // allow re-selecting same file
            if (inputRef.current) inputRef.current.value = "";
        }
    };

    const removeFromCloudinary = async () => {
        if (disabled || isUploading || isRemoving) return;

        setError(null);
        setIsRemoving(true);
        try {
            const token = preview?.deleteToken;
            if (token && CLOUDINARY_CLOUD_NAME) {
                const resp = await fetch(
                    `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/delete_by_token`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/x-www-form-urlencoded" },
                        body: new URLSearchParams({ token }).toString(),
                    },
                );
                // Even if deletion fails, still allow clearing the UI
                if (!resp.ok) {
                    setError("Could not delete from Cloudinary (cleared locally).");
                }
            }
        } catch {
            setError("Could not delete from Cloudinary (cleared locally).");
        } finally {
            setIsRemoving(false);
            setPreview(null);
            onChange(null);
        }
    };

    return (
        <div className={cn("space-y-2", className)}>
            <Input
                ref={inputRef}
                type="file"
                accept={ALLOWED_TYPES.join(",")}
                className="hidden"
                onChange={handleFile}
                disabled={disabled || isUploading}
            />

            {preview?.url ? (
                <div className="relative">
                    <div
                        className={cn(
                            "h-40 w-full rounded-md border bg-center bg-cover",
                        )}
                        style={{ backgroundImage: `url(${preview.url})` }}
                    />
                    <div className="absolute right-2 top-2 flex gap-2">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={handlePick}
                            disabled={disabled || isUploading || isRemoving}
                        >
                            {isUploading ? "Uploading..." : "Replace"}
                        </Button>
                        <Button
                            type="button"
                            variant="destructive"
                            onClick={removeFromCloudinary}
                            disabled={disabled || isUploading || isRemoving}
                        >
                            {isRemoving ? "Removing..." : "Remove"}
                        </Button>
                    </div>
                </div>
            ) : (
                <div
                    role="button"
                    tabIndex={0}
                    onClick={handlePick}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") handlePick();
                    }}
                    className={cn(
                        "h-40 w-full rounded-md border border-dashed",
                        "flex flex-col items-center justify-center gap-2",
                        "text-sm text-muted-foreground",
                        disabled || isUploading
                            ? "opacity-60 cursor-not-allowed"
                            : "cursor-pointer hover:bg-muted/30",
                    )}
                >
                    <UploadCloud className="h-8 w-8 text-orange-600" />
                    <div className="font-medium text-orange-600">
                        {isUploading ? "Uploading..." : "Click to upload photo"}
                    </div>
                    <div className="text-xs">
                        PNG, JPG up to {Math.round(MAX_FILE_SIZE / (1024 * 1024))}MB
                    </div>
                </div>
            )}

            {error ? <p className="text-sm text-destructive">{error}</p> : null}
        </div>
    );
}
export default UploadWidget;

