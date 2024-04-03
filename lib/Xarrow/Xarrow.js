var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
import React, { useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';
import useXarrowProps from './useXarrowProps';
import { XarrowContext } from '../Xwrapper';
import XarrowPropTypes from './propTypes';
import { getPosition } from './utils/GetPosition';
var log = console.log;
var Xarrow = function (props) {
    // log('xarrow update');
    var _a;
    var mainRef = useRef({
        svgRef: useRef(null),
        lineRef: useRef(null),
        headRef: useRef(null),
        tailRef: useRef(null),
        lineDrawAnimRef: useRef(null),
        lineDashAnimRef: useRef(null),
        headOpacityAnimRef: useRef(null),
    });
    var _b = mainRef.current, svgRef = _b.svgRef, lineRef = _b.lineRef, headRef = _b.headRef, tailRef = _b.tailRef, lineDrawAnimRef = _b.lineDrawAnimRef, lineDashAnimRef = _b.lineDashAnimRef, headOpacityAnimRef = _b.headOpacityAnimRef;
    useContext(XarrowContext);
    var xProps = useXarrowProps(props, mainRef.current);
    var propsRefs = xProps[0];
    var labels = propsRefs.labels, lineColor = propsRefs.lineColor, headColor = propsRefs.headColor, tailColor = propsRefs.tailColor, strokeWidth = propsRefs.strokeWidth, showHead = propsRefs.showHead, showTail = propsRefs.showTail, dashness = propsRefs.dashness, headShape = propsRefs.headShape, tailShape = propsRefs.tailShape, showXarrow = propsRefs.showXarrow, animateDrawing = propsRefs.animateDrawing, zIndex = propsRefs.zIndex, passProps = propsRefs.passProps, arrowBodyProps = propsRefs.arrowBodyProps, arrowHeadProps = propsRefs.arrowHeadProps, arrowTailProps = propsRefs.arrowTailProps, SVGcanvasProps = propsRefs.SVGcanvasProps, divContainerProps = propsRefs.divContainerProps, divContainerStyle = propsRefs.divContainerStyle, SVGcanvasStyle = propsRefs.SVGcanvasStyle, _debug = propsRefs._debug, shouldUpdatePosition = propsRefs.shouldUpdatePosition;
    animateDrawing = props.animateDrawing;
    var _c = useState(!animateDrawing), drawAnimEnded = _c[0], setDrawAnimEnded = _c[1];
    var _d = useState({}), setRender = _d[1];
    var forceRerender = function () { return setRender({}); };
    var _e = useState({
        //initial state
        cx0: 0, //x start position of the canvas
        cy0: 0, //y start position of the canvas
        cw: 0, // the canvas width
        ch: 0, // the canvas height
        x1: 0, //the x starting point of the line inside the canvas
        y1: 0, //the y starting point of the line inside the canvas
        x2: 0, //the x ending point of the line inside the canvas
        y2: 0, //the y ending point of the line inside the canvas
        dx: 0, // the x difference between 'start' anchor to 'end' anchor
        dy: 0, // the y difference between 'start' anchor to 'end' anchor
        absDx: 0, // the x length(positive) difference
        absDy: 0, // the y length(positive) difference
        cpx1: 0, // control points - control the curviness of the line
        cpy1: 0,
        cpx2: 0,
        cpy2: 0,
        headOrient: 0, // determines to what side the arrowhead will point
        tailOrient: 0, // determines to what side the arrow tail will point
        arrowHeadOffset: { x: 0, y: 0 },
        arrowTailOffset: { x: 0, y: 0 },
        headOffset: 0,
        excRight: 0, //expand canvas to the right
        excLeft: 0, //expand canvas to the left
        excUp: 0, //expand canvas upwards
        excDown: 0, // expand canvas downward
        startPoints: [],
        endPoints: [],
        mainDivPos: { x: 0, y: 0 },
        xSign: 1,
        ySign: 1,
        lineLength: 0,
        fHeadSize: 1,
        fTailSize: 1,
        arrowPath: "",
        labelStartPos: { x: 0, y: 0 },
        labelMiddlePos: { x: 0, y: 0 },
        labelEndPos: { x: 0, y: 0 },
    }), st = _e[0], setSt = _e[1];
    /**
     * The Main logic of path calculation for the arrow.
     * calculate new path, adjusting canvas, and set state based on given properties.
     * */
    useLayoutEffect(function () {
        if (shouldUpdatePosition.current) {
            // log('xarrow getPosition');
            var pos = getPosition(xProps, mainRef);
            // log('pos', pos);
            setSt(pos);
            shouldUpdatePosition.current = false;
        }
    });
    // log('st', st);
    var xOffsetHead = st.x2 - st.arrowHeadOffset.x;
    var yOffsetHead = st.y2 - st.arrowHeadOffset.y;
    var xOffsetTail = st.x1 - st.arrowTailOffset.x;
    var yOffsetTail = st.y1 - st.arrowTailOffset.y;
    var dashoffset = dashness.strokeLen + dashness.nonStrokeLen;
    var animDirection = 1;
    if (dashness.animation < 0) {
        dashness.animation *= -1;
        animDirection = -1;
    }
    var dashArray, animation, animRepeatCount, animStartValue, animEndValue = 0;
    if (animateDrawing && drawAnimEnded == false) {
        if (typeof animateDrawing === 'boolean')
            animateDrawing = 1;
        animation = animateDrawing + 's';
        dashArray = st.lineLength;
        animStartValue = st.lineLength;
        animRepeatCount = 1;
        if (animateDrawing < 0) {
            _a = [animEndValue, animStartValue], animStartValue = _a[0], animEndValue = _a[1];
            animation = animateDrawing * -1 + 's';
        }
    }
    else {
        dashArray = "".concat(dashness.strokeLen, " ").concat(dashness.nonStrokeLen);
        animation = "".concat(1 / dashness.animation, "s");
        animStartValue = dashoffset * animDirection;
        animRepeatCount = 'indefinite';
        animEndValue = 0;
    }
    // handle draw animation
    useLayoutEffect(function () {
        if (lineRef.current)
            setSt(function (prevSt) { var _a, _b; return (__assign(__assign({}, prevSt), { lineLength: (_b = (_a = lineRef.current) === null || _a === void 0 ? void 0 : _a.getTotalLength()) !== null && _b !== void 0 ? _b : 0 })); });
    }, [lineRef.current]);
    // set all props on first render
    useEffect(function () {
        var monitorDOMchanges = function () {
            window.addEventListener('resize', forceRerender);
            var handleDrawAmimEnd = function () {
                var _a, _b;
                setDrawAnimEnded(true);
                // @ts-ignore
                (_a = headOpacityAnimRef.current) === null || _a === void 0 ? void 0 : _a.beginElement();
                // @ts-ignore
                (_b = lineDashAnimRef.current) === null || _b === void 0 ? void 0 : _b.beginElement();
            };
            var handleDrawAmimBegin = function () {
                if (headRef.current) {
                    headRef.current.style.opacity = '0';
                }
            };
            if (lineDrawAnimRef.current && headRef.current) {
                lineDrawAnimRef.current.addEventListener('endEvent', handleDrawAmimEnd);
                lineDrawAnimRef.current.addEventListener('beginEvent', handleDrawAmimBegin);
            }
            return function () {
                window.removeEventListener('resize', forceRerender);
                if (lineDrawAnimRef.current) {
                    lineDrawAnimRef.current.removeEventListener('endEvent', handleDrawAmimEnd);
                    if (headRef.current)
                        lineDrawAnimRef.current.removeEventListener('beginEvent', handleDrawAmimBegin);
                }
            };
        };
        var cleanMonitorDOMchanges = monitorDOMchanges();
        return function () {
            setDrawAnimEnded(false);
            cleanMonitorDOMchanges();
        };
    }, [showXarrow]);
    //todo: could make some advanced generic typescript inferring. for example get type from headShape.elem:T and
    // tailShape.elem:K force the type for passProps,arrowHeadProps,arrowTailProps property. for now `as any` is used to
    // avoid typescript conflicts
    // so todo- fix all the `passProps as any` assertions
    return (React.createElement("div", __assign({}, divContainerProps, { style: __assign({ position: 'absolute', zIndex: zIndex }, divContainerStyle) }), showXarrow ? (React.createElement(React.Fragment, null,
        React.createElement("svg", __assign({ ref: svgRef, width: st.cw, height: st.ch, style: __assign({ position: 'absolute', left: st.cx0, top: st.cy0, pointerEvents: 'none', border: _debug ? '1px dashed yellow' : null }, SVGcanvasStyle), overflow: "auto" }, SVGcanvasProps),
            React.createElement("path", __assign({ ref: lineRef, d: st.arrowPath, stroke: lineColor, strokeDasharray: dashArray, 
                // strokeDasharray={'0 0'}
                strokeWidth: strokeWidth, fill: "transparent", pointerEvents: "visibleStroke" }, passProps, arrowBodyProps),
                React.createElement(React.Fragment, null, drawAnimEnded || !animateDrawing ? (React.createElement(React.Fragment, null, dashness.animation ? (React.createElement("animate", { ref: lineDashAnimRef, attributeName: "stroke-dashoffset", values: "".concat(dashoffset * animDirection, ";0"), dur: "".concat(1 / dashness.animation, "s"), repeatCount: "indefinite" })) : null)) : (React.createElement(React.Fragment, null, animateDrawing ? (React.createElement("animate", { ref: lineDrawAnimRef, id: "svgEndAnimate", attributeName: "stroke-dashoffset", values: "".concat(animStartValue, ";").concat(animEndValue), dur: animation, repeatCount: animRepeatCount })) : null)))),
            showTail ? (React.createElement("g", __assign({ fill: tailColor, pointerEvents: "auto", transform: "translate(".concat(xOffsetTail, ",").concat(yOffsetTail, ") rotate(").concat(st.tailOrient, ") scale(").concat(st.fTailSize, ")") }, passProps, arrowTailProps), tailShape.svgElem)) : null,
            showHead ? (React.createElement("g", __assign({ ref: headRef, 
                // d={normalArrowShape}
                fill: headColor, pointerEvents: "auto", transform: "translate(".concat(xOffsetHead, ",").concat(yOffsetHead, ") rotate(").concat(st.headOrient, ") scale(").concat(st.fHeadSize, ")"), opacity: animateDrawing && !drawAnimEnded ? 0 : 1 }, passProps, arrowHeadProps),
                React.createElement("animate", { ref: headOpacityAnimRef, dur: '0.4', attributeName: "opacity", from: "0", to: "1", begin: "indefinite", repeatCount: "1", fill: "freeze" }),
                headShape.svgElem)) : null,
            _debug ? (React.createElement(React.Fragment, null,
                React.createElement("circle", { r: "5", cx: st.cpx1, cy: st.cpy1, fill: "green" }),
                React.createElement("circle", { r: "5", cx: st.cpx2, cy: st.cpy2, fill: "blue" }),
                React.createElement("rect", { x: st.excLeft, y: st.excUp, width: st.absDx, height: st.absDy, fill: "none", stroke: "pink", strokeWidth: "2px" }))) : null),
        labels.start ? (React.createElement("div", { style: {
                transform: st.dx < 0 ? 'translate(-100% , -50%)' : 'translate(-0% , -50%)',
                width: 'max-content',
                position: 'absolute',
                left: st.cx0 + st.labelStartPos.x,
                top: st.cy0 + st.labelStartPos.y - strokeWidth - 5,
            } }, labels.start)) : null,
        labels.middle ? (React.createElement("div", { style: {
                display: 'table',
                width: 'max-content',
                transform: 'translate(-50% , -50%)',
                position: 'absolute',
                left: st.cx0 + st.labelMiddlePos.x,
                top: st.cy0 + st.labelMiddlePos.y,
            } }, labels.middle)) : null,
        labels.end ? (React.createElement("div", { style: {
                transform: st.dx > 0 ? 'translate(-100% , -50%)' : 'translate(-0% , -50%)',
                width: 'max-content',
                position: 'absolute',
                left: st.cx0 + st.labelEndPos.x,
                top: st.cy0 + st.labelEndPos.y + strokeWidth + 5,
            } }, labels.end)) : null,
        _debug ? (React.createElement(React.Fragment, null, __spreadArray(__spreadArray([], st.startPoints, true), st.endPoints, true).map(function (p, i) {
            return (React.createElement("div", { key: i, style: {
                    background: 'gray',
                    opacity: 0.5,
                    borderRadius: '50%',
                    transform: 'translate(-50%, -50%)',
                    height: 5,
                    width: 5,
                    position: 'absolute',
                    left: p.x - st.mainDivPos.x,
                    top: p.y - st.mainDivPos.y,
                } }));
        }))) : null)) : null));
};
//////////////////////////////
// propTypes
Xarrow.propTypes = XarrowPropTypes;
export default Xarrow;
