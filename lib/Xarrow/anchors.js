var getAnchorsDefaultOffsets = function (width, height) {
    return {
        middle: { x: width * 0.5, y: height * 0.5 },
        left: { x: 0, y: height * 0.5 },
        right: { x: width, y: height * 0.5 },
        top: { x: width * 0.5, y: 0 },
        bottom: { x: width * 0.5, y: height },
    };
};
export var calcAnchors = function (anchors, anchorPos) {
    // now prepare this list of anchors to object expected by the `getShortestLine` function
    return anchors.map(function (anchor) {
        var defsOffsets = getAnchorsDefaultOffsets(anchorPos.right - anchorPos.x, anchorPos.bottom - anchorPos.y);
        var _a = defsOffsets[anchor.position], x = _a.x, y = _a.y;
        return {
            x: anchorPos.x + x + anchor.offset.x,
            y: anchorPos.y + y + anchor.offset.y,
            anchor: anchor,
        };
    });
};
