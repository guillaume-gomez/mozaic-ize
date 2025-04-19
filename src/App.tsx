import { useState, useRef, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import imageTest from "/lifesaver_opaque.jpg";
import InputFileWithPreview from "./components/InputFileWithPreview";
import MozaicCanvas from "./components/MozaicCanvas";
import ColorPicker from "./components/ColorPicker";
import Range from "./components/Range";
import Select from "./components/Select";
import { generateColorPalette, drawPalette, extendPalette, fromPaletteToPaletteColor } from "./paletteGenerator";
import ThreeJsRenderer from "./components/ThreeJs/ThreeJsRenderer";
import { resizeImage } from "./utils";
import useMozaic from "./components/Hooks/useMozaic";

function App() {
  const [count, setCount] = useState<boolean>('0');
  const [originalImage, setOriginalImage] = useState<HTMLImageElement>();
  const [image, setImage] = useState<HTMLImageElement>();
  const [twoDimention, setTwoDimention] =  useState<boolean>(false);
  const [imageColorMode, setImageColorMode] = useState<string>("normal");
  const [width, setWidth] =  useState<number>(1024);
  const [height, setHeight] =  useState<number>(1024);
  const [dataUrl, setDataUrl] = useState<string>("");
  const {
    generate,
    tilesData,
    fromTilesDataToImage,
    padding,
    tileSize,
    backgroundColor,
    setPadding,
    setTileSize,
    setBackgroundColor
  } = useMozaic();

  function uploadImage(newImage: HTMLImageElement) {
    const expectedWidth = newImage.width + (tileSize - (newImage.width % tileSize))
    const expectedHeight = newImage.height + (tileSize - (newImage.height % tileSize))
    
    const resizedImage = resizeImage(newImage, expectedWidth, expectedHeight);
    setImage(resizedImage);

    setWidth(expectedWidth);
    setHeight(expectedHeight);

    setOriginalImage(newImage);
  }

  useEffect(() => {
    if(originalImage) {
      uploadImage(originalImage);
    }
  }, [tileSize])

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
      <h1>Vite + React</h1>
      <div className="form">
       <ColorPicker
        label={"BackgroundColor"}
        onChange={(color) => setBackgroundColor(color)}
        value={backgroundColor} />
        <div>
          <Range
            min={16}
            max={128}
            step={8}
            label={"Mozaic Tile"}
            value={tileSize}
            onChange={setTileSize}
          />
          <Range
            min={0}
            max={tileSize - 20}
            step={2}
            label={"Padding"}
            value={padding}
            onChange={setPadding}
          />
        </div>
        <InputFileWithPreview onChange={uploadImage} value={image} />
        <Select
          label="Mode of generation"
          value={imageColorMode}
          onChange={(imageColorMode) => setImageColorMode(imageColorMode)}
          options={[
            {label: "Normal", value: "normal"},
            {label: "Random", value: "random"},
          ]}
        />
        <button
          className="btn btn-primary"
          onClick={async () => {
            //generate(image, "normal");
            const dataUrl = await fromTilesDataToImage(image, imageColorMode);
            setDataUrl(dataUrl);
          }}>
          Generate
        </button>
      </div>
      <div /*className="flex flex-col gap-2"*/ style={{display: "flex", flexDirection: "column", gap: "6px"}}>
        <img src={dataUrl} className="hidden" />
        {twoDimention ? <MozaicCanvas
          backgroundColor={backgroundColor}
          tileSize={tileSize}
          padding={padding}
          tilesData={tilesData}
          width={width}
          height={height}
        />: 
        <div className="w-full h-1/2">
          {dataUrl !== "" && <ThreeJsRenderer
              widthMozaic={width}
              heightMozaic={height}
              base64Texture={dataUrl}
              tilesData={tilesData}
              tileSize={tileSize}
              padding={padding}
              backgroundColor={backgroundColor}
            />
          }
        </div>
          }
      </div>
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
