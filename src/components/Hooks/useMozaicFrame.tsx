

function useMozaicFrame() {
	const [frameSize, setFrameSize] = useState<number>(5);
  // const [frameType, setFrameType] = useState<FrameType>("default");

  function draw(imageWidth: number, imageHeight: number, tileSize: number) {
    const width = imageWidth + (frameSize * tileSize);
    const height = imageHeight + (frameSize * tileSize);

    const canvas = new OffscreenCanvas(width, height);
    const context = canvas.getContext("2d");
    if(!context) {
      throw new Error("Cannot find the context");
    }
  }

  function drawFrame(context: OffscreenCanvasRenderingContext2D, tileSize: number) {
    const { canvas: { width, height } } = context;
    
    context.fillStyle = "white";
    context.fillRect(0, 0, width, height);

    context.strokeStyle = "black";
    context.lineWidth = tileSize;
    context.strokeRect(0, 0, width, height);

    context.strokeRect(
      frameSize * tileSize,
      frameSize * tileSize,
      width - (frameSize * tileSize),
      height - (frameSize * tileSize)
    );
  }

	

}

export default useMozaicFrame;