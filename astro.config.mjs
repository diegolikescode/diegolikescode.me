import { defineConfig } from 'astro/config'
import tailwind from '@astrojs/tailwind'
import image from '@astrojs/image'
import mdx from '@astrojs/mdx'
import sitemap from '@astrojs/sitemap'

import react from '@astrojs/react'

// https://astro.build/config
export default defineConfig({
    site: 'https://diegolikescode.me',
    integrations: [
        tailwind(),
        image({
            serviceEntryPoint: '@astrojs/image/sharp',
        }),
        mdx(),
        sitemap(),
        react({ experimentalReactChildren: true }),
    ],
    experimental: {
        viewTransitions: true,
    },
})
