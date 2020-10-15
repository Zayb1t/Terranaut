$.World = function (data) {
    this.gravity = [0, 0.5];

    this.players = [];
    this.npcs = [];
    this.objects = [];
    this.loot = [];
    this.particleemitters = [];

    this.chunks = [];
    this.tiles = [];
    this.lightMap = [];

    this.layers = [];

    this.skyColor = "hsla(240, 75%, 65%, 1)";

    $.util.merge(this, data);

    this.setSize(8, 8);

    this.particleCount = 0;

    this.chunkUpdates = 0;
    this.chunkUpdatesCooldown = 0;

    for (var cc = 0; cc < this.widthInChunks; cc++) {
        for (var cr = 0; cr < this.heightInChunks; cr++) {
            var newChunk = new $.Chunk({ game: this.game, world: this });
            this.setChunk([cc, cr], newChunk);
        }
    }

    for (var tc = 0; tc < this.widthInChunks * 16; tc++) {
        for (var tr = 0; tr < this.heightInChunks * 16; tr++) {
            for (var l = 0; l < 2; l++) {
                this.setTile([tc, tr], l, "air", {});
            }
        }
    }

    for (var tc = 0; tc < this.widthInChunks * 16; tc++) {
        this.lightMap[tc] = {};
        for (var tr = 0; tr < this.heightInChunks * 16; tr++) {
            this.setLightLevel([tc, tr], 1);
        }
    }
};
$.World.prototype = {
    start: function () {
        
    },
    update: function (delta) {
        for (var i = 0; i < this.npcs.length; i++) {
            var npc = this.npcs[i];
            npc.update(delta);
        }

        for (var i = 0; i < this.players.length; i++) {
            var player = this.players[i];
            player.update(delta);
        }

        for (var i = 0; i < this.objects.length; i++) {
            var object = this.objects[i];
            if (this.game.camera.isInView(object)) {
                object.update(delta);
            }
        }

        for (var i = 0; i < this.loot.length; i++) {
            var loot = this.loot[i];
            loot.update(delta);
        }

        this.particleCount = 0;
        for (var i = 0; i < this.particleemitters.length; i++) {
            var particleemitter = this.particleemitters[i];
            particleemitter.update(delta);
            this.particleCount += particleemitter.particles.length;
        }

        if (this.chunkUpdatesCooldown > 0) {
            this.chunkUpdatesCooldown -= delta;
        } else {
            this.chunkUpdates = 0;
            this.chunkUpdatesCooldown = 100;
        }

        var range = [3, 3];
        for (var c = 0; c < range[0] * 2; c++) {
            for (var r = 0; r < range[1] * 2; r++) {
                var chunk = this.getChunk([this.game.player.chunkPosition[0] - range[0] + c, this.game.player.chunkPosition[1] - range[1] + r]);
                if (chunk === undefined) {
                    continue;
                }
                if (chunk.mustUpdateTiles) {
                    this.chunkUpdates++;
                }
                chunk.update(delta);
            }
        }
    },
    render: function (ctx, camera) {
        ctx.fillStyle = this.skyColor;
        ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        this.resetLayers();

        var range = [3, 3];
        for (var c = 0; c < range[0] * 2; c++) {
            for (var r = 0; r < range[1] * 2; r++) {
                var chunk = this.getChunk([this.game.player.chunkPosition[0] - range[0] + c, this.game.player.chunkPosition[1] - range[1] + r]);
                if (chunk === undefined) {
                    continue;
                }
                this.addToLayer(chunk.layer, chunk);
            }
        }

        for (var i = 0; i < this.npcs.length; i++) {
            var npc = this.npcs[i];
            if (camera.isInView(npc)) {
                this.addToLayer(npc.layer, npc);
            }
        }

        for (var i = 0; i < this.players.length; i++) {
            var player = this.players[i];
            if (camera.isInView(player)) {
                this.addToLayer(player.layer, player);
            }
        }

        for (var i = 0; i < this.objects.length; i++) {
            var object = this.objects[i];
            if (camera.isInView(object)) {
                this.addToLayer(object.layer, object);
            }
        }

        for (var i = 0; i < this.loot.length; i++) {
            var loot = this.loot[i];
            if (camera.isInView(loot)) {
                this.addToLayer(loot.layer, loot);
            }
        }

        for (var i = 0; i < this.particleemitters.length; i++) {
            var particleemitter = this.particleemitters[i];
            if (camera.isInView(particleemitter)) {
                this.addToLayer(particleemitter.layer, particleemitter);
            }
        }

        this.renderLayers(ctx, camera);
    },
    // Chunk
    setChunk: function (position, chunk) {
        var address = position[0] + position[1] * this.widthInChunks;

        chunk.chunkPosition = position;
        chunk.position = position.multiply(16 * 20);
        chunk.tilePosition = position.multiply(16);
        this.chunks[address] = chunk;
    },
    getChunk: function (position) {
        var address = position[0] + position[1] * this.widthInChunks;

        return this.chunks[address];
    },
    updateChunk: function (position) {
        this.getChunk(position).checkUpdate = true;
    },
    // Tile
    setTile: function (position, layer, type, data) {
        var position = position.round(1);

        var address = position[0] + position[1] * this.widthInTiles;

        if (this.tiles[layer] === undefined) {
            this.tiles[layer] = {};
        }
        var tileData = {
            game: this.game,
            world: this,
            type: type,
            layer: layer,
            tilePosition: position,
            position: position.multiply(20),
            chunkPosition: position.divide(16).floor()
        };
        $.util.merge(tileData, data);
        var tile = new $.Tile(tileData);
        tile.start();
        this.tiles[layer][address] = tile;
        var chunk = this.getChunk(tile.chunkPosition);
        if (chunk != undefined) {
            chunk.mustUpdateTiles = true;
        }
    },
    getTile: function (position, layer) {
        var col = $.util.clamp(0, position[0], this.widthInChunks * 16);
        var row = $.util.clamp(0, position[1], this.heightInChunks * 16);

        var address = col + row * this.widthInTiles;

        if (this.tiles[layer] != undefined && this.tiles[layer][address] != undefined) {
            return this.tiles[layer][address];
        }
        return new $.Tile({ game: this.game, world: this, type: "air" });
    },
    // Npc
    addNpc: function (npc) {
        npc.start();
        this.npcs.push(npc);
    },
    removeNpc: function (npc) {
        this.npcs.splice(this.npcs.indexOf(npc), 1);
    },
    // Player
    addPlayer: function (player) {
        this.players.push(player);
    },
    removePlayer: function (player) {
        this.players.splice(this.players.indexOf(player), 1);
    },
    // Object
    addObject: function (object) {
        object.start();
        this.objects.push(object);
    },
    removeObject: function (object) {
        this.objects.splice(this.objects.indexOf(object), 1);
    },
    // ParticleEmitter
    addParticleEmitter: function (particleemitter) {
        particleemitter.start();
        this.particleemitters.push(particleemitter);
    },
    removeParticleEmitter: function (particleemitter) {
        this.particleemitters.splice(this.particleemitters.indexOf(particleemitter), 1);
    },
    // Loot
    addLoot: function (loot) {
        this.loot.push(loot);
    },
    removeLoot: function (object) {
        this.loot.splice(this.loot.indexOf(loot), 1);
    },
    dropLoot: function (position, loot) {
        for (var i = 0; i < loot.length; i++) {
            if (Math.random() < loot[i].chance) {
                this.addLoot(new $.Loot({ game: this.game, world: this, item: new $.Item({ game: this.game, world: this, type: loot[i].item }), count: $.util.random(loot[i].minCount, loot[i].maxCount) }));
            }
        }
    },
    // Light
    getLightLevel: function (position) {
        var address = position[0] + position[1] * this.widthInTiles;

        return this.lightMap[address];
    },
    setLightLevel: function (position, level) {
        var address = position[0] + position[1] * this.widthInTiles;

        this.lightMap[address] = level;
    },
    // Spawning
    getValidSpawnPoint: function (object) {
        var c = this.widthInTiles / 2;
        for (var r = 0; r < this.heightInTiles; r++) {
            if (this.getTile([c, r], 1).isOpaque) {
                if (this.isValidSpawn([c, r - 1], object)) {
                    return [c * 20, (r - 1) * 20];
                }
            }
        }
        return [0, 0];
    },
    isValidSpawn: function (position, object) {
        var canSpawn = true;
        for (var i = 0; i < object.spawnSpaces.length; i++) {
            var spawnSpace = object.spawnSpaces[i];
            var tilePosition = [position[0] + spawnSpace[0], position[1] + spawnSpace[1]];
            if (this.getTile(tilePosition, 1).isOpaque && this.getTile(tilePosition, 0).isOpaque && false) {
                canSpawn = false;
                continue;
            }
        }
        return canSpawn;
    },
    // Render Layers
    resetLayers: function () {
        this.layers = [];
    },
    addToLayer: function (layer, object) {
        if (this.layers[layer] === undefined) {
            this.layers[layer] = [];
        }
        this.layers[layer].push(object);
    },
    renderLayers: function (ctx, camera) {
        for (var l = 0; l < this.layers.length; l++) {
            if (this.layers[l] === undefined) {
                this.layers[l] = [];
            }
            var layer = this.layers[l];
            for (var i = 0; i < layer.length; i++) {
                layer[i].render(ctx, camera);
            }
        }
    },
    // Size
    setSize: function (width, height) {
        this.widthInChunks = width;
        this.heightInChunks = height;

        this.widthInTiles = this.widthInChunks * 16;
        this.heightInTiles = this.heightInChunks * 16;

        this.widthInPixels = this.widthInTiles * 20;
        this.heightInPixels = this.heightInTiles * 20;
    },
    // Damage
    applyDamageToNpcs: function (attacker, rect, amount) {
        for (var i = 0; i < this.npcs.length; i++) {
            var npc = this.npcs[i];
            if ($.physics.checkCollision(attacker, rect, npc, npc.bounds)) {
                npc.applyDamage(amount);
            }
        }
    }
};