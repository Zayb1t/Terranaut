$.Camera = function (data) {
    this.position = [0, 0];
    this.velocity = [0, 0];
    this.tilePosition = [0, 0];
    this.chunkPosition = [0, 0];

    $.util.merge(this, data);
};
$.Camera.prototype = {
    start: function () {
        this.width = this.game.canvas.width;
        this.height = this.game.canvas.height;
    },
    update: function (delta) {
        this.tilePosition = this.position.divide(20).floor();
        this.chunkPosition = this.tilePosition.divide(16).floor();

        this.position[0] += this.velocity[0] * delta;
        this.position[1] += this.velocity[1] * delta;

        this.bounds = [-this.width / 2, -this.height / 2, this.width / 2, this.height / 2];

        $.physics.applyWorldBounds(this, this.game.world);
    },
    isInView: function (object) {
        return (object.position[0] + object.viewBounds[2] > this.position[0] - this.width / 2
            && object.position[0] + object.viewBounds[0] < this.position[0] + this.width / 2
            && object.position[1] + object.viewBounds[3] > this.position[1] - this.height / 2
            && object.position[1] + object.viewBounds[1] < this.position[1] + this.height / 2);
    },
    render: function (object) {
        return [
            object.position[0] - this.position[0] + this.width / 2,
            object.position[1] - this.position[1] + this.height / 2
        ];
    }
};