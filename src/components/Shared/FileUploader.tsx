import { useCallback, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";

import { Button } from "@/components/ui/button";
import heic2any from 'heic2any';

type FileUploaderProps = {
    fieldChange: (files: File[]) => void;
    mediaUrl: string;
};

const FileUploader = ({ fieldChange, mediaUrl }: FileUploaderProps) => {
    const [file, setFile] = useState<File[]>([]);
    const [fileUrl, setFileUrl] = useState<string>(mediaUrl);

    const onDrop = useCallback(
        async (acceptedFiles: FileWithPath[]) => {
            const convertedFiles = await Promise.all(
                acceptedFiles.map(async (file) => {
                    // Check if the file is HEIF
                    if (file.type === 'image/heif') {
                        // Convert HEIF to PNG
                        const convertedBlob = await heic2any({ blob: file, toType: 'image/png' });
                        return new File([convertedBlob as BlobPart], `${file.name}.png`, { type: 'image/png' });
                    }
                    return file;
                })
            );

            setFile(convertedFiles);
            setFileUrl(URL.createObjectURL(convertedFiles[0]));
            fieldChange(convertedFiles);
        },
        [file]
    );
    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: { 'image/*': ['.heic', '.heif', '.png', '.jpg', '.jpeg'] }
    })
    return (
        <div className="flex flex-center flex-col bg-dark-3 rounded-xl cursor-pointer"{...getRootProps()}>
            <input accept="image/*" {...getInputProps()} className="cursor-pointer" />
            {
                fileUrl ? (
                    <>
                        <div className="flex flex-1 justify-center w-full p-5 lg:p-10">
                            <img style={{ objectFit: "contain" }} src={fileUrl} alt="image" className="file_uploader-img" />
                        </div>
                        <p className="file_uploader-label">Click or drag photo to replace</p>
                    </>


                ) : (
                    <div className="file_uploader-box ">
                        <img
                            src="/assets/icons/file-upload.svg"
                            width={96}
                            height={77}
                            alt="file upload"
                        />

                        <h3 className="base-medium text-light-2 mb-2 mt-6">
                            Drag photo here
                        </h3>
                        <p className="text-light-4 small-regular mb-6">SVG, PNG, JPG</p>

                        <Button type="button" className="shad-button_dark_4">
                            Select from computer
                        </Button>
                    </div>
                )}
        </div >
    )
}

export default FileUploader