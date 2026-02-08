
export enum AspectRatio {
  SQUARE = '1:1',
  LANDSCAPE = '16:9',
  PORTRAIT = '9:16',
  STANDARD = '4:3',
  TALL = '3:4'
}

export enum ImageStyle {
  NONE = 'No Style',
  REALISTIC = 'Realistic',
  CINEMATIC = 'Cinematic',
  PIXAR = '3D Pixar',
  ANIME = 'Anime',
  CYBERPUNK = 'Cyberpunk',
  FANTASY = 'Fantasy',
  SKETCH = 'Sketch',
  PHOTOREALISTIC = 'Photorealistic'
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
  params: {
    aspectRatio: AspectRatio;
    style: ImageStyle;
  };
}

export interface GenerationParams {
  prompt: string;
  aspectRatio: AspectRatio;
  style: ImageStyle;
  batchSize: number;
}
