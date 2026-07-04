import { useState } from 'react';
import {
    generateColorPalette,
    extendPalette
} from "../../paletteGenerator";
import { rgbToHex, toDataURL } from "../../utils";
import useLayer from "./useLayer";

interface Color {
  red: number;
  green: number;
  blue: number;
}

export interface TileData {
  color: Color;
  x: number;
  y: number;
}

function useMozaicFrame() {
  const [frameSize, setFrameSize] = useState<number>(5);
  const [backgroundColor, setBackgroundColor] = useState<string>("#FFFFFF");
  const { generateLayer } = useLayer();


  function generate(imageWidth: number, imageHeight: number, tileSize: number,) : TileData[] {
    const canvasBuffer = createCanvasFromImage(imageWidth, imageHeight);
    drawFrame();
    
    const tilesData = generateLayer(
      canvasBuffer, 
      tileSize, 
      0,
      {
        interpolateArea: false
      }

    );
    setTilesData(tilesData);
    return tilesData;
  }

  function createCanvasFromImage(imageWidth: number, imageHeight: number): OffscreenCanvas {
    const extendCanvas = frameSize * 2;

    const canvasBuffer = new OffscreenCanvas(imageWidth + extendCanvas, imageHeight + extendCanvas);
    return canvasBuffer;
  }

  function drawFrame(canvas: OffscreenCanvas, tileSize: number) {
    const { width, height } = canvas;

    const context = canvasBuffer.getContext('2d');
    
    if(!context) {
      throw new Error("Cannot find the context");
    }
    
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    context.strokeStyle = "black";
    context.lineWidth = tileSize;
    context.strokeRect(0, 0, width, height);

    context.strokeRect(
      frameSize * tileSize,
      frameSize * tileSize,
      width - (frameSize * tileSize),
      height - (frameSize * tileSize)
    );
  }

   
  return { 
    generateImage,
    tilesData,
    padding,
    tileSize,
    backgroundColor,
    setPadding,
    setTileSize,
    setBackgroundColor
  };
}

export default useMozaicFrame;