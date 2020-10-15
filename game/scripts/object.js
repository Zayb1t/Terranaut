$.Object = function (data) {
    var self = this;

    this.layer = 0;

    this.position = [0, 0];
    this.tilePosition = [0, 0];
    this.chunkPosition = [0, 0];
    this.velocity = [0, 0];

    this.bounds = [0, 0, 0, 0];
    this.viewBounds = [-80, -160, 80, 5];

    this.physics = { resolveCollisions: true, isStatic: true };

    this.angle = 0;
    this.deltaAngle = 0;

    $.util.merge(this, data);
    $.util.merge(this, $.objectTypes[this.type]);
};
$.Object.prototype = {
    start: function () {
        this.startType();
    },
    update: function (delta) {
        this.tilePosition = this.position.divide(20).floor();
        this.chunkPosition = this.tilePosition.divide(16).floor();

        if (!this.physics.isStatic) {
            this.velocity[0] += this.world.gravity[0] * delta;
            this.velocity[0] = $.util.clamp(-40, this.velocity[0], 40);
            this.position[0] += this.velocity[0] * delta;
            if (Math.abs(this.velocity[0] > 0)) {
                $.physics.resolveTileCollisions(this, this.world, [this.velocity[0], 0]);
            }
            this.velocity[1] += this.world.gravity[1] * delta;
            this.velocity[1] = $.util.clamp(-40, this.velocity[1], 40);
            this.position[1] += this.velocity[1] * delta;
            if (Math.abs(this.velocity[1] > 0)) {
                $.physics.resolveTileCollisions(this, this.world, [0, this.velocity[1]]);
            }

            $.physics.applyWorldBounds(this, this.world);

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
        }

        this.angle += this.deltaAngle * delta;

        this.updateType(delta);
    },
    render: function (ctx, camera) {
        ctx.save();
        ctx.translate(this.position[0] - camera.position[0] + camera.width / 2, this.position[1] - camera.position[1] + camera.height / 2);
        ctx.rotate(this.angle);
        this.renderType(ctx);
        ctx.restore();
    },
    destroy: function () {
        this.world.removeObject(this);
    }
};