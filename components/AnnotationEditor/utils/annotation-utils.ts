import { Annotation } from "../../types";

type AnnotationDraft = Record<
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
