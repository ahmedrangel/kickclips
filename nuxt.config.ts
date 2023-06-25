export default ({     
  css: [
    "bootstrap/dist/css/bootstrap.min.css",
    "~/assets/css/kcd.css",
    "~/assets/css/transitions.css"	
  ],
  
  app: {
    head: {
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      htmlAttrs: {
        lang: "en"
      },
      meta: [
        { name: "robots", content: "index, follow" }
      ]
    }
  },

  modules: [
    "nuxt-icon"
  ]
})
