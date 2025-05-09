import { useState, useEffect, useRef } from 'react';
import InputFileWithPreview from "./components/InputFileWithPreview";
import MozaicCanvas from "./components/MozaicCanvas";
import ColorPicker from "./components/ColorPicker";
import Range from "./components/Range";
import Select from "./components/Select";
import ThreeJsRenderer from "./components/ThreeJs/ThreeJsRenderer";
import { resizeImage } from "./utils";
import useMozaic from "./components/Hooks/useMozaic";
import Toggle from "./components/Toggle";
import { useSpring, animated, useSpringRef, easings } from '@react-spring/web'

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
  const goToFinalResultDivRef = useRef<HTMLDivElement>(null)
  // to conditionnaly hide some items
  const [firstRender, setFirstRender] = useState<boolean>(true);
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

  const apiDiv = useSpringRef()
  const propsDiv = useSpring({
    ref: apiDiv,
    config: {
      easing: easings.easeInOutCubic,
      duration: 250,
    },
    from: { height: 100 },
    to: { height: 525 },
    // chaining the second animation
    onRest: () => { apiForm.start() }
  })

  const apiForm = useSpringRef()
  const propsForm = useSpring({
    ref: apiForm,
    config: {
      easing: easings.easeInOutBack,
      duration: 500
    },
    delay: 100,
    from: { opacity: 0.2, transformOrigin: "top left", scaleX: 0 },
    to: { opacity: 1.0, scaleX: 1 },
  })

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
    setFirstRender(false);
    
    // scrollIntoView does not work on async function
    setTimeout(() => {
      if(goToFinalResultDivRef.current) {
        goToFinalResultDivRef.current.scrollIntoView({behavior: "smooth", block: 'center' });
      }
    }, 750);

    apiDiv.start();
  }

  // pour le bouton, le faire passer de - sa position initiale à sa position finale

  return (
    <div className="bg-base-300">
      <div className="relative container m-auto flex-col h-screen gap-5 lg:p-2 p-4">
        <img src={dataUrl} className="hidden" />
        <div className="h-full flex md:flex-row flex-col gap-4 flex-grow">
          <div className="lg:basis-4/12 md:basis-5/12 basis-auto content-center">

              <div className="flex flex-col gap-8 p-4">
                <div className="">
                  <h2 className="md:text-6xl text-3xl font-extrabold">
                    <p>
                      Change
                     <span className="px-2 line-through decoration-accent">photo</span>
                    </p>
                    walls into
                    <span className="px-2 underline decoration-primary">art</span>
                  </h2>
                </div>
                <animated.div style={propsDiv} className="flex flex-col gap-3">
                  <div>
                    <label>Upload an image for start</label>
                    <InputFileWithPreview onChange={uploadImage} value={image} />
                  </div>
                  {!firstRender &&
                  <animated.div style={propsForm}>
                    <div className="form-control">
                      <label>Sign you artwork (max 32 caracters)</label>
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
                    <Range
                      min={16}
                      max={128}
                      step={8}
                      label={"Change the mozaic tile size"}
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
                      label={"Add or Reduce padding between the tiles"}
                      value={padding}
                      onChange={(value) => {
                        setPadding(value)
                        setIsDirty(true);
                      }}
                    />
                    <ColorPicker
                      label={"BackgroundColor"}
                      onChange={(color) => {
                        setBackgroundColor(color);
                        setIsDirty(true);
                      }}
                      value={backgroundColor}
                    />
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
                    <Toggle
                      label="See the plain mozaic image (2d version)"
                      value={twoDimension}
                      toggle={() => setTwoDimension(!twoDimension)}
                    />
                  </animated.div>
                  }
                  { image && 
                    <div className="form-control flex flex-col gap-1">
                      <label className="text-success">{ firstRender ? "Great! Then press generate to make some magic" : "Play around with the settings now !"}</label>
                      <button
                        className="btn btn-primary font-extrabold uppercase rounded-xl btn-lg"
                        onClick={generate}
                        disabled={!isDirty}
                      >
                        Generate
                      </button>
                    </div>
                  }
                </animated.div>
              </div>

          </div>
          <div ref={goToFinalResultDivRef} className="lg:basis-8/12 md:basis-7/12 basis-auto bg-gradient-to-b from-sky-100 to-sky-500 rounded-xl">
             {  !twoDimension &&
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
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
