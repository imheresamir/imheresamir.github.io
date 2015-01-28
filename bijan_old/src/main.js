/*global famous*/
// import dependencies
var Engine = famous.core.Engine;
var Modifier = famous.core.Modifier;
var Transform = famous.core.Transform;
var ImageSurface = famous.surfaces.ImageSurface;
var Transitionable = famous.transitions.Transitionable;
var Surface = famous.core.Surface;
var Deck = famous.views.Deck;
var RenderNode = famous.core.RenderNode;
var RenderController = famous.views.RenderController;
var Easing = famous.transitions.Easing;

// create the main context
var mainContext = Engine.createContext();

// your app here
var border = '1px solid black';
var border = 'none';

var logo = new ImageSurface({
    content: 'res/cwp.jpg',
    properties: {
    	//border: border
    	zIndex: 1
    }
});

console.log(window.innerWidth);

var moveLogo = new Transitionable([0.5, 0.5]);
var resizeLogo = new Transitionable([544, 319]);

var menuSurfaces = [];
var menuDeck = new Deck();
var menuNode = new RenderNode();
var menuRenderController = new RenderController({
	//inTransition: {duration: 1000, curve: Easing.inOutQuart},
	//outTransition: {duration: 1000, curve: Easing.inOutQuart},
	//overlap: true
});

var logoMod = new Modifier({
	origin: [0.5, 0.5]
});

var menuDeckMod = new Modifier({
	align: [0.2, 0.2],
	origin: [0.5, 0.5],
	transform: Transform.translate(0, 213, 0)
});

for(var i = 0; i < 4; i++) {
	var current = new Surface({
		size: [200, 50],
		//content: i + '',
		properties: {
			border: border,
			color: '#e1e7a1',
			textAlign: 'left'
		}
	});

	current.on('click', function() {
		menuDeck.close();
	});

	menuSurfaces.push(current);
}

menuSurfaces[0].setContent('Mission');
menuSurfaces[1].setContent('Services');
menuSurfaces[2].setContent('Environmental Awareness');
menuSurfaces[3].setContent('Mission');

menuDeck.sequenceFrom(menuSurfaces);
menuDeck.close();
menuNode.add(menuDeckMod).add(menuDeck);
mainContext.add(menuRenderController);

menuRenderController.hide();

mainContext.add(logoMod).add(logo);

mainContext.add(new Modifier({
	align: [0.2, 0.8],
	origin: [0.5, 0.5]
})).add(new Surface({
	size: [363, 213],
	properties: {
		border: border
	}
}));

mainContext.add(new Modifier({
	align: [0.8, 0.2],
	origin: [0.5, 0.5]
})).add(new Surface({
	size: [363, 213],
	properties: {
		border: border
	}
}));

mainContext.add(new Modifier({
	align: [0.5, 0.2],
	origin: [0.5, 0],
	transform: Transform.translate(0, 0, 0)
})).add(new Surface({
	size: [363, 320],
	properties: {
		border: border
	}
}));

logoMod.alignFrom(function() {
	return moveLogo.get();
});
logoMod.sizeFrom(function() {
	return resizeLogo.get();
});

logo.on('click', function() {
	moveLogo.set([0.5, 0.2], {duration: 1000, curve: 'easeInOut'}, function() {
		moveLogo.set([0.2, 0.2], {duration: 1000, curve: 'easeInOut'});
	});
	resizeLogo.set([363, 213], {duration: 1000, curve: 'easeInOut'}, function() {
		menuDeck.open();
		menuRenderController.show(menuNode);
	});
	
});
