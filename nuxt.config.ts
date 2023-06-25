export default ({     
  css: [
    "bootstrap/dist/css/bootstrap.min.css",
    "~/assets/css/kcd.css",
  ],
  
  app: {
    head: {
      script: [{src: "https://cdnjs.cloudflare.com/ajax/libs/iconify/3.1.0/iconify.min.js"}]
    }
  },

  modules: [
    "nuxt-icon"
  ]
})
