"use strict";

process.env.NODE_ENV = process.env.NODE_ENV || "production";

if(process.env.NODE_ENV == 'development'){

  require("babel-core/register")({

      presets: ["es2015"],
      only: 'src',
      extensions: [".js"],
      sourceMaps: false

    });

  require('./src/electron/dev.js');

} else {

  require('./src/electron/prod.js');
}
