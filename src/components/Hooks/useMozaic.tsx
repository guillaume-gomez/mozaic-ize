import { useState } from 'react';
import { minBy, findIndex, sample } from "lodash";
import {
    generateColorPalette,
    extendPalette,
    ExtendedPalette
} from "../../paletteGenerator";
import { rgbToHex, toDataURL } from "../../utils";

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

    async function fromTilesDataToImage(imageOrigin: HTMLImageElement, imageColorMode: string) : Promise<string> {
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
        const canvasBuffer = document.createElement("canvas");
        const palette = generateColorPalette(imageOrigin , 20);
        const extendedPalette = extendPalette(palette, 20, 20);
        const context = canvasBuffer.getContext('2d', { willReadFrequently: true });
        const {width, height} = imageOrigin
        // create backing canvas
        canvasBuffer.width = width;
        canvasBuffer.height = height;
        
        if(!context) {
          throw new Error("Cannot find the context");
        }
        // restore main canvas
        context.drawImage(imageOrigin, 0,0);


        if( width % (tileSize) !== 0) {
          throw new Error("Cannot match the width");
        }

        if( height % (tileSize) !== 0) {
          throw new Error("Cannot match the height");
        }

        const tilesData = getColorsImage(
          context,
          width,
          height,
          tileSize,
          padding,
          extendedPalette,
          imageColorMode
        );
        setTilesData(tilesData);
        return tilesData;
    }

    function getColorsImage(
      context: CanvasRenderingContext2D,
      width: number,
      height: number,
      tileSize: number,
      padding: number,
      extendedPalette: ExtendedPalette,
      imageColorMode: string) : TileData[] {
      const tilesData: TileData[] = [];

      for(let x = padding/2; x < width; x+= (tileSize) ) {
        for(let y = padding/2; y < height; y+= (tileSize) ) {
          const color = computeColor(context, tileSize, x - padding, y - padding, extendedPalette, imageColorMode);
          tilesData.push({
            color,
            x,
            y,
          }
          );
        }
      }
      return tilesData;
    }

    function computeColor(
      context: CanvasRenderingContext2D,
      tileSize: number,
      x: number,
      y: number,
      extendedPalette: ExtendedPalette,
      imageColorMode: string
    ) {

      if(imageColorMode ==="normal") {
        return interpolateArea(context, tileSize, x, y);
      }

      // using the palette to randomize the chosen color
      return findColorWithRandomness(context, tileSize, x, y, extendedPalette);
    }


    function interpolateArea(context: CanvasRenderingContext2D, tileSize: number, x: number, y: number) : Color {
      const pixels = context.getImageData(x,y, tileSize, tileSize);
      const { data } = pixels;
      const numberOfPixels = tileSize * tileSize;
      let red = 0;
      let green = 0;
      let blue = 0;


      for (let i = 0; i < data.length; i += 4) {
        red += data[i];
        green += data[i + 1];
        blue += data[i + 2];
      }

      return { red: (red/numberOfPixels), green: (green/numberOfPixels), blue: (blue/numberOfPixels) };
    }


    function fromColorToDominantColor(color: Color, palette: Color[]) : Color {
      const comparaisonValues = palette.map(colorPalette => ({
          colorPalette,
          difference: colorDistance(color, colorPalette)})
      );
      const foundColor = minBy(comparaisonValues, 'difference');
      if(!foundColor) {
        throw `No sprite found for the pixel with the value ${color}`;
      }
      if(!foundColor.colorPalette) {
        throw new Error("Cannot find the color");
      }
      return foundColor.colorPalette;
    }

    function findColorWithRandomness(
      context: CanvasRenderingContext2D,
      tileSize: number,
      x: number,
      y: number,
      extendedPalette: ExtendedPalette) {
      const foundColor = fromColorToDominantColor(
          interpolateArea(context, tileSize, x, y),
          extendedPalette.original
        );
      const colorIndex : number = findIndex(extendedPalette.original, foundColor);
      const randomTypeOfPalette = sample(["original", "original", "original", "hue", "saturated"]);
      return extendedPalette[randomTypeOfPalette as keyof ExtendedPalette][colorIndex];
    }

    function colorDistance(color1: Color, color2: Color) : number {
      const redDiff = (color2.red - color1.red);
      const greenDiff = (color2.green - color1.green);
      const blueDiff = (color2.blue - color1.blue);
      return (redDiff * redDiff) + (greenDiff * greenDiff) + (blueDiff * blueDiff);
    }

  return { 
    generate,
    tilesData,
    fromTilesDataToImage,
    padding,
    tileSize,
    backgroundColor,
    setPadding,
    setTileSize,
    setBackgroundColor
  };
}

export default useMozaic;