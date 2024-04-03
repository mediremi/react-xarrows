import PT from 'prop-types';
declare const XarrowPropTypes: {
    start: PT.Validator<NonNullable<NonNullable<string | Required<PT.InferProps<{
        current: PT.Requireable<any>;
    }>>>>>;
    end: PT.Validator<NonNullable<NonNullable<string | Required<PT.InferProps<{
        current: PT.Requireable<any>;
    }>>>>>;
    startAnchor: PT.Requireable<NonNullable<NonNullable<"middle" | "left" | "right" | "top" | "bottom" | "auto" | Required<PT.InferProps<{
        position: PT.Validator<NonNullable<"middle" | "left" | "right" | "top" | "bottom" | "auto">>;
        offset: PT.Validator<Required<PT.InferProps<{
            x: PT.Requireable<number>;
            y: PT.Requireable<number>;
        }>>>;
    }>>> | NonNullable<"middle" | "left" | "right" | "top" | "bottom" | "auto" | Required<PT.InferProps<{
        position: PT.Validator<NonNullable<"middle" | "left" | "right" | "top" | "bottom" | "auto">>;
        offset: PT.Validator<Required<PT.InferProps<{
            x: PT.Requireable<number>;
            y: PT.Requireable<number>;
        }>>>;
    }>>>[]>>;
    endAnchor: PT.Requireable<NonNullable<NonNullable<"middle" | "left" | "right" | "top" | "bottom" | "auto" | Required<PT.InferProps<{
        position: PT.Validator<NonNullable<"middle" | "left" | "right" | "top" | "bottom" | "auto">>;
        offset: PT.Validator<Required<PT.InferProps<{
            x: PT.Requireable<number>;
            y: PT.Requireable<number>;
        }>>>;
    }>>> | NonNullable<"middle" | "left" | "right" | "top" | "bottom" | "auto" | Required<PT.InferProps<{
        position: PT.Validator<NonNullable<"middle" | "left" | "right" | "top" | "bottom" | "auto">>;
        offset: PT.Validator<Required<PT.InferProps<{
            x: PT.Requireable<number>;
            y: PT.Requireable<number>;
        }>>>;
    }>>>[]>>;
    labels: PT.Requireable<NonNullable<NonNullable<string | PT.ReactElementLike> | Required<PT.InferProps<{
        start: PT.Requireable<NonNullable<string | PT.ReactElementLike>>;
        middle: PT.Requireable<NonNullable<string | PT.ReactElementLike>>;
        end: PT.Requireable<NonNullable<string | PT.ReactElementLike>>;
    }>>>>;
    color: PT.Requireable<string>;
    lineColor: PT.Requireable<string>;
    showHead: PT.Requireable<boolean>;
    headColor: PT.Requireable<string>;
    headSize: PT.Requireable<number>;
    tailSize: PT.Requireable<number>;
    tailColor: PT.Requireable<string>;
    strokeWidth: PT.Requireable<number>;
    showTail: PT.Requireable<boolean>;
    path: PT.Requireable<"smooth" | "grid" | "straight">;
    showXarrow: PT.Requireable<boolean>;
    curveness: PT.Requireable<number>;
    gridBreak: PT.Requireable<string>;
    dashness: PT.Requireable<NonNullable<boolean | object>>;
    headShape: PT.Requireable<NonNullable<"circle" | "arrow1" | "heart" | Required<PT.InferProps<{
        svgElem: PT.Requireable<any>;
        offsetForward: PT.Requireable<number>;
    }>>>>;
    tailShape: PT.Requireable<NonNullable<"circle" | "arrow1" | "heart" | Required<PT.InferProps<{
        svgElem: PT.Requireable<any>;
        offsetForward: PT.Requireable<number>;
    }>>>>;
    animateDrawing: PT.Requireable<NonNullable<number | boolean>>;
    zIndex: PT.Requireable<number>;
    passProps: PT.Requireable<object>;
    arrowBodyProps: PT.Requireable<object>;
    arrowHeadProps: PT.Requireable<object>;
    arrowTailProps: PT.Requireable<object>;
    SVGcanvasProps: PT.Requireable<object>;
    divContainerProps: PT.Requireable<object>;
    _extendSVGcanvas: PT.Requireable<number>;
    _debug: PT.Requireable<boolean>;
    _cpx1Offset: PT.Requireable<number>;
    _cpy1Offset: PT.Requireable<number>;
    _cpx2Offset: PT.Requireable<number>;
    _cpy2Offset: PT.Requireable<number>;
};
export default XarrowPropTypes;
//# sourceMappingURL=propTypes.d.ts.map