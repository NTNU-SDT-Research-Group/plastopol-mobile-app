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

export enum AnnotationModeType {
  PREVIEW = 'PREVIEW',
  EDIT_MASTER = 'EDIT_MASTER',
  EDIT_ADD_ANNOTATION = 'EDIT_ADD_ANNOTATION',
  EDIT_MODIFY_ANNOTATION = 'EDIT_MODIFY_ANNOTATION',
}