$.Loot = function (data) {
    var self = this;

    this.layer = 3;

    this.position = [0, 0];
    this.tilePosition = [0, 0];
    this.chunkPosition = [0, 0];
    this.velocity = [0, 0];

    this.physics = { resolveCollisions: true };

    this.colliders = [[-8, -8, 8, 8]];

    this.bounds = [0, 0, 0, 0];
    this.viewBounds = [-15, -15, 15, 15];

    $.util.merge(this, data);
};
$.Loot.prototype = {
    update: function (delta) {
        this.tilePosition = this.position.divide(20).floor();
        this.chunkPosition = this.tilePosition.divide(16).floor();

        this.velocity[0] += this.world.gravity[0] * delta;
        this.velocity[0] = $.util.clamp(-40, this.velocity[0], 40);
        this.position[0] += this.velocity[0] * delta;
        $.physics.resolveTileCollisions(this, this.world, [this.velocity[0], 0]);
        this.velocity[1] += this.world.gravity[1] * delta;
        this.velocity[1] = $.util.clamp(-40, this.velocity[1], 40);
        this.position[1] += this.velocity[1] * delta;
        $.physics.resolveTileCollisions(this, this.world, [0, this.velocity[1]]);

        for (var i = 0; i < this.colliders.length; i++) {
            var collider = this.colliders[i];
            if (collider[0] < this.bounds[0]) {
                this.bounds[0] = collider[0];
            }
            if (collider[1] < this.bounds[1]) {
                this.bounds[1] = collider[1];
            }
            if (collider[2] > this.bounds[2]) {
                this.bounds[2] = collider[2];
            }
            if (collider[3] > this.bounds[3]) {
                this.bounds[3] = collider[3];
            }
        }

        $.physics.applyWorldBounds(this, this.world);
    },
    render: function (ctx, camera) {
        ctx.save();
        ctx.translate(this.position[0] - camera.position[0] + camera.width / 2, this.position[1] - camera.position[1] + camera.height / 2);
        ctx.rotate(this.angle);
        this.item.render(ctx);
        ctx.restore();
    },
    callEvent: function (event, data) {
        if (this.events[event] != undefined) {
            this.events[event](this, data);
        }
    }
};