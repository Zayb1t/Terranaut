$.WorldGenerator = function (data) {
    var self = this;

    this.settings = {
        grassGrowthDepth: 16,

        caveChance: 0.005,
        caveDepth: 80,
        minCaveSize: 4,
        maxCaveSize: 6,
        minCaveLength: 50,
        maxCaveLength: 800
    };

    this.surface = {
        height: 300,
        scale: 0.05,
        amplitude: 24
    };

    this.mountain = {
        height: 350,
        position: 0.5
    };

    this.ores = [
        { type: "dirt", chance: 0.0003, minSize: 3, maxSize: 5, minDepth: 20, maxDepth: 32 },
        { type: "copper_ore", chance: 0.00025, minSize: 2, maxSize: 5, minDepth: 48, maxDepth: 256 }
    ];

    this.trees = [
        { type: "oak_tree", chance: 0.045 },
        { type: "spruce_tree", chance: 0.01 }
    ];

    $.util.merge(this, data);

    this.events = {};
};
$.WorldGenerator.prototype = {
    generateWorld: function (width, height) {
        var startTime = Date.now();

        this.setSize(width, height);

        this.biome = 0;
        this.biomes = [];
        for (var i in $.biomeTypes) {
            var newBiome = new $.Biome({ type: i });
            newBiome.start();
            this.biomes.push(newBiome);
        }

        // Vertices for noise
        var vertices = [];

        for (var i = 0; i < this.widthInTiles; i++) {
            vertices.push(Math.random());
        }

        // Generate terrain
        for (var c = 0; c < this.widthInTiles; c++) {
            var scaledI = c * this.surface.scale;
            var iFloor = Math.floor(scaledI);
            var t = scaledI - iFloor;
            var tRemapSmoothStep = t * t * (3 - 2 * t);

            var iMin = iFloor;
            var iMax = (iMin + 1);

            var surface = $.util.lerp(vertices[iMin], vertices[iMax], tRemapSmoothStep) * this.surface.amplitude + this.surface.height;

            // Temporary generator variables
            var dirtDepth = 20;

            for (var r = surface; r < this.heightInTiles; r++) {
                if (r > surface + dirtDepth) {
                    this.world.setTile([c, r], 0, "stone", {});
                    this.world.setTile([c, r], 1, "stone", {});
                } else if (r > surface) {
                    this.world.setTile([c, r], 0, "dirt", {});
                    this.world.setTile([c, r], 1, "dirt", {});
                }
            }
        }

        // Generate the mountain
        var mountainNoise = $.util.noise(this.widthInTiles, 0.15);
        var mountainNoiseAmplitude = 10;
        var mountainHalfWidth = 128;
        var mountainIncline = 2;
        var baseSurface = 0;

        for (var c = this.widthInTiles / 2 - mountainHalfWidth; c < this.widthInTiles / 2 + mountainHalfWidth; c++) {
            if (c < this.widthInTiles / 2) {
                baseSurface -= mountainIncline;
            } else {
                baseSurface += mountainIncline;
            }

            var surfaceNode = mountainNoise[c] * mountainNoiseAmplitude;
            var surface = this.mountain.height + baseSurface + surfaceNode;

            for (var r = surface; r < this.heightInTiles; r++) {
                var dirtDepth = 0;
                if (r > this.surface.height && surfaceNode > mountainIncline * 2) {
                    dirtDepth = 4;
                }
                if (r > surface + dirtDepth) {
                    this.world.setTile([c, r], 0, "stone", {});
                    this.world.setTile([c, r], 1, "stone", {});
                } else if (r > surface) {
                    this.world.setTile([c, r], 0, "dirt", {});
                    this.world.setTile([c, r], 1, "dirt", {});
                }
            }
        }

        // Plants and ores
        for (var c = 0; c < this.widthInTiles; c++) {
            for (var r = 0; r < this.heightInTiles; r++) {
                var tile = this.world.getTile([c, r], 1);
                if (tile.type === "dirt") {
                    if (this.world.getTile([c, r - 1], 0).type === "air") {
                        for (var i = 0; i < this.trees.length; i++) {
                            var tree = this.trees[i];
                            if (Math.random() < tree.chance) {
                                var tree = new $.Object({ game: this.game, world: this.world, type: tree.type });
                                tree.start();
                                tree.position = [c * 20, (r - 1) * 20 + 10];
                                if (this.world.getTile([c - 1, r - 1], 1).type != "air") {
                                    tree.angle += 0.1;
                                } else if (this.world.getTile([c + 1, r - 1], 1).type != "air") {
                                    tree.angle -= 0.1;
                                }
                                this.world.addObject(tree);
                            }
                        }
                    }
                    if (this.world.getTile([c, r - 1], 1).type === "air") {
                        tile.hasGrass = true;
                    }
                }
            }
        }

        // Calculate time taken
        var endTime = Date.now();
        var timeTaken = endTime - startTime;

        console.log("Generated new world in " + timeTaken + "ms");
    },
    generateTestingWorld: function (width, height) {
        var startTime = Date.now();

        this.setSize(width, height);

        for (var i = 0; i < this.widthInTiles; i++) {
            this.world.setTile([i, 0], 1, "stone", {});
        }
        for (var i = 0; i < this.widthInTiles; i++) {
            this.world.setTile([i, this.heightInTiles - 1], 1, "stone", {});
        }
        for (var i = 0; i < this.heightInTiles; i++) {
            this.world.setTile([0, i], 1, "stone", {});
        }
        for (var i = 0; i < this.heightInTiles; i++) {
            this.world.setTile([this.widthInTiles - 1, i], 1, "stone", {});
        }

        // Calculate time taken
        var endTime = Date.now();
        var timeTaken = endTime - startTime;

        console.log("Generated new testing world in " + timeTaken + "ms");
    },
    update: function (delta) {
        
    },
    render: function (ctx) {
        ctx.save();
        ctx.translate(this.game.canvas.width / 2, this.game.canvas.height / 2);
        ctx.font = "20px Terranaut";
        ctx.textAlign = "center";
        ctx.textBaseline = "bottom";
        ctx.fillStyle = "hsla(0, 0%, 100%, 1)";
        ctx.fillText("Building World: " + Math.floor(this.progress * 100) + "%", 0, -22);
        ctx.restore();
    },
    callEvent: function (event, data) {
        if (this.events[event] != undefined) {
            this.events[event](this, data);
        }
    },
    setSize: function (width, height) {
        this.widthInChunks = width;
        this.heightInChunks = height;

        this.widthInTiles = this.widthInChunks * 16;
        this.heightInTiles = this.heightInChunks * 16;

        this.world.setSize(width, height);
    }
};