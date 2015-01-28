define(function(require, exports, module) {
    var View            = require('famous/core/View');
    var Surface         = require('famous/core/Surface');
    var Transform       = require('famous/core/Transform');
    var StateModifier   = require('famous/modifiers/StateModifier');
    var HeaderFooter    = require('famous/views/HeaderFooterLayout');
    var ImageSurface    = require('famous/surfaces/ImageSurface');
    var ScrollContainer = require('famous/views/ScrollContainer');
    var ContentData     = require('data/ContentData');
    var RenderNode      = require('famous/core/RenderNode');

    function PageView() {
        View.apply(this, arguments);

        _createBacking.call(this);
        _createLayout.call(this);
        _createHeader.call(this);
        _createBody.call(this);

        _setListeners.call(this);
    }

    PageView.prototype = Object.create(View.prototype);
    PageView.prototype.constructor = PageView;

    PageView.DEFAULT_OPTIONS = {
        headerSize: 160
    };

    function _createBacking() {
        var backing = new Surface({
            properties: {
                //backgroundColor: '#e1e7a1',
                backgroundColor: 'black',
                boxShadow: '0 0 20px rgba(0,0,0,0.5)',
            }
        });

        this.add(backing);
    }

    function _createLayout() {
        this.layout = new HeaderFooter({
            headerSize: this.options.headerSize
        });

        var layoutModifier = new StateModifier({
            transform: Transform.translate(0, 0, 0.1)
        });

        this.add(layoutModifier).add(this.layout);
    }

    function _createHeader() {
        var backgroundSurface = new Surface({
            properties: {
                backgroundColor: '#41496d'
                //backgroundColor: 'black'
            }
        });

        this.hamburgerSurface = new ImageSurface({
            size: [44, 44],
            content : 'img/hamburger.png'
        });

        var logoSurface = new ImageSurface({
            size: [272, 160],
            content : 'img/cwp.jpg'
        });

        var iconSurface = new ImageSurface({
            size: [44, 44],
            content : 'img/icon.png'
        });

        var backgroundModifier = new StateModifier({
            transform : Transform.behind
        });

        var hamburgerModifier = new StateModifier({
            origin: [0, 1],
            align : [0, 1]
        });

        var logoModifier = new StateModifier({
            origin: [0.5, 0.5],
            align : [0.5, 0.5]
        });

        var iconModifier = new StateModifier({
            origin: [1, 1],
            align : [1, 1]
        });

        this.layout.header.add(backgroundModifier).add(backgroundSurface);
        this.layout.header.add(hamburgerModifier).add(this.hamburgerSurface);
        this.layout.header.add(logoModifier).add(logoSurface);
        //this.layout.header.add(iconModifier).add(iconSurface);
    }

    function _createBody() {
        this.container = new ScrollContainer({
            scrollview: {
                direction: 1,
                //edgeGrip: 1,
                //edgeDamp: 1,
                //speedLimit: 0.5,
                //friction: 1,
                //drag: 5
            }
        });

        var surfaces = [];

        this.container.sequenceFrom(surfaces);

        for(var i = 0; i < 4; i++) {
            var color;

            if(i % 2 == 0) {
                color = 'black';
            } else {
                color = '#41496d';
            }

            var itemSurface = new Surface({
                content: ContentData[i].title + '<br>' + ContentData[i].content,
                size: [window.innerWidth, (window.innerHeight-this.options.headerSize) * 0.5],
                properties: {
                    backgroundColor: color,
                    color: '#e1e7a1',
                    fontFamily: 'AvenirNextCondensed-DemiBold',
                    //fontSize: this.options.fontSize + 'px',
                    //lineHeight: '100px',
                    textAlign: 'left',
                    paddingLeft: '5px'
                }
            });

            itemSurface.pipe(this.container.scrollview);

            surfaces.push(itemSurface);
        }

        for(var i = 0, index = 1; i < 4; i++, index += 2) {
            itemSurface = new ImageSurface({
                size: [window.innerWidth, (window.innerHeight-this.options.headerSize) * 0.5],
                content : 'img/car' + (i+1) + '.jpg'
            });

            itemSurface.pipe(this.container.scrollview);

            surfaces.splice(index, 0, itemSurface);
        }

        this.layout.content.add(this.container);
    }

    function _setListeners() {
        this.hamburgerSurface.on('click', function() {
            this._eventOutput.emit('menuToggle');
        }.bind(this));

        this.container.pipe(this._eventOutput);
    }

    module.exports = PageView;
});
