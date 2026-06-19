import fs from "fs";
import sharp from "sharp";

const buffer = fs.readFileSync('./public/img/cosmetics/items/nameplates/31018210_animated.gif');

await sharp(buffer, { animated: true })
    .resize(500)
    .webp({ quality: 85 })
    .toFile('./public/img/cosmetics/items/nameplates/31018210_animated.webp');