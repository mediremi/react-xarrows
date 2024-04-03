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
import React, { useLayoutEffect, useRef, useState } from 'react';
import { getElementByPropGiven, getElemPos, xStr2absRelative } from './utils';
import isEqual from 'lodash/isEqual';
import { arrowShapes, cAnchorEdge, cArrowShapes } from '../constants';
var parseLabels = function (label) {
    var parsedLabel = { start: null, middle: null, end: null };
    if (label) {
        if (typeof label === 'string' || React.isValidElement(label))
            parsedLabel.middle = label;
        else {
            for (var key in label) {
                parsedLabel[key] = label[key];
            }
        }
    }
    return parsedLabel;
};
var parseAnchor = function (anchor) {
    // convert to array
    var anchorChoice = Array.isArray(anchor) ? anchor : [anchor];
    //convert to array of objects
    var anchorChoice2 = anchorChoice.map(function (anchorChoice) {
        if (typeof anchorChoice === 'string') {
            return { position: anchorChoice };
        }
        else
            return anchorChoice;
    });
    //remove any invalid anchor names
    anchorChoice2 = anchorChoice2.filter(function (an) { return cAnchorEdge.includes(an.position); });
    if (anchorChoice2.length == 0)
        anchorChoice2 = [{ position: 'auto' }];
    //replace any 'auto' with ['left','right','bottom','top']
    var autosAncs = anchorChoice2.filter(function (an) { return an.position === 'auto'; });
    if (autosAncs.length > 0) {
        anchorChoice2 = anchorChoice2.filter(function (an) { return an.position !== 'auto'; });
        anchorChoice2.push.apply(anchorChoice2, autosAncs.flatMap(function (anchorObj) {
            return ['left', 'right', 'top', 'bottom'].map(function (anchorName) {
                return __assign(__assign({}, anchorObj), { position: anchorName });
            });
        }));
    }
    // default values
    var anchorChoice3 = anchorChoice2.map(function (anchorChoice) {
        if (typeof anchorChoice === 'object') {
            var anchorChoiceCustom = anchorChoice;
            if (!anchorChoiceCustom.position)
                anchorChoiceCustom.position = 'auto';
            if (!anchorChoiceCustom.offset)
                anchorChoiceCustom.offset = { x: 0, y: 0 };
            if (!anchorChoiceCustom.offset.y)
                anchorChoiceCustom.offset.y = 0;
            if (!anchorChoiceCustom.offset.x)
                anchorChoiceCustom.offset.x = 0;
            anchorChoiceCustom = anchorChoiceCustom;
            return anchorChoiceCustom;
        }
        else
            return anchorChoice;
    });
    return anchorChoice3;
};
var parseDashness = function (dashness, props) {
    var dashStroke = 0, dashNone = 0, animDashSpeed, animDirection = 1;
    if (typeof dashness === 'object') {
        dashStroke = dashness.strokeLen || props.strokeWidth * 2;
        dashNone = dashness.strokeLen ? dashness.nonStrokeLen : props.strokeWidth;
        animDashSpeed = dashness.animation ? dashness.animation : null;
    }
    else if (typeof dashness === 'boolean' && dashness) {
        dashStroke = props.strokeWidth * 2;
        dashNone = props.strokeWidth;
        animDashSpeed = null;
    }
    return { strokeLen: dashStroke, nonStrokeLen: dashNone, animation: animDashSpeed, animDirection: animDirection };
};
var parseEdgeShape = function (svgEdge) {
    if (typeof svgEdge == 'string') {
        if (svgEdge in arrowShapes)
            svgEdge = arrowShapes[svgEdge];
        else {
            console.warn("'".concat(svgEdge, "' is not supported arrow shape. the supported arrow shapes is one of ").concat(cArrowShapes, ".\n           reverting to default shape."));
            svgEdge = arrowShapes['arrow1'];
        }
    }
    svgEdge = svgEdge;
    if ((svgEdge === null || svgEdge === void 0 ? void 0 : svgEdge.offsetForward) === undefined)
        svgEdge.offsetForward = 0.25;
    if ((svgEdge === null || svgEdge === void 0 ? void 0 : svgEdge.svgElem) === undefined)
        svgEdge.svgElem = 'path';
    // if (svgEdge?.svgProps === undefined) svgEdge.svgProps = arrowShapes.arrow1.svgProps;
    return svgEdge;
};
var parseGridBreak = function (gridBreak) {
    var resGridBreak = xStr2absRelative(gridBreak);
    if (!resGridBreak)
        resGridBreak = { relative: 0.5, abs: 0 };
    return resGridBreak;
};
/**
 * should be wrapped with any changed prop that is affecting the points path positioning
 * @param propVal
 * @param updateRef
 */
var withUpdate = function (propVal, updateRef) {
    if (updateRef)
        updateRef.current = true;
    return propVal;
};
var noParse = function (userProp) { return userProp; };
var noParseWithUpdatePos = function (userProp, _, updatePos) { return withUpdate(userProp, updatePos); };
var parseNumWithUpdatePos = function (userProp, _, updatePos) { return withUpdate(Number(userProp), updatePos); };
var parseNum = function (userProp) { return Number(userProp); };
var parsePropsFuncs = {
    start: function (userProp) { return getElementByPropGiven(userProp); },
    end: function (userProp) { return getElementByPropGiven(userProp); },
    startAnchor: function (userProp, _, updatePos) { return withUpdate(parseAnchor(userProp), updatePos); },
    endAnchor: function (userProp, _, updatePos) { return withUpdate(parseAnchor(userProp), updatePos); },
    labels: function (userProp) { return parseLabels(userProp); },
    color: noParse,
    lineColor: function (userProp, propsRefs) { return userProp || propsRefs.color; },
    headColor: function (userProp, propsRefs) { return userProp || propsRefs.color; },
    tailColor: function (userProp, propsRefs) { return userProp || propsRefs.color; },
    strokeWidth: parseNumWithUpdatePos,
    showHead: noParseWithUpdatePos,
    headSize: parseNumWithUpdatePos,
    showTail: noParseWithUpdatePos,
    tailSize: parseNumWithUpdatePos,
    path: noParseWithUpdatePos,
    curveness: parseNumWithUpdatePos,
    gridBreak: function (userProp, _, updatePos) { return withUpdate(parseGridBreak(userProp), updatePos); },
    // // gridRadius = strokeWidth * 2, //todo
    dashness: function (userProp, propsRefs) { return parseDashness(userProp, propsRefs); },
    headShape: function (userProp) { return parseEdgeShape(userProp); },
    tailShape: function (userProp) { return parseEdgeShape(userProp); },
    showXarrow: noParse,
    animateDrawing: noParse,
    zIndex: parseNum,
    passProps: noParse,
    arrowBodyProps: noParseWithUpdatePos,
    arrowHeadProps: noParseWithUpdatePos,
    arrowTailProps: noParseWithUpdatePos,
    SVGcanvasProps: noParseWithUpdatePos,
    divContainerProps: noParseWithUpdatePos,
    divContainerStyle: noParseWithUpdatePos,
    SVGcanvasStyle: noParseWithUpdatePos,
    _extendSVGcanvas: noParseWithUpdatePos,
    _debug: noParseWithUpdatePos,
    _cpx1Offset: noParseWithUpdatePos,
    _cpy1Offset: noParseWithUpdatePos,
    _cpx2Offset: noParseWithUpdatePos,
    _cpy2Offset: noParseWithUpdatePos,
};
//build dependencies
var propsDeps = {};
//each prop depends on himself
for (var propName in parsePropsFuncs) {
    propsDeps[propName] = [propName];
}
// 'lineColor', 'headColor', 'tailColor' props also depends on 'color' prop
for (var _i = 0, _a = ['lineColor', 'headColor', 'tailColor']; _i < _a.length; _i++) {
    var propName = _a[_i];
    propsDeps[propName].push('color');
}
var parseGivenProps = function (props, propsRef) {
    var _a;
    for (var _i = 0, _b = Object.entries(props); _i < _b.length; _i++) {
        var _c = _b[_i], name_1 = _c[0], val = _c[1];
        propsRef[name_1] = (_a = parsePropsFuncs === null || parsePropsFuncs === void 0 ? void 0 : parsePropsFuncs[name_1]) === null || _a === void 0 ? void 0 : _a.call(parsePropsFuncs, val, propsRef);
    }
    return propsRef;
};
var defaultProps = {
    start: null,
    end: null,
    startAnchor: 'auto',
    endAnchor: 'auto',
    labels: null,
    color: 'CornflowerBlue',
    lineColor: null,
    headColor: null,
    tailColor: null,
    strokeWidth: 4,
    showHead: true,
    headSize: 6,
    showTail: false,
    tailSize: 6,
    path: 'smooth',
    curveness: 0.8,
    gridBreak: '50%',
    // gridRadius : strokeWidth * 2, //todo
    dashness: false,
    headShape: 'arrow1',
    tailShape: 'arrow1',
    showXarrow: true,
    animateDrawing: false,
    zIndex: 0,
    passProps: {},
    arrowBodyProps: {},
    arrowHeadProps: {},
    arrowTailProps: {},
    SVGcanvasProps: {},
    divContainerProps: {},
    divContainerStyle: {},
    SVGcanvasStyle: {},
    _extendSVGcanvas: 0,
    _debug: false,
    _cpx1Offset: 0,
    _cpy1Offset: 0,
    _cpx2Offset: 0,
    _cpy2Offset: 0,
};
var initialParsedProps = {};
initialParsedProps = parseGivenProps(defaultProps, initialParsedProps);
var initialValVars = {
    startPos: { x: 0, y: 0, right: 0, bottom: 0 },
    endPos: { x: 0, y: 0, right: 0, bottom: 0 },
};
// const parseAllProps = () => parseGivenProps(defaultProps, initialParsedProps);
function deepCompareEquals(a, b) {
    return isEqual(a, b);
}
function useDeepCompareMemoize(value) {
    var ref = useRef();
    // it can be done by using useMemo as well
    // but useRef is rather cleaner and easier
    if (!deepCompareEquals(value, ref.current)) {
        ref.current = value;
    }
    return ref.current;
}
function useDeepCompareEffect(callback, dependencies) {
    useLayoutEffect(callback, dependencies.map(useDeepCompareMemoize));
}
/**
 * smart hook that provides parsed props to Xarrow and will trigger rerender whenever given prop is changed.
 */
var useXarrowProps = function (userProps, refs) {
    var _a = useState(initialParsedProps), propsRefs = _a[0], setPropsRefs = _a[1];
    var shouldUpdatePosition = useRef(false);
    // const _propsRefs = useRef(initialParsedProps);
    // const propsRefs = _propsRefs.current;
    propsRefs['shouldUpdatePosition'] = shouldUpdatePosition;
    var curProps = __assign(__assign({}, defaultProps), userProps);
    var _loop_1 = function (propName) {
        useLayoutEffect(function () {
            var _a;
            propsRefs[propName] = (_a = parsePropsFuncs === null || parsePropsFuncs === void 0 ? void 0 : parsePropsFuncs[propName]) === null || _a === void 0 ? void 0 : _a.call(parsePropsFuncs, curProps[propName], propsRefs, shouldUpdatePosition);
            // console.log('prop update:', propName, 'with value', propsRefs[propName]);
            setPropsRefs(__assign({}, propsRefs));
        }, propsDeps[propName].map(function (name) { return userProps[name]; }));
    };
    // react states the number of hooks per render must stay constant,
    // this is ok we are using these hooks in a loop, because the number of props in defaultProps is constant,
    // so the number of hook we will fire each render will always be the same.
    // update the value of the ref that represents the corresponding prop
    // for example: if given 'start' prop would change call getElementByPropGiven(props.start) and save value into propsRefs.start.current
    // why to save refs to props parsed values? some of the props require relatively expensive computations(like 'start' and 'startAnchor').
    // this will always run in the same order and THAT'S WAY ITS LEGAL
    for (var propName in defaultProps) {
        _loop_1(propName);
    }
    // rerender whenever position of start element or end element changes
    var _b = useState(initialValVars), valVars = _b[0], setValVars = _b[1];
    var startPos = getElemPos(propsRefs.start);
    useDeepCompareEffect(function () {
        valVars.startPos = startPos;
        shouldUpdatePosition.current = true;
        setValVars(__assign({}, valVars));
        // console.log('start update pos', startPos);
    }, [startPos]);
    var endPos = getElemPos(propsRefs.end);
    useDeepCompareEffect(function () {
        valVars.endPos = endPos;
        shouldUpdatePosition.current = true;
        setValVars(__assign({}, valVars));
        // console.log('end update pos', endPos);
    }, [endPos]);
    useLayoutEffect(function () {
        // console.log('svg shape changed!');
        shouldUpdatePosition.current = true;
        setValVars(__assign({}, valVars));
    }, [propsRefs.headShape.svgElem, propsRefs.tailShape.svgElem]);
    return [propsRefs, valVars];
};
export default useXarrowProps;
