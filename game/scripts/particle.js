$.Particle = function (data) {
    this.position = [0, 0];
    this.velocity = [0, 0];

    this.angle = 0;
    this.deltaAngle = 0;
    this.speed = 0;
    this.deltaSpeed = 0;
    this.size = 0;
    this.deltaSize = 0;

    this.lifetime = 0;

    this.fillStyle = "hsla(0, 0%, 100%, 1)";

    $.util.merge(this, data);
};
$.Particle.prototype = {
    update: function (delta) {
        this.position[0] += this.velocity[0] * delta;
        this.position[1] += this.velocity[1] * delta;

        this.velocity[0] = Math.sin(this.angle) * this.speed;
        this.velocity[1] = Math.cos(this.angle) * this.speed;

        this.angle += this.deltaAngle * delta;
        this.speed += this.deltaSpeed * delta;
        this.size += this.deltaSize * delta;

        if (this.lifetime > 0) {
            this.lifetime -= delta;
        }
    },
    render: function (ctx, camera) {
        var draw = camera.render(this);

        ctx.save();
        ctx.translate(draw[0], draw[1]);
        ctx.fillStyle = this.fillStyle;
        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
    }
};