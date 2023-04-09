import React, { forwardRef, useImperativeHandle } from "react";
import {
  DiffRect,
  Group,
  SkMatrix,
  Skia,
  SkiaMutableValue,
  rect,
  rrect,
  useValue,
  useValueEffect,
} from "@shopify/react-native-skia";

type AnnotationRectProps = {
  color?: string;
  baseMatrix: SkiaMutableValue<SkMatrix>;
};

export const AnnotationRect = forwardRef(
  ({ color = "red", baseMatrix }: AnnotationRectProps, ref) => {
    const x = 0;
    const y = 0;
    const height = 70;
    const width = 50;
    const borderWidth = 1;

    const transformationMatrix = useValue(Skia.Matrix());
    const annotationRectMatrix = useValue(Skia.Matrix());

    useValueEffect(baseMatrix, () => {
      Skia.Matrix().identity();
      Skia.multiply3(annotationRectMatrix.current, baseMatrix.current, transformationMatrix.current);
    });

    useImperativeHandle(
      ref,
      () => {
        return {
          getMatrix() {
            return annotationRectMatrix;
          }
        };
      },
      []
    );

    const outer = rrect(rect(x, y, width, height), 0, 0);
    const inner = rrect(
      rect(
        x + borderWidth,
        y + borderWidth,
        x + width - 2 * borderWidth,
        x + height - 2 * borderWidth
      ),
      0,
      0
    );

    return (
      // * INFO: the origin has to be specified for the transform to work
      <Group
        origin={{ x: 0, y: 0 }}
        transform={[{ translateX: 50 }, { translateY: 50 }]}
        matrix={baseMatrix}
      >
        <DiffRect inner={inner} outer={outer} color={color} />
      </Group>
    );
  }
);
