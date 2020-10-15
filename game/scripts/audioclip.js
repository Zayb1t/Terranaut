$.AudioClip = function (data) {
    this.pools = [];

    $.util.merge(this, data);

    for (var i = 0; i < this.files.length; i++) {
        this.pools[i] = [];
        for (var j = 0; j < this.size; j++) {
            this.pools[i].push(new Audio(this.files[i]));
        }
    }
};
$.AudioClip.prototype = {
    play: function (gain, single) {
        var volume = gain;
        if (volume > 1) {
            volume = 1;
        } else if (volume < 0) {
            volume = 0;
        }
        var pool = this.pools[Math.floor(Math.random() * this.pools.length)];
        if (single) {
            pool[0].volume = volume;
            pool[0].currentTime = 0;
            pool[0].play();
            return;
        }
        for (var i = 0; i < pool.length; i++) {
            if (pool[i].ended || pool[i].currentTime === 0) {
                pool[i].volume = volume;
                pool[i].play();
                return;
            }
        }
    }
};