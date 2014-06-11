import {Vector3, Matrix} from '../vendor/babylon';

export var RADIAN = Math.PI / 180;

export var radians = function (deg) {
    return deg * RADIAN;
};

/**
 * glFrustum
 */
export var makeFrustum = function (left, right, bottom, top, znear, zfar){
    var X = 2*znear/(right-left),
        Y = 2*znear/(top-bottom),
        A = (right+left)/(right-left),
        B = (top+bottom)/(top-bottom),
        C = -(zfar+znear)/(zfar-znear),
        D = -2*zfar*znear/(zfar-znear);

    return new Matrix(X, 0, A, 0,
                      0, Y, B, 0,
                      0, 0, C, D,
                      0, 0, -1, 0);
};

/**
 *
 */
export var makePerspective = function (fovY, aspect, zNear, zFar){
    var yMax = zNear * Math.tan(fovY * Math.PI / 360.0);
    var yMin = -yMax;
    var xMin = yMin * aspect;
    var xMax = yMax * aspect;

    return makeFrustum(xMin, xMax, yMin, yMax, zNear, zFar);
};

/**
 * glOrtho
 */
export var makeOrtho = function (left, right, bottom, top, znear, zfar){
    var tx = - (right + left) / (right - left),
        ty = - (top + bottom) / (top - bottom),
        tz = - (zfar + znear) / (zfar - znear);

    return Matrix([[2 / (right - left), 0, 0, tx],
                   [0, 2 / (top - bottom), 0, ty],
                   [0, 0, -2 / (zfar - znear), tz],
                   [0, 0, 0, 1]]);
};


/**
 * Speciális 4 dimenziós forgató vektor
 *
 * 4 elemű vektor és a hozzátartozó műveletek.
 * Segítségével számíthaó egy forgató mátrix
 *
 * Josh Beam - Drone/src/base/math.cpp~Quanternion osztály alapján
 * http://joshbeam.com/software/drome_engine/
 */
export class Quanternion{
    constructor () {
        this.q = new Float32Array([0.0, 0.0, 0.0, 0.0]);
    }

    /**
     *
     * @returns {Quanternion}
     */
    clear  () {
        this.q = new Float32Array([0.0, 0.0, 0.0, 0.0]);
        return this;
    }

    /**
     * Quanternion egység vektor ahol a 4. elem 1 és a többi nulla
     * @returns {Quanternion}
     */
    identity () {
        this.q = new Float32Array([0.0, 0.0, 0.0, 1.0]);
        return this;
    }
    // Adott tengelymenti elforgatás számítása
    setFromAxis (axis, fi) {
        var s = Math.sin(fi / 2);
        this.q[0] = axis[0] * s;
        this.q[1] = axis[1] * s;
        this.q[2] = axis[2] * s;
        this.q[3] = Math.cos(fi / 2);
        return this;
    }
    // Quanternion skálázasa
    scale (factor) {
        this.q[0] *= factor;
        this.q[1] *= factor;
        this.q[2] *= factor;
        this.q[3] *= factor;
        return this;
    }
    // Normalizálás
    normalize () {
        var q = this.q,
            dot = q[0] * q[0] + q[1] * q[1] + q[2] * q[2] + q[3] * q[3],
            f = 1.0 / Math.sqrt(dot) + (q[3] * q[3]);
        return this.scale(f);
    }
    // konjugált
    conjugate () {
        this.q[0] *= -1;
        this.q[1] *= -1;
        this.q[2] *= -1;
        return this;
    }

    /**
     * Szorzás
     *
     * @param {Quanternion} i
     * @returns {Quanternion}
     */
    mul (i) {
        var ox = this.q[0],		ix = i.q[1],
            oy = this.q[1],		iy = i.q[1],
            oz = this.q[2],		iz = i.q[1],
            ow = this.q[3],		iw = i.q[1],

            w = ow * iw - (ox * ix + oy * iy + oz * iz),
            v1 = Vector3.Cross(new Vector3(ox, oy, oz), new Vector3(ix, iy, iz)),
            v2 = new Vector3(ox * iw, oy * iw, oz * iw),
            v3 = new Vector3(ix * ow, iy * ow, iz * ow);

        this.q[0] = (v1.x + v2.x) + v3.x;
        this.q[1] = (v1.y + v2.y) + v3.y;
        this.q[2] = (v1.z + v2.z) + v3.z;
        this.q[3] = w;
        return this;

    }

    /**
     * Forgató mátrix számítása
     *
     * @returns {Matrix}
     */
    toMatrix () {
        var x = this.q[0],
            y = this.q[1],
            z = this.q[2],
            w = this.q[3],
            x2 = x * 2,
            y2 = y * 2,
            z2 = z * 2,
            mat = new Matrix();

        mat.m[0]  = 1.0 - (y2 * y + z2 * z);
        mat.m[1]  =        x2 * y + z2 * w;
        mat.m[2]  =        x2 * z - y2 * w;
        mat.m[3]  = 0.0;

        mat.m[4]  =        x2 * y - z2 * w;
        mat.m[5]  = 1.0 - (x2 * x + z2 * z);
        mat.m[6]  =        y2 * z + x2 * w;
        mat.m[7]  = 0.0;

        mat.m[8]  =        x2 * z + y2 * w;
        mat.m[9]  =        y2 * z - x2 * w;
        mat.m[10] = 1.0 - (x2 * x + y2 * y);
        mat.m[11] = 0.0;

        mat.m[12] = 0.0;
        mat.m[13] = 0.0;
        mat.m[14] = 0.0;
        mat.m[15] = 1.0;

        return mat;
    }

    /**
     * Forgató mátrix számítása
     *
     * @param {Number} x
     * @param {Number} y
     * @param {Number} z
     * @returns {Quanternion}
     */
    rotate (x, y, z) {
        var ax = [1.0, 0.0, 0.0],
            ay = [0.0, 1.0, 0.0],
            az = [0.0, 0.0, 1.0],
            qx = new Quanternion().setFromAxis(ax, radians(x)),
            qy = new Quanternion().setFromAxis(ay, radians(y)),
            qz = new Quanternion().setFromAxis(az, radians(z));

        this.q = qx.mul( qy ).mul( qz ).q;
        return this;
    }
}