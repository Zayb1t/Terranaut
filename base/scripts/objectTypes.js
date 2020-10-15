$.objectTypes = {
    "magic_lantern": {
        title: "Magic Lantern",
        startType: function () {
            this.material = {
                catagoryType: "metal",
                catagory: "stone",
                durability: 0.1
            };
        },
        updateType: function () {
            // Fancy particles
            this.world.addParticleEmitter(new $.ParticleEmitter({
                game: this.game,
                world: this.world,
                position: [this.position[0], this.position[1] - 75],
                fillStyles: ["hsla(240, 90%, 85%, 1)"],
                minCount: -10,
                maxCount: 1,
                minDeltaAngle: -0.1,
                maxDeltaAngle: 0.1,
                minDeltaSpeed: -0.01,
                maxDeltaSpeed: -0.01,
                minDeltaSize: -0.01,
                maxDeltaSize: -0.01
            }));
        },
        renderType: function (ctx) {
            ctx.fillStyle = "hsla(0, 0%, 5%, 1)";
            // Main pillar thing
            ctx.beginPath();
            ctx.moveTo(-15, 0);
            ctx.lineTo(15, 0);
            ctx.lineTo(12, -60);
            ctx.lineTo(-12, -60);
            ctx.closePath();
            ctx.fill();
            // Glowy bit
            ctx.fillStyle = "hsla(240, 85%, 55%, 0.5)";
            ctx.fillRect(-11, -90, 22, 30);
            ctx.fillStyle = "hsla(240, 90%, 85%, 1)";
            ctx.beginPath();
            ctx.arc(0, -75, 4 + Math.sin(this.game.ct / 10) * 2, 0, Math.PI * 2);
            ctx.fill();
            // Fancy bits
            ctx.fillStyle = "hsla(0, 0%, 5%, 1)";
            ctx.strokeStyle = ctx.fillStyle;
            ctx.lineCap = "round";
            ctx.lineWidth = 8;
            ctx.beginPath();
            ctx.moveTo(-13, -60);
            ctx.lineTo(13, -60);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(-13, -90);
            ctx.lineTo(13, -90);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(0, -94, 6, Math.PI, Math.PI * 2);
            ctx.fill();
        }
    },
    "rock": {
        title: "Rock",
        startType: function () {
            this.physics.isStatic = false;
            this.colliders = [[-5, -10, 5, 0]];
            this.material = {
                catagoryType: "earth",
                catagory: "stone",
                durability: 0.1
            };
            this.vertices = [[-8, 0], [8, 0], [$.util.random(7, 2), $.util.random(-12, -8)], [$.util.random(-7, -2), $.util.random(-12, -8)]];
        },
        updateType: function () {

        },
        renderType: function (ctx) {
            ctx.fillStyle = "hsla(0, 0%, 20%, 1)";
            ctx.strokeStyle = "hsla(0, 0%, 0%, 1)";
            ctx.lineWidth = 2;

            ctx.beginPath();
            ctx.moveTo(this.vertices[0][0], this.vertices[0][1]);
            for (var i = 1; i < this.vertices.length; i++) {
                ctx.lineTo(this.vertices[i][0], this.vertices[i][1]);
            }
            ctx.closePath();
            ctx.stroke();
            ctx.fill();
        }
    },
    "spruce_tree": {
        title: "Spruce Tree",
        startType: function () {
            this.supportTiles = [[0, 1]];
            this.material = {
                catagoryType: "organic",
                catagory: "wood",
                durability: 3.8
            };
            this.stats = {
                height: $.util.random(140, 200),
                leafColor: "hsla(140, 70%, 35%, 1)"
            };
            this.loot = [
                { item: "spruce_wood", minCount: Math.floor(this.stats.height / 20), maxCount: Math.floor(this.stats.height / 20), chance: 1 }
            ];
        },
        updateType: function () {
            if (this.isBroken) {
                if (this.angle > 0) {
                    this.deltaAngle += 0.001;
                } else {
                    this.deltaAngle -= 0.001;
                }

                if (Math.abs(this.angle) > Math.PI / 2) {
                    this.destroy();
                }
            }
        },
        renderType: function (ctx) {
            ctx.save();
            ctx.rotate(Math.sin(this.game.ct * 0.005) * 0.05);

            ctx.fillStyle = "hsla(67, 18%, 15%, 1)";
            ctx.strokeStyle = "hsla(0, 0%, 0%, 1)";
            ctx.lineWidth = 2;

            ctx.beginPath();
            ctx.moveTo(-10, 0);
            ctx.lineTo(-8, -10);
            ctx.lineTo(-8, -10 - this.stats.height);
            ctx.lineTo(8, -10 - this.stats.height);
            ctx.lineTo(8, -10);
            ctx.lineTo(10, 0);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = this.stats.leafColor;
            ctx.lineWidth = 4;

            ctx.beginPath();
            for (var i = -40; i > -40 - this.stats.height; i -= 30) {
                var offset = Math.sin((this.game.ct + i) * 0.02) * 2;
                ctx.moveTo(-60 - (i / 15) + offset, i);
                ctx.lineTo(offset, i - 50);
                ctx.lineTo(60 + (i / 15) + offset, i);
                ctx.closePath();
            }
            ctx.stroke();
            ctx.fill();

            ctx.restore();
        }
    },
    "oak_tree": {
        title: "Oak Tree",
        startType: function () {
            this.supportTiles = [[0, 1]];
            this.material = {
                catagoryType: "organic",
                catagory: "wood",
                durability: 4.5
            };
            this.stats = {
                height: $.util.random(140, 200),
                leafColor: "hsla(140, 70%, 40%, 1)",
                leaves: []
            };
            this.loot = [
                { item: "oak_wood", minCount: Math.floor(this.stats.height / 20), maxCount: Math.floor(this.stats.height / 20), chance: 1 }
            ];

            for (var i = 0; i < 5; i++) {
                this.stats.leaves.push([$.util.random(-15, 15), $.util.random(-this.stats.height - 30, -this.stats.height), $.util.random(40, 60)]);
            }
        },
        updateType: function () {
            if (this.isBroken) {
                if (this.angle > 0) {
                    this.deltaAngle += 0.001;
                } else {
                    this.deltaAngle -= 0.001;
                }

                if (Math.abs(this.angle) > Math.PI / 2) {
                    this.world.dropLoot(this.position, this.loot);
                    this.destroy();
                }
            }
        },
        renderType: function (ctx) {
            ctx.save();
            ctx.rotate(Math.sin(this.game.ct * 0.005) * 0.05);

            ctx.fillStyle = "hsla(67, 18%, 15%, 1)";
            ctx.strokeStyle = "hsla(0, 0%, 0%, 1)";
            ctx.lineWidth = 2;

            ctx.beginPath();
            ctx.moveTo(-10, 2);
            ctx.lineTo(-8, -10);
            ctx.lineTo(-8, -10 - this.stats.height);
            ctx.lineTo(8, -10 - this.stats.height);
            ctx.lineTo(8, -10);
            ctx.lineTo(10, 2);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = this.stats.leafColor;
            ctx.lineWidth = 4;

            ctx.beginPath();
            for (var i = 0; i < this.stats.leaves.length; i++) {
                var leaf = this.stats.leaves[i];
                var offset = leaf[0] + Math.sin((this.game.ct + i) * 0.005) * 4;
                ctx.moveTo(leaf[0] + offset, leaf[1]);
                ctx.arc(leaf[0] + offset, leaf[1], leaf[2], 0, Math.PI * 2);
            }
            ctx.stroke();
            ctx.fill();

            ctx.restore();
        }
    }
};