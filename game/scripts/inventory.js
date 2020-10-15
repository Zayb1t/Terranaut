$.Inventory = function (data) {
    var self = this;

    this.items = [];
    this.space = 0;
    this.usedSpace = 0;

    $.util.merge(this, data);
};
$.Inventory.prototype = {
    start: function () {

    },
    update: function (delta) {
        this.usedSpace = 0;
        for (var i = 0; i < this.items.length; i++) {
            this.usedSpace += this.items[i].stats.size;
        }
    },
    render: function (ctx) {
        ctx.save();
        ctx.translate(ctx.canvas.width / 2, ctx.canvas.height / 2);

        ctx.fillStyle = "hsla(0, 0%, 2%, 1)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(-350, -210);
        ctx.lineTo(350, -210);
        ctx.lineTo(350, 210);
        ctx.lineTo(-350, 210);
        ctx.closePath();
        ctx.fill();

        for (var i = 0; i < 26; i++) {
            var draw = [-300, -150 + (i * 14)];
            if (Math.floor(i / 2) === i / 2) {
                ctx.fillStyle = "hsla(0, 0%, 5%, 1)";
                ctx.fillRect(draw[0], draw[1] - 7, 400, 14);
            }
        }

        var select = -1;

        for (var i = 0; i < this.items.length; i++) {
            var item = this.items[i];
            var draw = [-300, -150 + (i * 14)];

            if (this.game.cursorIsOver(ctx.canvas.width / 2 + draw[0], ctx.canvas.height / 2 + draw[1] - 7, 400, 14)) {
                select = i;
                
                ctx.fillStyle = "hsla(0, 0%, 100%, 1)";
                ctx.fillRect(draw[0], draw[1] - 7, 400, 14);

                if (item.equipable) {
                    if (this.game.buttonPressed(0)) {
                        this.game.playSound("item_equip", 1);
                        if (item.twoHanded) {
                            if (this.owner.handItems[0] === i) {
                                this.owner.handItems[0] = -1;
                                this.owner.handItems[1] = -1;
                            } else {
                                this.owner.handItems[0] = i;
                                this.owner.handItems[1] = i;
                            }
                        } else {
                            if (this.owner.handItems[0] === i) {
                                this.owner.handItems[0] = -1;
                            } else {
                                this.owner.handItems[0] = i;
                            }
                            if (this.owner.handItems[1] === i) {
                                this.owner.handItems[1] = -1;
                            }
                        }
                    } else if (this.game.buttonPressed(1)) {
                        this.game.playSound("item_equip", 1);
                        if (item.twoHanded) {
                            if (this.owner.handItems[1] === i) {
                                this.owner.handItems[0] = -1;
                                this.owner.handItems[1] = -1;
                            } else {
                                this.owner.handItems[0] = i;
                                this.owner.handItems[1] = i;
                            }
                        } else {
                            if (this.owner.handItems[1] === i) {
                                this.owner.handItems[1] = -1;
                            } else {
                                this.owner.handItems[1] = i;
                            }
                            if (this.owner.handItems[0] === i) {
                                this.owner.handItems[0] = -1;
                            }
                        }
                    }
                }
            }

            ctx.fillStyle = "hsla(0, 0%, 100%, 1)";
            ctx.font = "14px Terranaut";
            ctx.textAlign = "right";
            ctx.textBaseline = "top";
            if (this.owner.handItems[0] === i) {
                ctx.fillText("L", draw[0] - 26, draw[1] - 8);
            }
            if (this.owner.handItems[1] === i) {
                ctx.fillText("R", draw[0] - 14, draw[1] - 8);
            }

            ctx.fillStyle = "hsla(0, 0%, 100%, 1)";
            if (select === i) {
                ctx.fillStyle = "hsla(0, 0%, 0%, 1)";
            }
            ctx.font = "14px Terranaut";
            ctx.textAlign = "left";
            ctx.textBaseline = "top";
            ctx.fillText(item.title, draw[0] + 2, draw[1] - 8);
            ctx.textAlign = "right";
            ctx.fillText("x" + item.count, draw[0] + 398, draw[1] - 8);
        }

        if (select != -1) {
            var item = this.items[select];

            ctx.save();
            ctx.translate(230, -110);
            ctx.scale(2, 2);
            item.render(ctx);
            ctx.restore();

            ctx.fillStyle = "hsla(0, 0%, 100%, 1)";
            ctx.font = "14px Terranaut";
            ctx.textAlign = "center";
            ctx.textBaseline = "center";
            ctx.fillText(item.title, 230, -20);

            if (item.stats.value) {
                ctx.fillText("Value: " + item.stats.value, 230, -8);
            }
        }

        ctx.restore();
    },
    attemptToCollect: function (loot) {

    },
    collect: function (item) {
        item.owner = this.owner;
        this.items.push(item);
    },
    drop: function (item) {

    }
};