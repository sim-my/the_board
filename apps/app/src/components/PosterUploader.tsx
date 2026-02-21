// PosterUploaderDropzone.tsx
import React, { useEffect, useState } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { Upload, X } from "lucide-react";

type PosterUploaderDropzoneProps = {
    value: File | null;
    onChange: (file: File | null) => void;
    maxSizeMB?: number;
};

export default function PosterUploaderDropzone({
    value,
    onChange,
    maxSizeMB = 5,
}: PosterUploaderDropzoneProps) {
    const [preview, setPreview] = useState<string>("");

    useEffect(() => {
        if (!value) {
            setPreview("");
            return;
        }
        const url = URL.createObjectURL(value);
        setPreview(url);
        return () => URL.revokeObjectURL(url);
    }, [value]);

    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    const onDrop = (accepted: File[], rejected: FileRejection[]) => {
        // If rejected, just clear (you can show errors if you want)
        if (rejected.length) {
            onChange(null);
            return;
        }
        onChange(accepted[0] ?? null);
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { "image/*": [] },
        maxFiles: 1,
        maxSize: maxSizeBytes,
    });

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-stone-800">Event Poster</label>
                {value ? (
                    <button
                        type="button"
                        onClick={() => onChange(null)}
                        className="inline-flex items-center gap-1 rounded-lg px-2 py-1 text-xs text-stone-600 hover:bg-stone-100 cursor-pointer"
                    >
                        <X className="h-4 w-4" />
                        Remove
                    </button>
                ) : null}
            </div>

            <div
                {...getRootProps()}
                className={[
                    "h-28 w-full rounded-xl border border-dashed bg-stone-50 cursor-pointer",
                    "border-stone-300 hover:bg-stone-100",
                    isDragActive ? "bg-stone-100" : "",
                ].join(" ")}
            >
                <input {...getInputProps()} />

                {!value ? (
                    <div className="h-full flex items-center justify-center gap-2 text-sm text-stone-500">
                        <Upload className="h-4 w-4" />
                        <span>{isDragActive ? "Drop the image here" : "Upload poster image"}</span>
                    </div>
                ) : (
                    <div className="h-full flex items-center gap-4 p-3">
                        <img
                            src={preview}
                            alt="Poster preview"
                            className="h-full w-24 rounded-lg object-cover border border-stone-200 bg-white"
                        />
                        <div className="min-w-0">
                            <p className="truncate text-sm font-medium text-stone-800">{value.name}</p>
                            <p className="text-xs text-stone-500">
                                {(value.size / 1024 / 1024).toFixed(2)} MB
                            </p>
                            <p className="text-xs text-stone-400">Click or drop to change</p>
                        </div>
                    </div>
                )}
            </div>

            <p className="text-xs text-stone-400">PNG/JPG/WEBP up to {maxSizeMB}MB</p>
        </div>
    );
}