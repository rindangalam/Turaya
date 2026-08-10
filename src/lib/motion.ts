export const MOTION = {
  duration: {
    micro: 0.15,
    quick: 0.25,
    component: 0.45,
    experience: 0.8,
  },
  easing: {
    standard: [0.4, 0, 0.2, 1],
    luxury: [0.16, 1, 0.3, 1],
    soft: [0.25, 0.46, 0.45, 0.94],
    exit: [0.3, 0, 0.8, 0.15],
  },
  stagger: {
    micro: 0.04,
    component: 0.08,
    experience: 0.12,
  },
} as const;
