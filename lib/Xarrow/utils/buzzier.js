// Buzier curve calculations
/**
 * returns buzzier curve function with 2 controls points
 * bzCurve with 2 control points function(4 points total):  bz = (1−t)^3*p1 + 3(1−t)^2*t*p2 +3(1−t)*t^2*p3 + t^3*p4
 */
export var bzFunction = function (p1, p2, p3, p4) { return function (t) {
    return Math.pow((1 - t), 3) * p1 + 3 * Math.pow((1 - t), 2) * t * p2 + 3 * (1 - t) * Math.pow(t, 2) * p3 + Math.pow(t, 3) * p4;
}; };
/**
 * returns 2 solutions from extram points for buzzier curve with 2 controls points
 */
export var buzzierMinSols = function (p1, p2, p3, p4) {
    var bz = bzFunction(p1, p2, p3, p4);
    // dt(bz) = -3 p1 (1 - t)^2 + 3 p2 (1 - t)^2 - 6 p2 (1 - t) t + 6 p3 (1 - t) t - 3 p3 t^2 + 3 p4 t^2
    // when p1=(x1,y1),p2=(cpx1,cpy1),p3=(cpx2,cpy2),p4=(x2,y2)
    // then extrema points is when dt(bz) = 0
    // solutions =>  t = ((-6 p1 + 12 p2 - 6 p3) ± sqrt((6 p1 - 12 p2 + 6 p3)^2 - 4 (3 p2 - 3 p1) (-3 p1 + 9 p2 - 9 p3 + 3 p4)))/(2 (-3 p1 + 9 p2 - 9 p3 + 3 p4))  when (p1 + 3 p3!=3 p2 + p4)
    // if we mark A=(-6 p1 + 12 p2 - 6 p3) and B=(6 p1 - 12 p2 + 6 p3)^2 - 4 (3 p2 - 3 p1) (-3 p1 + 9 p2 - 9 p3 + 3 p4)) and C =(2 (-3 p1 + 9 p2 - 9 p3 + 3 p4) then
    // tSol = A ± sqrt(B)
    // then solution we want is: bz(tSol)
    var A = -6 * p1 + 12 * p2 - 6 * p3;
    var B = Math.pow((-6 * p1 + 12 * p2 - 6 * p3), 2) - 4 * (3 * p2 - 3 * p1) * (-3 * p1 + 9 * p2 - 9 * p3 + 3 * p4);
    var C = 2 * (-3 * p1 + 9 * p2 - 9 * p3 + 3 * p4);
    var sol1 = bz((A + Math.sqrt(B)) / C);
    var sol2 = bz((A - Math.sqrt(B)) / C);
    return [sol1, sol2];
};
