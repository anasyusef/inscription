import { SiteHeader } from "@/components/site-header"

interface LayoutProps {
  children: React.ReactNode
}

export function Layout({ children }: LayoutProps) {
  return (
    <>
      <SiteHeader />
      <main className="flex h-screen flex-col justify-between">
        {children}
        <Footer />
      </main>
    </>
  )
}

export function Footer() {
  return (
    <div className="flex justify-center pb-4 text-gray-500 dark:text-gray-400">
      Inscribit © {new Date().getFullYear()}
    </div>
  )
}
