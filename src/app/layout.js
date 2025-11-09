import SiteInfoProvider from '@/components/context/SiteInfoContext'
import ThemeProvider from '@/components/context/ThemeContext'
import '@/styles/globals.css'

export const metadata = {
  title: 'plannerify.io',
  description:
    'Plannerify is a smart productivity app that helps you organize your goals, ideas, and plans — all in one intuitive dashboard.',
  icons: {
    icon: [
      {
        url: '/assets/images/logo.png',
        type: 'image/png',
      },
    ],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="bg-background antialiased transition-colors duration-300">
        <ThemeProvider>
          <SiteInfoProvider>
            <div id="floating"></div>
            {children}
          </SiteInfoProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
