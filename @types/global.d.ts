export type Annotation = {
  id: string;
}

export type Image = {
  id: string;
  height: number;
  width: number;
  path: string;
  modificationTime: number;
}

export type ImageWithAnnotation = Image & {
  annotations: Annotation | null;
};