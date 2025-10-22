# Animation Guide

This guide explains the comprehensive Framer Motion animation system built into this starter, showcasing professional motion design and reusable patterns.

## Table of Contents

- [Animation System](#animation-system)
- [Reusable Variants](#reusable-variants)
- [Animation Hooks](#animation-hooks)
- [Landing Page Examples](#landing-page-examples)
- [Best Practices](#best-practices)
- [Performance](#performance)

## Animation System

The animation system is built with **Framer Motion** and provides:

- ✅ Reusable animation variants
- ✅ Custom hooks for common patterns
- ✅ Scroll-triggered animations
- ✅ Number count-up effects
- ✅ Accessibility support (reduced motion)
- ✅ Performance optimizations

## Reusable Variants

Located in `lib/animations/variants.ts`, these are pre-built animation configurations you can use throughout your app.

### Fade Animations

```typescript
import {motion} from "framer-motion"
import {fadeIn, fadeInUp, fadeInDown} from "@/lib/animations/variants"

// Simple fade
<motion.div variants={fadeIn} initial="hidden" animate="visible">
  Content
</motion.div>

// Fade with upward motion
<motion.div variants={fadeInUp} initial="hidden" animate="visible">
  Content
</motion.div>
```

**Available fade variants:**
- `fadeIn` - Simple opacity fade
- `fadeInUp` - Fade + move up
- `fadeInDown` - Fade + move down
- `fadeInLeft` - Fade + move from left
- `fadeInRight` - Fade + move from right

### Scale Animations

```typescript
import {scaleIn, scaleUp} from "@/lib/animations/variants"

<motion.div variants={scaleIn} initial="hidden" animate="visible">
  Pop in effect
</motion.div>
```

**Available scale variants:**
- `scaleIn` - Scale from 80% to 100%
- `scaleUp` - Subtle scale from 95% to 100%

### Stagger Animations

Perfect for lists and grids:

```typescript
import {staggerContainer, staggerItem} from "@/lib/animations/variants"

<motion.div variants={staggerContainer} initial="hidden" animate="visible">
  {items.map((item) => (
    <motion.div key={item.id} variants={staggerItem}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

### Hover & Tap Animations

```typescript
import {hoverScale, tapScale} from "@/lib/animations/variants"

<motion.button whileHover={hoverScale} whileTap={tapScale}>
  Interactive Button
</motion.button>
```

### Modal Animations

```typescript
import {modalOverlay, modalContent} from "@/lib/animations/variants"

<motion.div variants={modalOverlay} initial="hidden" animate="visible" exit="exit">
  <motion.div variants={modalContent}>
    Modal content
  </motion.div>
</motion.div>
```

## Animation Hooks

Located in `lib/animations/hooks.ts`, these provide common animation patterns.

### useAnimateOnView

Trigger animations when elements enter the viewport:

```typescript
import {useAnimateOnView} from "@/lib/animations/hooks"
import {fadeInUp} from "@/lib/animations/variants"

function Component() {
  const {ref, controls} = useAnimateOnView()

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial="hidden"
      variants={fadeInUp}
    >
      Animates when scrolled into view
    </motion.div>
  )
}
```

**Options:**
```typescript
useAnimateOnView({
  threshold: 0.2,      // Percentage visible to trigger (default: 0.2)
  triggerOnce: true,   // Only animate once (default: true)
})
```

### useCountUp

Animate numbers counting up:

```typescript
import {useCountUp} from "@/lib/animations/hooks"

function StatCard() {
  const {ref, isInView} = useAnimateOnView()
  const count = useCountUp(isInView ? 1000 : 0, 2000) // target, duration

  return (
    <div ref={ref}>
      <span>{count}</span>
    </div>
  )
}
```

### useReducedMotion

Respect user's motion preferences:

```typescript
import {useReducedMotion} from "@/lib/animations/hooks"

function Component() {
  const prefersReducedMotion = useReducedMotion()

  return (
    <motion.div
      animate={prefersReducedMotion ? {} : {x: 100}}
    >
      Respects accessibility settings
    </motion.div>
  )
}
```

### useSequentialAnimation

Delay animations for sequential effects:

```typescript
import {useSequentialAnimation} from "@/lib/animations/hooks"

function Component() {
  const {ref, isInView} = useSequentialAnimation(500) // 500ms delay

  return (
    <motion.div
      ref={ref}
      animate={isInView ? "visible" : "hidden"}
      variants={fadeInUp}
    >
      Animates 500ms after scrolling into view
    </motion.div>
  )
}
```

## Landing Page Examples

The landing page (`app/page.tsx`) showcases various animation techniques:

### 1. Animated Background Gradients

```typescript
<motion.div
  className="absolute inset-0 bg-gradient-to-br from-primary/5"
  animate={{
    scale: [1, 1.1, 1],
    rotate: [0, 5, 0],
  }}
  transition={{
    duration: 20,
    repeat: Infinity,
    ease: "linear",
  }}
/>
```

### 2. Staggered Hero Content

```typescript
<motion.div
  variants={staggerContainer}
  initial="hidden"
  animate="visible"
>
  <motion.div variants={staggerItem}>Badge</motion.div>
  <motion.h1 variants={staggerItem}>Heading</motion.h1>
  <motion.p variants={staggerItem}>Description</motion.p>
  <motion.div variants={staggerItem}>Buttons</motion.div>
</motion.div>
```

### 3. Animated Text Gradients

```typescript
<motion.span
  className="bg-gradient-to-r from-primary to-blue-600 bg-clip-text"
  animate={{
    backgroundPosition: ["0%", "100%", "0%"],
  }}
  transition={{
    duration: 5,
    repeat: Infinity,
  }}
>
  Animated Text
</motion.span>
```

### 4. Interactive Buttons

```typescript
<motion.button
  whileHover={{scale: 1.05, y: -2}}
  whileTap={{scale: 0.95}}
  className="group"
>
  <span>Click me</span>
  <motion.div
    animate={{x: [0, 5, 0]}}
    transition={{
      duration: 1.5,
      repeat: Infinity,
    }}
  >
    <ArrowRight />
  </motion.div>
</motion.button>
```

### 5. Count-Up Stats

```typescript
function StatCard({end, suffix, label}) {
  const {ref, isInView} = useAnimateOnView()
  const count = useCountUp(isInView ? end : 0, 2000)

  return (
    <motion.div ref={ref} whileHover={{y: -5}}>
      <div>{count}{suffix}</div>
      <div>{label}</div>
    </motion.div>
  )
}
```

### 6. Parallax Scrolling

```typescript
const {scrollYProgress} = useScroll({
  target: containerRef,
  offset: ["start end", "end start"],
})

const y = useTransform(scrollYProgress, [0, 1], [100, -100])
const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

<motion.div style={{y, opacity}}>
  Parallax content
</motion.div>
```

### 7. 3D Card Rotations

```typescript
<motion.div
  whileHover={{
    scale: 1.05,
    rotateY: -5,
  }}
  style={{
    transformStyle: "preserve-3d",
  }}
>
  Card content
</motion.div>
```

### 8. Timeline Animations

```typescript
// Animated timeline line
<motion.div
  className="h-full w-0.5 bg-gradient-to-b"
  initial={{scaleY: 0}}
  animate={{scaleY: 1}}
  transition={{duration: 1.5}}
/>

// Timeline items
{items.map((item, i) => (
  <motion.div
    initial={{scale: 0}}
    animate={{scale: 1}}
    transition={{delay: i * 0.2}}
  >
    {item}
  </motion.div>
))}
```

### 9. Icon Rotations

```typescript
<motion.div
  whileHover={{rotate: 360, scale: 1.1}}
  transition={{duration: 0.6}}
>
  <Icon />
</motion.div>
```

### 10. Tech Stack Cards

```typescript
<motion.div
  whileHover={{
    scale: 1.1,
    rotateZ: [0, -5, 5, 0],
  }}
  whileTap={{scale: 0.95}}
>
  <motion.div
    className="absolute bottom-0 h-1 bg-gradient-to-r"
    initial={{width: 0}}
    whileHover={{width: "100%"}}
  />
</motion.div>
```

## Best Practices

### 1. Use Variants for Consistency

```typescript
// ✅ Good - reusable and consistent
<motion.div variants={fadeInUp} initial="hidden" animate="visible" />

// ❌ Avoid - inline animations hard to maintain
<motion.div
  initial={{opacity: 0, y: 20}}
  animate={{opacity: 1, y: 0}}
/>
```

### 2. Respect Reduced Motion

```typescript
const prefersReducedMotion = useReducedMotion()

<motion.div
  animate={prefersReducedMotion ? {opacity: 1} : {opacity: 1, x: 100}}
/>
```

### 3. Optimize Performance

```typescript
// ✅ Use transform and opacity (GPU accelerated)
<motion.div animate={{x: 100, opacity: 1}} />

// ❌ Avoid animating layout properties
<motion.div animate={{width: "100%", height: 200}} />
```

### 4. Use Layout Animations Sparingly

```typescript
// Use layout animations for dynamic layouts
<motion.div layout layoutId="unique-id">
  Content
</motion.div>
```

### 5. Stagger Children for Lists

```typescript
<motion.div variants={staggerContainer} initial="hidden" animate="visible">
  {items.map(item => (
    <motion.div key={item.id} variants={staggerItem}>
      {item.content}
    </motion.div>
  ))}
</motion.div>
```

## Performance

### GPU Acceleration

These properties are GPU-accelerated and performant:
- `x`, `y`, `z`
- `scale`, `scaleX`, `scaleY`
- `rotate`, `rotateX`, `rotateY`, `rotateZ`
- `opacity`

### Avoid Animating

These can cause layout shifts and poor performance:
- `width`, `height`
- `top`, `left`, `right`, `bottom`
- `padding`, `margin`

### Use will-change Sparingly

```typescript
// Only when absolutely necessary
<motion.div style={{willChange: "transform"}} />
```

### Lazy Load Heavy Animations

```typescript
import dynamic from "next/dynamic"

const HeavyAnimation = dynamic(() => import("./heavy-animation"), {
  ssr: false,
})
```

## Animation Patterns

### Entrance Animations

```typescript
// On mount
<motion.div initial={{opacity: 0}} animate={{opacity: 1}} />

// On scroll
const {ref, controls} = useAnimateOnView()
<motion.div ref={ref} animate={controls} />
```

### Exit Animations

```typescript
import {AnimatePresence} from "framer-motion"

<AnimatePresence>
  {isVisible && (
    <motion.div
      initial={{opacity: 0}}
      animate={{opacity: 1}}
      exit={{opacity: 0}}
    />
  )}
</AnimatePresence>
```

### Gesture Animations

```typescript
<motion.button
  whileHover={{scale: 1.1}}
  whileTap={{scale: 0.9}}
  whileFocus={{outline: "2px solid blue"}}
>
  Button
</motion.button>
```

## Resources

- [Framer Motion Documentation](https://www.framer.com/motion/)
- [Animation Variants](../lib/animations/variants.ts)
- [Animation Hooks](../lib/animations/hooks.ts)
- [Landing Page Example](../components/landing/animated-hero.tsx)

---

**Remember**: Great animations enhance UX but should never interfere with usability or accessibility!
