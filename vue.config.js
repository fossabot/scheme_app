module.exports = {
  css: {
    loaderOptions: {
      sass: {
        prependData: `
          @import "@/assets/_vars.scss";
        `
      }
    }
  }
};
