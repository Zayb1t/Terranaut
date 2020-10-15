$.Npc = function (data) {
    var self = this;

    this.layer = 2;

    this.position = [0, 0];
    this.tilePosition = [0, 0];
    this.chunkPosition = [0, 0];
    this.velocity = [0, 0];
    this.bounds = [0, 0, 0, 0];

    this.viewBounds = [-15, -30, 15, 30];

    this.damage = {
        cooldown: 30,
        timer: 0
    };
    this.movement = {
        speed: 0,
        acceleration: 0,
        jumpForce: 0
    };
    this.wandering = {
        hRange: 15,
        vRange: 0.5,
        chance: 0.00125
    };
    this.targeting = {
        range: 0,
        chance: 0
    };
    this.stats = {
        life: 0,
        maxLife: 6,
        mana: 0,
        maxMana: 6,
        dexterity: 1,
        strength: 1,
        intelligence: 1
    };
    this.events = {
        collideBottom: function (self, data) {
            if (data.velocity[1] > 25) {

            } else if (data.velocity[1] > 5.5) {
                self.game.playSound("generic_step", 0.5, self.position, self.game.camera);
            }
        }
    };

    this.target;

    this.direction = 1;
    
    $.util.merge(this, data);
    $.util.merge(this, $.npcTypes[this.type]);
};
$.Npc.prototype = {
    start: function () {
        this.startType();
    },
    update: function (delta) {
        this.tilePosition = this.position.divide(20).floor();
        this.chunkPosition = this.tilePosition.divide(16).floor();

        this.isGrounded = false;
        this.isMoving = false;

        this.velocity[0] += this.world.gravity[0] * delta;
        this.velocity[0] = $.util.clamp(-40, this.velocity[0], 40);
        this.position[0] += this.velocity[0] * delta;
        $.physics.resolveTileCollisions(this, this.world, [this.velocity[0], 0]);
        this.velocity[1] += this.world.gravity[1] * delta;
        this.velocity[1] = $.util.clamp(-40, this.velocity[1], 40);
        this.position[1] += this.velocity[1] * delta;
        $.physics.resolveTileCollisions(this, this.world, [0, this.velocity[1]]);

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

        this.updateType(delta);
    },
    render: function (ctx, camera) {
        ctx.save();
        ctx.translate(this.position[0] - camera.position[0] + camera.width / 2, this.position[1] - camera.position[1] + camera.height / 2);
        if (this.game.showDebug) {
            for (var i = 0; i < this.colliders.length; i++) {
                var collider = this.colliders[i];
                ctx.strokeStyle = "hsla(0, 0%, 100%, 1)";
                ctx.lineWidth = 2;
                ctx.strokeRect(collider[0], collider[1], collider[2] - collider[0], collider[3] - collider[1]);
            }
            ctx.strokeStyle = "hsla(140, 100%, 50%, 1)";
            ctx.lineWidth = 2;
            ctx.strokeRect(this.bounds[0], this.bounds[1], this.bounds[2] - this.bounds[0], this.bounds[3] - this.bounds[1]);
            ctx.fillStyle = "hsla(0, 0%, 100%, 1)";
            ctx.font = "16px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "bottom";
            ctx.fillText(this.title, 0, this.bounds[1] - 10);
            // Destination
            if (this.destination) {
                ctx.strokeStyle = "hsla(240, 100%, 50%, 1)";
                ctx.strokeRect(this.destination[0] - this.position[0] - 10, this.destination[1] - this.position[1] - 10, 20, 20);
            }
        }
        ctx.scale(this.direction, 1);
        this.renderType(ctx);
        ctx.restore();
    },
    searchForTarget: function () {
        for (var i = 0; i < this.world.players.length; i++) {
            var player = this.world.players[i];
            if (Math.random() < this.tracking.chance && this.position.distance(player.position) < this.tracking.range) {
                this.target = player;
            }
        }
    },
    wander: function () {
        if (Math.random() < this.wandering.chance) {
            var newPosition = this.tilePosition.add([
                Math.round($.util.random(-this.wandering.hRange, this.wandering.hRange)),
                Math.round($.util.random(-this.wandering.vRange, this.wandering.vRange))
            ]);
            if (this.world.getTile(newPosition, 1).type === "air") {
                this.setDestination(newPosition.multiply(20));
            }
        }
    },
    setDestination: function (position) {
        this.destination = position;
    },
    resetDestination: function () {
        this.destination = undefined;
    },
    setTarget: function (object) {
        this.target = object;
    },
    resetTarget: function () {
        this.target = undefined;
    },
    callEvent: function (event, data) {
        if (this.events[event] != undefined) {
            this.events[event](this, data);
        }
    },
    applyDamage: function (amount) {
        if (this.damage.timer <= 0) {
            console.log(amount);
            if (amount > 2) {
                this.game.playSound("hurt_big", 1, this.position);
            } else {
                this.game.playSound("hurt_small", 1, this.position);
            }

            this.stats.life -= amount;

            this.damage.timer = this.damage.cooldown;

            if (this.stats.life <= 0) {
                this.destroy();
            }
        }
    },
    destroy: function () {
        this.world.removeNpc(this);
    }
};