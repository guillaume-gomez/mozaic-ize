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

function useMozaic() {
  const [tilesData, setTilesData] = useState<TileData[]>([]);
  const [tileSize, setTileSize] = useState<number>(32);
  const [padding, setPadding] = useState<number>(2);
  const [backgroundColor, setBackgroundColor] = useState<string>("#FFFFFF");
  const { generateLayer } = useLayer();

    async function generateImage(imageOrigin: HTMLImageElement, imageColorMode: string) : Promise<string> {
      const tilesData = generate(imageOrigin, imageColorMode);

      if(tilesData.length === 0) {
        throw new Error("tilesData are not ready");
      }

      const {width, height} = imageOrigin
      const canvas = new OffscreenCanvas(width, height);
      const context = canvas.getContext("2d");
      if(!context) {
        throw new Error("Cannot find the context");
      }

      context.fillStyle = backgroundColor;
      context.fillRect(0, 0, canvas.width, canvas.height);

      tilesData.forEach(colorData => {
        const { red, green, blue } = colorData.color;
        const { x, y } = colorData;

        context.beginPath()
        context.fillStyle = rgbToHex(red, green, blue);
        context.roundRect(x,y, tileSize - padding, tileSize - padding, 2 * 1/tileSize);
        context.fill();
      });
      // Hack-ish
      const blob = await canvas.convertToBlob();
      return await toDataURL(blob);
    }

    function generate(imageOrigin: HTMLImageElement, imageColorMode: string) : TileData[] {
        const palette = generateColorPalette(imageOrigin , 20);
        const extendedPalette = extendPalette(palette, 20, 20);

        const canvasBuffer = createCanvasFromImage(imageOrigin);
        
        const tilesData = generateLayer(
          canvasBuffer, 
          tileSize, 
          padding,
          extendedPalette,
          imageColorMode
        );
        setTilesData(tilesData);
        return tilesData;
    }

    function createCanvasFromImage(imageOrigin: HTMLImageElement): OffscreenCanvas {
      const canvasBuffer = new OffscreenCanvas(imageOrigin.width, imageOrigin.height);
      const context = canvasBuffer.getContext('2d');
        if(!context) {
          throw new Error("Cannot find the context");
        }
        // restore main canvas
        context.drawImage(imageOrigin, 0,0);

      return canvasBuffer;
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

export default useMozaic;