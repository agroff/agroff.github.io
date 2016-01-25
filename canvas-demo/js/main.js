var gl;

function initGL(canvas) {
    try {
        gl = canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
    } catch (e) {
    }
    if (!gl) {
        alert("Could not initialise WebGL, sorry :-(");
    }
}


function getShader(gl, id) {
    var shaderScript = document.getElementById(id);
    if (!shaderScript) {
        return null;
    }

    var str = "";
    var k = shaderScript.firstChild;
    while (k) {
        if (k.nodeType == 3) {
            str += k.textContent;
        }
        k = k.nextSibling;
    }

    var shader;
    if (shaderScript.type == "x-shader/x-fragment") {
        shader = gl.createShader(gl.FRAGMENT_SHADER);
    } else if (shaderScript.type == "x-shader/x-vertex") {
        shader = gl.createShader(gl.VERTEX_SHADER);
    } else {
        return null;
    }

    gl.shaderSource(shader, str);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        alert(gl.getShaderInfoLog(shader));
        return null;
    }

    return shader;
}


var shaderProgram;

function initShaders() {
    var fragmentShader = getShader(gl, "shader-fs");
    var vertexShader = getShader(gl, "shader-vs");

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }

    gl.useProgram(shaderProgram);

    shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
    gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

    shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
    gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

    shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
    shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
}


var mvMatrix = mat4.create();
var mvMatrixStack = [];
var pMatrix = mat4.create();

function mvPushMatrix() {
    var copy = mat4.create();
    mat4.set(mvMatrix, copy);
    mvMatrixStack.push(copy);
}

function mvPopMatrix() {
    if (mvMatrixStack.length == 0) {
        throw "Invalid popMatrix!";
    }
    mvMatrix = mvMatrixStack.pop();
}


function setMatrixUniforms() {
    gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
    gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
}


function degToRad(degrees) {
    return degrees * Math.PI / 180;
}


var pyramidVertexPositionBuffer;
var pyramidVertexColorBuffer;
var starVertexPositionBuffer;
var starVertexTextureCoordBuffer;

var dots = [];

function drawDot() {
    gl.activeTexture(gl.TEXTURE0);
    gl.uniform1i(shaderProgram.samplerUniform, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, starVertexTextureCoordBuffer);
    gl.vertexAttribPointer(shaderProgram.textureCoordAttribute, starVertexTextureCoordBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, starVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, starVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, starVertexPositionBuffer.numItems);
}



function Dot(startingDistance, rotationSpeed) {
    this.angle = 0;
    this.dist = startingDistance;
    this.rotationSpeed = rotationSpeed;

    // Set the colors to a starting value.
    this.randomiseColors();
}

Dot.prototype.draw = function (tilt, spin) {
    mvPushMatrix();

    // Move to the star's position
    mat4.rotate(mvMatrix, degToRad(this.angle), [0.0, 1.0, 0.0]);
    mat4.translate(mvMatrix, [this.dist, 0.0, 0.0]);

    // Rotate back so that the star is facing the viewer
    mat4.rotate(mvMatrix, degToRad(-this.angle), [0.0, 1.0, 0.0]);
    mat4.rotate(mvMatrix, degToRad(-tilt), [1.0, 0.0, 0.0]);


    // All stars spin around the Z axis at the same rate
    mat4.rotate(mvMatrix, degToRad(spin), [0.0, 0.0, 1.0]);

    // Draw the star in its main color
    gl.uniform3f(shaderProgram.colorUniform, this.r, this.g, this.b);
    drawDot();

    mvPopMatrix();
};


var effectiveFPMS = 60 / 1000;
Dot.prototype.animate = function (elapsedTime) {
    this.angle += this.rotationSpeed * effectiveFPMS * elapsedTime;

    // Decrease the distance, resetting the star to the outside of
    // the spiral if it's at the center.
    this.dist -= 0.01 * effectiveFPMS * elapsedTime;
    if (this.dist < 0.0) {
        this.dist += 5.0;
        this.randomiseColors();
    }

};


Dot.prototype.randomiseColors = function () {
    // Give the star a random color for normal
    // circumstances...
    this.r = Math.random();
    this.g = Math.random();
    this.b = Math.random();
};


function initBuffers() {

    starVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, starVertexPositionBuffer);
    vertices = [
        -1.0, -1.0,  0.0,
        1.0, -1.0,  0.0,
        -1.0,  1.0,  0.0,
        1.0,  1.0,  0.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    starVertexPositionBuffer.itemSize = 3;
    starVertexPositionBuffer.numItems = 4;

    starVertexTextureCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, starVertexTextureCoordBuffer);
    var textureCoords = [
        0.0, 0.0,
        1.0, 0.0,
        0.0, 1.0,
        1.0, 1.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(textureCoords), gl.STATIC_DRAW);
    starVertexTextureCoordBuffer.itemSize = 2;
    starVertexTextureCoordBuffer.numItems = 4;


    pyramidVertexPositionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pyramidVertexPositionBuffer);
    var vertices = [
        // Front face
        0.0,  1.0,  0.0,
        -1.0, -1.0,  1.0,
        1.0, -1.0,  1.0,

        // Right face
        0.0,  1.0,  0.0,
        1.0, -1.0,  1.0,
        1.0, -1.0, -1.0,

        // Back face
        0.0,  1.0,  0.0,
        1.0, -1.0, -1.0,
        -1.0, -1.0, -1.0,

        // Left face
        0.0,  1.0,  0.0,
        -1.0, -1.0, -1.0,
        -1.0, -1.0,  1.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
    pyramidVertexPositionBuffer.itemSize = 3;
    pyramidVertexPositionBuffer.numItems = 12;

    pyramidVertexColorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, pyramidVertexColorBuffer);
    var opacity = 0.5
    var colors = [
        // Front face
        1.0, 0.0, 0.0, opacity,
        0.0, 1.0, 0.0, opacity,
        0.0, 0.0, 1.0, opacity,

        // Right face
        1.0, 0.0, 0.0, opacity,
        0.0, 0.0, 1.0, opacity,
        0.0, 1.0, 0.0, opacity,

        // Back face
        1.0, 0.0, 0.0, opacity,
        0.0, 1.0, 0.0, opacity,
        0.0, 0.0, 1.0, opacity,

        // Left face
        1.0, 0.0, 0.0, 1.0,
        0.0, 0.0, 1.0, 1.0,
        0.0, 1.0, 0.0, 1.0
    ];
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    pyramidVertexColorBuffer.itemSize = 4;
    pyramidVertexColorBuffer.numItems = 12;


}


var rPyramid = 0;

function drawScene() {
    gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);

    mat4.identity(mvMatrix);

    mat4.translate(mvMatrix, [0, 0.0, -8.0]);

    mvPushMatrix();
    mat4.rotate(mvMatrix, degToRad(rPyramid), [0, 1, 0]);

    gl.bindBuffer(gl.ARRAY_BUFFER, pyramidVertexPositionBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexPositionAttribute, pyramidVertexPositionBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.bindBuffer(gl.ARRAY_BUFFER, pyramidVertexColorBuffer);
    gl.vertexAttribPointer(shaderProgram.vertexColorAttribute, pyramidVertexColorBuffer.itemSize, gl.FLOAT, false, 0, 0);

    gl.blendFunc(gl.SRC_ALPHA, gl.ONE);
    gl.enable(gl.BLEND);
    gl.disable(gl.DEPTH_TEST);
    gl.uniform1f(shaderProgram.alphaUniform, 0.5);

    setMatrixUniforms();
    gl.drawArrays(gl.TRIANGLES, 0, pyramidVertexPositionBuffer.numItems);

    mvPopMatrix();

    for (var i in dots) {
        dots[i].draw();
    }


}


var lastTime = 0;

function animate() {
    var timeNow = new Date().getTime();
    if (lastTime != 0) {
        var elapsed = timeNow - lastTime;

        rPyramid += (90 * elapsed) / 2000.0;

        for (var i in dots) {
            dots[i].animate(elapsed);
        }
    }
    lastTime = timeNow;
}


function tick() {
    requestAnimFrame(tick);
    drawScene();
    animate();
}


function webGLStart() {
    var canvas = document.getElementById("lesson01-canvas");
    initGL(canvas);
    initShaders()
    initBuffers();

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.enable(gl.DEPTH_TEST);

    dots[0] = new Dot(0.2, 0.5);

    tick();

    APP.init();
}