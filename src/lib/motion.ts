type Bezier = [number, number, number, number];

export const MOTION = {
  duration: {
    micro: 0.15,
    quick: 0.25,
    component: 0.45,
    experience: 0.8,
  },
  easing: {
    standard: [0.4, 0, 0.2, 1] as Bezier,
    luxury: [0.16, 1, 0.3, 1] as Bezier,
    soft: [0.25, 0.46, 0.45, 0.94] as Bezier,
    exit: [0.3, 0, 0.8, 0.15] as Bezier,
  },
  stagger: {
    micro: 0.04,
    component: 0.08,
    experience: 0.12,
  },
};
