import { useState, useEffect } from 'react';
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
  const [originalImage, setOriginalImage] = useState<HTMLImageElement>();
  const [image, setImage] = useState<HTMLImageElement>();
  const [twoDimension, setTwoDimension] =  useState<boolean>(false);
  const [imageColorMode, setImageColorMode] = useState<string>("normal");
  const [width, setWidth] =  useState<number>(1024);
  const [height, setHeight] =  useState<number>(1024);
  const [artistName, setArtistName]= useState<string>("Made by Guillaume G");
  const [dataUrl, setDataUrl] = useState<string>("");
  const [isDirty, setIsDirty] = useState<boolean>(false);
  const {
    tilesData,
    generateImage,
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
    setIsDirty(true);
  }

  useEffect(() => {
    if(originalImage) {
      uploadImage(originalImage);
    }
  }, [tileSize]);

  async function generate() {
    if(!image) {
      console.error("Image is not loaded")
      return;
    }
    const dataUrl = await generateImage(image, imageColorMode);
    if(!dataUrl) {
      console.error("Cannot generate image");
      return;
    }
    setDataUrl(dataUrl);
    setIsDirty(false);
  }

  return (
    <div className="container m-auto flex-col gap-5 lg:p-2 p-4">
      <h1>Mosaic-ize</h1>
      <div className="h-full grid grid-flow-col grid grid-cols-3 gap-4">

        <Card
          label={"Settings"}
        >
          <ColorPicker
            label={"BackgroundColor"}
            onChange={(color) => {
              setBackgroundColor(color);
              setIsDirty(true);
            }}
            value={backgroundColor}
          />
          <Range
            min={16}
            max={128}
            step={8}
            label={"Mozaic Tile"}
            value={tileSize}
            onChange={(value) => {
              setTileSize(value);
              setIsDirty(true);
            }}
          />
          <Range
            min={0}
            max={tileSize - 20}
            step={2}
            label={"Padding"}
            value={padding}
            onChange={(value) => {
              setPadding(value)
              setIsDirty(true);
            }}
          />
          <InputFileWithPreview onChange={uploadImage} value={image} />
          <Select
            label="Mode of generation"
            value={imageColorMode}
            onChange={(imageColorMode) => {
              setImageColorMode(imageColorMode)
              setIsDirty(true);
            }}
            options={[
              {label: "Normal", value: "normal"},
              {label: "Random", value: "random"},
            ]}
          />
          <div className="form-control">
            <label>Artist name</label>
            <input
              type="text"
              className="input input-primary w-full" 
              max={32}
              value={artistName}
              onChange={(e) => {
                  if(e.target.value.length < 32) {
                    setArtistName(e.target.value)
                  }
                }
              }
            />
          </div>
          <button
            className="btn btn-primary"
            onClick={generate}
            disabled={!isDirty}
          >
            Generate
          </button>
        </Card>
        <div className="col-span-3 col-start-2">
          <img src={dataUrl} className="hidden" />
          <Card 
            label={
              <div role="tablist"
                className="tabs tabs-box"
              >
                <a 
                  role="tab"
                  className={`tab ${!twoDimension ? "tab-active" : ""}`}
                  onClick={() => setTwoDimension(false)}
                >
                  3D
                </a>
                <a 
                  role="tab"
                  className={`tab ${twoDimension ? "tab-active" : ""}`}
                  onClick={() => setTwoDimension(true)}
                >
                  2D
                </a>
              </div>
            }
          >
            
            {!twoDimension &&  dataUrl !== "" &&
                <ThreeJsRenderer
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
              {
                twoDimension && 
                <MozaicCanvas
                  backgroundColor={backgroundColor}
                  tileSize={tileSize}
                  padding={padding}
                  tilesData={tilesData}
                  width={width}
                  height={height}
                />
              }
          </Card>
        </div>


      </div>
    </div>
  )
}

export default App
