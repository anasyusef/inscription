import { NavItem } from "@/types/nav"

interface SiteConfig {
  name: string
  description: string
  mainNav: NavItem[]
  links: {
    twitter: string
    discord: string
    docs?: string
  }
}

export const siteConfig: SiteConfig = {
  name: "Next.js",
  description:
    "Beautifully designed components built with Radix UI and Tailwind CSS.",
  mainNav: [
    {
      title: "Inscribe",
      href: "/",
    },
    {
      title: "My Orders",
      href: "/orders",
    },
  ],
  links: {
    twitter: "https://twitter.com/inscribit_xyz",
    discord: "https://discord.gg/ordinals"
  },
}
