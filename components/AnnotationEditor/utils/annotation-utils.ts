import { Annotation } from "../../types";

export type AnnotationDraft = Record<
  string,
  {
    labelId: string;
    x: number;
    y: number;
    width: number;
    height: number;
    id: string;
  }
>;

export const convertAnnotationsToAnnotationsDraft = (
  annotations: Annotation[]
): AnnotationDraft => {
  return annotations.reduce((acc, annotation) => {
    acc[annotation.id] = annotation;
    return acc;
  }, {} as AnnotationDraft);
};

export const convertAnnotationsDraftToAnnotations = (
  annotationsMap: AnnotationDraft
): Annotation[] => {
  return Object.values(annotationsMap) as Annotation[];
};

export const convertFromTransformToBox = (
  dimensions: {
    x: number;
    y: number;
    width: number;
    height: number;
  },
  matrix: number[]
) => {
  const translateX = matrix[12];
  const translateY = matrix[13];
  const scaleX = matrix[0];
  const scaleY = matrix[5];

  const width = dimensions.width * scaleX;
  const height = dimensions.height * scaleY;
  const x = dimensions.x + translateX;
  const y = dimensions.y + translateY;

  return {
    x,
    y,
    width,
    height,
  };
};
