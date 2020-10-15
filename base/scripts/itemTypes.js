$.itemTypes = {
    "primitive_axe": {
        title: "Primitive Axe",
        description: "A simple axe made from organic materials",
        catagoryType: "tool",
        catagory: "axe",
        equipable: true,
        twoHanded: true,
        startType: function () {
            this.stats = {
                value: 1,
                size: 3
            };
            this.attack = {
                weight: 4,
                sharpness: 0.8,
                quality: 0.7,
                range: 1.5
            };
        },
        updateType: function (delta) {

        },
        renderType: function (ctx) {
            ctx.fillStyle = "hsla(47, 35%, 15%, 1)";
            ctx.beginPath();
            ctx.moveTo(-2, 20);
            ctx.lineTo(-2, -15);
            ctx.lineTo(2, -15);
            ctx.lineTo(2, 20);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = "hsla(0, 5%, 30%, 1)";
            ctx.beginPath();
            ctx.moveTo(-5, -11);
            ctx.lineTo(5, -11);
            ctx.lineTo(10, -14);
            ctx.ellipse(10, -6, 4, 8, 0, Math.PI * 1.5, Math.PI * 2.5);
            ctx.lineTo(10, 2);
            ctx.lineTo(5, -1);
            ctx.lineTo(-5, -1);
            ctx.closePath();
            ctx.fill();
        }
    },
    "primitive_pickaxe": {
        title: "Primitive Pickaxe",
        description: "A simple pickaxe made from organic materials",
        catagoryType: "tool",
        catagory: "pickaxe",
        equipable: true,
        twoHanded: true,
        startType: function () {
            this.stats = {
                value: 1,
                size: 4
            };
            this.attack = {
                weight: 4,
                sharpness: 0.8,
                quality: 0.7,
                range: 1.5
            };
        },
        updateType: function (delta) {

        },
        renderType: function (ctx) {
            ctx.fillStyle = "hsla(47, 35%, 15%, 1)";
            ctx.beginPath();
            ctx.moveTo(-2, 20);
            ctx.lineTo(-2, -15);
            ctx.lineTo(2, -15);
            ctx.lineTo(2, 20);
            ctx.closePath();
            ctx.fill();

            ctx.strokeStyle = "hsla(0, 5%, 30%, 1)";
            ctx.lineCap = "round";
            ctx.lineWidth = 4;
            ctx.beginPath();
            ctx.ellipse(0, -6, 20, 5, 0, Math.PI + 0.1, Math.PI * 2 - 0.1);
            ctx.stroke();
        }
    },
    "primitive_sword": {
        title: "Primitive Sword",
        description: "A simple sword made from organic materials",
        catagoryType: "tool",
        catagory: "sword",
        equipable: true,
        twoHanded: true,
        startType: function () {
            this.stats = {
                value: 2,
                size: 3
            };
            this.attack = {
                weight: 4,
                sharpness: 0.8,
                quality: 0.7,
                range: 1.5
            };
        },
        updateType: function (delta) {

        },
        renderType: function (ctx) {
            ctx.fillStyle = "hsla(47, 35%, 15%, 1)";
            ctx.beginPath();
            ctx.moveTo(-2, 20);
            ctx.lineTo(-2, 10);
            ctx.lineTo(2, 10);
            ctx.lineTo(2, 20);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = "hsla(0, 5%, 30%, 1)";
            ctx.beginPath();
            ctx.moveTo(-3, 10);
            ctx.lineTo(-4, -16);
            ctx.lineTo(0, -20);
            ctx.lineTo(4, -16);
            ctx.lineTo(3, 10);
            ctx.closePath();
            ctx.fill();

            ctx.fillStyle = "hsla(0, 0%, 100%, 0.1)";
            ctx.beginPath();
            ctx.moveTo(3, 10);
            ctx.lineTo(4, -16);
            ctx.lineTo(0, -20);
            ctx.lineTo(0, 10);
            ctx.closePath();
            ctx.fill();
        }
    },
    "oak_wood": {
        title: "Oak Wood",
        description: "A log from an oak tree",
        catagoryType: "material",
        catagory: "wood",
        equipable: false,
        startType: function () {
            this.stats = {
                value: 2,
                size: 1
            };
        },
        updateType: function (delta) {

        },
        renderType: function (ctx) {
            ctx.fillStyle = "hsla(47, 35%, 15%, 1)";
            ctx.strokeStyle = "hsla(47, 35%, 15%, 1)";
            ctx.lineWidth = 1;

            ctx.beginPath();
            ctx.ellipse(10, 0, 4, 5, 0, 0, Math.PI * 2);
            ctx.fill();

            ctx.fillRect(-10, -5, 20, 10);

            ctx.fillStyle = "hsla(67, 35%, 50%, 1)";
            ctx.beginPath();
            ctx.ellipse(-10, 0, 4, 5, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        }
    }
};