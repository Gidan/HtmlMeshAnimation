const options = {
  lineStroke: "rgba(200,200,200, 1.0)",
  vertexSpacing: 80,
  defaultSpeed: 0.1,
  variantSpeed: 0.1
};

let vertexes = [];
let initialized = false;

let calcCanvasSize = function() {
  w = canvasBody.width = window.innerWidth;
  h = canvasBody.height = window.innerHeight;
};

window.addEventListener("resize", function() {
  init();
});

let drawLine = function(point1, point2) {
  drawArea.lineWidth = 0.5;
  drawArea.strokeStyle = options.lineStroke;
  drawArea.beginPath();
  drawArea.moveTo(point1.x, point1.y);
  drawArea.lineTo(point2.x, point2.y);
  drawArea.closePath();
  drawArea.stroke();
};

let linkPoints = function(vertexes) {
  for (let i = 0; i < r - 1; i++) {
    for (let j = 0; j < v - 1; j++) {
      const point = vertexes[i][j];

      const point1 = vertexes[i][j + 1];
      const point2 = vertexes[i + 1][j + 1];
      const point3 = vertexes[i + 1][j];

      drawLine(point, point1);
      drawLine(point, point2);
      drawLine(point, point3);
    }
  }
};

Vertex = function(xPos, yPos) {
  //const rowOffset = w / opts.particlesPerRow / 2;
  const rowOffset = 0;
  this.initialX =
    (xPos / (v - 1)) * w + (yPos % 2 == 0 ? 0 : rowOffset) + Math.random() * 40;
  this.initialY = (yPos / (r - 1)) * h + Math.random() * 40;
  const offset = 10;
  this.maxX = this.initialX + offset;
  this.minX = this.initialX - offset;
  this.maxY = this.initialY + offset;
  this.minY = this.initialY - offset;
  this.x = this.initialX;
  this.y = this.initialY;

  this.speed = options.defaultSpeed + Math.random() * options.variantSpeed;
  this.directionAngle = Math.floor(Math.random() * 360);

  this.vector = {
    x: Math.cos(this.directionAngle) * this.speed,
    y: Math.sin(this.directionAngle) * this.speed
  };

  this.update = function() {
    this.clampPosition();
    this.x += this.vector.x;
    this.y += this.vector.y;
  };

  this.clampPosition = function() {
    if (this.x >= this.maxX || this.x <= this.minX) {
      this.vector.x *= -1;
    }
    if (this.y >= this.maxY || this.y <= this.minY) {
      this.vector.y *= -1;
    }
    if (this.x > w) this.x = w;
    if (this.y > h) this.y = h;
    if (this.x < 0) this.x = 0;
    if (this.y < 0) this.y = 0;
  };
};

function init() {
  calcCanvasSize();
  vertexes = [];
  r = h / options.vertexSpacing;
  v = w / options.vertexSpacing;
  for (let i = 0; i < r; i++) {
    const row = [];
    for (let j = 0; j < v; j++) {
      row.push(new Vertex(j, i));
    }
    vertexes.push(row);
  }
  if (!initialized) {
    initialized = true;
    window.requestAnimationFrame(loop);
  }
}

function loop() {
  drawArea.clearRect(0, 0, w, h);
  for (let i = 0; i < r; i++) {
    for (let j = 0; j < v; j++) {
      vertexes[i][j].update();
    }
  }

  linkPoints(vertexes);
  window.requestAnimationFrame(loop);
}

const canvasBody = document.getElementById("canvas");
const drawArea = canvasBody.getContext("2d");
init();
