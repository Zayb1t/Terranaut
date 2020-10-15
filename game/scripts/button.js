$.Button = function (data) {
    this.position = [0, 0];
    this.offset = [0, 0];

    this.width = 200;
    this.height = 40;

    this.title = "Button";

    this.events = {};

    this.isHovered = false;
    this.isClicked = false;

    $.util.merge(this, data);
};
$.Button.prototype = {
    update: function (delta) {
        this.rect = [
            this.game.canvas.width * this.position[0] + this.offset[0] - this.width / 2,
            this.game.canvas.height * this.position[1] + this.offset[1] - this.height / 2,
            this.width,
            this.height
        ];

        if (this.game.cursorIsOver(this.rect[0], this.rect[1], this.rect[2], this.rect[3])) {
            if (!this.isHovered) {
                this.isHovered = true;
                this.game.playSound("button_hover", 1);
            }
        } else {
            this.isHovered = false;
            this.isClicked = false;
        }

        if (this.isHovered) {
            if (this.game.buttonDown(0)) {
                if (!this.isClicked) {
                    this.isClicked = true;
                    this.game.playSound("button_click", 1);
                }
            } else {
                this.isClicked = false;
            }
        }

        if (this.isClicked) {
            if (this.game.buttonReleased(0)) {
                this.callEvent("onclick");
            }
        }
    },
    render: function (ctx) {
        ctx.fillStyle = "hsla(0, 0%, 100%, 1)";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "20px Terranaut";
        ctx.fillText(this.title, this.rect[0] + this.rect[2] / 2, this.rect[1] + this.rect[3] / 2);

        if (this.isHovered) {
            ctx.strokeStyle = "hsla(0, 0%, 100%, 1)";
            ctx.lineWidth = 2;
            ctx.strokeRect(this.rect[0], this.rect[1], this.rect[2], this.rect[3]);
        }
    },
    callEvent: function (event, data) {
        if (this.events[event] != undefined) {
            this.events[event](this, data);
        }
    }
};