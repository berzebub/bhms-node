const fs = require("fs");
const path = require("path");
const orderReccentFiles = (dir) => {
  return fs
    .readdirSync(dir)
    .filter((file) => fs.lstatSync(path.join(dir, file)).isFile())
    .map((file) => ({ file, mtime: fs.lstatSync(path.join(dir, file)).mtime }))
    .sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
};
const getMostRecentFile = (dir) => {
  const files = orderReccentFiles(dir);
  return files.length ? files[0] : undefined;
};

console.log(getMostRecentFile("C:/Users/Edutech111/Desktop/T1_005"));
