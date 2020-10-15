$.Item = function (data) {
    var self = this;

    this.owner;

    this.count = 1;

    $.util.merge(this, data);
    $.util.merge(this, $.itemTypes[this.type]);

    this.startType();
};
$.Item.prototype = {
    update: function (delta) {
        this.updateType(delta);
    },
    render: function (ctx) {
        this.renderType(ctx);
    }
};