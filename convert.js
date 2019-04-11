
function convert(panodata, img, heading, pitch, fov)
{
	var pwidth = panodata.width;
	var pheight = panodata.height;
	var width = img.width;
	var height = img.height;

	// var fov = 180.0/(Math.pow(2,zoom));
	var dis = width / 2.0 / Math.tan(fov / 360.0 * Math.PI);
	var p = pitch / 180.0 * Math.PI;
	var h = (180.0 + heading ) % 360.0 / 180.0 * Math.PI;

	for ( var i = 0 ; i < width ; i ++ )
		for ( var j = 0 ; j < height; j ++ )
		{
			var x = 1.0;
			var y = (i - width/2.0)/dis;
			var z = (j - height/2.0)/dis;

			var x1 = Math.cos(p) * x - Math.sin(p) * z;
			var z1 = Math.sin(p) * x + Math.cos(p) * z;
			var y1 = Math.sin(h) * x1 + Math.cos(h) * y;
			x = Math.cos(h) * x1 - Math.sin(h) * y;
			y = y1;
			z = z1;

			var phi = Math.atan2(y,x);
			var theta = Math.acos(z/Math.sqrt(x*x+y*y+z*z))

			var i2 = parseInt((phi/Math.PI*180)%360 / 360 * pwidth);
			var j2 = parseInt((theta/Math.PI*180)%180 / 180 * pheight);
			if (i2 == pwidth) i2 -= 1;
			if (j2 == pheight) j2 -= 1;

			for ( var k = 0 ; k < 4 ; k ++ )
				img.data[(height-1-j)*width*4+i*4+k] = panodata.data[j2*pwidth*4+i2*4+k]
		}
	return img;
}
