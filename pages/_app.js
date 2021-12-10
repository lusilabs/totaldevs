import 'tailwindcss/tailwind.css'
import Head from 'next/head'

function MyApp ({ Component, pageProps }) {
  return (
    <>
      <Head>
        <script type='text/javascript' src='tawk.js' />
        <link rel='icon' href='totaldevs-logo.png' />
        <meta name='totalves' content='&nbsp;' />
        <title>totaldevs</title>
      </Head>
      <Component {...pageProps} />
    </>
  )
}

export default MyApp
