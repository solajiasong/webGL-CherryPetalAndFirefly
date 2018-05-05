var container, stats;
var camera, scene, renderer, particle;
var mouseX = 0, mouseY = 0;

var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;

init();
animate();

function init() {

	container = document.createElement('div');
	document.body.appendChild(container);

	//Camera
	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 5000);
	camera.position.z = 1000;

	//Scene
	scene = new THREE.Scene();
	scene.background = new THREE.Color(0x000000);
	//scene.background = new THREE.TextureLoader().load( "Resources/hotaru.jpg" );

	//Particle material 1~ 3
	var material1 = new THREE.SpriteMaterial({
		map: new THREE.CanvasTexture(generateSprite('Green')),
		blending: THREE.AdditiveBlending
	});
	var material2 = new THREE.SpriteMaterial({
		map: new THREE.CanvasTexture(generateSprite('Yellow')),
		blending: THREE.AdditiveBlending
	});
	var material3 = new THREE.SpriteMaterial({
		map: new THREE.CanvasTexture(generateSprite('GrassGreen')),
		blending: THREE.AdditiveBlending
	});

	for (var i = 0; i < 2000; i++) {

		//randomize particles with different color, saturation, etc.
		//not finished yet
		var randomSeed = Math.floor(Math.random() * 3);
		if (randomSeed == 0) {
			particle = new THREE.Sprite(material1);
		} else if (randomSeed == 1) {
			particle = new THREE.Sprite(material2);
		} else if (randomSeed == 2) {
			particle = new THREE.Sprite(material3);
		}

		initParticle(particle, i * 5);

		scene.add(particle);
	}

	//renderer = new THREE.CanvasRenderer();
	renderer = new THREE.WebGLRenderer({ alpha: true });
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	container.appendChild(renderer.domElement);

	//stats = new Stats();
	//container.appendChild(stats.dom);

	document.addEventListener('mousemove', onDocumentMouseMove, false);
	document.addEventListener('touchstart', onDocumentTouchStart, false);
	document.addEventListener('touchmove', onDocumentTouchMove, false);

	//

	window.addEventListener('resize', onWindowResize, false);

}

//Gaussian distribution random
function randn_bm() {
	var u = 0, v = 0;
	while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
	while (v === 0) v = Math.random();
	return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

function onWindowResize() {

	windowHalfX = window.innerWidth / 2;
	windowHalfY = window.innerHeight / 2;

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize(window.innerWidth, window.innerHeight);

}

function generateSprite(SpriteColor) {

	var canvas = document.createElement('canvas');
	canvas.width = 16;
	canvas.height = 16;

	var context = canvas.getContext('2d');
	var gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);

	if (SpriteColor == 'Yellow') {
		gradient.addColorStop(0, 'rgba(255,252,0,1)');
		gradient.addColorStop(0.3, 'rgba(255,252,0,0.75)');
		gradient.addColorStop(0.6, 'rgba(255,252,0,0.05)');
		gradient.addColorStop(1, 'rgba(255,252,0,0)');
	} else if (SpriteColor == 'Green') {
		gradient.addColorStop(0, 'rgba(60,240,24,1)');
		gradient.addColorStop(0.3, 'rgba(60,240,24,0.75)');
		gradient.addColorStop(0.6, 'rgba(60,240,24,0.05)');
		gradient.addColorStop(1, 'rgba(60,240,24,0)');
	} else if (SpriteColor == 'GrassGreen') {
		gradient.addColorStop(0, 'rgba(173,223,101,1)');
		gradient.addColorStop(0.3, 'rgba(173,223,101,0.75)');
		gradient.addColorStop(0.6, 'rgba(173,223,101,0.05)');
		gradient.addColorStop(1, 'rgba(173,223,101,0)');
	}

	context.fillStyle = gradient;
	context.fillRect(0, 0, canvas.width, canvas.height);

	return canvas;

}

function initParticle(particle, delay) {

	var particle = this instanceof THREE.Sprite ? this : particle;
	var delay = delay !== undefined ? delay : 0;

	//particle.position.set( Math.random() * 4000 - 2000, Math.random() * 1000 - 500, Math.random() * 4000 - 2000 );

	/************* Type I : particles from left-down side to right-up side ****************/
	particle.position.set(randn_bm() * 300 - 1600, randn_bm() * 300 - 1200, randn_bm() * 600);

	/************* Type II : particles move circularly ****************/
	//particle.position.set( randn_bm() * 50 - 1200, randn_bm() * 50 - 800, randn_bm() * 50 - 400);


	particle.scale.x = particle.scale.y = Math.random() * 32 + 16;

	new TWEEN.Tween(particle)
		.delay(delay)
		.to({}, 1)
		.onComplete(loopParticle)
		.start();

}

function loopParticle(particle, delay) {

	var particle = this instanceof THREE.Sprite ? this : particle;
	var delay = delay !== undefined ? delay : 0;

	new TWEEN.Tween(particle)
		.delay(delay)
		.to({}, 20000)
		.onComplete(loopParticle)
		.start();

	/********* particles drifting from left-down to right-up *********/
	new TWEEN.Tween(particle.position)
		.delay(delay)
		.to({ x: randn_bm() * 600 + 1600, y: randn_bm() * 600 + 1200, z: randn_bm() * 600 }, Math.random() * 20000 + 10000)
		//.to( { x: randn_bm() * 50 + 1200, y: randn_bm() * 50 + 800, z: randn_bm() * 50 }, Math.random()  * 20000 + 10000)
		.easing(TWEEN.Easing.Sinusoidal.InOut)
		//.interpolation( TWEEN.Interpolation.Bezier )
		.start();

	//TWEEN : alpha
	// new TWEEN.Tween( particle.material )
	// .delay( Math.random() * 1000 )
	// .to( { opacity: Math.random() }, 1000 )
	// .delay( Math.random() * 1000 )
	// .to( { opacity: Math.random() }, 1000 )
	// .start();

	// randomize particle scale to make it winkle
	/*********
	var randomScale = 	Math.random() * 32 + 16;
	new TWEEN.Tween( particle.scale )
		.delay( delay )
		.to( { x: randomScale, y: randomScale }, 5000 )
		.repeat( Infinity )
		.start();
	*********/

}


function onDocumentMouseMove(event) {

	mouseX = event.clientX - windowHalfX;
	mouseY = event.clientY - windowHalfY;
}

function onDocumentTouchStart(event) {

	if (event.touches.length == 1) {

		event.preventDefault();

		mouseX = event.touches[0].pageX - windowHalfX;
		mouseY = event.touches[0].pageY - windowHalfY;

	}

}

function onDocumentTouchMove(event) {

	if (event.touches.length == 1) {

		event.preventDefault();

		mouseX = event.touches[0].pageX - windowHalfX;
		mouseY = event.touches[0].pageY - windowHalfY;

	}

}

//

function animate() {

	$('.ml13').show();

	requestAnimationFrame(animate);

	render();
	//stats.update();

}

function render() {

	TWEEN.update();

	camera.position.x += (mouseX - camera.position.x) * 0.02;
	camera.position.y += (- mouseY - camera.position.y) * 0.02;
	camera.lookAt(scene.position);

	renderer.render(scene, camera);

}


/********* Text area *********/

// Initialization
var textArray = ['This is a demo to show the possibility of WebGL', 'It consists of two scenes created by Three.js', 'Three.js is a top webGL framework that can create predecent 3D scenes', 'The first demo I was trying to build a scene where fireflies are wondering', 'You can move your mouse to view it through differen angle', 'The fireflies can drift through a predefined route with some randomness', 'It can also function with timeline control module like Tween.js'];
var textCount = 0;
// pause for 3s
animateText();

function animateText() {
	var currentText = textArray[textCount];
	$('.ml13').empty().text(currentText).each(function () {
		$(this).html($(this).text().replace(/([^\x00-\x80]|\w)/g, "<span class='letter'>$&</span>"));
	});

	anime.timeline({}).add({
		targets: '.ml13 .letter',
		translateY: [100, 0],
		translateZ: 0,
		opacity: [0, 1],
		easing: "easeOutExpo",
		duration: 800,
		delay: function (el, i) {
			return 300 + 30 * i;
		}
	}).add({
		targets: '.ml13 .letter',
		translateY: [0, -100],
		//scale: 1.5,
		opacity: [1, 0],
		easing: "easeInExpo",
		duration: 700,
		delay: function (el, i) {
			return 100 + 30 * i;
		},
		complete: function (anim) {
			textCount++;
			if (textCount > textArray.length - 1) {
				backgroundToWhite();
			} else {
				animateText();
			}
		}
	});
}

function backgroundToWhite() {

	var backgroundColor = { r: 0, g: 0, b: 0 };

	new TWEEN.Tween(backgroundColor)
		.to({ r: 255, g: 255, b: 255 }, 2000)
		.onUpdate(function () {
			scene.background = new THREE.Color("rgb(" + parseInt(backgroundColor.r) + ", " + parseInt(backgroundColor.g) + ", " + parseInt(backgroundColor.b) + ")");
		})
		.onComplete(initII)
		.start();

}

function initII() {

	//container = document.createElement('div');
	//document.body.appendChild(container);

	console.log("successfully get into partII");

	camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 2000);
	camera.position.z = 800;

	// scene
	// background
	var reflectionCube = new THREE.CubeTextureLoader()
		.setPath('Resources/SolaTexture/')
		.load(['Background_1.jpg', 'Background_3.jpg', 'Background_5.jpg', 'Background_6.jpg', 'Background_4.jpg', 'Background_2.jpg']);
	//reflectionCube.format = THREE.RGBFormat;

	scene = new THREE.Scene();
	scene.background = reflectionCube;
	//scene.background = new THREE.Color().setHSL( 0.6, 0, 1 );
	//scene.fog = new THREE.Fog( scene.background, 1, 5000 );

	hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
	hemiLight.color.setHSL(0, 1, 0.6);
	hemiLight.groundColor.setHSL(0.095, 1, 0.75);
	hemiLight.position.set(0, 3000, 0);
	scene.add(hemiLight);

	var ambientLight = new THREE.AmbientLight(0x404040, 0.8);
	scene.add(ambientLight);

	var pointLight = new THREE.PointLight(0xff9999, 0.8);
	camera.add(pointLight);
	scene.add(camera);

	// texture

	var manager = new THREE.LoadingManager();
	manager.onProgress = function (item, loaded, total) {

		console.log(item, loaded, total);

	};

	var textureLoader = new THREE.TextureLoader(manager);
	var texture = textureLoader.load('Resources/petal/p_01.jpg');

	// model

	var onProgress = function (xhr) {
		if (xhr.lengthComputable) {
			var percentComplete = xhr.loaded / xhr.total * 100;
			console.log(Math.round(percentComplete, 2) + '% downloaded');
		}
	};

	var onError = function (xhr) {
	};

	var loader = new THREE.OBJLoader(manager);
	loader.load('Resources/petal/flower.obj', function (object) {

		object.traverse(function (child) {

			if (child instanceof THREE.Mesh) {

				//双面贴图
				child.material.side = THREE.DoubleSide;
				child.material.map = texture;
				child.material.blending = THREE['AdditiveBlending'];
				child.material.fog = false;

			}

		});
		scene.add(object);
		console.log(object);

		//Create copies of object, with random position, and angle
		for (var i = 0; i < 2000; i++) {
			var objectCopy = object.clone();
			objectCopy.position.x = randn_bm() * 600 + 1200;
			objectCopy.position.y = randn_bm() * 600 + 800;
			objectCopy.position.z = randn_bm() * 300;

			objectCopy.rotation.x = Math.random() * 3.14 / 2;
			objectCopy.rotation.y = Math.random() * 3.14 / 2;
			objectCopy.rotation.z = Math.random() * 3.14 / 2;

			objectCopy.scale.x = objectCopy.scale.y = objectCopy.scale.z = 6;

			scene.add(objectCopy);

			// Add falling movement
			new TWEEN.Tween(objectCopy.position)
				//.delay( i * 5 )
				.to({ x: objectCopy.position.x - 3000 - randn_bm() * 300, y: objectCopy.position.y - 2250 - randn_bm() * 300, z: objectCopy.position.z + randn_bm() * 300 }, 30000)
				//.easing( TWEEN.Easing.Sinusoidal.InOut )
				//.onComplete( loopPetal )
				.start();

			// 
			var x_rotation = Math.random() * 40;
			var y_rotation = Math.random() * 40;
			var z_rotation = Math.random() * 40;
			new TWEEN.Tween(objectCopy.rotation)
				//.to( {x: Math.random() * 20, y: Math.random() * 20, z: Math.random() * 20}, 20000 )
				.to({ x: x_rotation, y: y_rotation, z: z_rotation }, 30000)
				.start();
		}



		// Run second textArray
		$('.ml13').show();

		// Initialization
		animateTextII();

	}, onProgress, onError);

}


var textCountII = 0;
var textArrayII = ['The second scene is cherry petals drifting', 'The petal is a 3D model imported and rendered with texture', 'I believe given enough time, webGL would be a powertool of presenting innovating ideas'];


function animateTextII() {

	console.log("get into animeTextII");

	var currentText = textArrayII[textCountII];
	console.log(currentText);
	$('.ml13').empty().text(currentText).each(function () {
		$(this).html($(this).text().replace(/([^\x00-\x80]|\w)/g, "<span class='letter'>$&</span>"));
	});

	anime.timeline({}).add({
		targets: '.ml13 .letter',
		translateY: [100, 0],
		translateZ: 0,
		opacity: [0, 1],
		easing: "easeOutExpo",
		duration: 1500,
		delay: function (el, i) {
			return 300 + 30 * i;
		}
	}).add({
		targets: '.ml13 .letter',
		translateY: [0, -100],
		//scale: 1.5,
		opacity: [1, 0],
		easing: "easeInExpo",
		duration: 1200,
		delay: function (el, i) {
			return 100 + 30 * i;
		},
		complete: function (anim) {
			textCountII++;
			if (textCountII > textArrayII.length - 1) {
				$('.ml14').show().empty().html('By Sola, Last days in IBM Dalian');
			} else {
				animateTextII();
			}
		}
	});
}