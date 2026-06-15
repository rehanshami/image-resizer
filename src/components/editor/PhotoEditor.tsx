// src/components/editor/PhotoEditor.tsx
"use client";

import { useState } from "react";
import styled from "styled-components";
import { Area } from "react-easy-crop";
import EditorCanvas from "./EditorCanvas";
import EditorSidebar from "./EditorSidebar";
import { downloadCanvasAsset } from "@/utils/canvas/canvasExporter";

const EditorLayout = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.xl};
  align-items: start;

  @media (min-width: 1024px) {
    grid-template-columns: 1fr 340px;
  }
`;

export type AsymmetricPadding = {
  top: number;
  right: number;
  bottom: number;
  left: number;
};
export type ExportFormat = "png" | "jpeg";
export type FramePreset = "option1" | "option2" | "option3" | "custom";

export type FrameConfig = {
  id: FramePreset;
  name: string;
  width: number;
  height: number;
  padding: number | AsymmetricPadding;
  borderRadius: number;
};

export const PRESETS: Record<Exclude<FramePreset, "custom">, FrameConfig> = {
  option1: {
    id: "option1",
    name: "618 x 420 Padded",
    width: 618,
    height: 420,
    padding: { top: 14, right: 18, bottom: 15, left: 16 },
    borderRadius: 24,
  },
  option2: {
    id: "option2",
    name: "1200 x 800 Standard",
    width: 1200,
    height: 800,
    padding: 0,
    borderRadius: 0,
  },
  option3: {
    id: "option3",
    name: "1500 x 600 Banner",
    width: 1500,
    height: 600,
    padding: 0,
    borderRadius: 0,
  },
};

export default function PhotoEditor({ imageUrl }: { imageUrl: string }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [frameConfig, setFrameConfig] = useState<FrameConfig>(PRESETS.option1);
  const [exportFormat, setExportFormat] = useState<ExportFormat>("png");
  const [optimizeForWeb, setOptimizeForWeb] = useState<boolean>(false); // Defaults to pristine regular output
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

  const handlePresetChange = (presetId: FramePreset) => {
    if (presetId === "custom") {
      setFrameConfig({
        id: "custom",
        name: "Custom Workspace",
        width: 1000,
        height: 1000,
        padding: 40,
        borderRadius: 12,
      });
    } else {
      setFrameConfig(PRESETS[presetId]);
    }
    handleResetView();
  };

  const handleCustomModifier = (
    key: keyof Omit<FrameConfig, "id" | "name">,
    value: number,
  ) => {
    setFrameConfig((prev) => {
      const updated = { ...prev, [key]: value };
      if (key === "padding") {
        const maxPadding = Math.min(updated.width, updated.height) / 2 - 10;
        updated.padding = Math.min(value, maxPadding);
      }
      if (key === "borderRadius") {
        const maxRadius = Math.min(updated.width, updated.height) / 2;
        updated.borderRadius = Math.min(value, maxRadius);
      }
      return updated;
    });
  };

  // Resets zoom and position metrics back to base canvas settings
  const handleResetView = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
  };

  const handleDownload = async () => {
    if (!croppedAreaPixels) return;

    const fileExtension = exportFormat === "jpeg" ? "jpg" : "png";
    const baseName = frameConfig.name.toLowerCase().replace(/\s+/g, "-");

    await downloadCanvasAsset(
      imageUrl,
      croppedAreaPixels,
      frameConfig,
      exportFormat,
      optimizeForWeb,
      `padded-${baseName}.${fileExtension}`,
    );
  };

  return (
    <EditorLayout>
      <EditorCanvas
        imageUrl={imageUrl}
        crop={crop}
        zoom={zoom}
        frameConfig={frameConfig}
        onCropChange={setCrop}
        onZoomChange={setZoom}
        onCropComplete={(_, pixels) => setCroppedAreaPixels(pixels)}
      />

      <EditorSidebar
        zoom={zoom}
        onZoomChange={setZoom}
        frameConfig={frameConfig}
        exportFormat={exportFormat}
        onFormatChange={setExportFormat}
        optimizeForWeb={optimizeForWeb}
        onOptimizationChange={setOptimizeForWeb}
        onPresetChange={handlePresetChange}
        onCustomModifier={handleCustomModifier}
        onDownload={handleDownload}
        onResetView={handleResetView}
        isReadyToDownload={!!croppedAreaPixels}
      />
    </EditorLayout>
  );
}
