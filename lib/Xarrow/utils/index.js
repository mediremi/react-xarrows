export var getElementByPropGiven = function (ref) {
    var myRef;
    if (typeof ref === 'string') {
        // myRef = document.getElementById(ref);
        myRef = document.getElementById(ref);
    }
    else
        myRef = ref === null || ref === void 0 ? void 0 : ref.current;
    return myRef;
};
// receives string representing a d path and factoring only the numbers
export var factorDpathStr = function (d, factor) {
    var l = d.split(/(\d+(?:\.\d+)?)/);
    l = l.map(function (s) {
        if (Number(s))
            return (Number(s) * factor).toString();
        else
            return s;
    });
    return l.join('');
};
// return relative,abs
export var xStr2absRelative = function (str) {
    if (typeof str !== 'string')
        return { abs: 0, relative: 0.5 };
    var sp = str.split('%');
    var absLen = 0, percentLen = 0;
    if (sp.length == 1) {
        var p = parseFloat(sp[0]);
        if (!isNaN(p)) {
            absLen = p;
            return { abs: absLen, relative: 0 };
        }
    }
    else if (sp.length == 2) {
        var _a = [parseFloat(sp[0]), parseFloat(sp[1])], p1 = _a[0], p2 = _a[1];
        if (!isNaN(p1))
            percentLen = p1 / 100;
        if (!isNaN(p2))
            absLen = p2;
        if (!isNaN(p1) || !isNaN(p2))
            return { abs: absLen, relative: percentLen };
    }
};
var dist = function (p1, p2) {
    //length of line
    return Math.sqrt(Math.pow((p1.x - p2.x), 2) + Math.pow((p1.y - p2.y), 2));
};
export var getShortestLine = function (sPoints, ePoints) {
    // closes tPair Of Points which feet to the specified anchors
    var minDist = Infinity, d = Infinity;
    var closestPair;
    sPoints.forEach(function (sp) {
        ePoints.forEach(function (ep) {
            d = dist(sp, ep);
            if (d < minDist) {
                minDist = d;
                closestPair = { chosenStart: sp, chosenEnd: ep };
            }
        });
    });
    return closestPair;
};
export var getElemPos = function (elem) {
    if (!elem)
        return { x: 0, y: 0, right: 0, bottom: 0 };
    var pos = elem.getBoundingClientRect();
    return {
        x: pos.left,
        y: pos.top,
        right: pos.right,
        bottom: pos.bottom,
    };
};
export var getSvgPos = function (svgRef) {
    if (!svgRef.current)
        return { x: 0, y: 0 };
    var _a = svgRef.current.getBoundingClientRect(), xarrowElemX = _a.left, xarrowElemY = _a.top;
    var xarrowStyle = getComputedStyle(svgRef.current);
    var xarrowStyleLeft = Number(xarrowStyle.left.slice(0, -2));
    var xarrowStyleTop = Number(xarrowStyle.top.slice(0, -2));
    return {
        x: xarrowElemX - xarrowStyleLeft,
        y: xarrowElemY - xarrowStyleTop,
    };
};
