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
  const [width, setWidth] =  useState<number>(1024);
  const [height, setHeight] =  useState<number>(1024);
  const [dataUrl, setDataUrl] = useState<string>("");
  const {generate, tilesData, fromTilesDataToImage, padding, tileSize } = useMozaic();

  function uploadImage(newImage: HTMLImageElement) {
    /*const expectedWidth = newImage.width + (tileSize - (newImage.width % tileSize))
    const expectedHeight = newImage.height + (tileSize - (newImage.height % tileSize))
    
    const resizedImage = resizeImage(newImage, expectedWidth, expectedHeight);
    setImage(resizedImage);

    setWidth(expectedWidth);
    setHeight(expectedHeight);*/

    //to debug
    const resizedImage = resizeImage(newImage, width, height);
    setImage(resizedImage);


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
          {/*<Range
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
          />*/}
        </div>
      </div>
      <div /*className="flex flex-col gap-2"*/ style={{display: "flex", flexDirection: "column", gap: "6px"}}>
        <img src={dataUrl} />
        <MozaicCanvas
          backgroundColor={backgroundColor}
          imageColorMode={imageColorMode}
          tileSize={tileSize}
          padding={2}
          tilesData={tilesData}
          width={width}
          height={height}
        />
        <button
          className="btn btn-primary"
          onClick={async () => {
            //generate(image, "normal");
            const dataUrl = await fromTilesDataToImage(image, "normal");
            setDataUrl(dataUrl);
          }}>
          Generate
        </button>
        <div style={{ height: 400 }}>
          {dataUrl !== "" && <ThreeJsRenderer
              widthMozaic={width}
              heightMozaic={height}
              base64Texture={dataUrl}
            />
          }
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
