$.ParticleEmitter = function (data) {
    this.layer = 4;

    this.position = [0, 0];

    this.viewBounds = [-100, -100, 100, 100];

    this.minRadius = 0;
    this.maxRadius = 0;
    this.minSpawnAngle = 0;
    this.maxSpawnAngle = Math.PI * 2;
    this.minAngle = 0;
    this.maxAngle = Math.PI * 2;
    this.minDeltaAngle = 0;
    this.maxDeltaAngle = 0;
    this.minSpeed = 1;
    this.maxSpeed = 2;
    this.minDeltaSpeed = 0;
    this.maxDeltaSpeed = 0;
    this.minSize = 1;
    this.maxSize = 2;
    this.minDeltaSize = 0;
    this.maxDeltaSize = 0;
    this.minLifetime = 50;
    this.maxLifetime = 60;

    this.minCount = 5;
    this.maxCount = 10;

    this.fillStyles = [];

    $.util.merge(this, data);

    this.particles = [];
};
$.ParticleEmitter.prototype = {
    start: function () {
        var count = $.util.random(this.minCount, this.maxCount);

        for (var i = 0; i < Math.round(count); i++) {
            var radius = $.util.random(this.minRadius, this.maxRadius);
            var spawnAngle = $.util.random(this.minSpawnAngle, this.maxSpawnAngle);

            var angle = spawnAngle + $.util.random(this.minAngle, this.maxAngle);
            var deltaAngle = $.util.random(this.minDeltaAngle, this.maxDeltaAngle);
            var speed = $.util.random(this.minSpeed, this.maxSize);
            var deltaSpeed = $.util.random(this.minDeltaSpeed, this.maxDeltaSpeed);
            var size = $.util.random(this.minSize, this.maxSize);
            var deltaSize = $.util.random(this.minDeltaSize, this.maxDeltaSize);
            var lifetime = $.util.random(this.minLifetime, this.maxLifetime);
            var fillStyle = this.fillStyles[Math.floor(Math.random() * this.fillStyles.length)];

            var position = [
                this.position[0] + Math.sin(spawnAngle) * radius,
                this.position[1] + Math.cos(spawnAngle) * radius
            ];

            var particle = new $.Particle({
                position: position,
                angle: angle,
                deltaAngle: deltaAngle,
                speed: speed,
                deltaSpeed: deltaSpeed,
                size: size,
                deltaSize: deltaSize,
                lifetime: lifetime,
                fillStyle: fillStyle
            });
            this.particles.push(particle);
        }
    },
    update: function (delta) {
        for (var i = 0; i < this.particles.length; i++) {
            var particle = this.particles[i];
            particle.update(delta);
            if (particle.lifetime < 0) {
                this.particles.splice(i, 1);
            }
        }

        if (this.particles.length === 0) {
            this.destroy();
        }
    },
    render: function (ctx, camera) {
        for (var i = 0; i < this.particles.length; i++) {
            this.particles[i].render(ctx, camera);
        }
    },
    destroy: function () {
        this.world.removeParticleEmitter(this);
    }
};