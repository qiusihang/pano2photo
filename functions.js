var photo = document.createElement("canvas");
var ctx = photo.getContext("2d");
var pano = document.getElementById("pano");
var pctx = pano.getContext("2d");
var image = document.getElementById("panoimg");
image.addEventListener("load", () => {
	// set a scaled panorama image on the page
	pano.width = 600;
	pano.height = 600/image.naturalWidth*image.naturalHeight;
	drawlines();
	document.getElementById("tool").style.display = "block";
});

var loadFile = function(event) {
	image.src = URL.createObjectURL(event.target.files[0]);
};

function loadExample()
{
	image.src = "example/amsterdam.png";
}

function drawlines()
{
	var heading = document.getElementById("heading").value;
	var pitch = document.getElementById("pitch").value;
	var fov = document.getElementById("fov").value;
	document.getElementById("hvalue").innerHTML = heading;
	document.getElementById("pvalue").innerHTML = pitch;
	document.getElementById("fvalue").innerHTML = fov;

	pctx.clearRect(0, 0, pano.width, pano.height);
	pctx.beginPath();
	pctx.moveTo(heading/360*pano.width, 0); pctx.lineTo(heading/360*pano.width, pano.height);
	pctx.lineWidth = 3; pctx.strokeStyle = 'red';
	pctx.stroke();

	pctx.beginPath();
	pctx.moveTo(0, (90-parseInt(pitch))/180*pano.height); pctx.lineTo(pano.width, (90-parseInt(pitch))/180*pano.height);
	pctx.lineWidth = 3; pctx.strokeStyle = 'red';
	pctx.stroke();
}

function shot()
{
	// get full-size panorama image data
	var tmpcanvas = document.createElement("canvas");
	var tmpctx = tmpcanvas.getContext("2d");
	tmpcanvas.width = image.naturalWidth;
	tmpcanvas.height = image.naturalHeight;
	tmpctx.drawImage(image, 0, 0);
	var panodata = tmpctx.getImageData(0, 0, image.naturalWidth, image.naturalHeight);

	var heading = document.getElementById("heading").value;
	var pitch = document.getElementById("pitch").value;
	var fov = document.getElementById("fov").value;

	// convert
	var w = parseInt(Math.max(Math.min(document.getElementById("size0").value,1000),200));
	var h = parseInt(Math.max(Math.min(document.getElementById("size1").value,1000),200));
	var img = ctx.createImageData(w, h);
	img = convert(panodata, img, heading, pitch, fov);
	photo.width = w;
	photo.height = h;
	ctx.putImageData(img,0,0,0,0,w,h);

	document.getElementById("photo").src = photo.toDataURL("image/png");
}

function cubemap(size=0)
{
	// get full-size panorama image data
	var tmpcanvas = document.createElement("canvas");
	var tmpctx = tmpcanvas.getContext("2d");
	tmpcanvas.width = image.naturalWidth;
	tmpcanvas.height = image.naturalHeight;
	tmpctx.drawImage(image, 0, 0);
	var panodata = tmpctx.getImageData(0, 0, image.naturalWidth, image.naturalHeight);

	if (size == 0) size = parseInt(image.naturalWidth/4);
	photo.width = 4*size;
	photo.height = 3*size;
	var img = ctx.createImageData(size, size);
	// Forward
	img = convert(panodata, img, 0, 0, 90);
	ctx.putImageData(img,size,size,0,0,size,size);
	// Back
	img = convert(panodata, img, 180, 0, 90);
	ctx.putImageData(img,3*size,size,0,0,size,size);
	// Top
	img = convert(panodata, img, 0, 90, 90);
	ctx.putImageData(img,size,0,0,0,size,size);
	// Down
	img = convert(panodata, img, 0, -90, 90);
	ctx.putImageData(img,size,2*size,0,0,size,size);
	// Left
	img = convert(panodata, img, 90, 0, 90);
	ctx.putImageData(img,2*size,size,0,0,size,size);
	// Right
	img = convert(panodata, img, 270, 0, 90);
	ctx.putImageData(img,0,size,0,0,size,size);

	document.getElementById("photo").src = photo.toDataURL("image/png");
}
