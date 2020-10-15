$.graphics = {};

$.graphics.rect = function (ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.arc(x + w - r, y + r, r, Math.PI, Math.PI * 1.5);
    ctx.lineTo(x + w, y + h - r);
    ctx.arc(x + w - r, y + h - r, r, Math.PI * 1.5, 0);
    ctx.lineTo(x + r, y + h);
    ctx.arc(x + r, y + h - r, r, 0, Math.PI * 0.5);
    ctx.lineTo(x, y + r);
    ctx.arc(x + r, y + r, r, Math.PI * 0.5, Math.PI);
};