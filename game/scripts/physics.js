$.physics = {};

/* My lovely realistic physics engine */

/* DO NOT ALTER THESE FUNCTIONS IT WILL BREAK THE GAME */

// Returns true if any of both objects' colliders overlap
$.physics.checkCollision = function (obj1, col1, obj2, col2) {
    return (obj1.position[0] + col1[2] > obj2.position[0] + col2[0] - obj1.velocity[0]
        && obj1.position[0] + col1[0] < obj2.position[0] + col2[2] - obj1.velocity[0]
        && obj1.position[1] + col1[3] > obj2.position[1] + col2[1] - obj1.velocity[1]
        && obj1.position[1] + col1[1] < obj2.position[1] + col2[3] - obj1.velocity[1]);
};
// Resolves any collision between obj1 and obj2
$.physics.resolveCollision = function (obj1, col1, obj2, col2, velocity) {
    // obj1 is the object being affected
    if ($.physics.checkCollision(obj1, col1, obj2, col2)) {
        if (velocity[1] > 0) {
            obj1.callEvent("collideBottom", { object: obj2, velocity: velocity });
            obj1.velocity[1] = 0;
            obj1.position[1] = obj2.position[1] + col2[1] - col1[3];
            obj1.isGrounded = true;
        }
        if (velocity[1] < 0) {
            obj1.velocity[1] = 0;
            obj1.position[1] = obj2.position[1] + col2[3] - col1[1];
        }
        if (velocity[0] > 0) {
            obj1.velocity[0] = 0;
            obj1.position[0] = obj2.position[0] + col2[0] - col1[2];
            obj1.isMoving = false;
        }
        if (velocity[0] < 0) {
            obj1.velocity[0] = 0;
            obj1.position[0] = obj2.position[0] + col2[2] - col1[0];
            obj1.isMoving = false;
        }
    }
};
$.physics.resolveTileCollisions = function (object, world, velocity) {
    if (object.physics.resolveCollisions) {
        for (var tc = -8; tc < 8; tc++) {
            for (var tr = -8; tr < 8; tr++) {
                var tile = world.getTile([object.tilePosition[0] + tc, object.tilePosition[1] + tr], 1);
                if (tile === undefined) {
                    continue;
                }
                if (tile.physics.resolveCollisions) {
                    for (var i = 0; i < object.colliders.length; i++) {
                        for (var j = 0; j < tile.colliders.length; j++) {
                            $.physics.resolveCollision(object, object.colliders[i], tile, tile.colliders[j], velocity);
                        }
                    }
                }
            }
        }
    }
};
$.physics.applyWorldBounds = function (object, world) {
    var worldBounds = [-object.bounds[0] - 10, -object.bounds[1] - 10, world.widthInPixels - object.bounds[2] - 10, world.heightInPixels - object.bounds[3] - 10];

    if (object.position[0] < worldBounds[0]) {
        object.velocity[0] = 0;
        object.position[0] = worldBounds[0];
    } else if (object.position[0] > worldBounds[2]) {
        object.velocity[0] = 0;
        object.position[0] = worldBounds[2];
    }
    if (object.position[1] < worldBounds[1]) {
        object.velocity[1] = 0;
        object.position[1] = worldBounds[1];
    } else if (object.position[1] > worldBounds[3]) {
        object.velocity[1] = 0;
        object.position[1] = worldBounds[3];
        object.isGrounded = true;
    }
};