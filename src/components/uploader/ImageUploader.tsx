"use client";

import React, { ChangeEvent, useRef } from "react";
import styled from "styled-components";

import { Button } from "@/components/common/Button";
import { Stack } from "@/components/common/Stack";
import { Title } from "@/components/common/Title";

import { UploadedImage } from "@/types/image.types";

type ImageUploaderProps = {
  onImageUpload: (image: UploadedImage) => void;
};

const UploadWrapper = styled.div`
  width: 100%;
  max-width: 500px;

  padding: ${({ theme }) => theme.spacing.xl};
  border: 2px dashed ${({ theme }) => theme.colors.border.default};
  border-radius: ${({ theme }) => theme.borderRadius.lg};

  background: ${({ theme }) => theme.colors.surface};
  text-align: center;
`;

const HiddenInput = styled.input`
  display: none;
`;

export default function ImageUploader({ onImageUpload }: ImageUploaderProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please upload a valid image file");
      return;
    }

    const previewUrl = URL.createObjectURL(file);

    onImageUpload({
      file,
      previewUrl,
    });
  };

  return (
    <UploadWrapper>
      <Stack $spacing="lg" $align="center">
        <Title $size="medium">Upload an image</Title>

        <Button $variant="primary" onClick={handleButtonClick}>
          Choose image
        </Button>

        <HiddenInput
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/webp"
          onChange={handleFileChange}
        />
      </Stack>
    </UploadWrapper>
  );
}
