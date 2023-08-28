import type { AppProps } from 'next/app'
import { SWRConfig } from 'swr'
import { trpc } from '@/utils/trpc'
import 'allotment/dist/style.css'
import '@/styles/globals.css'

function App({ Component, pageProps }: AppProps) {
  return (
    <SWRConfig>
      <Component {...pageProps} />
    </SWRConfig>
  )
}

export default trpc.withTRPC(App)
