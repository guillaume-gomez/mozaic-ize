import { useState, useRef, useEffect } from 'react';
import {
    generateColorPalette,
    drawPalette,
    extendPalette,
    fromPaletteToPaletteColor
} from "../paletteGenerator";

interface MozaicCanvasProps {
    imageOrigin: HTMLImageElement;
    backgroundColor: string;
    shadowBlur: number;
    imageColorMode: string;
}

interface Color {
  red: number;
  green: number;
  blue: number;
}

interface TileData {
  color: Color;
  x: number;
  y: number;
}

function componentToHex(c: number) : string {
  const hex = c.toString(16);
  return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r: number, g: number, b: number) : string {
  return "#" + componentToHex(Math.floor(r)) + componentToHex(Math.floor(g)) + componentToHex(Math.floor(b));
}

function MozaicCanvas({ imageOrigin, backgroundColor, shadowBlur, imageColorMode }: MozaicCanvasProps) {
    const canvasRef = useRef<HTMLCanvasDocument>();

    useEffect(() => {
        if(imageOrigin && canvasRef.current) {
          const palette = generateColorPalette(imageOrigin ,20);
          const paletteColor = fromPaletteToPaletteColor(palette);


          const context = canvasRef.current.getContext('2d');
          const {width, height} = imageOrigin
          // create backing canvas
          canvasRef.current.width = width;
          canvasRef.current.height = height;
          // restore main canvas
          context.drawImage(imageOrigin, 0,0);

          const tileSize = 18;
          const padding = 1;

          if( width % (tileSize - 2*padding) !== 0) {
            throw new Error("Cannot match the width");
          }

          if( height % (tileSize - 2*padding) !== 0) {
            throw new Error("Cannot match the height");
          }

          const tilesData = getColorsImage(
            context,
            width,
            height,
            tileSize,
            padding,
            paletteColor
          );
          context.clearRect(0,0, width, height);

          context.fillStyle = backgroundColor;
          context.fillRect(0,0, width, height);

          drawTiles(context, tilesData, tileSize - (2*padding));
        }
  }, [canvasRef.current, imageOrigin, backgroundColor, shadowBlur]);

  function getColorsImage(
    context: CanvasRenderingContext2D,
    width: number,
    height: number,
    tileSize: number,
    padding: number,
    paletteColor: Color[]) : TileData[] {
    const tilesData: TileData[] = [];
    for(let x = padding; x < width; x+= (tileSize + padding) ) {
      for(let y = padding; y < height; y+= (tileSize + padding) ) {
        const color = computeColor(context, tileSize - (2*padding), x + padding, y + padding, paletteColor);
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

  function computeColor(context: CanvasRenderingContext2D, tileSize: number, x: number, y: number, paletteColor: Color[]) {
    if(imageColorMode ==="normal") {
      return interpolateArea(context, tileSize, x, y);
    }

    return fromColorToDominantColor(
        interpolateArea(context, tileSize, x, y),
        paletteColor
    );

  }

  function drawTiles(context: CanvasRenderingContext2D, tilesData: TileData[], tileSize: number) {
    context.shadowColor = "black";
    const shadow = Math.floor(Math.sqrt(tileSize));
    context.shadowOffsetX = shadow;
    context.shadowOffsetY = shadow;
    context.shadowBlur = shadowBlur;
    tilesData.forEach(colorData => {
        const { red, green, blue } = colorData.color;
        const { x, y } = colorData;

        context.beginPath()
        context.strokeStyle = rgbToHex(red-20, green-20, blue-20);
        context.fillStyle = rgbToHex(red, green, blue)
        context.roundRect(x,y, tileSize, tileSize, 2);
        context.stroke();
        context.fill();


        //context.fillRect(x + 2,y + 2, tileSize-4, tileSize-4);
    });
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

    return (
        <div>
            <p>Alice est la miss de mon coeur</p>
            <canvas ref={canvasRef} width={512} height={512}/>
        </div>
    )
}

export default MozaicCanvas;