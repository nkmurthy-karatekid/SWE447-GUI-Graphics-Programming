function Square(gl, vertexShaderId, fragmentShaderId) {
	var vertShdr = vertexShaderId || "Square-vertex-shader";
	var fragShdr = fragmentShaderId || "Square-fragment-shader";

	this.program = initShaders(gl, vertShdr, fragShdr);

	if ( this.program < 0 ) {
    	alert( "Error: Square shader pipeline failed to compile.\n\n" +
    	    "\tvertex shader id:  \t" + vertShdr + "\n" +
    	    "\tfragment shader id:\t" + fragShdr + "\n" );
    	return; 
	}


	gl.useProgram(this.program);
	this.count = 24; // i am assuming that count is the number of vertices. there are 6 squares in a cube, so 4 vertices * 6 squares = 24 vertices
	
	/*
	this.positions = {
		values : new Float32Array([
		    // Front face
		    0.0, 0.0, // Vertex 0
		    1.0, 0.0, // Vertex 1
		    1.0, 1.0, // Vertex 2
		    0.0, 1.0  // Vertex 3
		]),
		numComponents : 2 // 3 components for each
		// position (2D coords)
	};*/
	this.positions = {
		values : new Float32Array([
		    // Front face
		     1.0, 1.0, 1.0, // Vertex 0
		     1.0, -1.0, 1.0, // Vertex 1
		    -1.0, -1.0, 1.0, // Vertex 2
		    -1.0, 1.0, 1.0,  // Vertex 3
		
		    // Back face
		     1.0, 1.0, -1.0, // Vertex 0
		     1.0, -1.0, -1.0, // Vertex 1
		    -1.0, -1.0, -1.0, // Vertex 2
		    -1.0, 1.0, -1.0  // Vertex 3

		    // Top face
		     1.0, 1.0, 1.0, // Vertex 0
		    -1.0, 1.0, 1.0, // Vertex 1
		    -1.0, 1.0, -1.0, // Vertex 2
		     1.0, 1.0, -1.0  // Vertex 3

		    // Bottom face
		     1.0, -1.0, 1.0, // Vertex 0
		    -1.0, -1.0, 1.0, // Vertex 1
		    -1.0, -1.0, -1.0, // Vertex 2
		     1.0, -1.0, -1.0  // Vertex 3

		    // Right face
		     1.0, 1.0, -1.0, // Vertex 0
		     1.0, -1.0, 1.0, // Vertex 1
		    -1.0, -1.0, 1.0, // Vertex 2
		    -1.0, 1.0, -1.0  // Vertex 3

		    // Left face
		    -1.0, 1.0, 1.0, // Vertex 0
		    -1.0, 1.0, -1.0, // Vertex 1
		    -1.0, -1.0, -1.0, // Vertex 2
		    -1.0, -1.0, 1.0  // Vertex 3
		]),
		numComponents : 3 // 3 components for each
		// position (3D coords)
		};
/*
this.indicesClockwize1 = {
    values : new Uint16Array([ 0, 3, 1 ])
    };

this.indicesClockwize2 = {
    values : new Uint16Array([ 1, 3, 2 ])
    };

this.indicesCounterClockwise1 = {
    values : new Uint16Array([ 0, 1, 3 ])
    };

this.indicesCounterClockwise2 = {
    values : new Uint16Array([ 1, 2, 3 ])
    };*/
	
	this.colors = {
		values : new Float32Array([
		    1.0, 0.0, 0.0, 
		    1.0, 0.0, 0.0,
		    1.0, 0.0, 0.0,
		    1.0, 0.0, 0.0,
			
		    1.0, 0.0, 0.0, 
		    1.0, 0.0, 0.0,
		    1.0, 0.0, 0.0,
		    1.0, 0.0, 0.0,
		
		    1.0, 0.0, 0.0, 
		    1.0, 0.0, 0.0,
		    1.0, 0.0, 0.0,
		    1.0, 0.0, 0.0,
		
		    1.0, 0.0, 0.0, 
		    1.0, 0.0, 0.0,
		    1.0, 0.0, 0.0,
		    1.0, 0.0, 0.0,
			
		    1.0, 0.0, 0.0, 
		    1.0, 0.0, 0.0,
		    1.0, 0.0, 0.0,
		    1.0, 0.0, 0.0,
			
		    1.0, 0.0, 0.0, 
		    1.0, 0.0, 0.0,
		    1.0, 0.0, 0.0,
		    1.0, 0.0, 0.0
		]),
		numComponents : 3 
	};
    this.indices = {
    values : new Uint16Array([0,1,2, 0,2,3, 4,5,6, 4,6,7, 8,9,10, 8,10,11, 12,13,14, 12,14,15, 16,17,18, 16,18,19, 20,21,22, 20,22,23])
    //values : new Uint16Array([ 0, 1, 3, 2 ])
    };
	
	// positions
	
	this.positions.buffer = gl.createBuffer();
	gl.bindBuffer( gl.ARRAY_BUFFER, this.positions.buffer );
    gl.bufferData( gl.ARRAY_BUFFER, this.positions.values, gl.STATIC_DRAW );
	this.positions.attributeLoc = gl.getAttribLocation( this.program, "vPosition" );
	gl.enableVertexAttribArray( this.positions.attributeLoc );

	// colors
    this.colors.buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, this.colors.buffer );
    gl.bufferData( gl.ARRAY_BUFFER, this.colors.values, gl.STATIC_DRAW );
    this.colors.attributeLoc = gl.getAttribLocation( this.program, "vColor" );
    gl.enableVertexAttribArray( this.colors.attributeLoc );
    
	// indices
    this.indices.buffer = gl.createBuffer();
    gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.indices.buffer );
    gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, this.indices.values, gl.STATIC_DRAW );
    

	this.render = function () {
    	gl.useProgram( this.program );
    	//gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    	gl.bindBuffer( gl.ARRAY_BUFFER, this.positions.buffer );
    	gl.vertexAttribPointer( this.positions.attributeLoc, this.positions.numComponents,
        		gl.FLOAT, gl.FALSE, 0, 0 );

           
    	gl.bindBuffer( gl.ARRAY_BUFFER, this.colors.buffer );
    	gl.vertexAttribPointer( this.colors.attributeLoc, this.colors.numComponents,
        		gl.FLOAT, gl.FALSE, 0, 0 );
	
        //gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.indices.buffer );
		var start = 0;
		var count = this.count;
		//gl.drawArrays(gl.TRIANGLE_STRIP, start, count); // TRIANGLE_STRIP
		//gl.drawElements(gl.TRIANGLE_STRIP, this.indices.values.length, gl.UNSIGNED_SHORT, 0);
		gl.drawElements(gl.TRIANGLES, this.indices.values.length, gl.UNSIGNED_SHORT, 0);


	};

};