"use client";

import Cropper, { Area } from "react-easy-crop";
import styled from "styled-components";
import { FrameConfig, AsymmetricPadding } from "./PhotoEditor";

type EditorCanvasProps = {
  imageUrl: string;
  crop: { x: number; y: number };
  zoom: number;
  frameConfig: FrameConfig;
  onCropChange: (crop: { x: number; y: number }) => void;
  onZoomChange: (zoom: number) => void;
  onCropComplete: (croppedArea: Area, croppedAreaPixels: Area) => void;
};

const StudioWorkspace = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(
    circle at top,
    #ffffff 0%,
    #f1f5f9 45%,
    #e2e8f0 100%
  );
  border-radius: 24px;
  border: 1px solid #e2e8f0;
  padding: clamp(1.5rem, 5vw, 3rem);
  min-height: 520px;
  position: relative;
  overflow: hidden;
`;

const ExportCanvasFrame = styled.div<{
  $width: number;
  $height: number;
  $pTop: number;
  $pRight: number;
  $pBottom: number;
  $pLeft: number;
}>`
  position: relative;
  width: 100%;
  max-width: ${({ $width }) => $width}px;
  aspect-ratio: ${({ $width, $height }) => $width / $height};
  container-type: inline-size;

  /* Precision edge scaling mapping via container width values */
  padding: ${({ $pTop, $pRight, $pBottom, $pLeft }) =>
    `${$pTop}cqw ${$pRight}cqw ${$pBottom}cqw ${$pLeft}cqw`};

  background-image:
    linear-gradient(45deg, #cbd5e1 25%, transparent 25%),
    linear-gradient(-45deg, #cbd5e1 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #cbd5e1 75%),
    linear-gradient(-45deg, transparent 75%, #cbd5e1 75%);
  background-size: 16px 16px;
  background-position:
    0 0,
    0 8px,
    8px -8px,
    -8px 0;
  background-color: #ffffff;
  border-radius: 0px;
  box-shadow:
    0 25px 50px -12px rgba(15, 23, 42, 0.18),
    0 8px 16px rgba(15, 23, 42, 0.06);
`;

const InteractiveSafeZone = styled.div<{ $radiusRatio: number }>`
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  isolation: isolate;
  transform: translateZ(0);
  border-radius: ${({ $radiusRatio }) => `${$radiusRatio}cqw`};

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    border: 1px solid rgba(255, 255, 255, 0.65);
    box-shadow: 0 0 0 1px rgba(15, 23, 42, 0.25);
    border-radius: inherit;
    pointer-events: none;
    z-index: 10;
  }

  .reactEasyCrop_CropArea {
    border: none !important;
    box-shadow: none !important;
    width: 100% !important;
    height: 100% !important;
    top: 0 !important;
    left: 0 !important;
    transform: none !important;
  }

  .reactEasyCrop_Container {
    background: transparent !important;
  }
`;

export default function EditorCanvas({
  imageUrl,
  crop,
  zoom,
  frameConfig,
  onCropChange,
  onZoomChange,
  onCropComplete,
}: EditorCanvasProps) {
  // Extract configuration mapping safely for either numeric variables or object parameters
  const pad: AsymmetricPadding =
    typeof frameConfig.padding === "number"
      ? {
          top: frameConfig.padding,
          right: frameConfig.padding,
          bottom: frameConfig.padding,
          left: frameConfig.padding,
        }
      : frameConfig.padding;

  const innerWidth = frameConfig.width - (pad.left + pad.right);
  const innerHeight = frameConfig.height - (pad.top + pad.bottom);
  const safeZoneAspect = innerWidth / innerHeight;

  // Render scaling calculations mapped to relative widths
  const pTopRatio = (pad.top / frameConfig.width) * 100;
  const pRightRatio = (pad.right / frameConfig.width) * 100;
  const pBottomRatio = (pad.bottom / frameConfig.width) * 100;
  const pLeftRatio = (pad.left / frameConfig.width) * 100;
  const radiusRatio = (frameConfig.borderRadius / frameConfig.width) * 100;

  return (
    <StudioWorkspace>
      <ExportCanvasFrame
        $width={frameConfig.width}
        $height={frameConfig.height}
        $pTop={pTopRatio}
        $pRight={pRightRatio}
        $pBottom={pBottomRatio}
        $pLeft={pLeftRatio}
      >
        <InteractiveSafeZone $radiusRatio={radiusRatio}>
          <Cropper
            image={imageUrl}
            crop={crop}
            zoom={zoom}
            minZoom={1}
            aspect={safeZoneAspect}
            onCropChange={onCropChange}
            onZoomChange={onZoomChange}
            onCropComplete={onCropComplete}
            showGrid={false}
            objectFit="cover"
            restrictPosition={true}
          />
        </InteractiveSafeZone>
      </ExportCanvasFrame>
    </StudioWorkspace>
  );
}
