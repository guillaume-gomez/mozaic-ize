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
  const [count, setCount] = useState(0);
  const [image, setImage] = useState<HTMLImageElement>();
  const [imageColorMode, setImageColorMode] = useState<string>("normal");
  const [backgroundColor, setBackgroundColor] = useState<string>("#FFFFFF");
  const [shadowBlur, setShadowBlur] = useState<number>(10);
  const [mozaicTile, setMozaicTile] = useState<number>(18);
  const [padding, setPadding] = useState<number>(1);
  const [width, ] =  useState<number>(1024);
  const [height, ] =  useState<number>(1024);
  const {generate, tilesData} = useMozaic();

  console.log("height", tilesData)

  function uploadImage(newImage: HTMLImageElement) {
    const resizedImage = resizeImage(newImage, width, height)
    setImage(resizedImage);
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
            min={0}
            max={10}
            label={"Shadow Blur"}
            value={shadowBlur}
            onChange={setShadowBlur}
          />
          <Range
            min={2}
            max={20}
            label={"Mozaic Tile"}
            value={mozaicTile}
            onChange={setMozaicTile}
          />
          <Range
            min={1}
            max={10}
            label={"Padding"}
            value={padding}
            onChange={setPadding}
          />
        </div>
      </div>
      <div /*className="flex flex-col gap-2"*/ style={{display: "flex", flexDirection: "column", gap: "6px"}}>
        <MozaicCanvas
          imageOrigin={image}
          shadowBlur={shadowBlur}
          backgroundColor={backgroundColor}
          imageColorMode={imageColorMode}
        />
        <button
          className="btn btn-primary"
          onClick={() => generate(image, "normal")}>
          Generate fdfd
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
