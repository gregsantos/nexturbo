"use client"

import {motion} from "framer-motion"
import Link from "next/link"
import {ArrowRight, Sparkles, Zap, Shield, Code2} from "lucide-react"
import {
  fadeInUp,
  staggerContainer,
  staggerItem,
  scaleIn,
} from "@/lib/animations/variants"
import {useAnimateOnView, useCountUp} from "@/lib/animations/hooks"

export function AnimatedHero() {
  return (
    <div className='relative min-h-screen overflow-hidden'>
      {/* Animated Background Gradient */}
      <div className='fixed inset-0 -z-10'>
        <motion.div
          className='absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10'
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
        <motion.div
          className='absolute inset-0 bg-gradient-to-tl from-blue-500/5 via-transparent to-purple-500/5'
          animate={{
            scale: [1.1, 1, 1.1],
            rotate: [0, -5, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      </div>

      {/* Hero Content */}
      <div className='container mx-auto px-4 py-20 sm:px-6 lg:px-8'>
        <motion.div
          variants={staggerContainer}
          initial='hidden'
          animate='visible'
          className='flex flex-col items-center text-center'
        >
          {/* Badge */}
          <motion.div variants={scaleIn}>
            <div className='mb-8 inline-flex items-center gap-2 rounded-full border bg-background/50 px-4 py-2 text-sm backdrop-blur-sm'>
              <Sparkles className='h-4 w-4 text-primary' />
              <span>Production-Ready Next.js 15 Starter</span>
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            variants={staggerItem}
            className='max-w-4xl text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl'
          >
            Build{" "}
            <motion.span
              className='bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent'
              animate={{
                backgroundPosition: ["0%", "100%", "0%"],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              Fast
            </motion.span>
            , Scale{" "}
            <motion.span
              className='bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'
              animate={{
                backgroundPosition: ["0%", "100%", "0%"],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              Infinitely
            </motion.span>
          </motion.h1>

          {/* Description */}
          <motion.p
            variants={staggerItem}
            className='mt-6 max-w-2xl text-lg text-muted-foreground sm:text-xl'
          >
            A modern, production-ready starter with comprehensive testing,
            security, animations, and everything you need to scale from 0 to
            millions of users.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            variants={staggerItem}
            className='mt-10 flex flex-col gap-4 sm:flex-row'
          >
            <Link href='/dashboard'>
              <motion.div
                whileHover={{scale: 1.05, y: -2}}
                whileTap={{scale: 0.95}}
                className='group inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-primary px-8 text-sm font-medium text-primary-foreground shadow-lg transition-shadow hover:shadow-xl'
              >
                View Dashboard
                <motion.div
                  animate={{x: [0, 5, 0]}}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <ArrowRight className='h-4 w-4' />
                </motion.div>
              </motion.div>
            </Link>

            <Link href='/auth/signin'>
              <motion.div
                whileHover={{scale: 1.05, y: -2}}
                whileTap={{scale: 0.95}}
                className='inline-flex h-12 items-center justify-center rounded-lg border border-input bg-background px-8 text-sm font-medium shadow-sm hover:bg-accent hover:text-accent-foreground'
              >
                Sign In
              </motion.div>
            </Link>
          </motion.div>

          {/* Stats Section */}
          <StatsSection />
        </motion.div>

        {/* Feature Grid */}
        <FeaturesGrid />

        {/* Simple Footer CTA */}
        <div className='mt-18 text-center'>
          <h3 className='mb-4 text-2xl font-bold'>
            Ready to Build Something Amazing?
          </h3>
          <p className='mb-8 text-muted-foreground'>
            Get started in minutes with production-ready code.
          </p>
          <Link href='https://github.com/gregsantos/nexturbo'>
            <motion.div
              whileHover={{scale: 1.05}}
              whileTap={{scale: 0.95}}
              className='inline-flex h-12 items-center justify-center rounded-lg bg-primary px-8 text-sm font-medium text-primary-foreground shadow-lg'
            >
              Clone Now
            </motion.div>
          </Link>
        </div>
      </div>
    </div>
  )
}

function StatsSection() {
  const {ref, isInView} = useAnimateOnView({threshold: 0.3})

  return (
    <motion.div
      ref={ref}
      variants={fadeInUp}
      initial='hidden'
      animate={isInView ? "visible" : "hidden"}
      className='mt-20 grid w-full max-w-4xl grid-cols-1 gap-8 sm:grid-cols-3'
    >
      <StatCard end={95} suffix='%' label='Production Ready' />
      <StatCard end={70} suffix='%+' label='Test Coverage' />
      <StatCard end={30} suffix='+' label='Components' />
    </motion.div>
  )
}

function StatCard({
  end,
  suffix,
  label,
}: {
  end: number
  suffix: string
  label: string
}) {
  const {ref, isInView} = useAnimateOnView({threshold: 0.5, triggerOnce: true})
  const count = useCountUp(isInView ? end : 0, 2000)

  return (
    <motion.div
      ref={ref}
      whileHover={{y: -5}}
      className='rounded-lg border bg-card p-6 text-center shadow-sm transition-shadow hover:shadow-md'
    >
      <div className='text-3xl font-bold text-primary'>
        {count}
        {suffix}
      </div>
      <div className='mt-2 text-sm text-muted-foreground'>{label}</div>
    </motion.div>
  )
}

function FeaturesGrid() {
  return (
    <div className='mt-24 grid gap-8 sm:grid-cols-2 lg:grid-cols-4'>
      <FeatureCard
        icon={<Zap className='h-6 w-6' />}
        title='Lightning Fast'
        description='Vitest, Playwright, and MSW for comprehensive testing'
      />
      <FeatureCard
        icon={<Shield className='h-6 w-6' />}
        title='Secure by Default'
        description='Security headers, CORS, CSP, and data redaction'
      />
      <FeatureCard
        icon={<Code2 className='h-6 w-6' />}
        title='Type-Safe'
        description='End-to-end type safety with TypeScript and Zod'
      />
      <FeatureCard
        icon={<Sparkles className='h-6 w-6' />}
        title='Beautiful Animations'
        description='Framer Motion with reusable variants and hooks'
      />
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <motion.div
      whileHover={{y: -4}}
      transition={{duration: 0.2}}
      className='group rounded-xl border bg-card p-6 transition-shadow hover:shadow-lg'
    >
      <div className='mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary'>
        {icon}
      </div>
      <h3 className='mb-2 text-lg font-semibold'>{title}</h3>
      <p className='text-sm text-muted-foreground'>{description}</p>
    </motion.div>
  )
}
