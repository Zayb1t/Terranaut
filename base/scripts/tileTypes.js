$.tileTypes = {
    "air": {
        isOpaque: false,
        mapColor: "hsla(0, 0%, 0%, 0)",
        colliders: [[-10, -10, 10, 10]],
        physics: { resolveCollisions: false, isLiquid: false },
        renderType: function (ctx) {}
    },
    "dirt": {
        isOpaque: true,
        mapColor: "hsla(15, 50%, 20%, 1)",
        colliders: [[-10, -10, 10, 10]],
        physics: { resolveCollisions: true, isLiquid: false },
        renderType: function (ctx) {
            ctx.fillStyle = "hsla(15, 50%, 20%, 1)";
            ctx.fillRect(-10, -10, 20, 20);
            if (this.hasGrass) {
                ctx.fillStyle = "hsla(100, 70%, 45%, 1)";
                ctx.moveTo(-10, -10);
                ctx.lineTo(-10, 0);
                ctx.lineTo(-5, -5);
                ctx.lineTo(0, 0);
                ctx.lineTo(5, -5);
                ctx.lineTo(10, 0);
                ctx.lineTo(10, -10);
                ctx.closePath();
                ctx.fill();
            }
            ctx.fillStyle = "hsla(0, 0%, 0%, 1)";
            if (this.borders[0]) {
                ctx.fillRect(-11, -11, 22, 2);
            }
            if (this.borders[1]) {
                
            }
            if (this.borders[2]) {
                
            }
            if (this.borders[3]) {
                
            }
        }
    },
    "stone": {
        isOpaque: true,
        mapColor: "hsla(0, 0%, 20%, 1)",
        colliders: [[-10, -10, 10, 10]],
        physics: { resolveCollisions: true, isLiquid: false },
        startType: function () {
            this.details = [];
            for (var i = 0; i < 3; i++) {
                this.details.push([
                    $.util.random(-5, 5),
                    $.util.random(-5, 5),
                    $.util.random(5, 10)
                ]);
            }
        },
        renderType: function (ctx) {
            ctx.fillStyle = "hsla(0, 0%, 20%, 1)";
            ctx.fillRect(-10, -10, 20, 20);
            ctx.fillStyle = "hsla(0, 0%, 15%, 1)";
            for (var i = 0; i < this.details.length; i++) {
                var detail = this.details[i];
                ctx.fillRect(detail[0] - detail[2] / 2, detail[1] - detail[2] / 2, detail[2], detail[2]);
            }
            ctx.fillStyle = "hsla(0, 0%, 0%, 1)";
            if (this.borders[0]) {
                ctx.fillRect(-11, -11, 22, 2);
            }
            if (this.borders[1]) {

            }
            if (this.borders[2]) {

            }
            if (this.borders[3]) {

            }
        }
    },
    "copper_ore": {
        isOpaque: true,
        mapColor: "hsla(15, 55%, 50%, 1)",
        colliders: [[-10, -10, 10, 10]],
        physics: { resolveCollisions: true, isLiquid: false },
        renderType: function (ctx) {
            ctx.fillStyle = "hsla(15, 55%, 50%, 1)";
            ctx.fillRect(-10, -10, 20, 20);
            ctx.fillStyle = "hsla(0, 0%, 0%, 1)";
            if (this.borders[0]) {
                ctx.fillRect(-11, -11, 22, 2);
            }
            if (this.borders[1]) {

            }
            if (this.borders[2]) {

            }
            if (this.borders[3]) {

            }
        }
    },
    "water": {
        isOpaque: false,
        colliders: [[-10, -10, 10, 10]],
        physics: { resolveCollisions: false, isLiquid: true, density: 0.5 },
        renderType: function (ctx) {
            ctx.fillStyle = "hsla(215, 100%, 100%, 0.5)";
            ctx.fillRect(-10, -10, 20, 20);
        }
    }
};