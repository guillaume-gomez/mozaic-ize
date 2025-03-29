import { useState, useRef, useEffect } from 'react';
import { minBy } from "lodash";
import {
    generateColorPalette,
    drawPalette,
    extendPalette,
    fromPaletteToPaletteColor
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

// original one
//const tileSize = 16 + 2;
//const padding = 1;

// for the test
const tileSize = 32;
const padding = 0;

function useMozaic() {
  const [tilesData, setTilesData] = useState<TileData[]>([]);

    async function fromTilesDataToImage(imageOrigin: HTMLImageElement, imageColorMode: string) {
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

      context.fillStyle = "#FFFFFF";
      context.fillRect(0, 0, canvas.width, canvas.height);

      tilesData.forEach(colorData => {
        const { red, green, blue } = colorData.color;
        const { x, y } = colorData;

        context.beginPath()
        context.fillStyle = rgbToHex(red, green, blue);
        // before
        //context.rect(x,y, tileSize - 2*padding, tileSize - 2*padding);
        
        //after 
        context.rect(x + 1,y + 1, tileSize - 2, tileSize - 2);
        context.fill();
      });
      // Hack-ish
      const blob = await canvas.convertToBlob();
      return await toDataURL(blob);
    }

    function generate(imageOrigin: HTMLImageElement, imageColorMode: string) : TileData[] {
        const canvasBuffer = document.createElement("canvas");
        const palette = generateColorPalette(imageOrigin , 20);
        const paletteColor = fromPaletteToPaletteColor(palette);
        const context = canvasBuffer.getContext('2d', { willReadFrequently: true });
        const {width, height} = imageOrigin
        // create backing canvas
        canvasBuffer.width = width;
        canvasBuffer.height = height;
        // restore main canvas
        context.drawImage(imageOrigin, 0,0);


        if( width % (tileSize - 2*padding) !== 0) {
          throw new Error("Cannot match the width");
        }

        if( height % (tileSize - 2*padding) !== 0) {
          throw new Error("Cannot match the height");
        }

        console.log(width, " ", height)

        const tilesData = getColorsImage(
          context,
          width,
          height,
          tileSize,
          padding,
          paletteColor
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
      paletteColor: Color[],
      imageColorMode: string) : TileData[] {
      const tilesData: TileData[] = [];
      for(let x = padding; x < width; x+= (tileSize + padding) ) {
        for(let y = padding; y < height; y+= (tileSize + padding) ) {
          const color = computeColor(context, tileSize - (2*padding), x + padding, y + padding, paletteColor, imageColorMode);
          tilesData.push({
            color,
            x: x + padding,
            y: y + padding,
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
      paletteColor: Color[],
      imageColorMode: string
    ) {
      if(imageColorMode ==="normal") {
        return interpolateArea(context, tileSize, x, y);
      }

      return fromColorToDominantColor(
          interpolateArea(context, tileSize, x, y),
          paletteColor
      );
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

    function colorDistance(color1: Color, color2: Color) : number {
      const redDiff = (color2.red - color1.red);
      const greenDiff = (color2.green - color1.green);
      const blueDiff = (color2.blue - color1.blue);
      return (redDiff * redDiff) + (greenDiff * greenDiff) + (blueDiff * blueDiff);
    }

  return { generate, tilesData, fromTilesDataToImage, padding, tileSize };
}

export default useMozaic;