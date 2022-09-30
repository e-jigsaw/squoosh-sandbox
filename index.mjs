import { ImagePool } from "@squoosh/lib";
import { cpus } from "os";
import { readFile, writeFile, readdir } from "fs/promises";

const pool = new ImagePool(cpus().length);

for (const name of (await readdir("./data")).filter((name) =>
  /.png$/.test(name)
)) {
  const file = await readFile(`./data/${name}`);
  const img = pool.ingestImage(file);
  await img.preprocess({
    resize: {
      width: 512,
    },
  });
  await img.encode({
    webp: {
      quality: 100,
    },
  });
  await writeFile(
    `./data/enc/${name}.webp`,
    (
      await img.encodedWith.webp
    ).binary
  );
}

process.exit();
