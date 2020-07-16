export default class AnimationLoop {

  constructor(autoStart) {
    this.renderLoopFuncs = new Set();
    this.isStop = true;
    if (autoStart) {
      this.start();
    }
  }

  start() {
    this.isStop = false;
    animate.bind(this)();
  }

  stop() {
    this.isStop = true;
  }

}

function animate() {
  if (this.isStop) return;
  this.renderLoopFuncs.forEach((func) => func.call(undefined));
  requestAnimationFrame(animate.bind(this));
}
