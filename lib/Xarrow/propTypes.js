import PT from 'prop-types';
import { arrowShapes, cAnchorEdge, cPaths } from '../constants';
var pAnchorPositionType = PT.oneOf(cAnchorEdge);
var pAnchorCustomPositionType = PT.exact({
    position: pAnchorPositionType.isRequired,
    offset: PT.exact({
        x: PT.number,
        y: PT.number,
    }).isRequired,
});
var _pAnchorType = PT.oneOfType([pAnchorPositionType, pAnchorCustomPositionType]);
var pAnchorType = PT.oneOfType([_pAnchorType, PT.arrayOf(_pAnchorType)]);
var pRefType = PT.oneOfType([PT.string, PT.exact({ current: PT.any })]);
var _pLabelType = PT.oneOfType([PT.element, PT.string]);
var pLabelsType = PT.exact({
    start: _pLabelType,
    middle: _pLabelType,
    end: _pLabelType,
});
var pSvgEdgeShapeType = PT.oneOf(Object.keys(arrowShapes));
// const pSvgElemType = PT.oneOf(cSvgElems);
var pSvgElemType = PT.any;
var pSvgEdgeType = PT.oneOfType([
    pSvgEdgeShapeType,
    PT.exact({
        svgElem: pSvgElemType,
        offsetForward: PT.number,
    }).isRequired,
]);
var XarrowPropTypes = {
    start: pRefType.isRequired,
    end: pRefType.isRequired,
    startAnchor: pAnchorType,
    endAnchor: pAnchorType,
    labels: PT.oneOfType([_pLabelType, pLabelsType]),
    color: PT.string,
    lineColor: PT.string,
    showHead: PT.bool,
    headColor: PT.string,
    headSize: PT.number,
    tailSize: PT.number,
    tailColor: PT.string,
    strokeWidth: PT.number,
    showTail: PT.bool,
    path: PT.oneOf(cPaths),
    showXarrow: PT.bool,
    curveness: PT.number,
    gridBreak: PT.string,
    dashness: PT.oneOfType([PT.bool, PT.object]),
    headShape: pSvgEdgeType,
    tailShape: pSvgEdgeType,
    animateDrawing: PT.oneOfType([PT.bool, PT.number]),
    zIndex: PT.number,
    passProps: PT.object,
    arrowBodyProps: PT.object,
    arrowHeadProps: PT.object,
    arrowTailProps: PT.object,
    SVGcanvasProps: PT.object,
    divContainerProps: PT.object,
    _extendSVGcanvas: PT.number,
    _debug: PT.bool,
    _cpx1Offset: PT.number,
    _cpy1Offset: PT.number,
    _cpx2Offset: PT.number,
    _cpy2Offset: PT.number,
};
export default XarrowPropTypes;
