function resizeImageCanvas(originCanvas: HTMLCanvasElement, targetCanvas: HTMLCanvasElement, expectedWidth: number, expectedHeight: number) {
  // resize image
  const canvasBuffer = document.createElement("canvas");
  const contextBuffer = getContext(canvasBuffer);

  // resize to 50%
  canvasBuffer.width = originCanvas.width * 0.5;
  canvasBuffer.height = originCanvas.height * 0.5;
  contextBuffer.drawImage(originCanvas, 0, 0, canvasBuffer.width, canvasBuffer.height);

  contextBuffer.drawImage(canvasBuffer, 0, 0, canvasBuffer.width * 0.5, canvasBuffer.height * 0.5);

  const contextTarget = getContext(targetCanvas);

  targetCanvas.width = expectedWidth;
  targetCanvas.height = expectedHeight;

  contextTarget.drawImage(
    canvasBuffer,
    0,
    0,
    canvasBuffer.width * 0.5,
    canvasBuffer.height * 0.5,
    0,
    0,
    expectedWidth,
    expectedHeight
  );
}

function getContext(canvas:  HTMLCanvasElement) : CanvasRenderingContext2D {
  const context = canvas.getContext("2d");
  if(!context) {
      throw new Error("cannot find the context 2d for the canvas");
  }
  return context;
}



export function resizeImage(image: HTMLImageElement, expectedWidth: number, expectedHeight : number) : HTMLImageElement {
  const canvasBuffer = document.createElement("canvas");
  const contextBuffer = getContext(canvasBuffer);

  canvasBuffer.width = image.width;
  canvasBuffer.height = image.height;

  contextBuffer.drawImage(image, 0, 0, image.width, image.height);

  const canvasTarget = document.createElement("canvas");

  // mutate canvasTarget
  resizeImageCanvas(canvasBuffer, canvasTarget, expectedWidth, expectedHeight);

  const resizedImage = new Image();
  resizedImage.onload = () => {};
  resizedImage.src = canvasTarget.toDataURL();
  return resizedImage;
}

function componentToHex(c: number) : string {
      const hex = c.toString(16);
      return hex.length == 1 ? "0" + hex : hex;
    }

export function rgbToHex(r: number, g: number, b: number) : string {
  return "#" + componentToHex(Math.floor(r)) + componentToHex(Math.floor(g)) + componentToHex(Math.floor(b));
}

export async function toDataURL(data: string) {
  return new Promise(ok => {
    const reader = new FileReader();
    reader.addEventListener('load', () => ok(reader.result));
    reader.readAsDataURL(data);
  });
}