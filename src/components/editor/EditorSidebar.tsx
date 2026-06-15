"use client";

import styled from "styled-components";
import { Slider } from "@/components/common/Slider";
import { Button } from "@/components/common/Button";
import { FrameConfig, FramePreset, ExportFormat } from "./PhotoEditor";

type EditorSidebarProps = {
  zoom: number;
  isReadyToDownload: boolean;
  onDownload: () => void;
  onResetView: () => void;
  onZoomChange: (zoom: number) => void;
  frameConfig: FrameConfig;
  exportFormat: ExportFormat;
  onFormatChange: (format: ExportFormat) => void;
  optimizeForWeb: boolean;
  onOptimizationChange: (optimize: boolean) => void;
  onPresetChange: (preset: FramePreset) => void;
  onCustomModifier: (
    key: keyof Omit<FrameConfig, "id" | "name">,
    value: number,
  ) => void;
};

const SidebarContainer = styled.aside`
  width: 100%;
  padding: ${({ theme }) => theme.spacing.lg};
  border-radius: ${({ theme }) => theme.borderRadius.lg};
  background: ${({ theme }) => theme.colors.surface.elevated};
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
  box-shadow: ${({ theme }) => theme.shadows.md};
  position: sticky;
  top: 24px;
`;

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  & + & {
    margin-top: 2rem;
  }
`;

const SectionTitle = styled.h2`
  margin: 0;
  font-size: 0.75rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.text.tertiary};
`;

const PresetGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
`;

const PresetCard = styled.button<{ $active?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 1rem;
  width: 100%;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  border: 1px solid
    ${({ $active, theme }) =>
      $active ? theme.colors.brand.primary : theme.colors.border.subtle};
  background: ${({ theme }) => theme.colors.surface.elevated};
  cursor: pointer;
  transition:
    transform 180ms ease,
    border-color 180ms ease;
  &:hover {
    transform: translateY(-2px);
  }
`;

const PresetAspect = styled.div<{ $ratio: number }>`
  width: 100%;
  aspect-ratio: ${({ $ratio }) => $ratio};
  border-radius: 10px;
  background: linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%);
  border: 1px solid #bfdbfe;
`;

const SegmentedContainer = styled.div`
  display: flex;
  background: ${({ theme }) => theme.colors.surface.default || "#f1f5f9"};
  padding: 4px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.colors.border.subtle};
`;

const SegmentButton = styled.button<{ $active: boolean }>`
  flex: 1;
  padding: 6px 12px;
  font-size: 0.875rem;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  background: ${({ $active }) => ($active ? "#ffffff" : "transparent")};
  color: ${({ $active, theme }) =>
    $active ? theme.colors.text.primary : theme.colors.text.tertiary};
  box-shadow: ${({ $active }) =>
    $active ? "0 1px 3px rgba(0,0,0,0.1)" : "none"};
  cursor: pointer;
  transition: all 150ms ease;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.text.secondary};
`;

export default function EditorSidebar({
  zoom,
  onZoomChange,
  frameConfig,
  exportFormat,
  onFormatChange,
  optimizeForWeb,
  onOptimizationChange,
  onPresetChange,
  onCustomModifier,
  onDownload,
  onResetView,
  isReadyToDownload,
}: EditorSidebarProps) {
  const isAsymmetric = typeof frameConfig.padding !== "number";
  const displayPadding = isAsymmetric
    ? "asymmetric"
    : `${frameConfig.padding}px`;

  return (
    <SidebarContainer>
      <Section>
        <SectionTitle>Frame Presets</SectionTitle>
        <PresetGrid>
          <PresetCard
            $active={frameConfig.id === "option1"}
            onClick={() => onPresetChange("option1")}
          >
            <PresetAspect $ratio={618 / 420} />
            <Label>618 × 420</Label>
          </PresetCard>
          <PresetCard
            $active={frameConfig.id === "option2"}
            onClick={() => onPresetChange("option2")}
          >
            <PresetAspect $ratio={1200 / 800} />
            <Label>1200 × 800</Label>
          </PresetCard>
          <PresetCard
            $active={frameConfig.id === "option3"}
            onClick={() => onPresetChange("option3")}
          >
            <PresetAspect $ratio={1500 / 600} />
            <Label>1500 × 600</Label>
          </PresetCard>
          <PresetCard
            $active={frameConfig.id === "custom"}
            onClick={() => onPresetChange("custom")}
          >
            <PresetAspect $ratio={1} />
            <Label>Custom</Label>
          </PresetCard>
        </PresetGrid>
      </Section>

      <Section>
        <SectionTitle>Image alignment</SectionTitle>
        <FieldGroup>
          <Label htmlFor="zoom-slider">Zoom ({zoom.toFixed(1)}x)</Label>
          <Slider
            id="zoom-slider"
            min={0.5}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => onZoomChange(Number(e.target.value))}
          />
        </FieldGroup>
        <Button type="button" $variant="secondary" onClick={onResetView}>
          Reset position
        </Button>
      </Section>

      <Section>
        <SectionTitle>Frame Styling</SectionTitle>
        <FieldGroup>
          <Label>Padding ({displayPadding})</Label>
          <Slider
            disabled={isAsymmetric}
            min={0}
            max={150}
            step={1}
            value={isAsymmetric ? 16 : (frameConfig.padding as number)}
            onChange={(e) =>
              onCustomModifier("padding", Number(e.target.value))
            }
          />
        </FieldGroup>
        <FieldGroup>
          <Label>Corner radius ({frameConfig.borderRadius}px)</Label>
          <Slider
            min={0}
            max={100}
            step={1}
            value={frameConfig.borderRadius}
            onChange={(e) =>
              onCustomModifier("borderRadius", Number(e.target.value))
            }
          />
        </FieldGroup>
      </Section>

      <Section>
        <SectionTitle>Export Configuration</SectionTitle>
        <FieldGroup>
          <Label>Format type</Label>
          <SegmentedContainer>
            <SegmentButton
              $active={exportFormat === "png"}
              onClick={() => onFormatChange("png")}
            >
              PNG
            </SegmentButton>
            <SegmentButton
              $active={exportFormat === "jpeg"}
              onClick={() => onFormatChange("jpeg")}
            >
              JPG
            </SegmentButton>
          </SegmentedContainer>
        </FieldGroup>

        <FieldGroup>
          <Label>Compression profile</Label>
          <SegmentedContainer>
            <SegmentButton
              $active={!optimizeForWeb}
              onClick={() => onOptimizationChange(false)}
            >
              Regular
            </SegmentButton>
            <SegmentButton
              $active={optimizeForWeb}
              onClick={() => onOptimizationChange(true)}
            >
              Web optimized
            </SegmentButton>
          </SegmentedContainer>
        </FieldGroup>

        <Button onClick={onDownload} disabled={!isReadyToDownload}>
          Export
        </Button>
      </Section>
    </SidebarContainer>
  );
}
