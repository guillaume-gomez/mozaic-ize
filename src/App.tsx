import { useState, useRef, useEffect } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import imageTest from "/lifesaver_opaque.jpg";
import InputFileWithPreview from "./components/InputFileWithPreview";
import './App.css';

function App() {
  const [count, setCount] = useState(0);
  const [image, setImage] = useState<HTMLImageElement>();
  const imageRef = useRef<HTMLImageElement>();
  const canvasRef = useRef<HTMLCanvasDocument>();


  useEffect(() => {
    if(canvasRef.current && imageRef.current) {
      const context = canvasRef.current.getContext('2d');
      // create backing canvas
      canvasRef.current.width = imageRef.current.width;
      canvasRef.current.height = imageRef.current.height;
      // restore main canvas
      context.drawImage(imageRef.current, 0,0);
    }
  }, [canvasRef, imageRef]);

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
      <InputFileWithPreview onChange={uploadImage} value={image} />
      <canvas ref={canvasRef} width={500} height={500}/>
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
