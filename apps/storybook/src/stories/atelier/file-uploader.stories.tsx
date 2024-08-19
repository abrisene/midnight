import type { Meta, StoryObj } from "@storybook/react";
import { useState } from "react";
import {
  FileInput,
  FileUploader,
  FileUploaderContent,
  FileUploaderItem,
} from "@acausal/ui-core/file-uploader";

const meta = {
  title: "Atelier/File/Uploader",
  component: FileUploader,
  parameters: {
    layout: "centered",
  },
} satisfies Meta<typeof FileUploader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    value: null,
    onValueChange: (files) => console.log(files),
    dropzoneOptions: {
      accept: { "image/*": [".jpg", ".jpeg", ".png", ".gif"] },
      maxFiles: 5,
      maxSize: 5 * 1024 * 1024, // 5MB
    },
  },
  render: () => {
    const [files, setFiles] = useState<File[] | null>(null);
    return (
      <FileUploader
        value={files}
        onValueChange={setFiles}
        dropzoneOptions={{
          accept: { "image/*": [".jpg", ".jpeg", ".png", ".gif"] },
          maxFiles: 5,
          maxSize: 5 * 1024 * 1024, // 5MB
        }}
      >
        <FileUploaderContent>
          <FileInput>
            <div className="p-4 text-center">
              Drag & drop files here or click to select
            </div>
          </FileInput>
          {files &&
            files.map((file, index) => (
              <FileUploaderItem key={index} index={index}>
                {file.name}
              </FileUploaderItem>
            ))}
        </FileUploaderContent>
      </FileUploader>
    );
  },
};
