<script setup lang="ts">
const authStore = useAuthStore();
await authStore.init();

const starsCanvas = ref<HTMLCanvasElement | null>(null);
let stopStarsAnimation: (() => void) | null = null;
let floatAnimations: FloatAnimations | undefined;
let doesOnClickRan = false;

const ingredientRefs: IngredientRefs = {
  garlic: useTemplateRef("garlic"),
  cucumber: useTemplateRef("cucumber"),
  broccoli: useTemplateRef("broccoli"),
  tomato: useTemplateRef("tomato"),
  egg: useTemplateRef("egg"),
  salt: useTemplateRef("salt"),
  carrot: useTemplateRef("carrot"),
};
const pan = useTemplateRef("pan");

onMounted(() => {
  if (!starsCanvas.value) {
    return;
  }

  floatAnimations = drawIngredients(ingredientRefs);

  resizeCanvas(starsCanvas.value);
  stopStarsAnimation = drawStars(starsCanvas.value);

  window.addEventListener("resize", () => {
    if (starsCanvas.value) {
      resizeCanvas(starsCanvas.value);
    }
  });
});

onUnmounted(() => {
  if (stopStarsAnimation) {
    stopStarsAnimation();
  }

  if (floatAnimations) {
    Object.values(floatAnimations).forEach(anim => anim.kill());
  }
});

function onClick() {
  if (floatAnimations) {
    Object.values(floatAnimations).forEach(anim => anim.kill());
  }

  if (!doesOnClickRan) {
    animateToSpot(pan, ingredientRefs);
    doesOnClickRan = true;
  }
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
            <div class="flex flex-col w-md" @click="onClick">
              <NuxtPage />
            </div>

            <div class="hidden 2xl:block absolute bottom-0 h-full w-full right-0 -z-10">
              <div ref="garlic" class="absolute top-1/2 left-20">
                <NuxtIcon
                  name="noto:garlic"
                  size="150"
                />
              </div>

              <div ref="cucumber" class="absolute top-1/6 left-1/8">
                <NuxtIcon
                  name="noto:cucumber"
                  size="150"
                />
              </div>

              <div ref="tomato" class="absolute top-1/4 left-1/3">
                <NuxtIcon
                  name="noto:tomato"
                  size="150"
                />
              </div>

              <div ref="carrot" class="absolute top-1/8 right-50">
                <NuxtIcon
                  name="noto:carrot"
                  size="150"
                />
              </div>

              <div ref="salt" class="absolute top-1/12 right-1/3">
                <NuxtIcon
                  name="noto:salt"
                  size="150"
                />
              </div>

              <div ref="egg" class="absolute bottom-1/12 right-1/2">
                <NuxtIcon
                  name="twemoji:egg"
                  size="150"
                />
              </div>

              <div ref="broccoli" class="absolute bottom-1/11 left-1/12">
                <NuxtIcon
                  name="noto:broccoli"
                  size="150"
                />
              </div>

              <img
                ref="pan"
                src="/pan.png"
                class="absolute bottom-0 right-0 -z-20 w-[30vw] h-[50vh]"
              >
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
