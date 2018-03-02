const DefaultNumSides = 8;

function Cone( gl, numSides, vertexShaderId, fragmentShaderId ) {

    // Initialize the shader pipeline for this object using either shader ids
    //   declared in the application's HTML header, or use the default names.
    //
    var vertShdr = vertexShaderId || "Cone-vertex-shader";
    var fragShdr = fragmentShaderId || "Cone-fragment-shader";

    this.program = initShaders(gl, vertShdr, fragShdr);

    if ( this.program < 0 ) {
        alert( "Error: Cone shader pipeline failed to compile.\n\n" +
            "\tvertex shader id:  \t" + vertShdr + "\n" +
            "\tfragment shader id:\t" + fragShdr + "\n" );
        return; 
    }

    var n = numSides || DefaultNumSides; // Number of sides 

    var theta = 0.0;
    var dTheta = 2.0 * Math.PI / n;
    
    // Record the number of components for each vertex's position in the Cone object's 
    //   positions property. (that's why there's a "this" preceding the positions here).
    //   Here, we both create the positions object, as well as initialize its
    //   numComponents field.
    //
    this.positions = { numComponents : 3 };
    
    // Initialize temporary arrays for the Cone's indices and vertex positions
    //
    var positions = [0.0, 0.0, 0.0];
    var colorVals = [1.0, 0.0, 0.0];
    var indices = [ 0 ];
    
    for ( var i = 0; i < n; ++i ) {
        theta = i * dTheta;
        positions.push( Math.cos(theta), Math.sin(theta), 0.0 );
        colorVals.push(0.0, 1.0, 0.0);

        indices.push(n - i);
    }

    
    positions.push( 0.0, 0.0, 1.0 );
    colorVals.push(1.0, 0.0, 0.0);
    // Close the triangle fan by repeating the first (non-center) point.
    //
    indices.push(n);

    
    // Record the number of indices in one of our two disks that we're using to make the
    //   cone.  At this point, the indices array contains the correct number of indices for a
    //   single disk, and as we render the cone as two disks of the same size, this value is
    //   precisely what we need.
    //
    this.indices = { count : indices.length };

    // Now build up the list for the cone.  First, add the apex vertex onto the index list
    //
    indices.push(n + 1);

    // Next, we need to append the rest of the vertices for the permieter of the disk.
    // However, the cone's perimeter vertices need to be reversed since it's effectively a
    // reflection of the bottom disk.
    //
    indices = indices.concat( indices.slice(1,n+2).reverse() );

    this.positions.buffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, this.positions.buffer );
    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW );

    this.colors.buffer = gl.createBuffer();
    gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.indices.buffer );
    gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Float32Array(colorVals), gl.STATIC_DRAW );
    
    this.indices.buffer = gl.createBuffer();
    gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.indices.buffer );
    gl.bufferData( gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW );

    this.positions.attributeLoc = gl.getAttribLocation( this.program, "vPosition" );
    gl.enableVertexAttribArray( this.positions.attributeLoc );

    this.uniforms = 
    {
        MV: undefined
        P: undefined,
    };
    
    this.uniforms.MV = gl.getUniformLocation(this.program, "MV");
    this.uniforms.P = gl.getUniformLocation(this.program, "P");
    
    this.MV = mat4();
    this.P = mat4();
    
    this.render = function () {
        gl.useProgram( this.program );

        gl.bindBuffer( gl.ARRAY_BUFFER, this.positions.buffer );
        gl.vertexAttribPointer( this.positions.attributeLoc, this.positions.numComponents,
            gl.FLOAT, gl.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT, 0 );
        
        gl.bindBuffer( gl.ARRAY_BUFFER, this.colorVals.buffer );
        gl.vertexAttribPointer( this.colorVals.attributeLoc, this.colorVals.buffer,
            gl.FLOAT, gl.FALSE, 3 * Float32Array.BYTES_PER_ELEMENT, 0 );
 
        gl.bindBuffer( gl.ELEMENT_ARRAY_BUFFER, this.indices.buffer );
        gl.uniformMatrix4fv(this.uniforms.P, gl.FALSE, flatten(this.P));
        gl.uniformMatrix4fv(this.uniforms.MV, gl.FALSE, flatten(this.MV));
       
        // Draw the cone's base
        //
        gl.drawElements( gl.TRIANGLE_FAN, this.indices.count, gl.UNSIGNED_SHORT, 0 );

        // Draw the cone's top
        //
        var offset = this.indices.count * 2 /* sizeof(UNSIGNED_INT) */;
        gl.drawElements( gl.TRIANGLE_FAN, this.indices.count, gl.UNSIGNED_SHORT, offset );
    }
};