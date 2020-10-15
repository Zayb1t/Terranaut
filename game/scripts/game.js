$.Game = function () {
    var startTime = Date.now();

    var self = this;

    this.body = document.getElementById("game");

    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");

    this.body.style.width = this.canvas.width = window.innerWidth;
    this.body.style.height = this.canvas.height = window.innerHeight;

    this.mmCanvas = document.createElement("canvas");
    this.mmCtx = this.mmCanvas.getContext("2d");

    this.settings = {
        enableFrameSkip: true
    };

    this.isPaused = true;
    this.isPlaying = false;

    this.dt = 0;
    this.lt = Date.now();
    this.ct = 0;

    this.mouse = {};
    this.keys = {};
    this.cursor = [];

    window.addEventListener('blur', function () {
        //self.isPaused = true;
    });
    window.addEventListener('resize', function () {
        self.body.style.width = self.canvas.width = window.innerWidth;
        self.body.style.height = self.canvas.height = window.innerHeight;
    });
    window.addEventListener('mousemove', function (event) {
        self.cursor = [
            event.pageX,
            event.pageY
        ];
    });
    window.addEventListener('mousedown', function (event) {
        self.buttonExists(event.button);
        if (!self.mouse[event.button].down) {
            self.mouse[event.button].down = true;
            self.mouse[event.button].changed = true;
        }
    });
    window.addEventListener('mouseup', function (event) {
        self.buttonExists(event.button);
        if (self.mouse[event.button].down) {
            self.mouse[event.button].down = false;
            self.mouse[event.button].changed = true;
        }
    });
    window.addEventListener('keydown', function (event) {
        self.keyExists(event.keyCode);
        if (!self.keys[event.keyCode].down) {
            self.keys[event.keyCode].down = true;
            self.keys[event.keyCode].changed = true;
        }
    });
    window.addEventListener('keyup', function (event) {
        self.keyExists(event.keyCode);
        if (self.keys[event.keyCode].down) {
            self.keys[event.keyCode].down = false;
            self.keys[event.keyCode].changed = true;
        }
    });

    this.showDebug = false;

    this.sounds = {};
    for (var i = 0; i < $.sounds.length; i++) {
        this.loadSound($.sounds[i]);
    }

    // Menus
    this.buttons = [];

    this.menus = {
        "playing": {
            start: function () { },
            update: function (delta) { },
            render: function (ctx) { }
        },
        "main": {
            start: function () {
                self.buttons.push(new $.Button({
                    game: self,
                    position: [0.5, 0.5],
                    offset: [0, 0],
                    width: 200,
                    height: 30,
                    title: "Start testing world",
                    events: {
                        "onClick": function (self) {
                            self.game.startTestingWorld();
                        }
                    }
                }));
            },
            update: function (delta) {

            },
            render: function (ctx) {
                ctx.fillStyle = "hsla(0, 0%, 100%, 1)";
                ctx.textAlign = "center";
                ctx.textBaseline = "bottom";
                ctx.font = "40px Terranaut";
                ctx.fillText("Terranaut", self.canvas.width / 2, self.canvas.height / 2 - 200);
            }
        }
    };

    // Calculate time taken
    var endTime = Date.now();
    var timeTaken = endTime - startTime;
    
    console.log("Game initialized in " + timeTaken + "ms");

    this.startTestingWorld();
};
$.Game.prototype = {
    update: function () {
        var now = Date.now();
        if (this.settings.enableFrameSkip) {
            this.dt = (now - this.lt) / (1000 / 60);
        } else {
            this.dt = 0.5;
        }
        this.lt = now;
        this.ct += this.dt;

        if (this.isPlaying && !this.isPaused) {
            this.camera.width = this.canvas.width;
            this.camera.height = this.camera.height;

            this.camera.position[0] = this.player.position[0];
            this.camera.position[1] = this.player.position[1];

            this.world.update(this.dt);
            this.camera.update(this.dt);
        }

        if (this.keyPressed(192)) {
            this.showDebug = !this.showDebug;
        }

        if (this.keyPressed(27)) {
            this.isPaused = !this.isPaused;
        }

        // Update menus
        this.menus[this.menu].update(this.dt);

        for (var i = 0; i < this.buttons.length; i++) {
            this.buttons[i].update(this.dt);
        }
    },
    render: function () {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        if (this.isPlaying) {
            this.world.render(this.ctx, this.camera);
        }

        if (this.player) {
            this.renderPlayerHUD(this.ctx);
        }

        if (this.isPlaying && this.isPaused) {
            this.ctx.fillStyle = "hsla(0, 0%, 0%, 0.5)";
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            this.ctx.fillStyle = "hsla(0, 0%, 100%, 1)";
            this.ctx.font = "24px Terranaut";
            this.ctx.textAlign = "center";
            this.ctx.textBaseline = "center";
            this.ctx.fillText("[ Paused ]", this.canvas.width / 2, this.canvas.height / 2);
        }

        this.menus[this.menu].render(this.ctx);

        for (var i = 0; i < this.buttons.length; i++) {
            this.buttons[i].render(this.ctx);
        }

        if (this.showDebug) {
            this.ctx.fillStyle = "hsla(0, 0%, 100%, 1)";
            this.ctx.font = "16px Terranaut";
            this.ctx.textAlign = "center";
            this.ctx.textBaseline = "top";
            this.ctx.fillText("Delta: " + Math.round(this.dt / 0.01) * 0.01, this.canvas.width / 2, 2);
            this.ctx.fillText("Tile: " + this.player.tilePosition, this.canvas.width / 2, 20);
            this.ctx.fillText("Velocity: " + this.player.velocity.round(1), this.canvas.width / 2, 38);
            this.ctx.fillText("Chunk Updates: " + this.world.chunkUpdates, this.canvas.width / 2, 60);
            this.ctx.fillText("Particles: " + this.world.particleCount, this.canvas.width / 2, 78);
            //this.renderMiniMap();
            this.ctx.restore();
        }
    },
    resetInputs: function () {
        for (var b in this.mouse) {
            this.mouse[b].changed = false;
        }
        for (var k in this.keys) {
            this.keys[k].changed = false;
        }
    },
    keyExists: function (key) {
        if (this.keys[key] === undefined) {
            this.keys[key] = {};
        }
    },
    keyPressed: function (key) {
        this.keyExists(key);
        return this.keys[key].changed && this.keys[key].down;
    },
    keyReleased: function (key) {
        this.keyExists(key);
        return this.keys[key].changed && !this.keys[key].down;
    },
    keyDown: function (key) {
        this.keyExists(key);
        return this.keys[key].down;
    },
    buttonExists: function (button) {
        if (this.mouse[button] === undefined) {
            this.mouse[button] = {};
        }
    },
    buttonPressed: function (button) {
        this.buttonExists(button);
        return this.mouse[button].changed && this.mouse[button].down;
    },
    buttonReleased: function (button) {
        this.buttonExists(button);
        return this.mouse[button].changed && !this.mouse[button].down;
    },
    buttonDown: function (button) {
        this.buttonExists(button);
        return this.buttons[button].down;
    },
    playSound: function (title, gain, source) {
        if (this.sounds[title] === undefined) {
            console.error("No sound with title " + title);
            return;
        }
        if (source === undefined) {
            this.sounds[title].play(gain);
            return;
        }
        var volume = 1 - source.distance(this.camera.position) / 1000;
        if (volume < 0) {
            volume = 0;
        }
        this.sounds[title].play(volume * gain);
    },
    loadSound: function (sound) {
        this.sounds[sound.title] = new $.AudioClip(sound);
    },
    renderMiniMap: function () {
        var mapWidth = 400;
        var mapHeight = 400;
        this.ctx.fillStyle = "hsla(0, 0%, 0%, 1)";
        this.ctx.fillRect(this.canvas.width - mapWidth, 0, mapWidth, mapHeight);
        this.ctx.drawImage(this.mmCanvas, (this.camera.position[0] - this.camera.width) / (this.world.widthInPixels / this.mmCanvas.width), (this.camera.position[1] - this.camera.height) / (this.world.heightInPixels / this.mmCanvas.height), mapWidth, mapHeight, this.canvas.width - mapWidth, 0, mapWidth, mapHeight);
        this.ctx.fillStyle = "hsla(240, 100%, 50%, 1)";
        this.ctx.save();
        this.ctx.translate(this.canvas.width - mapWidth - 5 + this.player.position[0] / (this.world.widthInPixels / this.mmCanvas.width), 5 + this.player.position[1] / (this.world.heightInPixels / this.mmCanvas.height));
        this.ctx.beginPath();
        this.ctx.moveTo(-3, -6);
        this.ctx.lineTo(3, -6);
        this.ctx.lineTo(0, 0);
        this.ctx.fill();
    },
    renderMiniMapImage: function () {
        this.mmCanvas.width = this.world.widthInChunks * 16;
        this.mmCanvas.height = this.world.heightInChunks * 16;
        this.mmCtx.clearRect(0, 0, this.mmCanvas.width, this.mmCanvas.height);
        for (var tc = 0; tc < this.world.widthInChunks * 16; tc++) {
            for (var tr = 0; tr < this.world.heightInChunks * 16; tr++) {
                var tile = this.world.getTile([tc, tr], 1);
                if (tile != undefined) {
                    this.mmCtx.fillStyle = tile.mapColor;
                    this.mmCtx.fillRect(tc, tr, 1, 1);
                }
            }
        }
    },
    cursorIsOver: function (x, y, w, h) {
        return (this.cursor[0] > x && this.cursor[0] < x + w && this.cursor[1] > y && this.cursor[1] < y + h);
    },
    renderPlayerHUD: function (ctx) {
        var currentLife = this.player.stats.life;
        var maxLife = this.player.stats.maxLife;
        for (var x = 0; x < maxLife / 2; x++) {
            var life = (x * 2) + 1;
            var position = [15 + x * 22, 15];
            ctx.strokeStyle = "rgba(0, 0, 0, 1)";
            if (this.player.effects.lifeFlashTimer > 0) {
                if (Math.sin(this.ct / 4) > 0) {
                    ctx.strokeStyle = "rgba(255, 255, 255, 1)";
                }
            }
            ctx.fillStyle = "rgba(20, 20, 20, 1)";
            $.util.renderIcon(ctx, 'heart_full', position[0], position[1]);
            ctx.fillStyle = "rgba(210, 37, 37, 1)";
            if (currentLife > life) {
                $.util.renderIcon(ctx, 'heart_full', position[0], position[1]);
                $.util.renderIcon(ctx, 'heart_half', position[0], position[1]);
            } else if (currentLife > life - 1) {
                $.util.renderIcon(ctx, 'heart_half', position[0], position[1]);
            }
        }

        var currentMana = this.player.stats.mana;
        var maxMana = this.player.stats.maxMana;
        for (var x = 0; x < maxMana / 2; x++) {
            var mana = (x * 2) + 1;
            var position = [15 + x * 22, 40];
            ctx.strokeStyle = "rgba(0, 0, 0, 1)";
            if (this.player.effects.manaFlashTimer > 0) {
                if (Math.sin(this.ct / 4) > 0) {
                    ctx.strokeStyle = "rgba(255, 255, 255, 1)";
                }
            }
            ctx.fillStyle = "rgba(20, 20, 20, 1)";
            $.util.renderIcon(ctx, 'star_full', position[0], position[1]);
            ctx.fillStyle = "rgba(37, 37, 210, 1)";
            ctx.strokeStyle = "rgba(0, 0, 0, 0)";
            if (currentMana > mana) {
                $.util.renderIcon(ctx, 'star_full', position[0], position[1]);
                $.util.renderIcon(ctx, 'star_half', position[0], position[1]);
            } else if (currentMana > mana - 1) {
                $.util.renderIcon(ctx, 'star_half', position[0], position[1]);
            }
        }
    },
    setMenu: function (menu) {
        if (this.menus[menu] === undefined) {
            console.error("[Game] No menu with name " + menu);
            return;
        }
        this.buttons = [];
        this.menu = menu;
        this.menus[menu].start();
    },
    startTestingWorld: function () {
        this.world = new $.World({ game: this });
        this.camera = new $.Camera({ game: this, width: this.canvas.width, height: this.canvas.height });

        this.worldGenerator = new $.WorldGenerator({ game: this, world: this.world });
        this.worldGenerator.generateTestingWorld(8, 8);

        this.player = new $.Player({ game: this, world: this.world });
        this.player.start();

        //this.world.spawnPoint = this.world.getValidSpawnPoint(this.player);
        //this.player.position = this.world.spawnPoint;

        this.player.position = [this.world.widthInPixels / 2, this.world.heightInPixels - 50];

        this.world.addPlayer(this.player);

        this.world.addObject(new $.Object({ game: this, world: this.world, type: "magic_lantern", position: [this.world.widthInPixels / 2 - 100, this.world.heightInPixels - 30] }));

        this.renderMiniMapImage();

        this.setMenu("playing");
        this.isPlaying = true;
    }
};