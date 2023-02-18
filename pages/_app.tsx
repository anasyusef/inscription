import type { AppProps } from "next/app"
import { Inter as FontSans } from "@next/font/google"
import { ThemeProvider } from "next-themes"

import "@/styles/globals.css"
import { useEffect } from "react"
import { useAuthStore } from "@/store"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"

import { uuidv4Regex } from "@/lib/utils"
import { TooltipProvider } from "@/components/ui/tooltip"

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
})

// Create a client
const queryClient = new QueryClient()

export default function App({ Component, pageProps }: AppProps) {
  const authStore = useAuthStore()
  useEffect(() => {
    if (!uuidv4Regex.test(authStore.uid)) {
      // In case the uid does not exist
      authStore.generateUid()
    }
  }, [authStore])
  return (
    <>
      <style jsx global>{`
				:root {
					--font-sans: ${fontSans.style.fontFamily};
				}
			}`}</style>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider delayDuration={500}>
            <Component {...pageProps} />
          </TooltipProvider>
          <ReactQueryDevtools position="bottom-right" />
        </QueryClientProvider>
      </ThemeProvider>
    </>
  )
}
