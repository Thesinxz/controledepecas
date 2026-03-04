import nextPwa from 'next-pwa'

/** @type {import('next').NextConfig} */
const nextConfig = {}

const withPWA = nextPwa({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
    register: true,
    skipWaiting: true,
    customWorkerDir: 'worker', // Will inject our push code
    buildExcludes: [/middleware-manifest.json$/],
})

export default withPWA(nextConfig)
