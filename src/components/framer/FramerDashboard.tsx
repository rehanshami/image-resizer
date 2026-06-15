"use client";

import { useState, useEffect } from "react";
import styled from "styled-components";
import { Stack } from "@/components/common/Stack";
import ImageUploader from "@/components/uploader/ImageUploader";
import { UploadedImage } from "@/types/image.types";
import PhotoEditor from "@/components/editor/PhotoEditor";

const PreviewFrame = styled.img`
  width: 100%;
  max-width: 600px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  border: 4px solid white;
  object-fit: cover;
`;

export default function FramerDashboard() {
  const [image, setImage] = useState<UploadedImage | null>(null);

  useEffect(() => {
    return () => {
      if (image?.previewUrl) {
        URL.revokeObjectURL(image.previewUrl);
      }
    };
  }, [image?.previewUrl]);

  return (
    <Stack $spacing="xl" $align="center" $fullWidth>
      <ImageUploader onImageUpload={setImage} />
      {image && <PhotoEditor imageUrl={image.previewUrl} />}
    </Stack>
  );
}
