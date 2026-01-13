import ColorThief from 'colorthief';
import convert from "color-convert";

const PALETTE_BASE_COLOR = 20;
type pixel = [number, number, number];
type colorType = [number, number, number];

interface PaletteColor {
  red: number;
  green: number;
  blue: number;
}

export interface ExtendedPalette {
  original: PaletteColor[];
  saturated: PaletteColor[];
  hue: PaletteColor[];
}

function saturate([hue, saturation, lightness]: colorType, x: number) : colorType {
  return [hue, Math.min(100, saturation + x), lightness];
}

function rotateHue([hue, saturation, lightness]: colorType, rotation: number) : colorType {
  const modulo = (x: number, n: number) : number => (x % n + n) % n;
  const newHue = modulo(hue + rotation, 360);
  return [newHue, saturation, lightness];
}


export function generateColorPalette(image: HTMLImageElement, paletteSize: number  = PALETTE_BASE_COLOR) : pixel[] {
  let colorThief = new ColorThief();
  return colorThief.getPalette(image, paletteSize);
}

export function extendPalette(palette: pixel[], saturationLevel: number = 20, hueLevel: number = 20 ) : ExtendedPalette {
  const moreSaturatedPalette = palette.map(([red, green, blue]) => {
    const [hue, saturation, lightness] = convert.rgb.hsl(red, green, blue);
    const [_, moreSaturated, __] = saturate([hue, saturation, lightness], saturationLevel);
    return convert.hsl.rgb([hue, moreSaturated, lightness]);
  });

  function moreHuePaletteGenerator() {
    return palette.map(([red, green, blue]) => {
      const random = Math.random() * (hueLevel - -hueLevel) + -hueLevel;
      
      const [hue, saturation, lightness] = convert.rgb.hsl(red, green, blue);
      const [newHue, _, __] = rotateHue([hue, saturation, lightness], random);
      return convert.hsl.rgb([newHue, saturation, lightness]);
    });
  }
  return {
    original: fromPaletteToPaletteColor(palette.slice(0)),
    saturated: fromPaletteToPaletteColor(moreSaturatedPalette),
    hue: fromPaletteToPaletteColor(moreHuePaletteGenerator())
  };
}

export function fromPaletteToPaletteColor(palette: pixel[]) : PaletteColor[] {
  return palette.map(value => ({red: value[0], green: value[1], blue: value[2] }) );
}
