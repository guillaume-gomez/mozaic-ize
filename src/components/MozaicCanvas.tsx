import { useState, useRef, useEffect } from 'react';
import {
    generateColorPalette,
    drawPalette,
    extendPalette,
    fromPaletteToPaletteColor
} from "../paletteGenerator";
import Range from "./Range";
import { TileData } from "../Hooks/useMozaic";
import { rgbToHex } from "../utils";

interface MozaicCanvasProps {
    backgroundColor: string;
    imageColorMode: string;
    tileSize: number;
    padding: number;
    tilesData: TileData[];
    width: number;
    height: number;
}

function MozaicCanvas({
  backgroundColor,
  imageColorMode,
  tileSize,
  padding,
  tilesData,
  width,
  height
}: MozaicCanvasProps) {
  const canvasRef = useRef<HTMLCanvasDocument>();
  const [shadowBlur, setShadowBlur] = useState<number>(10);

  useEffect(() => {
    if(!canvasRef.current) {
      return;
    }
    const context = canvasRef.current.getContext("2d");
    if(!context) {
      return;
    }

    canvasRef.current.width = width;
    canvasRef.current.height = height;

    if( width % (tileSize - padding) !== 0) {
      throw new Error("Cannot match the width");
    }

    if( height % (tileSize - padding) !== 0) {
      throw new Error("Cannot match the height");
    }

    context.clearRect(0,0, width, height);
    context.fillStyle = backgroundColor;
    context.fillRect(0,0, width, height);

    drawTiles(context, tilesData, tileSize - padding);
  }, [tilesData, canvasRef, backgroundColor])

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
        context.fillStyle = rgbToHex(red, green, blue);
        context.roundRect(x,y, tileSize, tileSize, 2);
        context.stroke();
        context.fill();


        //context.fillRect(x + 2,y + 2, tileSize-4, tileSize-4);
    });
  }


    return (
        <div>
            <Range
              min={0}
              max={10}
              label={"Shadow Blur"}
              value={shadowBlur}
              onChange={setShadowBlur}
            />
            <canvas ref={canvasRef} width={512} height={512}/>
        </div>
    )
}

export default MozaicCanvas;