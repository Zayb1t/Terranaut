$.Player = function (data) {
    var self = this;

    this.canvas = document.createElement("canvas");
    this.ctx = this.canvas.getContext("2d");

    this.canvas.width = 200;
    this.canvas.height = 200;

    this.layer = 2;

    this.title = "Player";

    this.position = [0, 0];
    this.tilePosition = [0, 0];
    this.chunkPosition = [0, 0];
    this.velocity = [0, 0];
    this.bounds = [0, 0, 0, 0];

    this.viewBounds = [-15, -30, 15, 30];

    this.colliders = [[-8, -18, 8, 20]];
    this.physics = { resolveCollisions: true, isStatic: false };
    this.spawnSpaces = [[0, 0], [0, -1], [0, -2]];

    this.movement = {
        speed: 0,
        acceleration: 0,
        jumpSpeed: 0,
        jumpHeight: 0,
        jumpTimer: 0
    };
    this.regeneration = {
        speed: 0,
        delay: 0
    };
    this.damage = {
        cooldown: 30,
        timer: 0
    };
    this.attack = {
        active: false,
        timer: 0
    };
    this.stats = {
        life: 0,
        maxLife: 24,
        mana: 0,
        maxMana: 10,
        dexterity: 1,
        strength: 1,
        intelligence: 1
    };
    this.bones = {
        leftArm: 0,
        leftLeg: 0,
        rightArm: 0,
        rightLeg: 0
    };
    this.events = {
        collideBottom: function (self, data) {
            if (data.velocity[1] > 25) {

            } else if (data.velocity[1] > 5.5) {
                self.game.playSound("generic_step", 0.5, self.position, self.game.camera);
            }
        }
    };
    this.effects = {
        lifeFlashTimer: 0,
        manaFlashTimer: 0
    };

    this.handItems = [-1, -1];

    // Bools
    this.invIsOpen = false;
    this.canTakeDamage = false;

    this.direction = 1;

    $.util.merge(this, data);
};
$.Player.prototype = {
    start: function () {
        this.stats.life = this.stats.maxLife;
        this.stats.mana = this.stats.maxMana;

        this.inventory = new $.Inventory({ game: this.game, owner: this });
        this.inventory.start();

        var axe = new $.Item({ type: "primitive_axe", count: 1 });
        this.inventory.collect(axe);

        var pickaxe = new $.Item({ type: "primitive_pickaxe", count: 1 });
        this.inventory.collect(pickaxe);

        var sword = new $.Item({ type: "primitive_sword", count: 1 });
        this.inventory.collect(sword);
    },
    update: function (delta) {
        this.tilePosition = this.position.divide(20).round(1);
        this.chunkPosition = this.tilePosition.divide(16).round(1);

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

        // Clamp stuff that needs clamping
        this.stats.life = $.util.clamp(0, this.stats.life, this.stats.maxLife);
        this.stats.mana = $.util.clamp(0, this.stats.mana, this.stats.maxMana);

        // Movement
        this.movement.speed = this.stats.dexterity * 4;
        this.movement.acceleration = this.stats.dexterity * 0.15;
        this.movement.jumpSpeed = this.stats.dexterity * 5;
        this.movement.jumpHeight = this.stats.dexterity * 20;

        if (this.game.keyDown(65)) {
            if (this.velocity[0] > -this.movement.speed) {
                if (this.velocity[0] > 0) {
                    this.velocity[0] -= this.velocity[0] * 0.5 * delta;
                }
                this.velocity[0] -= this.movement.acceleration;
            }
            this.direction = -1;
            this.isMoving = true;
        } else if (this.game.keyDown(68)) {
            if (this.velocity[0] < this.movement.speed) {
                if (this.velocity[0] < 0) {
                    this.velocity[0] -= this.velocity[0] * 0.5 * delta;
                }
                this.velocity[0] += this.movement.acceleration;
            }
            this.direction = 1;
            this.isMoving = true;
        } else {
            this.isMoving = false;
            this.velocity[0] -= this.velocity[0] * 0.5 * delta;
        }

        if (this.game.keyDown(32)) {
            if (this.isGrounded) {
                this.movement.jumpTimer = this.movement.jumpHeight;
                this.isGrounded = false;
                this.game.playSound("generic_jump", 0.5, this.position, this.game.camera);
            }
            if (this.movement.jumpTimer > 0) {
                this.movement.jumpTimer -= delta;
                this.velocity[1] = -this.movement.jumpSpeed;
            }
        } else {
            this.movement.jumpTimer = 0;
        }

        // Attacking
        if (this.game.buttonPressed(0)) {
            if (!this.attack.active) {
                this.attack.active = true;
                this.attack.timer = 20;
                this.world.applyDamageToNpcs(this, [this.position[0], this.position[1] - 10, this.position[0] + 20 * this.direction, this.position[1] + 10], 1);
            } 
        }

        if (this.attack.timer > 0) {
            this.attack.timer -= delta;
        } else {
            this.attack.active = false;
        }

        // Animations
        if (this.isMoving) {
            this.bones.leftLeg = Math.sin(this.position[0] * 0.05) * 0.3;
            this.bones.rightLeg = -Math.sin(this.position[0] * 0.05) * 0.3;
        } else {
            this.bones.leftLeg = this.bones.rightLeg = 0;
        }

        // Inventory
        this.inventory.update();

        if (this.game.keyPressed(9) || this.game.keyPressed(73)) {
            if (this.invIsOpen) {
                this.game.playSound("gui_close", 1, this.position, this.game.camera);
            } else {
                this.game.playSound("gui_open", 1, this.position, this.game.camera);
            }
            this.invIsOpen = !this.invIsOpen;
        }

        // Timers
        if (this.effects.lifeFlashTimer > 0) {
            this.effects.lifeFlashTimer -= delta;
        }
        if (this.effects.manaFlashTimer > 0) {
            this.effects.manaFlashTimer -= delta;
        }
        this.damage.timer -= delta;

        // Regeneration
        this.regeneration.speed = this.stats.strength * 0.001;
        this.regeneration.delay = 600 - this.stats.strength * 25;

        if (this.damage.timer < -this.regeneration.delay && this.stats.life < this.stats.maxLife) {
            this.stats.life += this.regeneration.speed;
        }
    },
    render: function (ctx, camera) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.save();
        this.ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
        if (this.game.showDebug) {
            for (var i = 0; i < this.colliders.length; i++) {
                var collider = this.colliders[i];
                this.ctx.strokeStyle = "hsla(0, 0%, 100%, 1)";
                this.ctx.lineWidth = 2;
                this.ctx.strokeRect(collider[0], collider[1], collider[2] - collider[0], collider[3] - collider[1]);
            }
            this.ctx.strokeStyle = "hsla(140, 100%, 50%, 1)";
            this.ctx.lineWidth = 2;
            this.ctx.strokeRect(this.bounds[0], this.bounds[1], this.bounds[2] - this.bounds[0], this.bounds[3] - this.bounds[1]);
            this.ctx.fillStyle = "hsla(0, 0%, 100%, 1)";
            this.ctx.font = "16px Arial";
            this.ctx.textAlign = "center";
            this.ctx.textBaseline = "bottom";
            this.ctx.fillText(this.title, 0, this.bounds[1] - 10);
        }
        this.ctx.scale(this.direction, 1);
        this.ctx.fillStyle = "hsla(0, 0%, 100%, 1)";
        this.ctx.strokeStyle = "hsla(0, 0%, 0%, 1)";
        this.ctx.lineWidth = 2;

        // Body
        this.ctx.beginPath();
        this.ctx.moveTo(-5, -2);
        this.ctx.lineTo(5, -2);
        this.ctx.lineTo(5, 10);
        this.ctx.lineTo(-5, 10);
        this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.fill();

        // Head
        this.ctx.beginPath();
        this.ctx.moveTo(-10, -20);
        this.ctx.lineTo(10, -20);
        this.ctx.lineTo(10, 0);
        this.ctx.lineTo(-10, 0);
        this.ctx.closePath();
        this.ctx.stroke();
        this.ctx.fill();
        this.ctx.fillStyle = "hsla(0, 0%, 0%, 0.2)";
        this.ctx.fillRect(-10, -4, 20, 4);

        // Face
        this.ctx.fillStyle = "hsla(0, 0%, 0%, 1)";
        this.ctx.fillRect(-4, -12, 4, 4);
        this.ctx.fillRect(4, -12, 4, 4);

        // Legs
        this.ctx.strokeStyle = "hsla(0, 0%, 0%, 1)";
        this.ctx.lineWidth = 2;

        this.ctx.beginPath();
        this.ctx.moveTo(-2, 10);
        this.ctx.lineTo(-2 + Math.sin(this.bones.leftLeg) * 10, 10 + Math.cos(this.bones.leftLeg) * 10);
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.moveTo(2, 10);
        this.ctx.lineTo(2 + Math.sin(this.bones.rightLeg) * 10, 10 + Math.cos(this.bones.rightLeg) * 10);
        this.ctx.stroke();
        this.ctx.restore();

        ctx.save();
        ctx.translate(this.position[0] - camera.position[0] + camera.width / 2, this.position[1] - camera.position[1] + camera.height / 2);
        if (this.stats.damageTimer > 0 && Math.sin(game.ct) > 0) {
            ctx.globalAlpha = 0.5;
        }
        ctx.drawImage(this.canvas, -this.canvas.width / 2, -this.canvas.height / 2);
        ctx.restore();

        if (this.invIsOpen) {
            this.inventory.render(ctx);
        }
    },
    applyDamage: function (amount) {
        if (this.damage.timer <= 0) {
            if (amount > 2) {
                this.game.playSound("hurt_big", 1, this.position);
            } else {
                this.game.playSound("hurt_small", 1, this.position);
            }

            this.stats.life -= amount;

            this.damage.timer = this.damage.cooldown;

            this.effects.lifeFlashTimer = 60;

            if (this.stats.life <= 0) {
                this.destroy();
            }
        }
    },
    destroy: function () {
        this.world.removePlayer(this);
    },
    callEvent: function (event, data) {
        if (this.events[event] != undefined) {
            this.events[event](this, data);
        }
    }
};