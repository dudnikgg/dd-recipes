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

  const stars: Star[] = [];
  const starCount = 200;
  const maxStarSize = 2;

  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      size: Math.random() * maxStarSize,
      speed: 0.2 + Math.random() * 0.5,
      alpha: 0.5 + Math.random() * 0.5,
      direction: Math.random() < 0.5 ? 1 : -1,
    });
  }

  let animationId: number;

  function animate() {
    if (!ctx) {
      return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const star of stars) {
      ctx.globalAlpha = star.alpha;
      ctx.fillStyle = "#f8f8f2";
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
      ctx.fill();

      // Twinkle effect
      star.alpha += 0.01 * star.direction;
      if (star.alpha >= 1 || star.alpha <= 0.3) {
        star.direction *= -1;
      }
    }

    animationId = requestAnimationFrame(animate);
  }

  animate();

  return () => cancelAnimationFrame(animationId);
}

export function resizeCanvas(canvas: HTMLCanvasElement) {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
