import { calcAnchors } from '../anchors';
import { getShortestLine, getSvgPos } from './index';
import pick from 'lodash/pick';
import { cPaths } from '../../constants';
import { buzzierMinSols, bzFunction } from './buzzier';
/**
 * The Main logic of path calculation for the arrow.
 * calculate new path, adjusting canvas, and set state based on given properties.
 * */
export var getPosition = function (xProps, mainRef) {
    var _a, _b;
    var _c, _d;
    var propsRefs = xProps[0], valVars = xProps[1];
    var startAnchor = propsRefs.startAnchor, endAnchor = propsRefs.endAnchor, strokeWidth = propsRefs.strokeWidth, showHead = propsRefs.showHead, headSize = propsRefs.headSize, showTail = propsRefs.showTail, tailSize = propsRefs.tailSize, path = propsRefs.path, curveness = propsRefs.curveness, gridBreak = propsRefs.gridBreak, headShape = propsRefs.headShape, tailShape = propsRefs.tailShape, _extendSVGcanvas = propsRefs._extendSVGcanvas, _cpx1Offset = propsRefs._cpx1Offset, _cpy1Offset = propsRefs._cpy1Offset, _cpx2Offset = propsRefs._cpx2Offset, _cpy2Offset = propsRefs._cpy2Offset;
    var startPos = valVars.startPos, endPos = valVars.endPos;
    var _e = mainRef.current, svgRef = _e.svgRef, lineRef = _e.lineRef;
    var headOrient = 0;
    var tailOrient = 0;
    // convert startAnchor and endAnchor to list of objects represents allowed anchors.
    var startPoints = calcAnchors(startAnchor, startPos);
    var endPoints = calcAnchors(endAnchor, endPos);
    // choose the smallest path for 2 points from these possibilities.
    var _f = getShortestLine(startPoints, endPoints), chosenStart = _f.chosenStart, chosenEnd = _f.chosenEnd;
    var startAnchorPosition = chosenStart.anchor.position, endAnchorPosition = chosenEnd.anchor.position;
    var startPoint = pick(chosenStart, ['x', 'y']), endPoint = pick(chosenEnd, ['x', 'y']);
    var mainDivPos = getSvgPos(svgRef);
    var cx0 = Math.min(startPoint.x, endPoint.x) - mainDivPos.x;
    var cy0 = Math.min(startPoint.y, endPoint.y) - mainDivPos.y;
    var dx = endPoint.x - startPoint.x;
    var dy = endPoint.y - startPoint.y;
    var absDx = Math.abs(endPoint.x - startPoint.x);
    var absDy = Math.abs(endPoint.y - startPoint.y);
    var xSign = dx > 0 ? 1 : -1;
    var ySign = dy > 0 ? 1 : -1;
    var _g = [headShape.offsetForward, tailShape.offsetForward], headOffset = _g[0], tailOffset = _g[1];
    var fHeadSize = headSize * strokeWidth; //factored head size
    var fTailSize = tailSize * strokeWidth; //factored head size
    // const { current: _headBox } = headBox;
    var xHeadOffset = 0;
    var yHeadOffset = 0;
    var xTailOffset = 0;
    var yTailOffset = 0;
    var _headOffset = fHeadSize * headOffset;
    var _tailOffset = fTailSize * tailOffset;
    var cu = Number(curveness);
    // gridRadius = Number(gridRadius);
    if (!cPaths.includes(path))
        path = 'smooth';
    if (path === 'straight') {
        cu = 0;
        path = 'smooth';
    }
    var biggerSide = headSize > tailSize ? headSize : tailSize;
    var _calc = strokeWidth + (strokeWidth * biggerSide) / 2;
    var excRight = _calc;
    var excLeft = _calc;
    var excUp = _calc;
    var excDown = _calc;
    excLeft += Number(_extendSVGcanvas);
    excRight += Number(_extendSVGcanvas);
    excUp += Number(_extendSVGcanvas);
    excDown += Number(_extendSVGcanvas);
    ////////////////////////////////////
    // arrow point to point calculations
    var x1 = 0, x2 = absDx, y1 = 0, y2 = absDy;
    if (dx < 0)
        _a = [x2, x1], x1 = _a[0], x2 = _a[1];
    if (dy < 0)
        _b = [y2, y1], y1 = _b[0], y2 = _b[1];
    ////////////////////////////////////
    // arrow curviness and arrowhead placement calculations
    if (cu === 0) {
        // in case of straight path
        var headAngel = Math.atan(absDy / absDx);
        if (showHead) {
            x2 -= fHeadSize * (1 - headOffset) * xSign * Math.cos(headAngel);
            y2 -= fHeadSize * (1 - headOffset) * ySign * Math.sin(headAngel);
            headAngel *= ySign;
            if (xSign < 0)
                headAngel = (Math.PI - headAngel * xSign) * xSign;
            xHeadOffset = Math.cos(headAngel) * _headOffset - (Math.sin(headAngel) * fHeadSize) / 2;
            yHeadOffset = (Math.cos(headAngel) * fHeadSize) / 2 + Math.sin(headAngel) * _headOffset;
            headOrient = (headAngel * 180) / Math.PI;
        }
        var tailAngel = Math.atan(absDy / absDx);
        if (showTail) {
            x1 += fTailSize * (1 - tailOffset) * xSign * Math.cos(tailAngel);
            y1 += fTailSize * (1 - tailOffset) * ySign * Math.sin(tailAngel);
            tailAngel *= -ySign;
            if (xSign > 0)
                tailAngel = (Math.PI - tailAngel * xSign) * xSign;
            xTailOffset = Math.cos(tailAngel) * _tailOffset - (Math.sin(tailAngel) * fTailSize) / 2;
            yTailOffset = (Math.cos(tailAngel) * fTailSize) / 2 + Math.sin(tailAngel) * _tailOffset;
            tailOrient = (tailAngel * 180) / Math.PI;
        }
    }
    else {
        // in case of smooth path
        if (endAnchorPosition === 'middle') {
            // in case a middle anchor is chosen for endAnchor choose from which side to attach to the middle of the element
            if (absDx > absDy) {
                endAnchorPosition = xSign ? 'left' : 'right';
            }
            else {
                endAnchorPosition = ySign ? 'top' : 'bottom';
            }
        }
        if (showHead) {
            if (['left', 'right'].includes(endAnchorPosition)) {
                xHeadOffset += _headOffset * xSign;
                x2 -= fHeadSize * (1 - headOffset) * xSign; //same!
                yHeadOffset += (fHeadSize * xSign) / 2;
                if (endAnchorPosition === 'left') {
                    headOrient = 0;
                    if (xSign < 0)
                        headOrient += 180;
                }
                else {
                    headOrient = 180;
                    if (xSign > 0)
                        headOrient += 180;
                }
            }
            else if (['top', 'bottom'].includes(endAnchorPosition)) {
                xHeadOffset += (fHeadSize * -ySign) / 2;
                yHeadOffset += _headOffset * ySign;
                y2 -= fHeadSize * ySign - yHeadOffset;
                if (endAnchorPosition === 'top') {
                    headOrient = 270;
                    if (ySign > 0)
                        headOrient += 180;
                }
                else {
                    headOrient = 90;
                    if (ySign < 0)
                        headOrient += 180;
                }
            }
        }
    }
    if (showTail && cu !== 0) {
        if (['left', 'right'].includes(startAnchorPosition)) {
            xTailOffset += _tailOffset * -xSign;
            x1 += fTailSize * xSign + xTailOffset;
            yTailOffset += -(fTailSize * xSign) / 2;
            if (startAnchorPosition === 'left') {
                tailOrient = 180;
                if (xSign < 0)
                    tailOrient += 180;
            }
            else {
                tailOrient = 0;
                if (xSign > 0)
                    tailOrient += 180;
            }
        }
        else if (['top', 'bottom'].includes(startAnchorPosition)) {
            yTailOffset += _tailOffset * -ySign;
            y1 += fTailSize * ySign + yTailOffset;
            xTailOffset += (fTailSize * ySign) / 2;
            if (startAnchorPosition === 'top') {
                tailOrient = 90;
                if (ySign > 0)
                    tailOrient += 180;
            }
            else {
                tailOrient = 270;
                if (ySign < 0)
                    tailOrient += 180;
            }
        }
    }
    var arrowHeadOffset = { x: xHeadOffset, y: yHeadOffset };
    var arrowTailOffset = { x: xTailOffset, y: yTailOffset };
    var cpx1 = x1, cpy1 = y1, cpx2 = x2, cpy2 = y2;
    var curvesPossibilities = {};
    if (path === 'smooth')
        curvesPossibilities = {
            hh: function () {
                //horizontal - from right to left or the opposite
                cpx1 += absDx * cu * xSign;
                cpx2 -= absDx * cu * xSign;
            },
            vv: function () {
                //vertical - from top to bottom or opposite
                cpy1 += absDy * cu * ySign;
                cpy2 -= absDy * cu * ySign;
            },
            hv: function () {
                // start horizontally then vertically
                // from v side to h side
                cpx1 += absDx * cu * xSign;
                cpy2 -= absDy * cu * ySign;
            },
            vh: function () {
                // start vertically then horizontally
                // from h side to v side
                cpy1 += absDy * cu * ySign;
                cpx2 -= absDx * cu * xSign;
            },
        };
    else if (path === 'grid') {
        curvesPossibilities = {
            hh: function () {
                cpx1 += (absDx * gridBreak.relative + gridBreak.abs) * xSign;
                cpx2 -= (absDx * (1 - gridBreak.relative) - gridBreak.abs) * xSign;
                if (showHead) {
                    cpx1 -= ((fHeadSize * (1 - headOffset)) / 2) * xSign;
                    cpx2 += ((fHeadSize * (1 - headOffset)) / 2) * xSign;
                }
                if (showTail) {
                    cpx1 -= ((fTailSize * (1 - tailOffset)) / 2) * xSign;
                    cpx2 += ((fTailSize * (1 - tailOffset)) / 2) * xSign;
                }
            },
            vv: function () {
                cpy1 += (absDy * gridBreak.relative + gridBreak.abs) * ySign;
                cpy2 -= (absDy * (1 - gridBreak.relative) - gridBreak.abs) * ySign;
                if (showHead) {
                    cpy1 -= ((fHeadSize * (1 - headOffset)) / 2) * ySign;
                    cpy2 += ((fHeadSize * (1 - headOffset)) / 2) * ySign;
                }
                if (showTail) {
                    cpy1 -= ((fTailSize * (1 - tailOffset)) / 2) * ySign;
                    cpy2 += ((fTailSize * (1 - tailOffset)) / 2) * ySign;
                }
            },
            hv: function () {
                cpx1 = x2;
            },
            vh: function () {
                cpy1 = y2;
            },
        };
    }
    // smart select best curve for the current anchors
    var selectedCurviness = '';
    if (['left', 'right'].includes(startAnchorPosition))
        selectedCurviness += 'h';
    else if (['bottom', 'top'].includes(startAnchorPosition))
        selectedCurviness += 'v';
    else if (startAnchorPosition === 'middle')
        selectedCurviness += 'm';
    if (['left', 'right'].includes(endAnchorPosition))
        selectedCurviness += 'h';
    else if (['bottom', 'top'].includes(endAnchorPosition))
        selectedCurviness += 'v';
    else if (endAnchorPosition === 'middle')
        selectedCurviness += 'm';
    if (absDx > absDy)
        selectedCurviness = selectedCurviness.replace(/m/g, 'h');
    else
        selectedCurviness = selectedCurviness.replace(/m/g, 'v');
    curvesPossibilities[selectedCurviness]();
    cpx1 += _cpx1Offset;
    cpy1 += _cpy1Offset;
    cpx2 += _cpx2Offset;
    cpy2 += _cpy2Offset;
    ////////////////////////////////////
    // canvas smart size adjustments
    var _h = buzzierMinSols(x1, cpx1, cpx2, x2), xSol1 = _h[0], xSol2 = _h[1];
    var _j = buzzierMinSols(y1, cpy1, cpy2, y2), ySol1 = _j[0], ySol2 = _j[1];
    if (xSol1 < 0)
        excLeft += -xSol1;
    if (xSol2 > absDx)
        excRight += xSol2 - absDx;
    if (ySol1 < 0)
        excUp += -ySol1;
    if (ySol2 > absDy)
        excDown += ySol2 - absDy;
    if (path === 'grid') {
        excLeft += _calc;
        excRight += _calc;
        excUp += _calc;
        excDown += _calc;
    }
    x1 += excLeft;
    x2 += excLeft;
    y1 += excUp;
    y2 += excUp;
    cpx1 += excLeft;
    cpx2 += excLeft;
    cpy1 += excUp;
    cpy2 += excUp;
    var cw = absDx + excLeft + excRight, ch = absDy + excUp + excDown;
    cx0 -= excLeft;
    cy0 -= excUp;
    //labels
    var bzx = bzFunction(x1, cpx1, cpx2, x2);
    var bzy = bzFunction(y1, cpy1, cpy2, y2);
    var labelStartPos = { x: bzx(0.01), y: bzy(0.01) };
    var labelMiddlePos = { x: bzx(0.5), y: bzy(0.5) };
    var labelEndPos = { x: bzx(0.99), y: bzy(0.99) };
    var arrowPath;
    if (path === 'grid') {
        // todo: support gridRadius
        //  arrowPath = `M ${x1} ${y1} L  ${cpx1 - 10} ${cpy1} a10,10 0 0 1 10,10
        // L ${cpx2} ${cpy2 - 10} a10,10 0 0 0 10,10 L  ${x2} ${y2}`;
        arrowPath = "M ".concat(x1, " ").concat(y1, " L  ").concat(cpx1, " ").concat(cpy1, " L ").concat(cpx2, " ").concat(cpy2, " ").concat(x2, " ").concat(y2);
    }
    else if (path === 'smooth')
        arrowPath = "M ".concat(x1, " ").concat(y1, " C ").concat(cpx1, " ").concat(cpy1, ", ").concat(cpx2, " ").concat(cpy2, ", ").concat(x2, " ").concat(y2);
    return {
        cx0: cx0,
        cy0: cy0,
        x1: x1,
        x2: x2,
        y1: y1,
        y2: y2,
        cw: cw,
        ch: ch,
        cpx1: cpx1,
        cpy1: cpy1,
        cpx2: cpx2,
        cpy2: cpy2,
        dx: dx,
        dy: dy,
        absDx: absDx,
        absDy: absDy,
        headOrient: headOrient,
        tailOrient: tailOrient,
        labelStartPos: labelStartPos,
        labelMiddlePos: labelMiddlePos,
        labelEndPos: labelEndPos,
        excLeft: excLeft,
        excRight: excRight,
        excUp: excUp,
        excDown: excDown,
        headOffset: _headOffset,
        arrowHeadOffset: arrowHeadOffset,
        arrowTailOffset: arrowTailOffset,
        startPoints: startPoints,
        endPoints: endPoints,
        mainDivPos: mainDivPos,
        xSign: xSign,
        ySign: ySign,
        lineLength: (_d = (_c = lineRef.current) === null || _c === void 0 ? void 0 : _c.getTotalLength()) !== null && _d !== void 0 ? _d : 0,
        fHeadSize: fHeadSize,
        fTailSize: fTailSize,
        arrowPath: arrowPath,
    };
};
