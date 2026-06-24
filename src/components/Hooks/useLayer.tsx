import { minBy, findIndex, sample } from "lodash";
import { ExtendedPalette } from "../../paletteGenerator";

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

function useLayer() {  
  function generateLayer(
    canvasBuffer: OffscreenCanvas,
    tileSize: number,
    padding: number,
    extendedPalette: ExtendedPalette,
    imageColorMode: string
  ) : TileData[] {
    
    const context = canvasBuffer.getContext('2d', { willReadFrequently: true });
    const { width, height } = canvasBuffer;
    
    if(!context) {
      throw new Error("Cannot find the context");
    }
    
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
    return tilesData;
  }

  function getColorsImage(
    context: OffscreenCanvasRenderingContext2D,
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
    context: OffscreenCanvasRenderingContext2D,
    tileSize: number,
    x: number,
    y: number,
    extendedPalette: ExtendedPalette,
    imageColorMode: string
  ) {

    if(imageColorMode === "normal") {
      return interpolateArea(context, tileSize, x, y);
    }

    // using the palette to randomize the chosen color
    return findColorWithRandomness(context, tileSize, x, y, extendedPalette);
  }


  function interpolateArea(context: OffscreenCanvasRenderingContext2D, tileSize: number, x: number, y: number) : Color {
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
    context: OffscreenCanvasRenderingContext2D,
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

  return { generateLayer };
}

export default useLayer;