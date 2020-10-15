$.npcTypes = {
    "zombie": {
        title: "Zombie",
        startType: function () {
            this.colliders = [[-8, -18, 8, 20]];
            this.physics = { resolveCollisions: true };
            this.spawnSpaces = [[0, 0], [0, -1]];

            this.bones = {
                leftArm: 0,
                leftLeg: 0,
                rightArm: 0,
                rightLeg: 0
            };
            this.tracking = {
                range: 150,
                chance: 0.1,
                forgetRange: 0
            };
        },
        updateType: function (delta) {
            this.movement.speed = 0;
            this.movement.acceleration = 0;
            this.movement.jumpForce = 0;

            this.movement.speed += this.stats.dexterity;
            this.movement.acceleration += this.stats.dexterity * 0.1;
            this.movement.jumpForce += this.stats.dexterity * 5;

            // Search for a target or move towards the target
            if (this.target === undefined) {
                this.searchForTarget();
            } else {
                this.destination = this.target.position;

                if (this.tracking.distance < 20) {
                    this.target.applyDamage(1);
                }
            }

            if (this.destination != undefined) {
                this.tracking.distance = this.position.distance(this.destination);

                if (this.destination[0] < this.position[0]) {
                    if (this.velocity[0] > -this.movement.speed) {
                        this.velocity[0] -= this.movement.acceleration;
                    }
                    this.direction = -1;
                    this.isMoving = true;
                } else {
                    if (this.velocity[0] < this.movement.speed) {
                        this.velocity[0] += this.movement.acceleration;
                    }
                    this.direction = 1;
                    this.isMoving = true;
                }

                if (this.tracking.distance > this.tracking.forgetRange || this.tracking.distance < 25) {
                    this.resetDestination();
                }
            } else {
                this.wander();
            }

            if (!this.isMoving) {
                this.velocity[0] -= this.velocity[0] * 0.5 * delta;
            }

            // Animations
            if (this.isMoving) {
                this.bones.leftLeg = Math.sin(this.position[0] * 0.05) * 0.3;
                this.bones.rightLeg = -Math.sin(this.position[0] * 0.05) * 0.3;
            } else {
                this.bones.leftLeg = this.bones.rightLeg = 0;
            }
        },
        renderType: function (ctx) {
            ctx.fillStyle = "hsla(120, 50%, 35%, 1)";
            ctx.strokeStyle = "hsla(0, 0%, 0%, 1)";
            ctx.lineWidth = 2;

            // Body
            ctx.beginPath();
            ctx.moveTo(-5, -2);
            ctx.lineTo(5, -2);
            ctx.lineTo(5, 10);
            ctx.lineTo(-5, 10);
            ctx.closePath();
            ctx.stroke();
            ctx.fill();

            // Head
            ctx.beginPath();
            ctx.moveTo(-6, -18);
            ctx.lineTo(14, -18);
            ctx.lineTo(14, 2);
            ctx.lineTo(-6, 2);
            ctx.closePath();
            ctx.stroke();
            ctx.fill();
            ctx.fillStyle = "hsla(0, 0%, 0%, 0.2)";
            ctx.fillRect(-7, -2, 20, 4);

            // Face
            ctx.fillStyle = "hsla(0, 0%, 0%, 1)";
            if (this.target === undefined) {
                ctx.fillRect(0, -8, 4, 2);
                ctx.fillRect(8, -8, 4, 2);
            } else {
                ctx.fillRect(0, -10, 4, 4);
                ctx.fillRect(8, -10, 4, 4);
            }

            // Legs
            ctx.strokeStyle = "hsla(0, 0%, 0%, 1)";
            ctx.lineWidth = 2;

            ctx.beginPath();
            ctx.moveTo(-2, 10);
            ctx.lineTo(-2 + Math.sin(this.bones.leftLeg) * 10, 10 + Math.cos(this.bones.leftLeg) * 10);
            ctx.stroke();

            ctx.beginPath();
            ctx.moveTo(2, 10);
            ctx.lineTo(2 + Math.sin(this.bones.rightLeg) * 10, 10 + Math.cos(this.bones.rightLeg) * 10);
            ctx.stroke();
        }
    }
};