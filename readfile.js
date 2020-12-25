const fs = require("fs");
const path = require("path");
var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://projectvue-55c77.firebaseio.com",
});

var db = admin.firestore();

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

let lastestFile = getMostRecentFile("./data2").file;

let getStartFileName = lastestFile.split("_")[0];
fs.readFile("./data2/" + lastestFile, function (err, data) {
  if (err) throw err;

  var array = data.toString().split("\n");
  //   console.log(array[9]);

  let date = array[9];
  let time = array[10];
  // All Column Without Value
  let column = array[22].replace("\r", "").split("\t");
  column.splice(0, 1);

  let dataTemp = [];
  for (let i = 23; i < array.length - 1; i++) {
    let data = array[i].replace("\r", "").split("\t");
    data.splice(0, 1);
    data.splice(7, 1);
    // dataTemp.push(data);
    let finalObject = {};
    for (let j = 0; j < data.length; j++) {
      finalObject[column[j]] = Number(data[j]);
    }

    dataTemp.push(finalObject);
  }

  console.log(dataTemp);

  // acc ไม่สนใจค่าบวกลบ ให้เป็นค่าสัมบูรณ์
  // acc_x
  let max_acc_x = dataTemp.map((x) => Math.abs(x.ACC_X));
  max_acc_x = Math.max(...max_acc_x);

  // acc1x
  let max_acc1_x = dataTemp.map((x) => Math.abs(x.ACC1_X));
  max_acc1_x = Math.max(...max_acc1_x);

  // acc_y
  let max_acc_y = dataTemp.map((x) => Math.abs(x.ACC_Y));
  max_acc_y = Math.max(...max_acc_y);
  // acc1_y
  let max_acc1_y = dataTemp.map((x) => Math.abs(x.ACC1_Y));
  max_acc1_y = Math.max(...max_acc1_y);

  // acc_z
  let max_acc_z = dataTemp.map((x) => Math.abs(x.ACC_Z));
  max_acc_z = Math.max(...max_acc_z);
  // acc1_z
  let max_acc1_z = dataTemp.map((x) => Math.abs(x.ACC1_Z));
  max_acc1_z = Math.max(...max_acc1_z);

  // tile_x max
  let max_tile_x = dataTemp.map((x) => x.TILE_X);
  max_tile_x = Math.max(...max_tile_x);

  // tile1_x max
  let max_tile1_x = dataTemp.map((x) => x.TILE1_X);
  max_tile1_x = Math.max(...max_tile1_x);

  // tile_y max
  let max_tile_y = dataTemp.map((x) => x.TILE_Y);
  max_tile_y = Math.max(...max_tile_y);

  // tile1_y max
  let max_tile1_y = dataTemp.map((x) => x.TILE1_Y);
  max_tile1_y = Math.max(...max_tile1_y);

  // tile_x min
  let min_tile_x = dataTemp.map((x) => x.TILE_X);
  min_tile_x = Math.min(...min_tile_x);

  // tile1_x min
  let min_tile1_x = dataTemp.map((x) => x.TILE1_X);
  min_tile1_x = Math.min(...min_tile1_x);

  // tile_y min
  let min_tile_y = dataTemp.map((x) => x.TILE_Y);
  min_tile_y = Math.min(...min_tile_y);

  // tile1_y min
  let min_tile1_y = dataTemp.map((x) => x.TILE1_Y);
  min_tile1_y = Math.min(...min_tile1_y);

  // STRAIN1 max
  let max_strain = dataTemp.map((x) => x.STRAIN1);
  max_strain = Math.max(...max_strain);

  // STRAIN1 min
  let min_strain = dataTemp.map((x) => x.STRAIN1);
  min_strain = Math.min(...min_strain);

  // STRAIN1_micro max
  let max_strain_micro = dataTemp.map((x) => x.STRAIN_1_MICRO);
  max_strain_micro = Math.max(...max_strain_micro);

  // STRAIN1_micro min
  let min_strain_micro = dataTemp.map((x) => x.STRAIN_1_MICRO);
  min_strain_micro = Math.min(...min_strain_micro);

  // LVDT_1_mm
  let max_lvdt1_mm = dataTemp.map((x) => x.LVDT_1_mm);
  max_lvdt1_mm = Math.max(...max_lvdt1_mm);

  // LVDT1
  let max_lvdt1 = dataTemp.map((x) => x.LVDT1);
  max_lvdt1 = Math.max(...max_lvdt1);

  //   console.log(max_acc1_x);

  db.collection("test").add({
    startFileName: getStartFileName,
    ACC_X: max_acc_x,
    ACC_Y: max_acc_y,
    date: date,
    time: time,
  });
});
