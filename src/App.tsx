import { useState, useRef, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import { minBy } from "lodash";
import imageTest from "/lifesaver_opaque.jpg";
import InputFileWithPreview from "./components/InputFileWithPreview";
import MozaicCanvas from "./components/MozaicCanvas";
import { generateColorPalette, drawPalette, extendPalette, fromPaletteToPaletteColor } from "./paletteGenerator";
import { resizeImage } from "./utils";
import './App.css';

function App() {
  const [count, setCount] = useState(0);
  const [image, setImage] = useState<HTMLImageElement>();
  const [imageColorMode, setImageColorMode] = useState<string>("normal");
  const [backgroundColor, setBackgroundColor] = useState<string>("#FFFFFF");
  const [shadowBlur, setShadowBlur] = useState<number>(10);

  function uploadImage(newImage: HTMLImageElement) {
    const resizedImage = resizeImage(newImage, 1024, 1024)
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
          <label>Shadow Blur</label>
          <span>{shadowBlur}</span>
          <input
            type="range"
            step={1}
            min={0}
            max={10}
            value={shadowBlur}
            onChange={(e) => setShadowBlur(e.target.value)}

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
