
Bmol editor tries to mimic the logic of a 2D isometric game. You will need a Tibia.spr file (version 931, 91, and 9 in general is fine).
Get that file from internet and the put into a folder. Then you can drop that folder into the application. The reason why you need to drop the whole folder is that in future the folder could contain png images instead of the compressed Tibia.spr file (this file actually contains all the images compressed).

The Tibia.spr file is just one side of the same coin. The other side is the .dat file which contains all the metadata for the images. Anyhow, this file is not currently used as the meta is now loaded `from the src/settings/spr.js`. This file, however, should be compressed and set into the Tibia.spr folder as Tibia.dat file in the future.

# Issues

* pngjs-image

  We are using a modified version of pngjs-image to make compatible with browserify and make to run in browser. If for some reason, you get into problems, then use the original pngjs-image version. To do so, just replace in `package.json` file next line:

  "pngjs-image": "" --> "pngjs-image": "^0.11.6"
