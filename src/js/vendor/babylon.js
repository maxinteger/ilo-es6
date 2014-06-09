
export class Color4{
    constructor(initialR, initialG, initialB, initialA) {
        this.r = initialR;
        this.g = initialG;
        this.b = initialB;
        this.a = initialA;
    }

    toString(){
        return "{R: " + this.r + " G:" + this.g + " B:" + this.b + " A:" + this.a + "}";
    }
}

export class Vector2 {
    constructor (initialX, initialY) {
        this.x = initialX;
        this.y = initialY;
    }

    toString () {
        return "{X: " + this.x + " Y:" + this.y + "}";
    }

    add (otherVector) {
        return new Vector2(this.x + otherVector.x, this.y + otherVector.y);
    }

    subtract (otherVector) {
        return new Vector2(this.x - otherVector.x, this.y - otherVector.y);
    }

    negate () {
        return new Vector2(-this.x, -this.y);
    }

    scale (s) {
        return new Vector2(this.x * s, this.y * s);
    }

    equals (otherVector) {
        return this.x === otherVector.x && this.y === otherVector.y;
    }

    length () {
        return Math.sqrt(this.x * this.x + this.y * this.y);
    }

    lengthSquared () {
        return (this.x * this.x + this.y * this.y);
    }

    normalize () {
        var len = this.length();
        if (len !== 0) {
            var num = 1.0 / len;
            this.x *= num;
            this.y *= num;
        }
        return this;
    }

    toArray () {
        return[this.x, this.y];
    }
}

Vector2.Zero = function () {
    return new Vector2(0, 0);
};
Vector2.Copy = function (source) {
    return new Vector2(source.x, source.y);
};
Vector2.Normalize = function (vector) {
    var newVector = Vector2.Copy(vector);
    newVector.normalize();
    return newVector;
};
Vector2.Minimize = function (left, right) {
    var x = (left.x < right.x) ? left.x : right.x;
    var y = (left.y < right.y) ? left.y : right.y;
    return new Vector2(x, y);
};
Vector2.Maximize = function (left, right) {
    var x = (left.x > right.x) ? left.x : right.x;
    var y = (left.y > right.y) ? left.y : right.y;
    return new Vector2(x, y);
};
Vector2.Transform = function (vector, transformation) {
    var x = (vector.x * transformation.m[0]) + (vector.y * transformation.m[4]);
    var y = (vector.x * transformation.m[1]) + (vector.y * transformation.m[5]);
    return new Vector2(x, y);
};
Vector2.Distance = function (value1, value2) {
    return Math.sqrt(Vector2.DistanceSquared(value1, value2));
};
Vector2.DistanceSquared = function (value1, value2) {
    var x = value1.x - value2.x;
    var y = value1.y - value2.y;
    return (x * x) + (y * y);
};

/**
 * Vector 3
 * @class
 */
export class Vector3 {
    constructor(initialX, initialY, initialZ) {
        this.x = initialX;
        this.y = initialY;
        this.z = initialZ;
    }

    toString() {
        return "{X: " + this.x + " Y:" + this.y + " Z:" + this.z + "}";
    }

    add(otherVector) {
        return new Vector3(this.x + otherVector.x, this.y + otherVector.y, this.z + otherVector.z);
    }

    subtract(otherVector) {
        return new Vector3(this.x - otherVector.x, this.y - otherVector.y, this.z - otherVector.z);
    }

    negate() {
        return new Vector3(-this.x, -this.y, -this.z);
    }

    scale(s) {
        return new Vector3(this.x * s, this.y * s, this.z * s);
    }

    equals(otherVector) {
        return this.x === otherVector.x && this.y === otherVector.y && this.z === otherVector.z;
    }

    multiply(otherVector) {
        return new Vector3(this.x * otherVector.x, this.y * otherVector.y, this.z * otherVector.z);
    }

    divide(otherVector) {
        return new Vector3(this.x / otherVector.x, this.y / otherVector.y, this.z / otherVector.z);
    }

    length() {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }

    lengthSquared() {
        return (this.x * this.x + this.y * this.y + this.z * this.z);
    }

    normalize() {
        var len = this.length();
        if (len !== 0) {
            var num = 1.0 / len;
            this.x *= num;
            this.y *= num;
            this.z *= num;
        }
        return this;
    }

    toArray() {
        return[this.x, this.y, this.z];

    }
}

Vector3.FromArray = function (array, offset) {
    if (!offset) {
        offset = 0;
    }
    return new Vector3(array[offset], array[offset + 1], array[offset + 2]);
};
Vector3.Zero = function () {
    return new Vector3(0, 0, 0);
};
Vector3.Up = function () {
    return new Vector3(0, 1.0, 0);
};
Vector3.Copy = function (source) {
    return new Vector3(source.x, source.y, source.z);
};
Vector3.TransformCoordinates = function (vector, transformation) {
    var x = (vector.x * transformation.m[0]) + (vector.y * transformation.m[4]) + (vector.z * transformation.m[8]) + transformation.m[12];
    var y = (vector.x * transformation.m[1]) + (vector.y * transformation.m[5]) + (vector.z * transformation.m[9]) + transformation.m[13];
    var z = (vector.x * transformation.m[2]) + (vector.y * transformation.m[6]) + (vector.z * transformation.m[10]) + transformation.m[14];
    var w = (vector.x * transformation.m[3]) + (vector.y * transformation.m[7]) + (vector.z * transformation.m[11]) + transformation.m[15];
    return new Vector3(x / w, y / w, z / w);
};
Vector3.TransformNormal = function (vector, transformation) {
    var x = (vector.x * transformation.m[0]) + (vector.y * transformation.m[4]) + (vector.z * transformation.m[8]);
    var y = (vector.x * transformation.m[1]) + (vector.y * transformation.m[5]) + (vector.z * transformation.m[9]);
    var z = (vector.x * transformation.m[2]) + (vector.y * transformation.m[6]) + (vector.z * transformation.m[10]);
    return new Vector3(x, y, z);
};
Vector3.Dot = function (left, right) {
    return (left.x * right.x + left.y * right.y + left.z * right.z);
};
Vector3.Cross = function (left, right) {
    var x = left.y * right.z - left.z * right.y;
    var y = left.z * right.x - left.x * right.z;
    var z = left.x * right.y - left.y * right.x;
    return new Vector3(x, y, z);
};
Vector3.Normalize = function (vector) {
    var newVector = Vector3.Copy(vector);
    newVector.normalize();
    return newVector;
};
Vector3.Distance = function (value1, value2) {
    return Math.sqrt(Vector3.DistanceSquared(value1, value2));
};
Vector3.DistanceSquared = function (value1, value2) {
    var x = value1.x - value2.x;
    var y = value1.y - value2.y;
    var z = value1.z - value2.z;
    return (x * x) + (y * y) + (z * z);
};


/*
 MATRIX
 */
export class Matrix {
    constructor() {
        this.m= Array.prototype.slice.call(arguments, 0);
    }
    isIdentity () {
        if (this.m[0] !== 1.0 || this.m[5] !== 1.0 || this.m[10] !== 1.0 || this.m[15] !== 1.0) {
            return false;
        }
        return !(this.m[12] !== 0.0 || this.m[13] !== 0.0 || this.m[14] !== 0.0 || this.m[4] !== 0.0 || this.m[6] !== 0.0 || this.m[7] !== 0.0 || this.m[8] !== 0.0 || this.m[9] !== 0.0 || this.m[11] !== 0.0 || this.m[12] !== 0.0 || this.m[13] !== 0.0 || this.m[14] !== 0.0);
    }

    determinant () {
        var temp1 = (this.m[10] * this.m[15]) - (this.m[11] * this.m[14]),
            temp2 = (this.m[9] * this.m[15]) - (this.m[11] * this.m[13]),
            temp3 = (this.m[9] * this.m[14]) - (this.m[10] * this.m[13]),
            temp4 = (this.m[8] * this.m[15]) - (this.m[11] * this.m[12]),
            temp5 = (this.m[8] * this.m[14]) - (this.m[10] * this.m[12]),
            temp6 = (this.m[8] * this.m[13]) - (this.m[9] * this.m[12]);
        return ((((this.m[0] * (((this.m[5] * temp1) - (this.m[6] * temp2)) + (this.m[7] * temp3))) - (this.m[1] * (((this.m[4] * temp1) - (this.m[6] * temp4)) + (this.m[7] * temp5)))) + (this.m[2] * (((this.m[4] * temp2) - (this.m[5] * temp4)) + (this.m[7] * temp6)))) - (this.m[3] * (((this.m[4] * temp3) - (this.m[5] * temp5)) + (this.m[6] * temp6))));
    }

    toArray () {
        return this.m;
    }

    invert () {
        var l1 = this.m[0],
            l2 = this.m[1],
            l3 = this.m[2],
            l4 = this.m[3],
            l5 = this.m[4],
            l6 = this.m[5],
            l7 = this.m[6],
            l8 = this.m[7],
            l9 = this.m[8],
            l10 = this.m[9],
            l11 = this.m[10],
            l12 = this.m[11],
            l13 = this.m[12],
            l14 = this.m[13],
            l15 = this.m[14],
            l16 = this.m[15],
            l17 = (l11 * l16) - (l12 * l15),
            l18 = (l10 * l16) - (l12 * l14),
            l19 = (l10 * l15) - (l11 * l14),
            l20 = (l9 * l16) - (l12 * l13),
            l21 = (l9 * l15) - (l11 * l13),
            l22 = (l9 * l14) - (l10 * l13),
            l23 = ((l6 * l17) - (l7 * l18)) + (l8 * l19),
            l24 = -(((l5 * l17) - (l7 * l20)) + (l8 * l21)),
            l25 = ((l5 * l18) - (l6 * l20)) + (l8 * l22),
            l26 = -(((l5 * l19) - (l6 * l21)) + (l7 * l22)),
            l27 = 1.0 / ((((l1 * l23) + (l2 * l24)) + (l3 * l25)) + (l4 * l26)),
            l28 = (l7 * l16) - (l8 * l15),
            l29 = (l6 * l16) - (l8 * l14),
            l30 = (l6 * l15) - (l7 * l14),
            l31 = (l5 * l16) - (l8 * l13),
            l32 = (l5 * l15) - (l7 * l13),
            l33 = (l5 * l14) - (l6 * l13),
            l34 = (l7 * l12) - (l8 * l11),
            l35 = (l6 * l12) - (l8 * l10),
            l36 = (l6 * l11) - (l7 * l10),
            l37 = (l5 * l12) - (l8 * l9),
            l38 = (l5 * l11) - (l7 * l9),
            l39 = (l5 * l10) - (l6 * l9);
        this.m[0] = l23 * l27;
        this.m[4] = l24 * l27;
        this.m[8] = l25 * l27;
        this.m[12] = l26 * l27;
        this.m[1] = -(((l2 * l17) - (l3 * l18)) + (l4 * l19)) * l27;
        this.m[5] = (((l1 * l17) - (l3 * l20)) + (l4 * l21)) * l27;
        this.m[9] = -(((l1 * l18) - (l2 * l20)) + (l4 * l22)) * l27;
        this.m[13] = (((l1 * l19) - (l2 * l21)) + (l3 * l22)) * l27;
        this.m[2] = (((l2 * l28) - (l3 * l29)) + (l4 * l30)) * l27;
        this.m[6] = -(((l1 * l28) - (l3 * l31)) + (l4 * l32)) * l27;
        this.m[10] = (((l1 * l29) - (l2 * l31)) + (l4 * l33)) * l27;
        this.m[14] = -(((l1 * l30) - (l2 * l32)) + (l3 * l33)) * l27;
        this.m[3] = -(((l2 * l34) - (l3 * l35)) + (l4 * l36)) * l27;
        this.m[7] = (((l1 * l34) - (l3 * l37)) + (l4 * l38)) * l27;
        this.m[11] = -(((l1 * l35) - (l2 * l37)) + (l4 * l39)) * l27;
        this.m[15] = (((l1 * l36) - (l2 * l38)) + (l3 * l39)) * l27;
    }

    multiply (other) {
        var result = new Matrix();
        result.m[0] = this.m[0] * other.m[0] + this.m[1] * other.m[4] + this.m[2] * other.m[8] + this.m[3] * other.m[12];
        result.m[1] = this.m[0] * other.m[1] + this.m[1] * other.m[5] + this.m[2] * other.m[9] + this.m[3] * other.m[13];
        result.m[2] = this.m[0] * other.m[2] + this.m[1] * other.m[6] + this.m[2] * other.m[10] + this.m[3] * other.m[14];
        result.m[3] = this.m[0] * other.m[3] + this.m[1] * other.m[7] + this.m[2] * other.m[11] + this.m[3] * other.m[15];
        result.m[4] = this.m[4] * other.m[0] + this.m[5] * other.m[4] + this.m[6] * other.m[8] + this.m[7] * other.m[12];
        result.m[5] = this.m[4] * other.m[1] + this.m[5] * other.m[5] + this.m[6] * other.m[9] + this.m[7] * other.m[13];
        result.m[6] = this.m[4] * other.m[2] + this.m[5] * other.m[6] + this.m[6] * other.m[10] + this.m[7] * other.m[14];
        result.m[7] = this.m[4] * other.m[3] + this.m[5] * other.m[7] + this.m[6] * other.m[11] + this.m[7] * other.m[15];
        result.m[8] = this.m[8] * other.m[0] + this.m[9] * other.m[4] + this.m[10] * other.m[8] + this.m[11] * other.m[12];
        result.m[9] = this.m[8] * other.m[1] + this.m[9] * other.m[5] + this.m[10] * other.m[9] + this.m[11] * other.m[13];
        result.m[10] = this.m[8] * other.m[2] + this.m[9] * other.m[6] + this.m[10] * other.m[10] + this.m[11] * other.m[14];
        result.m[11] = this.m[8] * other.m[3] + this.m[9] * other.m[7] + this.m[10] * other.m[11] + this.m[11] * other.m[15];
        result.m[12] = this.m[12] * other.m[0] + this.m[13] * other.m[4] + this.m[14] * other.m[8] + this.m[15] * other.m[12];
        result.m[13] = this.m[12] * other.m[1] + this.m[13] * other.m[5] + this.m[14] * other.m[9] + this.m[15] * other.m[13];
        result.m[14] = this.m[12] * other.m[2] + this.m[13] * other.m[6] + this.m[14] * other.m[10] + this.m[15] * other.m[14];
        result.m[15] = this.m[12] * other.m[3] + this.m[13] * other.m[7] + this.m[14] * other.m[11] + this.m[15] * other.m[15];
        return result;
    }

    equals (value) {
        return (this.m[0] === value.m[0] && this.m[1] === value.m[1] && this.m[2] === value.m[2] && this.m[3] === value.m[3] && this.m[4] === value.m[4] && this.m[5] === value.m[5] && this.m[6] === value.m[6] && this.m[7] === value.m[7] && this.m[8] === value.m[8] && this.m[9] === value.m[9] && this.m[10] === value.m[10] && this.m[11] === value.m[11] && this.m[12] === value.m[12] && this.m[13] === value.m[13] && this.m[14] === value.m[14] && this.m[15] === value.m[15]);
    }
}

Matrix.FromValues = function () {
    var result = new Matrix();
    result.m = Array.prototype.slice.call(arguments, 0);
    return result;
};
Matrix.Identity = function () {
    return Matrix.FromValues(1.0, 0, 0, 0, 0, 1.0, 0, 0, 0, 0, 1.0, 0, 0, 0, 0, 1.0);
};
Matrix.Zero = function () {
    return Matrix.FromValues(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
};
Matrix.Copy = function (source) {
    return Matrix.FromValues(source.m[0], source.m[1], source.m[2], source.m[3], source.m[4], source.m[5], source.m[6], source.m[7], source.m[8], source.m[9], source.m[10], source.m[11], source.m[12], source.m[13], source.m[14], source.m[15]);
};
Matrix.RotationX = function (angle) {
    var result = Matrix.Zero();
    var s = Math.sin(angle);
    var c = Math.cos(angle);
    result.m[0] = 1.0;
    result.m[15] = 1.0;
    result.m[5] = c;
    result.m[10] = c;
    result.m[9] = -s;
    result.m[6] = s;
    return result;
};
Matrix.RotationY = function (angle) {
    var result = Matrix.Zero();
    var s = Math.sin(angle);
    var c = Math.cos(angle);
    result.m[5] = 1.0;
    result.m[15] = 1.0;
    result.m[0] = c;
    result.m[2] = -s;
    result.m[8] = s;
    result.m[10] = c;
    return result;
};
Matrix.RotationZ = function (angle) {
    var result = Matrix.Zero();
    var s = Math.sin(angle);
    var c = Math.cos(angle);
    result.m[10] = 1.0;
    result.m[15] = 1.0;
    result.m[0] = c;
    result.m[1] = s;
    result.m[4] = -s;
    result.m[5] = c;
    return result;
};
Matrix.RotationAxis = function (axis, angle) {
    var s = Math.sin(-angle);
    var c = Math.cos(-angle);
    var c1 = 1 - c;
    axis.normalize();
    var result = Matrix.Zero();
    result.m[0] = (axis.x * axis.x) * c1 + c;
    result.m[1] = (axis.x * axis.y) * c1 - (axis.z * s);
    result.m[2] = (axis.x * axis.z) * c1 + (axis.y * s);
    result.m[3] = 0.0;
    result.m[4] = (axis.y * axis.x) * c1 + (axis.z * s);
    result.m[5] = (axis.y * axis.y) * c1 + c;
    result.m[6] = (axis.y * axis.z) * c1 - (axis.x * s);
    result.m[7] = 0.0;
    result.m[8] = (axis.z * axis.x) * c1 - (axis.y * s);
    result.m[9] = (axis.z * axis.y) * c1 + (axis.x * s);
    result.m[10] = (axis.z * axis.z) * c1 + c;
    result.m[11] = 0.0;
    result.m[15] = 1.0;
    return result;
};
Matrix.RotationYawPitchRoll = function (yaw, pitch, roll) {
    return Matrix.RotationZ(roll).multiply(Matrix.RotationX(pitch)).multiply(Matrix.RotationY(yaw));
};
Matrix.Scaling = function (x, y, z) {
    var result = Matrix.Zero();
    result.m[0] = x;
    result.m[5] = y;
    result.m[10] = z;
    result.m[15] = 1.0;
    return result;
};
Matrix.Translation = function (x, y, z) {
    var result = Matrix.Identity();
    result.m[12] = x;
    result.m[13] = y;
    result.m[14] = z;
    return result;
};
Matrix.LookAtLH = function (eye, target, up) {
    var zAxis = target.subtract(eye).normalize(),
        xAxis = Vector3.Cross(up, zAxis).normalize(),
        yAxis = Vector3.Cross(zAxis, xAxis),
        ex = -Vector3.Dot(xAxis, eye),
        ey = -Vector3.Dot(yAxis, eye),
        ez = -Vector3.Dot(zAxis, eye);

    return new Matrix(xAxis.x, yAxis.x, zAxis.x, 0,
        xAxis.y, yAxis.y, zAxis.y, 0,
        xAxis.z, yAxis.z, zAxis.z, 0,
        ex,      ey,      ez,      1);
};
Matrix.PerspectiveLH = function (width, height, znear, zfar) {
    var matrix = Matrix.Zero();
    matrix.m[0] = (2.0 * znear) / width;
    matrix.m[1] = matrix.m[2] = matrix.m[3] = 0.0;
    matrix.m[5] = (2.0 * znear) / height;
    matrix.m[4] = matrix.m[6] = matrix.m[7] = 0.0;
    matrix.m[10] = -zfar / (znear - zfar);
    matrix.m[8] = matrix.m[9] = 0.0;
    matrix.m[11] = 1.0;
    matrix.m[12] = matrix.m[13] = matrix.m[15] = 0.0;
    matrix.m[14] = (znear * zfar) / (znear - zfar);
    return matrix;
};
Matrix.PerspectiveFovLH = function (fov, aspect, znear, zfar) {
    var matrix = Matrix.Zero();
    var tan = 1.0 / (Math.tan(fov * 0.5));
    matrix.m[0] = tan / aspect;
    matrix.m[1] = matrix.m[2] = matrix.m[3] = 0.0;
    matrix.m[5] = tan;
    matrix.m[4] = matrix.m[6] = matrix.m[7] = 0.0;
    matrix.m[8] = matrix.m[9] = 0.0;
    matrix.m[10] = -zfar / (znear - zfar);
    matrix.m[11] = 1.0;
    matrix.m[12] = matrix.m[13] = matrix.m[15] = 0.0;
    matrix.m[14] = (znear * zfar) / (znear - zfar);
    return matrix;
};
Matrix.Transpose = function (matrix) {
    var result = new Matrix();
    result.m[0] = matrix.m[0];
    result.m[1] = matrix.m[4];
    result.m[2] = matrix.m[8];
    result.m[3] = matrix.m[12];
    result.m[4] = matrix.m[1];
    result.m[5] = matrix.m[5];
    result.m[6] = matrix.m[9];
    result.m[7] = matrix.m[13];
    result.m[8] = matrix.m[2];
    result.m[9] = matrix.m[6];
    result.m[10] = matrix.m[10];
    result.m[11] = matrix.m[14];
    result.m[12] = matrix.m[3];
    result.m[13] = matrix.m[7];
    result.m[14] = matrix.m[11];
    result.m[15] = matrix.m[15];
    return result;
};
window.Vect2 = Vector2;
window.Vect3 = Vector3;
window.Mat4 = Matrix;
