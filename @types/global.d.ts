export type BaseTheme = {
  background: string | Variable<any>,
  backgroundHover: string | Variable<any>,
  backgroundPress: string | Variable<any>,
  backgroundFocus: string | Variable<any>,
  borderColor: string | Variable<any>,
  borderColorHover: string | Variable<any>,
  color: string | Variable<any>,
  colorHover: string | Variable<any>,
  colorPress: string | Variable<any>,
  colorFocus: string | Variable<any>,
  shadowColor: string | Variable<any>,
  shadowColorHover: string | Variable<any>,
}

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