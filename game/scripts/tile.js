$.Tile = function (data) {
    this.layer = 0;

    $.util.merge(this, data);
    $.util.merge(this, $.tileTypes[this.type]);

    this.borders = [false, false, false, false];
};
$.Tile.prototype = {
    start: function () {
        if (this.startType) {
            this.startType();
        }
    },
    update: function () {
        this.borders = [false, false, false, false];

        if (this.type != "air") {
            if (this.world.getTile(this.tilePosition.add([0, -1]), this.layer) != undefined && this.world.getTile(this.tilePosition.add([0, -1]), this.layer).type === "air") {
                this.borders[0] = true;
            }
            if (this.world.getTile(this.tilePosition.add([0, 1]), this.layer) != undefined && this.world.getTile(this.tilePosition.add([0, 1]), this.layer).type === "air") {
                this.borders[1] = true;
            }
            if (this.world.getTile(this.tilePosition.add([-1, 0]), this.layer) != undefined && this.world.getTile(this.tilePosition.add([-1, 0]), this.layer).type === "air") {
                this.borders[2] = true;
            }
            if (this.world.getTile(this.tilePosition.add([1, 0]), this.layer) != undefined && this.world.getTile(this.tilePosition.add([1, 0]), this.layer).type === "air") {
                this.borders[3] = true;
            }
        }
    },
    render: function (ctx, camera) {
        this.renderType(ctx);
        if (this.type != "air" && this.layer < 1) {
            ctx.fillStyle = "hsla(0, 0%, 0%, 0.5)";
            ctx.fillRect(-10, -10, 20, 20);
        }
        var light = this.world.getLightLevel(this.tilePosition);
        light = $.util.clamp(0, light, 1);
        ctx.fillStyle = "hsla(0, 0%, 0%, " + (1 - light) + ")";
        ctx.fillRect(-10, -10, 20, 20);
    }
};