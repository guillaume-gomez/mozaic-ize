import { useState, useRef, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import { minBy } from "lodash";
import imageTest from "/lifesaver_opaque.jpg";
import InputFileWithPreview from "./components/InputFileWithPreview";
import MozaicCanvas from "./components/MozaicCanvas";
import Range from "./components/Range";
import { generateColorPalette, drawPalette, extendPalette, fromPaletteToPaletteColor } from "./paletteGenerator";
import ThreeJsRenderer from "./components/ThreeJs/ThreeJsRenderer";
import { resizeImage } from "./utils";
import useMozaic from "./components/Hooks/useMozaic";

function App() {
  const [count, setCount] = useState<boolean>('0');
  const [image, setImage] = useState<HTMLImageElement>();
  const [imageColorMode, setImageColorMode] = useState<string>("normal");
  const [backgroundColor, setBackgroundColor] = useState<string>("#FFFFFF");
  const [mozaicTile, setMozaicTile] = useState<number>(16);
  const [padding, setPadding] = useState<number>(0);
  const [width, setWidth] =  useState<number>(1024);
  const [height, setHeight] =  useState<number>(1024);
  const {generate, tilesData} = useMozaic();

  function uploadImage(newImage: HTMLImageElement) {
    const expectedWidth = newImage.width + (mozaicTile - (newImage.width % mozaicTile))
    const expectedHeight = newImage.height + (mozaicTile - (newImage.height % mozaicTile))
    
    const resizedImage = resizeImage(newImage, expectedWidth, expectedHeight)
    setImage(resizedImage);

    setWidth(expectedWidth);
    setWidth(expectedHeight);
  }

  return (
    <>
      <div>
        <h1 className="text-3xl font-bold underline">
          Hello world!
        </h1>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>Vite + React (oublie pas la branche optimization)</h1>
      <div className="form">
        <div>
          <label>BackgroundColor</label>
          <input
            type="color"
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
          />
        </div>
        <div>
          <Range
            min={2}
            max={20}
            step={2}
            label={"Mozaic Tile"}
            value={mozaicTile}
            onChange={setMozaicTile}
          />
          <Range
            min={0}
            max={10}
            step={2}
            label={"Padding"}
            value={padding}
            onChange={setPadding}
          />
        </div>
      </div>
      <div /*className="flex flex-col gap-2"*/ style={{display: "flex", flexDirection: "column", gap: "6px"}}>
        <MozaicCanvas
          backgroundColor={backgroundColor}
          imageColorMode={imageColorMode}
          tileSize={mozaicTile}
          padding={padding}
          tilesData={tilesData}
          width={width}
          height={height}
        />
        <button
          className="btn btn-primary"
          onClick={() => generate(image, "normal")}>
          Generate
        </button>
        <div style={{ height: 400 }}>
          <ThreeJsRenderer
            backgroundColor={backgroundColor}
            widthMozaic={width}
            heightMozaic={height}
            widthTile={16}
            heightTile={16}
            padding={2}
            tilesData={tilesData}
          />
        </div>
        <canvas id="palette" width={512} height={512} />
      </div>
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
