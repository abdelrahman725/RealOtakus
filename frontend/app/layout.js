import '@/styles/globals.css'
import '@/styles/App.css'
import App from '@/components/app'

export const metadata = {
  title: 'RealOtakus — Otakus Home',
  description: 'Test your otaku knowledge, create your own questions and more !',
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    minimumScale: 1,
  }
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <App>{children}</App>
      </body>
    </html>
  )
}
