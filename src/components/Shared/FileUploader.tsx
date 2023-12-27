import { useCallback, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import heic2any from "heic2any";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

type FileUploaderProps = {
  fieldChange: (files: File[]) => void;
  mediaUrl: string;
};

const FileUploader = ({ fieldChange, mediaUrl }: FileUploaderProps) => {
  const [file, setFile] = useState<File[]>([]);
  const [fileUrl, setFileUrl] = useState<string>(mediaUrl);
  const { toast } = useToast();

  const onDrop = useCallback(
    async (acceptedFiles: FileWithPath[]) => {
      const convertedFiles: File[] = [];

      for (const file of acceptedFiles) {
        if (
          file.type.startsWith("image/") &&
          (file.type === "image/heic" ||
            file.type === "image/heif" ||
            file.type === "image/HEIF" ||
            file.type === "image/HEIC")
        ) {
          // Convert HEIC to PNG using heic2any
          const convertedFileBlob = await heic2any({ blob: file });
          const convertedFile = new File([convertedFileBlob as Blob], file.name.replace(/\.[^/.]+$/, ".png"));
          convertedFiles.push(convertedFile);
        } else if (file.type.startsWith("video/")) {
          // Handle video files
          const video = document.createElement("video");
          const canPlay = video.canPlayType(file.type);
          if (canPlay === "probably" || canPlay === "maybe") {
            // Set up a temporary video element to get video duration
            video.src = URL.createObjectURL(file);
            await new Promise<void>((resolve) => {
              video.onloadedmetadata = () => {
                resolve();
              };
            });
            if (video.duration <= 30) {
              convertedFiles.push(file);
            } else {
              toast({
                title: "Video duration should not exceed 30 seconds",
                style: {
                  background: 'linear-gradient(to top, #a90329 0%, #8f0222 44%, #6d0019 100%)',
                },
              });
            }
          } else {
            // Handle case where the browser can't play the video
            alert("Unsupported video format");
          }
        } else {
          convertedFiles.push(file);
        }
      }

      setFile(convertedFiles);
      setFileUrl(URL.createObjectURL(convertedFiles[0]));
      fieldChange(convertedFiles);
    },
    [file]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.heic', '.HEIF', '.png', '.jpg', '.jpeg', '.JPEG'],
      'video/*': ['.mp4', '.webm', '.mov', '.avi', '.mkv', '.hevc']
    }
  });

  return (
    <div className="flex flex-center flex-col bg-dark-3 rounded-xl cursor-pointer" {...getRootProps()}>
      <input accept="image/*, video/*" {...getInputProps()} className="cursor-pointer" />
      {fileUrl && file.length > 0 ? (
        <>
          {file[0].type.startsWith("image/") ? (
            <div className="flex flex-1 justify-center w-full p-5 lg:p-10">
              <img style={{ objectFit: "contain" }} src={fileUrl} alt="image" className="file_uploader-img" />
            </div>
          ) : (
            <div className="flex flex-1 justify-center w-full p-5 lg:p-10">
              {/* Display video player for video files */}
              <video autoPlay controls style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }}>
                <source src={fileUrl} type={file[0].type} />
              </video>
            </div>
          )}
          <p className="file_uploader-label">Click or drag media to replace</p>
        </>
      ) : (
        <div className="file_uploader-box ">
          <img src="/assets/icons/file-upload.svg" width={96} height={77} alt="file upload" />
          <h3 className="base-medium text-light-2 mb-2 mt-6">Drag media here</h3>
          <p className="text-light-3 small-regular ">Images: SVG, PNG, JPG </p>
          <p className="text-light-3 small-regular">Videos: MP4, WebM, MKV, HEVC</p>
          <span className="text-red text-sm  mb-6">(Maximum Duration: 30 seconds)</span>
          <Button type="button" className="shad-button_dark_4">
            Select from computer
          </Button>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
