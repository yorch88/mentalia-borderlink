// Animación base ultra suave
const smoothTransition = {
    duration: 1.2,
    ease: [0.22, 1, 0.36, 1],
  };
  
  export const fadeUp = {
    hidden: {
      opacity: 0,
      y: 25,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: smoothTransition,
    },
  };
  
  export const fadeLeft = {
    hidden: {
      opacity: 0,
      x: -30,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: smoothTransition,
    },
  };
  
  export const fadeRight = {
    hidden: {
      opacity: 0,
      x: 30,
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: smoothTransition,
    },
  };
  
  export const staggerContainer = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.18,
        delayChildren: 0.2,
      },
    },
  };