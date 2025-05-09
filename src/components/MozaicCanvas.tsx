import { useState, useRef, useEffect } from 'react';
import Range from "./Range";
import SaveImageButton from "./SaveImageButton";
import { TileData } from "./Hooks/useMozaic";
import { rgbToHex } from "../utils";

interface MozaicCanvasProps {
    backgroundColor: string;
    tileSize: number;
    padding: number;
    tilesData: TileData[];
    width: number;
    height: number;
}

function MozaicCanvas({
  backgroundColor,
  tileSize,
  padding,
  tilesData,
  width,
  height
}: MozaicCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
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
        context.roundRect(x + padding/2,y + padding/2, tileSize - padding, tileSize - padding, 2);
        context.stroke();
        context.fill();


        //context.fillRect(x + 2,y + 2, tileSize-4, tileSize-4);
    });
  }


    return (
        <div className="flex flex-col gap-5 bg-black">
            <Range
              min={0}
              max={10}
              label={"Shadow Blur"}
              value={shadowBlur}
              onChange={setShadowBlur}
            />
            <canvas ref={canvasRef} width={width} height={height}/>
            <SaveImageButton
              label="Download"
              canvasRef={canvasRef}
              filename="mozaic-ize"
            />
        </div>
    )
}

export default MozaicCanvas;