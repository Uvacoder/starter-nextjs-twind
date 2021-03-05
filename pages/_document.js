import Document from 'next/document'
import * as React from 'react'
import { setup, shim, asyncVirtualSheet, getStyleTagProperties } from 'twind/server'
import twindConfig from '../twind.config'

const sheet = asyncVirtualSheet()

setup({ ...twindConfig, sheet })

export default class MyDocument extends Document {
  static getInitialProps(ctx) {
    const originalRenderPage = ctx.renderPage

    ctx.renderPage = async (options) => {
      sheet.reset()

      let { html, head } = await originalRenderPage(options)

      html = shim(html)
      
      const { id, textContent } = getStyleTagProperties(sheet)
      
      return {
        html,
        head: [
          ...head,
          React.createElement('style', {
            id: '__next' + id,
            key: id,
            dangerouslySetInnerHTML: {
              __html: textContent,
            },
          })
        ],
      }
    }

    return Document.getInitialProps(ctx)
  }
}
