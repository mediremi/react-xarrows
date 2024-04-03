import React, { useEffect, useRef, useState } from 'react';
export var XelemContext = React.createContext(null);
export var XarrowContext = React.createContext(null);
var updateRef = {};
var updateRefCount = 0;
var log = console.log;
var XarrowProvider = function (_a) {
    var children = _a.children, instanceCount = _a.instanceCount;
    var _b = useState({}), setRender = _b[1];
    var updateXarrow = function () { return setRender({}); };
    useEffect(function () {
        instanceCount.current = updateRefCount; // so this instance would know what is id
        updateRef[instanceCount.current] = updateXarrow;
    }, []);
    // log('XarrowProvider', updateRefCount);
    return React.createElement(XarrowContext.Provider, { value: updateXarrow }, children);
};
var XelemProvider = function (_a) {
    var children = _a.children, instanceCount = _a.instanceCount;
    return React.createElement(XelemContext.Provider, { value: updateRef[instanceCount.current] }, children);
};
var Xwrapper = function (_a) {
    var children = _a.children;
    var instanceCount = useRef(updateRefCount);
    var _b = useState({}), setRender = _b[1];
    useEffect(function () {
        updateRefCount++;
        setRender({});
        return function () {
            delete updateRef[instanceCount.current];
        };
    }, []);
    return (React.createElement(XelemProvider, { instanceCount: instanceCount },
        React.createElement(XarrowProvider, { instanceCount: instanceCount }, children)));
};
export default Xwrapper;
