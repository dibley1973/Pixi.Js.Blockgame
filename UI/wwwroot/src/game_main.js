/// <reference path="vs_reference\pixi.min.js" />

// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
; (function ($, window, document, undefined) {

    //"use strict";

    // undefined is used here as the undefined global variable in ECMAScript 3 is
    // mutable (ie. it can be changed by someone else). undefined isn't really being
    // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
    // can no longer be modified.

    // window and document are passed through as local variables rather than global
    // as this (slightly) quickens the resolution process and can be more efficiently
    // minified (especially when both are regularly referenced in your plugin).

    // Create the defaults once
    var gameName = "blockGame",
        defaults = {
            canvasSize: {x:640,y:690}
        };

    // The actual game constructor
    function Game(element, options) {
        this.element = element;
        this.settings = $.extend({}, defaults, options);
        this._defaults = defaults;
        this._name = gameName;

        // Start the game build
        this.init();
    }

    // Avoid Game.prototype conflicts
    $.extend(Game.prototype, {
        init: function () {

            // Create the Pixi stage
            this.stage = new PIXI.Stage(0x66FF99);

            // Create the root pixi object container to handle scaling/rotation/etc
            this.scene = new PIXI.DisplayObjectContainer();
            this.stage.addChild(this.scene);

            // Create a renderer
            this.renderer = PIXI.autoDetectRenderer(defaults.canvasSize.x, defaults.canvasSize.y);

            // Add the renderer to the DOM
            $(this.element).append(this.renderer.view);

            // Start animation ticker
            requestAnimationFrame(this.animate.bind(this));

            this.loadAssets();
        },

        animate: function() {
            requestAnimationFrame(this.animate.bind(this));


            this.renderer.render(this.stage);
        },

        loadAssets: function() {
            var loader = new PIXI.AssetLoader(['assets/interface.json']);

            loader.onComplete = this.onLoadAssets.bind(this);

            loader.load();
        },

        onLoadAssets: function() {
            var texture = PIXI.Texture.fromImage('bg.png');
            var gameBackground = new PIXI.Sprite(texture);
            this.scene.addChild(gameBackground);
        }
    });

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[gameName] = function (options) {
        return this.each(function () {
            if (!$.data(this, "game_" + gameName)) {
                $.data(this, "game_" +
                    gameName, new Game(this, options));
            }
        });
    };

})(jQuery, window, document);