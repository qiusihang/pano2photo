
function convert(panodata, img, heading, pitch, fov)
{
	var pwidth = panodata.width;
	var pheight = panodata.height;
	var width = img.width;
	var height = img.height;
	// var fov = 180.0/(Math.pow(2,zoom));

	// The panorama image is mapped into a sphere (whose center is the origin of Euclidean space)
	// Now you are standing at the origin, and the photo is what you see from a rectangular viewport (camera)

	// Defining the viewport
	var dis = width / 2.0 / Math.tan(fov / 360.0 * Math.PI);	// distance from the viewport to the origin
	var p = pitch / 180.0 * Math.PI;							// pitch of the viewport
	var h = (180.0 + heading ) % 360.0 / 180.0 * Math.PI;		// heading of the viewport

	// Acquiring pixels from the sphere (panorama image) inside the field of the viewport
	for ( var i = 0 ; i < width ; i ++ )
		for ( var j = 0 ; j < height; j ++ )
		// Going through all the pixels of the viewport (photo).
		{
			// Calculating the (x, y, z) of each pixel in Cartesian coordinate system
			var x = 1.0;
			var y = (i - width/2.0)/dis;
			var z = (j - height/2.0)/dis;
			// Rotating the viewport to corresponding heading and pitch
			var x1 = Math.cos(p) * x - Math.sin(p) * z;
			var z1 = Math.sin(p) * x + Math.cos(p) * z;
			var y1 = Math.sin(h) * x1 + Math.cos(h) * y;
			x = Math.cos(h) * x1 - Math.sin(h) * y;
			y = y1;
			z = z1;

			// Transferring to Spherical coordinate system from Cartesian coordinate system
			var phi = Math.atan2(y,x);
			var theta = Math.acos(z/Math.sqrt(x*x+y*y+z*z))

			// (1, theta, phi) is the point on the sphere you can see from the viewport
			// Acquiring the corresponding pixel from panorama image
			var i2 = parseInt((phi/Math.PI*180)%360 / 360 * pwidth);
			var j2 = parseInt((theta/Math.PI*180)%180 / 180 * pheight);
			if (i2 == pwidth) i2 -= 1;
			if (j2 == pheight) j2 -= 1;

			// Assign the panorama data to the photo (r,g,b,a)
			for ( var k = 0 ; k < 4 ; k ++ )
				img.data[(height-1-j)*width*4+i*4+k] = panodata.data[j2*pwidth*4+i2*4+k]
		}
	return img;
}
