<template>
  <div class="needle-display">
    <canvas class="needle-display__canvas" ref="canvas" />
  </div>
</template>

<script>
  const displayConsts = {
    speedGradients: {
      current: ['blue', 'blue'],
      total: ['green', 'green'],
      fromMax: ['red', 'red'],
    },
    shadows: {
      speed: {
        current: '#00b8fe',
        total: '#00b8fe',
        fromMax: '#f7b733',
      }
    },
    styles: {
      dialWidth: 20,
      dialShadow: 10,
      miniDialWidth: 5,
      markLength: 25,
      markWidth: 2,
      markFont: "700 1.5rem Arial",
      needleStyle: "black",
      needleWidth: 2,
      numberValueColor: "black",
      numberValueStyle: "700 3.5rem Arial",
      numberBpsColor: "black",
      numberBpsStyle: "700 2rem Arial",
    },
    angles: {
      from: 1/12 * Math.PI + Math.PI / 2,
      to: (2 - 1/12) * Math.PI + Math.PI / 2,
    }
  };
  const drawFunctions = {
    needle(canvas, ctx, rotation) {
      let xCenter = canvas.width / 2;
      let yCenter = canvas.height / 2;
      ctx.save();
      ctx.strokeStyle = displayConsts.styles.needleStyle;
      ctx.lineWidth = displayConsts.styles.needleWidth;
      ctx.translate(xCenter, yCenter);
      ctx.rotate(rotation);
      ctx.strokeRect(xCenter * 0.4, -1 / 2, xCenter * 0.6 - displayConsts.styles.dialShadow, 1);
      ctx.restore();
    },
    dial(canvas, ctx, style, shadow, fromAngle, toAngle) {
      let xCenter = canvas.width / 2;
      let yCenter = canvas.height / 2;

      ctx.beginPath();
      ctx.lineWidth = displayConsts.styles.dialWidth;
      ctx.shadowBlur = displayConsts.styles.dialShadow;
      ctx.shadowColor = shadow;
      ctx.strokeStyle = style;

      ctx.arc(xCenter, yCenter, xCenter-(displayConsts.styles.dialWidth/2 + displayConsts.styles.dialShadow), fromAngle, toAngle);
      ctx.stroke();
    },
    miniDial(canvas, ctx) {
      let xCenter = canvas.width / 2;
      let yCenter = canvas.height / 2;

      ctx.beginPath();
      ctx.lineWidth = displayConsts.styles.miniDialWidth;
      //ctx.shadowBlur = displayConsts.styles.miniDialShadow;
      ctx.shadowBlur = "";
      //ctx.shadowColor = "";
      ctx.strokeStyle = "red";

      ctx.arc(xCenter, yCenter, 0.4*xCenter, 0, 2*Math.PI);
      ctx.stroke();
    },
    dialMarks(canvas, ctx, points) {
      let xCenter = canvas.width / 2;
      let yCenter = canvas.height / 2;
      let stepSize = (displayConsts.angles.to - displayConsts.angles.from) / (points.length - 1);
      ctx.lineWidth = displayConsts.styles.markWidth;
      ctx.textAlign = "center";
      points.forEach((val, idx) => {
        ctx.save();
        ctx.translate(xCenter, yCenter);
        let rotation = idx * stepSize + displayConsts.angles.from;
        ctx.rotate(rotation);
        ctx.strokeStyle = "#333";
        ctx.fillStyle = "#333";
        ctx.strokeRect(xCenter-displayConsts.styles.dialWidth, -1 / 2, -displayConsts.styles.markLength, 1);
        ctx.restore();

        let x = 1 + 0.7 * Math.cos(rotation);
        let y = 1 + 0.7 * Math.sin(rotation) + 0.025;

        ctx.font = displayConsts.styles.markFont;
        ctx.fillText(val.toHumanString(3, 0, 1024), x * xCenter, y * yCenter);
      });
    },
    positionAngle(points, val) {
      let idx = points.findIndex(p => p >= val);
      if (val == 0 || points[idx] == val) {
        return displayConsts.angles.from;
      }
      let stepSize = (displayConsts.angles.to - displayConsts.angles.from) / (points.length - 1);
      let delta = 0;
      if (idx < 0) {
        idx = points.length;
      } else {
        let min = idx > 0 ? points[idx - 1] : 0;
        let max = points[idx];
        delta = (val - min) / (max - min);
      }
      return (delta + idx - 1) * stepSize + displayConsts.angles.from;
    },
    number(canvas, ctx, value, substr) {
      let xCenter = canvas.width / 2;
      let yCenter = canvas.height / 2;
      ctx.shadowBlur = "";
      ctx.textAlign = "center";
      ctx.fillStyle = displayConsts.styles.numberBpsColor;
      ctx.font = displayConsts.styles.numberBpsStyle;
      ctx.fillText(substr, xCenter, yCenter + 50);
      ctx.fillStyle = displayConsts.styles.numberValueColor;
      ctx.font = displayConsts.styles.numberValueStyle;
      ctx.fillText(value.toHumanString(3, 2, 1024), xCenter, yCenter);
    }
  };

  export default {
    name: "NeedleDisplay",
    props: {
      points: !Array,
      value: !Number,
      substr: !String
    },
    data() {
      return {
        canvas: null,
        canvasContext: null,
        colors: {},
        maxValue: this.value,
        intValue: this.value
      }
    },
    mounted() {
      this.canvas = this.$refs.canvas;
      this.canvasContext = this.canvas.getContext("2d");
      this.canvasContext.scale(1, 1);
      this.initialize();
    },
    watch: {
      'value'() {
        this.intValue = parseFloat(this.value);
        if (this.maxValue < this.intValue) {
          this.maxValue = this.intValue;
        }
        this.redraw();
      }
    },
    methods: {
      initialize() {
        for (var color in displayConsts.speedGradients) {
          let gradient = this.colors[color] = this.canvasContext.createLinearGradient(0, this.canvas.width, 0, 0)
          displayConsts.speedGradients[color].forEach((c, idx) => gradient.addColorStop(idx, c));
        }
        this.redraw();
      },
      reset() {
        this.intValue = this.maxValue = 0;
        this.redraw();
      },
      redraw() {
        this.canvas.height = this.canvas.scrollHeight;
        this.canvas.width = this.canvas.scrollWidth;
        let maxValAngle = drawFunctions.positionAngle(this.points, this.maxValue);
        let currentValAngle = drawFunctions.positionAngle(this.points, this.intValue);
        drawFunctions.dialMarks(this.canvas, this.canvasContext, this.points);
        drawFunctions.dial(this.canvas, this.canvasContext,
          this.colors.total,
          displayConsts.shadows.speed.total,
          displayConsts.angles.from, displayConsts.angles.to
        );
        drawFunctions.dial(this.canvas, this.canvasContext,
          this.colors.current,
          displayConsts.shadows.speed.current,
          displayConsts.angles.from, currentValAngle
        );
        drawFunctions.dial(this.canvas, this.canvasContext,
          this.colors.fromMax,
          displayConsts.shadows.speed.fromMax,
          currentValAngle, maxValAngle
        );
        drawFunctions.needle(this.canvas, this.canvasContext, currentValAngle);
        drawFunctions.miniDial(this.canvas, this.canvasContext);
        drawFunctions.number(this.canvas, this.canvasContext, this.intValue, this.substr);
      }
    }
  }
</script>
