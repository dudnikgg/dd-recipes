import type { TemplateRef } from "vue";

type IngredientKey = "garlic" | "cucumber" | "broccoli" | "tomato"
  | "egg" | "salt" | "carrot";

export type IngredientRefs = Record<IngredientKey, TemplateRef>;
type IngredientElements = Record<IngredientKey, HTMLElement | null>;

type Spot = {
  x: number;
  y: number;
  z?: number;
};

export type FloatAnimations = Record<IngredientKey, GSAPTween>;

function drawIngredients(ingredientRefs: IngredientRefs): FloatAnimations | undefined {
  if (!ingredientRefs) {
    return;
  }

  const ingredientElements = Object.keys(ingredientRefs).reduce((acc, curr) => {
    return {
      ...acc,
      [curr]: ingredientRefs[curr as IngredientKey].value,
    };
  }, {} as IngredientElements);

  const { gsap } = useGsap();

  const floatAnimations: FloatAnimations = {} as FloatAnimations;

  Object.entries(ingredientElements).forEach(([key, ingEl], i) => {
    if (ingEl instanceof Element) {
      floatAnimations[key as IngredientKey] = gsap.to(ingEl, {
        y: Math.random() * 10,
        duration: 0.5 + Math.random(),
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: i * 0.1,
      });
    }
  });

  return floatAnimations;
}

function animateToSpot(spotRef: TemplateRef, ingredientRefs: IngredientRefs) {
  const { gsap } = useGsap();

  const tl = gsap.timeline();

  const dropZone = {
    x: 0.15,
    y: 0.4,
    width: 0.5,
    height: 0.4,
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

  if (spotRef.value instanceof Element === false) {
    return;
  }

  const spotRect = spotRef.value.getBoundingClientRect();

  const zoneX = spotRect.left + spotRect.width * dropZone.x;
  const zoneY = spotRect.top + spotRect.height * dropZone.y;
  const zoneW = spotRect.width * dropZone.width;
  const zoneH = spotRect.height * dropZone.height;

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
};

export { animateToSpot, drawIngredients };
