import { useState, useRef, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import { minBy } from "lodash";
import imageTest from "/lifesaver_opaque.jpg";
import InputFileWithPreview from "./components/InputFileWithPreview";
import { generateColorPalette, drawPalette, extendPalette, fromPaletteToPaletteColor } from "./paletteGenerator";
import './App.css';

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

function App() {
  const [count, setCount] = useState(0);
  const [image, setImage] = useState<HTMLImageElement>();
  const imageRef = useRef<HTMLImageElement>();
  const canvasRef = useRef<HTMLCanvasDocument>();


  useEffect(() => {

    if(canvasRef.current && imageRef.current) {
      const palette = generateColorPalette(imageRef.current,20);
      //const extendedPalette = extendPalette(palette,20,20);
      const paletteColor = fromPaletteToPaletteColor(palette);
      //drawPalette("palette", extendedPalette);


      const context = canvasRef.current.getContext('2d');
      const {width, height} = imageRef.current
      // create backing canvas
      canvasRef.current.width = width;
      canvasRef.current.height = height;
      // restore main canvas
      context.drawImage(imageRef.current, 0,0);

      const tileSize = 12;
      const tilesData = getColorsImage(
        context,
        width,
        height,
        tileSize,
        paletteColor
      );
      context.clearRect(0,0, width, height);

      context.fillStyle = `rgb(0 0 0)`;
      context.fillRect(0,0, width, height);

      drawTiles(context, tilesData, tileSize - 2);
    }
  }, [canvasRef.current, imageRef.current]);

  function getColorsImage(
    context: CanvasRenderingContext2D,
    width: number,
    height: number,
    tileSize: number,
    paletteColor: Color[]) : TileData[] {
    const tilesData: TileData[] = [];
    for(let x = 0; x < width; x+= tileSize) {
      for(let y = 0; y < height; y+= tileSize) {
        /*const color = fromColorToDominantColor(
          interpolateArea(context, tileSize, x, y),
          paletteColor
        );*/
        const color = interpolateArea(context, tileSize, x, y);

        tilesData.push({
          color,
          x,
          y
        }
        );
      }
    }
    return tilesData;
  }

  function drawTiles(context: CanvasRenderingContext2D, tilesData: TileData[], tileSize: number) {
    tilesData.forEach(colorData => {
        const { red, green, blue } = colorData.color;
        const { x, y } = colorData;

        context.fillStyle = `rgb(${Math.floor(red)} ${Math.floor(green)} ${Math.floor(blue)})`;
        context.fillRect(x,y, tileSize, tileSize);
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



  function uploadImage(newImage: HTMLImageElement) {
    setImage(newImage);
  }

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React</h1>
      <img src={imageTest} ref={imageRef} alt="image test" />
      <canvas ref={canvasRef} width={500} height={500}/>
      <canvas id="palette" width={500} height={500} />
      <InputFileWithPreview onChange={uploadImage} value={image} />
      <div className="card">
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
