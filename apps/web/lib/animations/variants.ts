import {Variants} from "framer-motion"

/**
 * Reusable Framer Motion Animation Variants
 *
 * Centralized animation variants for consistent motion design across the app.
 * Use these with motion components for performant, accessible animations.
 *
 * Usage:
 * <motion.div variants={fadeIn} initial="hidden" animate="visible">
 */

// Fade Animations
export const fadeIn: Variants = {
  hidden: {opacity: 0},
  visible: {
    opacity: 1,
    transition: {duration: 0.3, ease: "easeOut"},
  },
}

export const fadeInUp: Variants = {
  hidden: {opacity: 0, y: 20},
  visible: {
    opacity: 1,
    y: 0,
    transition: {duration: 0.4, ease: "easeOut"},
  },
}

export const fadeInDown: Variants = {
  hidden: {opacity: 0, y: -20},
  visible: {
    opacity: 1,
    y: 0,
    transition: {duration: 0.4, ease: "easeOut"},
  },
}

export const fadeInLeft: Variants = {
  hidden: {opacity: 0, x: -20},
  visible: {
    opacity: 1,
    x: 0,
    transition: {duration: 0.4, ease: "easeOut"},
  },
}

export const fadeInRight: Variants = {
  hidden: {opacity: 0, x: 20},
  visible: {
    opacity: 1,
    x: 0,
    transition: {duration: 0.4, ease: "easeOut"},
  },
}

// Scale Animations
export const scaleIn: Variants = {
  hidden: {scale: 0.8, opacity: 0},
  visible: {
    scale: 1,
    opacity: 1,
    transition: {duration: 0.3, ease: "easeOut"},
  },
}

export const scaleUp: Variants = {
  hidden: {scale: 0.95, opacity: 0},
  visible: {
    scale: 1,
    opacity: 1,
    transition: {duration: 0.2, ease: "easeOut"},
  },
}

// Slide Animations
export const slideInUp: Variants = {
  hidden: {y: "100%", opacity: 0},
  visible: {
    y: 0,
    opacity: 1,
    transition: {duration: 0.4, ease: "easeOut"},
  },
}

export const slideInDown: Variants = {
  hidden: {y: "-100%", opacity: 0},
  visible: {
    y: 0,
    opacity: 1,
    transition: {duration: 0.4, ease: "easeOut"},
  },
}

export const slideInLeft: Variants = {
  hidden: {x: "-100%", opacity: 0},
  visible: {
    x: 0,
    opacity: 1,
    transition: {duration: 0.4, ease: "easeOut"},
  },
}

export const slideInRight: Variants = {
  hidden: {x: "100%", opacity: 0},
  visible: {
    x: 0,
    opacity: 1,
    transition: {duration: 0.4, ease: "easeOut"},
  },
}

// Stagger Children
export const staggerContainer: Variants = {
  hidden: {opacity: 0},
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

export const staggerItem: Variants = {
  hidden: {opacity: 0, y: 20},
  visible: {
    opacity: 1,
    y: 0,
    transition: {duration: 0.4, ease: "easeOut"},
  },
}

// Page Transitions
export const pageTransition: Variants = {
  hidden: {opacity: 0, x: -20},
  visible: {
    opacity: 1,
    x: 0,
    transition: {duration: 0.3, ease: "easeOut"},
  },
  exit: {
    opacity: 0,
    x: 20,
    transition: {duration: 0.2, ease: "easeIn"},
  },
}

// Modal/Dialog Animations
export const modalOverlay: Variants = {
  hidden: {opacity: 0},
  visible: {
    opacity: 1,
    transition: {duration: 0.2},
  },
  exit: {
    opacity: 0,
    transition: {duration: 0.2},
  },
}

export const modalContent: Variants = {
  hidden: {opacity: 0, scale: 0.95, y: 20},
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: "spring",
      damping: 25,
      stiffness: 300,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.95,
    y: 20,
    transition: {duration: 0.2},
  },
}

// Hover & Tap Animations (use with whileHover and whileTap)
export const hoverScale = {
  scale: 1.05,
  transition: {duration: 0.2},
}

export const tapScale = {
  scale: 0.95,
  transition: {duration: 0.1},
}

// Number Counter Animation
export const counterVariants: Variants = {
  hidden: {opacity: 0},
  visible: {
    opacity: 1,
    transition: {duration: 0.5},
  },
}

// Skeleton Loading Animation
export const skeletonPulse: Variants = {
  hidden: {opacity: 0.6},
  visible: {
    opacity: 1,
    transition: {
      repeat: Infinity,
      repeatType: "reverse",
      duration: 1,
    },
  },
}

// Card Animations
export const cardHover = {
  y: -4,
  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
  transition: {duration: 0.2},
}

// Nav Menu Animations
export const navMenuVariants: Variants = {
  hidden: {
    opacity: 0,
    y: -10,
    scaleY: 0.95,
  },
  visible: {
    opacity: 1,
    y: 0,
    scaleY: 1,
    transition: {
      duration: 0.2,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: -10,
    scaleY: 0.95,
    transition: {
      duration: 0.15,
      ease: "easeIn",
    },
  },
}
