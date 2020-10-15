var exports = {};

$.Chunk = function (data) {
    this.layer = 1;

    this.viewBounds = [-10, -10, 310, 310];

    this.imageCanvas = document.createElement("canvas");
    this.imageCtx = this.imageCanvas.getContext("2d");

    this.imageCanvas.width = 320;
    this.imageCanvas.height = 320;

    this.time = 0;
    this.isActive = false;
    this.mustUpdateTiles = true;
    this.mustRenderTiles = true;

    $.util.merge(this, data);
};
$.Chunk.prototype = {
    updateTiles: function (delta) {
        var startTime = Date.now();

        for (var c = 0; c < 16; c++) {
            for (var r = 0; r < 16; r++) {
                for (var l = 0; l < 2; l++) {
                    var tilePosition = [this.tilePosition[0] + c, this.tilePosition[1] + r]; // !
                    var tile = this.world.getTile(tilePosition, l);
                    if (tile === undefined) {
                        continue;
                    }
                    tile.update(delta);
                }
            }
        }

        var endTime = Date.now();
        var timeTaken = endTime - startTime;

        if (timeTaken > 10) {
            console.log("[Violation] Chunk took " + timeTaken + "ms to update!");
        }
    },
    renderTiles: function () {
        var startTime = Date.now();

        var chunkSizeInPixels = 320;
        this.imageCtx.clearRect(0, 0, chunkSizeInPixels, chunkSizeInPixels);
        for (var c = 0; c < 16; c++) {
            for (var r = 0; r < 16; r++) {
                for (var l = 0; l < 2; l++) {
                    var tilePosition = [this.tilePosition[0] + c, this.tilePosition[1] + r]; // !
                    var tile = this.world.getTile(tilePosition, l);
                    if (tile === undefined) {
                        continue;
                    }
                    this.imageCtx.save();
                    this.imageCtx.translate((c * 20) + 10, (r * 20) + 10); // !
                    tile.render(this.imageCtx);
                    this.imageCtx.restore();
                }
            }
        }

        var endTime = Date.now();
        var timeTaken = endTime - startTime;

        if (timeTaken > 10) {
            console.log("[Violation] Chunk took " + timeTaken + "ms to render!");
        }
    },
    update: function (delta) {
        this.time = this.game.ct;

        if (this.mustUpdateTiles) {
            //this.updateTiles(delta);
            this.mustUpdateTiles = false;
        }

        if (this.mustRenderTiles) {
            this.renderTiles();
            this.mustRenderTiles = false;
        }
    },
    render: function (ctx, camera) {
        ctx.save();
        ctx.translate(this.position[0] - camera.position[0] + camera.width / 2, this.position[1] - camera.position[1] + camera.height / 2);
        ctx.drawImage(this.imageCanvas, -10, -10, 320, 320);
        if (this.game.showDebug) {
            if (this.checkUpdate) {
                ctx.strokeStyle = "hsla(0, 100%, 50%, 1)";
            } else {
                ctx.strokeStyle = "hsla(120, 100%, 50%, 1)";
            }
            ctx.lineWidth = 1;
            ctx.strokeRect(-10, -10, 320, 320);
            ctx.strokeStyle = "hsla(0, 0%, 100%, 1)";
        }
        ctx.restore();
    }
};

exports.Chunk = $.Chunk;