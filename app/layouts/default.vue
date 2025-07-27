<script setup lang="ts">
const authStore = useAuthStore();
await authStore.init();

const { gsap } = useGsap();

const starsCanvas = ref<HTMLCanvasElement | null>(null);
const floatAnimations: Record<string, GSAPTween> = {};
let stopStarsAnimation: (() => void) | null = null;
let animationHasRun = false;

const ingredientRefs = useIngredientRefs();
const pan = ref<ComponentPublicInstance | null>(null);

onMounted(() => {
  if (!starsCanvas.value) {
    return;
  }

  resizeCanvas(starsCanvas.value);
  stopStarsAnimation = drawStars(starsCanvas.value);

  window.addEventListener("resize", () => {
    if (starsCanvas.value)
      resizeCanvas(starsCanvas.value);
  });

  Object.entries(ingredientRefs).forEach(([key, ingRef], i) => {
    floatAnimations[key] = gsap.to(ingRef.value, {
      y: Math.random() * 10,
      duration: 0.5 + Math.random(),
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
      delay: i * 0.1,
    });
  });
});

onUnmounted(() => {
  if (stopStarsAnimation) {
    stopStarsAnimation();
  }
});

function onClick() {
  if (animationHasRun) {
    return;
  }

  Object.values(floatAnimations).forEach(anim => anim.kill());

  const dropZone = {
    x: 0.15,
    y: 0.4,
    width: 0.5,
    height: 0.4,
  };

  type Spot = {
    x: number;
    y: number;
    z?: number;
  };
  const ingredientDropSpots: Record<string, Spot> = {
    garlic: { x: 0.1, y: 0.4 },
    cucumber: { x: 0.6, y: 0.1, z: 45 },
    tomato: { x: 0.8, y: 0.4 },
    carrot: { x: 0.3, y: 0.8, z: -97 },
    salt: { x: 0.6, y: -1, z: -120 },
    egg: { x: 0.7, y: 0.8, z: 45 },
    broccoli: { x: 0.4, y: 0.5 },
  };

  const tl = gsap.timeline();

  const panImgElement = (pan.value?.$el as HTMLElement) ?? null;
  const panRect = panImgElement.getBoundingClientRect();

  const zoneX = panRect.left + panRect.width * dropZone.x;
  const zoneY = panRect.top + panRect.height * dropZone.y;
  const zoneW = panRect.width * dropZone.width;
  const zoneH = panRect.height * dropZone.height;

  Object.entries(ingredientRefs).forEach(([key, ingRef], i) => {
    const el = ingRef.value;
    if (!el || !(el instanceof Element)) {
      return;
    }

    const iconRect = el.getBoundingClientRect();

    const raw = ingredientDropSpots[key];
    const spot: Spot = raw ?? { x: 0.5, y: 0.5 };

    const targetX = zoneX + zoneW * spot.x;
    const targetY = zoneY + zoneH * spot.y;

    const dx = targetX - (iconRect.left + iconRect.width / 2);
    const dy = targetY - (iconRect.top + iconRect.height / 2);

    tl.to(ingRef.value, {
      x: dx,
      y: dy,
      rotate: spot.z ?? 0,
      duration: 0.6,
      ease: "power2.out",
    }, i * 0.1);
  });

  animationHasRun = true;
}
</script>

<template>
  <div class="grid grid-rows-[auto_1fr_auto] min-h-dvh">
    <AppNavbar />

    <main class="row-span-1 grid grid-cols-1 min-h-0">
      <canvas ref="starsCanvas" class="fixed inset-0 z-[-1] block bg-base-300  size-full" />

      <div class="hero relative w-full">
        <div class="hero-content text-base-content text-center container mx-auto">
          <div class="max-w-2xl flex">
            <div class="flex flex-col w-md">
              <template v-if="!authStore.user">
                <slot />
              </template>
            </div>

            <div class="hidden 2xl:block absolute bottom-0 h-full w-full right-0 -z-10" @click="onClick">
              <div :ref="el => ingredientRefs.garlic.value = el" class="absolute top-1/2 left-20">
                <NuxtIcon
                  name="noto:garlic"
                  size="150"
                />
              </div>

              <div :ref="el => ingredientRefs.cucumber.value = el" class="absolute top-1/6 left-1/8">
                <NuxtIcon
                  name="noto:cucumber"
                  size="150"
                />
              </div>

              <div :ref="el => ingredientRefs.tomato.value = el" class="absolute top-1/4 left-1/3">
                <NuxtIcon
                  name="noto:tomato"
                  size="150"
                />
              </div>

              <div :ref="el => ingredientRefs.carrot.value = el" class="absolute top-1/8 right-50">
                <NuxtIcon
                  name="noto:carrot"
                  size="150"
                />
              </div>

              <div :ref="el => ingredientRefs.salt.value = el" class="absolute top-1/12 right-1/3">
                <NuxtIcon
                  name="noto:salt"
                  size="150"
                />
              </div>

              <div :ref="el => ingredientRefs.egg.value = el" class="absolute bottom-1/12 right-1/2">
                <NuxtIcon
                  name="twemoji:egg"
                  size="150"
                />
              </div>

              <div :ref="el => ingredientRefs.broccoli.value = el" class="absolute bottom-1/11 left-1/12">
                <NuxtIcon
                  name="noto:broccoli"
                  size="150"
                />
              </div>

              <NuxtImg
                ref="pan"
                src="/pan.png"
                class="absolute bottom-0 right-0 -z-20"
                sizes="100vw sm:20vw xl:30vw"
              />
            </div>
          </div>
        </div>
      </div>
    </main>

    <footer class="footer sm:footer-horizontal footer-center bg-base-300 text-base-content p-4">
      <aside>
        <p>Copyright © {{ new Date().getFullYear() }} - Denys Dudnik &lt;<a href="mailto:dudnik.gg@gmail.com">dudnik.gg@gmail.com</a>&gt; </p>
      </aside>
    </footer>
  </div>
</template>
