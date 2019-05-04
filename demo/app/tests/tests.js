var ParticleEmitter = require("nativescript-particle-emitter").ParticleEmitter;
var particleEmitter = new ParticleEmitter();

describe("greet function", function() {
    it("exists", function() {
        expect(particleEmitter.greet).toBeDefined();
    });

    it("returns a string", function() {
        expect(particleEmitter.greet()).toEqual("Hello, NS");
    });
});