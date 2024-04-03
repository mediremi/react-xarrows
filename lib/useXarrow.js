import { useContext, useLayoutEffect, useState } from 'react';
import { XelemContext } from './Xwrapper';
var noop = function () { };
var useXarrow = function () {
    var _a = useState({}), setRender = _a[1];
    var reRender = function () { return setRender({}); };
    var updateXarrow = useContext(XelemContext);
    if (!updateXarrow)
        updateXarrow = noop;
    // throw new Error(
    //   "'Xwrapper' is required around element using 'useXarrow' hook! wrap your xarrows and connected elements with Xwrapper! "
    // );
    useLayoutEffect(function () {
        updateXarrow();
    });
    return reRender;
};
export default useXarrow;
