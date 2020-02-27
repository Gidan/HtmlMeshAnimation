const options = {
  lineStroke: "rgba(200,200,200, 1.0)",
  vertexRows: 10,
  vertexesPerRow: 15,
  defaultSpeed: 0.1,
  variantSpeed: 0.1
};

const vertexes = [];

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
  for (let i = 0; i < options.vertexRows - 1; i++) {
    for (let j = 0; j < options.vertexesPerRow - 1; j++) {
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
    (xPos / (options.vertexesPerRow - 1)) * w +
    (yPos % 2 == 0 ? 0 : rowOffset) +
    Math.random() * 40;
  this.initialY = (yPos / (options.vertexRows - 1)) * h + Math.random() * 40;
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
    console.log(this.speed);
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
  for (let i = 0; i < options.vertexRows; i++) {
    const row = [];
    for (let j = 0; j < options.vertexesPerRow; j++) {
      row.push(new Vertex(j, i));
    }
    vertexes.push(row);
  }
  window.requestAnimationFrame(loop);
}

function loop() {
  window.requestAnimationFrame(loop);
  drawArea.clearRect(0, 0, w, h);
  for (let i = 0; i < options.vertexRows; i++) {
    for (let j = 0; j < options.vertexesPerRow; j++) {
      vertexes[i][j].update();
    }
  }

  linkPoints(vertexes);
}

const canvasBody = document.getElementById("canvas");
const drawArea = canvasBody.getContext("2d");
init();
