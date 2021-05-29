#!/usr/bin/env node
let inputArr = process.argv.slice(2);
let fs = require("fs");
let path = require("path");
// node main.js tree "directory path"
// node main.js organize "directory path"
// node main.js help
let command = inputArr[0];
let types = {
  media: ["mp4", "mkv"],
  document: [
    "docx",
    "doc",
    "pdf",
    "xlsx",
    "xls",
    "odt",
    "ods",
    "odp",
    "odg",
    "odf",
    "txt",
  ],
  archives: ["exe", "dmg", "plg", "deb"],
  images: ["jpeg", "jpg"],
};
switch (command) {
  case "tree":
    treeFn(inputArr[1]);
    break;
  case "organize":
    organizeFn(inputArr[1]);
    break;
  case "help":
    helpFn();
    break;
  default:
    console.log("please 👏 input write ✔ command");
    break;
}

// ------fn for tree---------
function treeFn(dirPath) {
  if (dirPath == undefined) {
    treeHelper(process.cwd(), "");
    return;
  } else {
    let doesExist = fs.existsSync(dirPath);
    if (doesExist) {
      treeHelper(dirPath, "");
    } else {
      console.log("kindly 👏 enter the path 🚀");
      return;
    }
  }
}

function treeHelper(dirPath, indent) {
  // is file or folder
  let isFile = fs.lstatSync(dirPath).isFile();
  if (isFile) {
    let fileName = path.basename(dirPath);
    console.log(indent + "|-----" + fileName);
  } else {
    let dirName = path.basename(dirPath);
    console.log(indent + ">>>>" + dirName);
    let childrens = fs.readdirSync(dirPath);
    for (let i = 0; i < childrens.length; i++) {
      let childPath = path.join(dirPath, childrens[i]);
      treeHelper(childPath, indent + "\t");
    }
  }
}


// ------fn for organize-------
function organizeFn(dirPath) {
  // 1. input -> directory path given
  let destPath;
  if (dirPath == undefined) {
    destPath = process.cwd();
    return;
  } else {
    let doesExist = fs.existsSync(dirPath);
    if (doesExist) {
      // 2. create -> organized files -> directory
      destPath = path.join(dirPath, "orgainized_files");
      if (fs.existsSync(destPath) == false) {
        fs.mkdirSync(destPath);
      }
    } else {
      console.log("kindly 👏 enter the path 🚀");
      return;
    }
  }
  organizeHelper(dirPath, destPath);
}

function organizeHelper(src, dest) {
  // 3. identify categories of all the files present in the input directory
  let childNames = fs.readdirSync(src);
  for (let i = 0; i < childNames.length; i++) {
    let childAddress = path.join(src, childNames[i]);
    let isFile = fs.lstatSync(childAddress).isFile();
    if (isFile) {
      let category = getCategory(childNames[i]);
      console.log(childNames[i], "---->", category);
      // 4. copy/cut files to that organized directoryinside of any category folder
      sendFile(childAddress, dest, category);
    }
  }
}

function getCategory(name) {
  let ext = path.extname(name).slice(1);
  for (let type in types) {
    let cTypeArray = types[type];
    for (let i = 0; i < cTypeArray.length; i++) {
      if (ext == cTypeArray[i]) {
        return type;
      }
    }
  }
  return "other";
}

function sendFile(srcFile, dest, category) {
  let categoryPath = path.join(dest, category);
  if (fs.existsSync(categoryPath) == false) fs.mkdirSync(categoryPath);
  let fileName = path.basename(srcFile);
  let destFilePath = path.join(categoryPath, fileName);
  fs.copyFileSync(srcFile, destFilePath);
  console.log(fileName, "--->", category);
}

// ---------fn for help--------
function helpFn() {
  console.log(
    ` 
  things you can do with my help
        ✔ node main.js tree "directory path"
        ✔ node main.js organize "directory path"
        ✔ node main.js help 
  `
  );
}
