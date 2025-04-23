import { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import InputFileWithPreview from "./components/InputFileWithPreview";
import MozaicCanvas from "./components/MozaicCanvas";
import ColorPicker from "./components/ColorPicker";
import Range from "./components/Range";
import Select from "./components/Select";
import ThreeJsRenderer from "./components/ThreeJs/ThreeJsRenderer";
import { resizeImage } from "./utils";
import useMozaic from "./components/Hooks/useMozaic";
import Card from "./components/Card";

function App() {
  const [count, setCount] = useState<number>(0);
  const [originalImage, setOriginalImage] = useState<HTMLImageElement>();
  const [image, setImage] = useState<HTMLImageElement>();
  //const [twoDimention, setTwoDimention] =  useState<boolean>(false);
  const [imageColorMode, setImageColorMode] = useState<string>("normal");
  const [width, setWidth] =  useState<number>(1024);
  const [height, setHeight] =  useState<number>(1024);
  const [artistName, setArtistName]= useState<string>("Made by Guillaume G");
  const [dataUrl, setDataUrl] = useState<string>("");
  const {
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
    <div className="container m-auto flex flex-col gap-5 lg:p-2 p-4">
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
      <h1>Mosaic-ize</h1>
      <Card
        label={"Settings"}
      >
        <ColorPicker
          label={"BackgroundColor"}
          onChange={(color) => setBackgroundColor(color)}
          value={backgroundColor}
        />
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
        <input
          type="text"
          className="input input-primary" 
          max={32}
          value={artistName}
          onChange={(e) => {
              if(e.target.value.length < 32) {
                setArtistName(e.target.value)
              }
            }
          }
        />
        <button
          className="btn btn-primary"
          onClick={async () => {
            //generate(image, "normal");
            if(!image) {
              console.error("Image is not loaded")
              return;
            }
            const dataUrl = await fromTilesDataToImage(image, imageColorMode);
            console.log(dataUrl)
            if(!dataUrl) {
              console.error("Cannot generate image");
              return;
            }
            setDataUrl(dataUrl);
          }}>
          Generate
        </button>
      </Card>
      <img src={dataUrl} className="hidden" />
      <Card 
        label="3d"
      >
        {dataUrl !== "" && <ThreeJsRenderer
              widthMozaic={width}
              heightMozaic={height}
              base64Texture={dataUrl}
              tilesData={tilesData}
              tileSize={tileSize}
              padding={padding}
              backgroundColor={backgroundColor}
              artistName={artistName}
            />
          }
      </Card>
      <Card
        label="2D"
      >
        <MozaicCanvas
          backgroundColor={backgroundColor}
          tileSize={tileSize}
          padding={padding}
          tilesData={tilesData}
          width={width}
          height={height}
        />
      </Card>
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
    </div>
  )
}

export default App
