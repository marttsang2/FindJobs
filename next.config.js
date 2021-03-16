// next.config.js

const { redirect } = require("next/dist/next-server/server/api-utils")

module.exports = {
    async redirect() {
      return [
        {
          source: '/',
          destination: "/jobtable/all?page=1&per-page=20",
          basePath: false,
          permanent: false,
        },
       
      ]
    }
  }