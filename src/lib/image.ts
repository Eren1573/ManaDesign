/**
 * Reads an image file and downscales it to max width/height of 896px using HTML Canvas.
 * Returns a high-quality JPEG data URL suitable for sending to Gemini Vision.
 */
export async function fileToDataUrl(file: File, maxDimension: number = 896): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (readerEvent) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

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
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          // Fallback to raw data URL if canvas context unavailable
          resolve(readerEvent.target?.result as string);
          return;
        }

        // Fill background with white for transparent images
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, width, height);

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        resolve(dataUrl);
      };

      img.onerror = (err) => reject(new Error('Failed to load image for resizing'));
      img.src = readerEvent.target?.result as string;
    };

    reader.onerror = (err) => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}
