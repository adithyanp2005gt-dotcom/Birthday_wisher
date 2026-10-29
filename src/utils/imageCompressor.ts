/**
 * imageCompressor.ts
 * Efficient client-side image compression using HTML5 Canvas.
 * Compresses camera/phone photos from several megabytes down to ~12KB - 20KB
 * so they can be embedded directly into shareable surprise links.
 */

export interface CompressionOptions {
  maxDimension?: number;
  quality?: number;
}

/**
 * Resizes and compresses an image File or DataURL into a lightweight JPEG data URL.
 */
export async function compressImage(
  source: File | string,
  options: CompressionOptions = {}
): Promise<string> {
  const { maxDimension = 280, quality = 0.55 } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = () => {
      try {
        let width = img.width;
        let height = img.height;

        // Scale down proportionally
        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas 2D context not available'));
          return;
        }

        // Smooth image downsampling
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        // Compress to JPEG
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      } catch (err) {
        reject(err);
      }
    };

    img.onerror = (err) => reject(err);

    if (typeof source === 'string') {
      img.src = source;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (typeof e.target?.result === 'string') {
          img.src = e.target.result;
        } else {
          reject(new Error('Could not read file'));
        }
      };
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(source);
    }
  });
}

