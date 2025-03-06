export default envMap => ({
  name: 'vite-plugin-transform-html',
  enforce: 'pre',
  transformIndexHtml: {
    enforce: 'pre',
    transform: html =>
      html
        .replace(
          /<\/head>/,
          `<script type="module" src="../src/main.js"></script>
              </head>`,
        )
        .replace(/<%=\s+BASE_URL\s+%>/g, '/public/')
        .replace(/\$\{process.env.VUE_APP_HM_CODE\}/g, envMap.VUE_APP_HM_CODE)
  }
})


