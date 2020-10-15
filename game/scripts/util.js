Array.prototype.add = function (value) {
    return [this[0] + value[0], this[1] + value[1]];
};
Array.prototype.multiply = function (ratio) {
    if (typeof ratio === "array") return [this[0] * ratio[0], this[1] * ratio[1]];
    return [this[0] * ratio, this[1] * ratio];
};
Array.prototype.divide = function (ratio) {
    return [this[0] / ratio, this[1] / ratio];
};
Array.prototype.floor = function () {
    return [Math.floor(this[0]), Math.floor(this[1])];
};
Array.prototype.round = function (value) {
	return [Math.round(this[0] / value) * value, Math.round(this[1] / value) * value];
};
Array.prototype.distance = function (position) {
    var diff = [position[0] - this[0], position[1] - this[1]];
    return Math.sqrt((diff[0] * diff[0]) + (diff[1] * diff[1]));
};
Array.prototype.tween = function (position, speed, delta) {
    return [this[0] + ((position[0] - this[0]) * speed) * delta, this[1] + ((position[1] - this[1]) * speed) * delta];
};
/*
Object.prototype.merge = function (data) {
    for (var i in data) {
        if (typeof this[i] === "object") {
            this[i].merge(data[i]);
        } else {
            this[i] = data[i];
        }
    }
};
*/
Object.prototype.callEvent = function (event, data) {
	if (this.events === undefined) {
		this.events = {};
    }
	if (this.events[event] != undefined) {
		this.events[event](this, data);
	}
};

$.util = {};

$.util.random = function (min, max) {
    return min + Math.random() * (max - min);
};
$.util.merge = function (object, data) {
    for (var i in data) {
        if (typeof object[i] === "object") {
            $.util.merge(object[i], data[i]);
        } else {
            object[i] = data[i];
        }
    }
};
$.util.distance = function (point1, point2) {
    var diff = [point2[0] - point1[0], point2[1] - point1[1]];
    return Math.sqrt((diff[0] * diff[0]) + (diff[1] * diff[1]));
};
$.util.noise = function (vertices, scale) {
    var q = [];

    for (var i = 0; i < vertices; i++) {
        q.push(Math.random());
    }

    var r = [];

    for (var i = 0; i < vertices; i++) {
        var v = Math.random();

        var scaledI = i * scale;
        var iFloor = Math.floor(scaledI);
        var t = scaledI - iFloor;
        var tRemapSmoothstep = t * t * (3 - 2 * t);

        var iMin = iFloor;
        var iMax = (iMin + 1);

        r.push($.util.lerp(q[iMin], q[iMax], tRemapSmoothstep));
    }

    return r;
};
$.util.lerp = function (a, b, t) {
    return a * (1 - t) + b * t;
};
$.util.clamp = function (min, value, max) {
    if (value < min) return min;
    if (value > max) return max;
    return value;
};
$.util.renderIcon = function (ctx, icon, x, y) {
	ctx.save();
	ctx.translate(x, y);
	if (icon === 'heart_full') {
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(0, 7);
		ctx.lineTo(-10, -5);
		ctx.lineTo(-5, -10);
		ctx.lineTo(0, -5);
		ctx.lineTo(5, -10);
		ctx.lineTo(10, -5);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
	} else if (icon === 'heart_half') {
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(0, 7);
		ctx.lineTo(-10, -5);
		ctx.lineTo(-5, -10);
		ctx.lineTo(5, 1.5);
		ctx.closePath();
		ctx.fill();
		ctx.stroke();
	} else if (icon === "star_full") {
		ctx.lineWidth = 4;
		ctx.beginPath();
		ctx.moveTo(0, -10);
		ctx.lineTo(3, -5);
		ctx.lineTo(9, -5);
		ctx.lineTo(5, 0);
		ctx.lineTo(5, 5);
		ctx.lineTo(0, 2);
		ctx.lineTo(-5, 5);
		ctx.lineTo(-5, 0);
		ctx.lineTo(-9, -5);
		ctx.lineTo(-3, -5);
		ctx.closePath();
		ctx.stroke();
		ctx.fill();
	} else if (icon === "star_half") {
		ctx.lineWidth = 4;
		ctx.beginPath();
		ctx.moveTo(0, -10);
		ctx.lineTo(-3, -5);
		ctx.lineTo(-9, -5);
		ctx.lineTo(-5, 0);
		ctx.lineTo(-5, 5);
		ctx.lineTo(0, 0);
		ctx.closePath();
		ctx.stroke();
		ctx.fill();
	} else {
		console.error("Unknown icon name.");
	}
	ctx.restore();
};