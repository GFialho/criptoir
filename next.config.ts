import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Amplify deploy: output standalone para menor bundle
  // output: 'standalone', // descomente antes do deploy Amplify

  // Suprimir warning de workspace root
  turbopack: {
    root: __dirname,
  },
}

export default nextConfig
