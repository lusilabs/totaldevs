import Document, { Html, Head, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  render () {
    return (
      <Html>
        <Head />
        <body>
          <noscript><iframe
            src='https://www.googletagmanager.com/ns.html?id=GTM-KZ29H25'
            height='0' width='0' style={{ display: 'none', visibility: 'hidden' }}
                    />
          </noscript>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
