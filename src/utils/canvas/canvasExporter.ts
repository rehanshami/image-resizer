// src/utils/canvas/canvasExporter.ts
import {
  FrameConfig,
  AsymmetricPadding,
  ExportFormat,
} from "@/components/editor/PhotoEditor";

interface CroppedAreaPixels {
  x: number;
  y: number;
  width: number;
  height: number;
}

const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", (error) => reject(error));
    image.setAttribute("crossOrigin", "anonymous");
    image.src = url;
  });

/**
 * Lossy pixel engine quantization method
 */
function optimizePngData(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
) {
  const imgData = ctx.getImageData(0, 0, width, height);
  const data = imgData.data;

  for (let i = 0; i < data.length; i += 4) {
    const alpha = data[i + 3];
    if (alpha === 0) {
      data[i] = 0;
      data[i + 1] = 0;
      data[i + 2] = 0;
      continue;
    }
    // Group identical bit clusters to maximize native standard DEFLATE patterns
    data[i] = Math.round(data[i] / 8) * 8;
    data[i + 1] = Math.round(data[i + 1] / 8) * 8;
    data[i + 2] = Math.round(data[i + 2] / 8) * 8;
  }
  ctx.putImageData(imgData, 0, 0);
}

export async function downloadCanvasAsset(
  imageUrl: string,
  croppedAreaPixels: CroppedAreaPixels | null,
  frameConfig: FrameConfig,
  format: ExportFormat,
  optimizeForWeb: boolean, // Parameter handles conditional execution flags
  fileName: string = "export-asset.png",
) {
  if (!croppedAreaPixels) {
    console.error("No valid cropping coordinates generated.");
    return;
  }

  try {
    const image = await createImage(imageUrl);
    const totalWidth = Number(frameConfig.width);
    const totalHeight = Number(frameConfig.height);
    const borderRadius = Number(frameConfig.borderRadius) || 0;

    const pad: AsymmetricPadding =
      typeof frameConfig.padding === "number"
        ? {
            top: frameConfig.padding,
            right: frameConfig.padding,
            bottom: frameConfig.padding,
            left: frameConfig.padding,
          }
        : frameConfig.padding;

    const canvas = document.createElement("canvas");
    canvas.width = totalWidth;
    canvas.height = totalHeight;
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      throw new Error("Canvas 2D context activation error.");
    }

    if (format === "jpeg") {
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, totalWidth, totalHeight);
    } else {
      ctx.clearRect(0, 0, totalWidth, totalHeight);
    }

    const destX = pad.left;
    const destY = pad.top;
    const destWidth = totalWidth - (pad.left + pad.right);
    const destHeight = totalHeight - (pad.top + pad.bottom);

    ctx.save();
    ctx.beginPath();
    ctx.roundRect(destX, destY, destWidth, destHeight, borderRadius);
    ctx.clip();

    ctx.drawImage(
      image,
      croppedAreaPixels.x,
      croppedAreaPixels.y,
      croppedAreaPixels.width,
      croppedAreaPixels.height,
      destX,
      destY,
      destWidth,
      destHeight,
    );
    ctx.restore();

    // Conditional Execution: Only apply optimization if selected by user
    if (format === "png" && optimizeForWeb) {
      optimizePngData(ctx, totalWidth, totalHeight);
    }

    const mimeType = `image/${format}`;

    // JPEG Compression Switch: 1.0 delivers max precision, 0.88 optimizes for lower payloads
    const quality =
      format === "jpeg" ? (optimizeForWeb ? 0.88 : 1.0) : undefined;

    canvas.toBlob(
      (blob) => {
        if (!blob) {
          console.error(
            "Binary media generation sequence encountered an error.",
          );
          return;
        }

        const downloadUrl = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = downloadUrl;
        link.download = fileName;

        document.body.appendChild(link);
        link.click();

        document.body.removeChild(link);
        window.URL.revokeObjectURL(downloadUrl);
      },
      mimeType,
      quality,
    );
  } catch (error) {
    console.error("High-fidelity workspace asset export failure:", error);
  }
}
