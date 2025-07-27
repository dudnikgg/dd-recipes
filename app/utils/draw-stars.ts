type Star = {
  x: number;
  y: number;
  size: number;
  speed: number;
  alpha: number;
  direction: number;
};

export function drawStars(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return () => {};
  }

  const stars: Star[] = Array.from({ length: 200 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 2,
    speed: 0.2 + Math.random() * 0.4,
    alpha: 0.5 + Math.random() * 0.9,
    direction: Math.random() < 0.5 ? 1 : -1,
  }));

  let lastTime = 0;
  let animationId: number;
  const FRAME_THROTTLE = 1000 / 30; // 30 FPS cap
  const context = ctx;

  const PI2 = Math.PI * 2;

  function animate(timestamp: number) {
    context.fillStyle = "#f8f8f2";

    const deltaTime = timestamp - lastTime;
    if (deltaTime < FRAME_THROTTLE) {
      animationId = requestAnimationFrame(animate);
      return;
    }
    lastTime = timestamp;

    context.clearRect(0, 0, canvas.width, canvas.height);

    for (const star of stars) {
      star.alpha += 0.01 * star.direction;
      if (star.alpha >= 1 || star.alpha <= 0.3) {
        star.direction *= -1;
      }
    }

    for (const star of stars) {
      context.globalAlpha = star.alpha;
      context.beginPath();
      context.arc(star.x, star.y, star.size, 0, PI2);
      context.fill();
    }

    animationId = requestAnimationFrame(animate);
  }

  animate(0);

  return () => cancelAnimationFrame(animationId);
}

export function resizeCanvas(canvas: HTMLCanvasElement) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
