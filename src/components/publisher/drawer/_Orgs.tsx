"use client";
import { Trash2, Plus, Upload, Edit } from "lucide-react";
import DrawerHeader from "./DrawerHeader";
import { useSelector, useDispatch } from "react-redux";
import { updateContent } from "@/redux/slice/contentSlice";
import type { RootState } from "@/redux/store";
import { useRef, useState } from "react";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { inputStyles } from "@/utils/customStyles";
import { uploadToCloudinary, removeFromCloudinary } from "@/utils/cloudinary";
import { validateImage } from "@/utils/imageCompression";

const OrgsFields = ({ toggleDrawer }: { toggleDrawer: () => void }) => {
  const dispatch = useDispatch();
  const organizations = useSelector(
    (state: RootState) => state.content.organizations
  );
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [removingIndex, setRemovingIndex] = useState<number | null>(null);
  const [uploadingIndex, setUploadingIndex] = useState<number | null>(null);
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleAddNewImage = async (file: File) => {
    if (!validateImage(file)) return;
    try {
      setIsUploading(true);
      toast.success("Uploading image...");
      const imageUrl = await uploadToCloudinary(file);
      
      // Add new image
      const updatedOrgs = [...organizations, imageUrl];
      dispatch(
        updateContent({
          section: "organizations",
          data: updatedOrgs,
        })
      );
      toast.success("Image uploaded successfully!");
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  const handleReplaceImage = async (file: File, index: number) => {
    if (!validateImage(file)) return;
    try {
      setUploadingIndex(index);
      toast.success("Replacing image...");
      const imageUrl = await uploadToCloudinary(file);
      
      // Replace existing image
      const updatedOrgs = [...organizations];
      updatedOrgs[index] = imageUrl;
      dispatch(
        updateContent({
          section: "organizations",
          data: updatedOrgs,
        })
      );
      toast.success("Image replaced successfully!");
    } catch (error) {
      console.error("Replace error:", error);
      toast.error("Failed to replace image");
    } finally {
      setUploadingIndex(null);
    }
  };

  const handleRemoveImage = async (index: number) => {
    if (organizations.length <= 1) {
      return;
    }
    try {
      setRemovingIndex(index);
      toast.success("Removing image...");
      const imageUrl = organizations[index];
      await removeFromCloudinary(imageUrl);
      const updatedOrgs = organizations.filter((_, i) => i !== index);
      dispatch(
        updateContent({
          section: "organizations",
          data: updatedOrgs,
        })
      );
      toast.success("Image removed successfully!");
    } catch (error) {
      console.error("Remove error:", error);
      toast.error("Failed to remove image");
    } finally {
      setRemovingIndex(null);
    }
  };

  return (
    <>
      <DrawerHeader label="Organizations Section" toggleDrawer={toggleDrawer} />
      <div className="w-full font-dm-sans font-medium text-xs mb-28 overflow-y-auto max-h-[calc(100vh-5rem)]">
        <section className="p-4 xl:p-6">
          <div className="flex flex-col gap-4">
            {organizations.length === 0 ? (
              <div className="flex flex-col items-center justify-center border border-dashed p-6 rounded-lg">
                <input
                  type="file"
                  accept="image/png, image/jpeg, image/jpg"
                  className="hidden"
                  ref={(el) => {
                    fileInputRefs.current[0] = el;
                  }}
                  onChange={(e) => {
                    if (e.target.files?.[0]) {
                      handleAddNewImage(e.target.files[0]);
                    }
                  }}
                  disabled={isUploading}
                />
                <div
                  className={`flex flex-col items-center gap-2 cursor-pointer ${
                    isUploading ? "opacity-50 pointer-events-none" : ""
                  }`}
                  onClick={() =>
                    !isUploading && fileInputRefs.current[0]?.click()
                  }
                  onKeyDown={(e) => {
                    if ((e.key === 'Enter' || e.key === ' ') && !isUploading) {
                      e.preventDefault();
                      fileInputRefs.current[0]?.click();
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-label="Upload organization image"
                >
                  {isUploading ? (
                    <>
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-500"></div>
                      <p className="text-gray-500">Uploading...</p>
                    </>
                  ) : (
                    <>
                      <Plus className="text-[#a020f0] size-8" />
                      <p className="text-gray-600">Upload Organization Image</p>
                      <p className="text-xs text-gray-400">
                        JPG, JPEG, or PNG (max 1MB)
                      </p>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <>
                {organizations.map((item, index) => (
                  <div
                    key={item}
                    className={`${inputStyles} flex gap-4 justify-between items-center w-full p-3`}
                  >
                    <div className="w-20 h-20 flex items-center justify-center bg-gray-100 rounded-md overflow-hidden">
                      {item ? (
                        <Image
                          src={item}
                          alt={`Organization ${index + 1}`}
                          width={80}
                          height={80}
                          className="object-contain w-full h-full"
                        />
                      ) : (
                        <div className="text-gray-400 text-center text-xs">
                          No image
                          <br />
                          uploaded
                        </div>
                      )}
                    </div>
                    <div className="flex gap-4 items-center">
                      <input
                        type="file"
                        accept="image/png, image/jpeg, image/jpg"
                        className="hidden"
                        id={`upload-org-${index}`}
                        ref={(el) => {
                          fileInputRefs.current[index] = el;
                        }}
                        onChange={(e) => {
                          if (e.target?.files?.[0]) {
                            handleReplaceImage(e.target.files[0], index);
                          }
                        }}
                        disabled={isUploading || uploadingIndex === index}
                      />
                      <label
                        htmlFor={`upload-org-${index}`}
                        className={`flex items-center gap-1 py-1 px-2 bg-blue-50 text-blue-600 rounded hover:bg-blue-100 cursor-pointer transition-colors ${
                          isUploading || uploadingIndex === index ? "opacity-50 pointer-events-none" : ""
                        }`}
                        aria-label={
                          item
                            ? "Replace organization image"
                            : "Upload organization image"
                        }
                      >
                        {(() => {
                          if (uploadingIndex === index) {
                            return (
                              <>
                                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                                <span className="text-xs">Replacing...</span>
                              </>
                            );
                          }
                          if (item) {
                            return (
                              <>
                                <Edit className="size-3" />
                                <span className="text-xs">Replace</span>
                              </>
                            );
                          }
                          return (
                            <>
                              <Upload className="size-3" />
                              <span className="text-xs">Upload</span>
                            </>
                          );
                        })()}
                      </label>
                      {organizations.length > 1 && (
                        <button
                          type="button"
                          className={`flex items-center gap-1 py-1 px-2 bg-red-50 text-red-600 rounded hover:bg-red-100 transition-colors ${
                            removingIndex === index ? "opacity-50 pointer-events-none" : ""
                          }`}
                          onClick={() => handleRemoveImage(index)}
                          disabled={removingIndex === index}
                          aria-label={`Remove organization ${index + 1}`}
                        >
                          <Trash2 className="size-3" />
                          <span className="text-xs">
                            {removingIndex === index ? "Removing..." : "Remove"}
                          </span>
                        </button>
                      )}
                    </div>
                  </div>
                ))}
                {organizations.length < 5 && (
                  <>
                    <input
                      type="file"
                      accept="image/png, image/jpeg, image/jpg"
                      className="hidden"
                      id="add-organization-input"
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          handleAddNewImage(e.target.files[0]);
                        }
                      }}
                      disabled={isUploading}
                    />
                    <button
                      type="button"
                      className={`flex gap-2 items-center text-[#a020f0] hover:text-purple-700 p-3 rounded-lg w-full mt-2 ${
                        isUploading ? "opacity-50 pointer-events-none" : ""
                      }`}
                      onClick={() => {
                        const input = document.getElementById('add-organization-input') as HTMLInputElement;
                        input?.click();
                      }}
                      disabled={isUploading}
                      aria-label="Add organization"
                    >
                      {isUploading ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#a020f0]"></div>
                          <span>Uploading...</span>
                        </>
                      ) : (
                        <>
                          <Plus className="size-4" />
                          <span>Add Organization</span>
                        </>
                      )}
                    </button>
                  </>
                )}
                <p className="text-xs text-gray-500">
                  Supported formats: JPG, JPEG, PNG (max 2MB)
                </p>
              </>
            )}
          </div>
        </section>
      </div>
    </>
  );
};

export default OrgsFields;
