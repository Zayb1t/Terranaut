$.drawText = function (ctx, text, x, y, scale, hAlign, vAlign, font) {
    var scale = scale || 1;
    var hAlign = hAlign || "left";
    var vAlign = vAlign || "top";
    var font = font || "default";
    var spacing = 1;

    var width = 0;
    var height = 0;

    for (var i = 0; i < text.length; i++) {
        var char = $.fonts[font][text[i]];
        width += char[0].length * scale + spacing;
        if (height < char.length * scale + spacing) {
            height = char.length * scale + spacing;
        }
    }

    var drawX = x;
    var drawY = y;

    if (hAlign === "center") {
        drawX = Math.floor(x - width / 2);
    } else if (hAlign === "left") {
        drawX = Math.floor(x);
    } else if (hAlign === "right") {
        drawX = Math.floor(x - width);
    }
    if (vAlign === "center") {
        drawY = Math.floor(y - height / 2);
    } else if (vAlign === "top") {
        drawY = Math.floor(y);
    } else if (vAlign === "bottom") {
        drawY = Math.floor(y - height);
    }

    var o = 0;

    ctx.beginPath();
    for (var i = 0; i < text.length; i++) {
        var char = $.fonts[font][text[i]];
        for (var y = 0; y < char.length; y++) {
            for (var x = 0; x < char[y].length; x++) {
                if (char[y][x] === "1") {
                    ctx.rect(drawX + o + x * scale, drawY + y * scale, scale, scale);
                }
            }
        }
        o += char[0].length * scale + spacing;
    }
};