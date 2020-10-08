const path = require("path");
const fs = require("fs");

// dom func
function dom(query) {
  return document.querySelector(query);
}
const gen_list = [
  { name: "linux", icons: [16, 22, 24, 32, 48, 64, 128, 256, 512] }
];
let current_gen = gen_list[0].name;
let current_icons = gen_list[0].icons;
let file = null;
let file_path = null;
let file_type = "png";

// dom
const file_input = dom("#file-input");

//event
file_input.addEventListener("change", e => {
  let f = e.target.files[0];
  if (f.type.startsWith("image")) {
    file = f;
    file_path = path.dirname(f.path);

    // show image
    let reader = new FileReader();
    reader.onload = e => {
      dom(".original-img img").src = e.target.result;
    };
    reader.readAsDataURL(f);
  }
});
dom(".gen-btn").addEventListener("click", gen_icon);

// drag && drop
dom(".left").addEventListener("dragover", e => {
  e.preventDefault();
});
dom(".left").addEventListener("drop", e => {
  e.preventDefault();
  let f = e.dataTransfer.files[0];

  if (f.type.startsWith("image")) {
    file = f;
    file_path = path.dirname(f.path);

    // show image
    let reader = new FileReader();
    reader.onload = e => {
      dom(".original-img img").src = e.target.result;
    };
    reader.readAsDataURL(f);
  }
});

// init
function init() {
  show_list(current_gen);
}

function show_list(name) {
  let li = "";
  for (let gen of gen_list) {
    if (gen.name == name) {
      current_icons = gen.icons;
      current_gen = gen.name;
      break;
    }
  }
  for (let icon of current_icons) {
    li += `<li>${icon}x${icon}</li>`;
  }

  dom(".generate-list").innerHTML = li;
}

// gen icon
async function gen_icon(e) {
  if (file == null) return false;

  for (let icon of current_icons) {
    let res = await file_resize(file, icon);

    // write
    fs.writeFileSync(
      `${file_path}/${icon}x${icon}.${file_type}`,
      res,
      "base64"
    );
  }
  new Notification("Icon Generate", {
    body: "Icon Generated"
  });
}

// gen
function url_to_base64(url) {
  let base64 = url.replace("data:image/png;base64,", "");
  return base64;
}

function file_resize(file, resize_width, resize_height = null) {
  return new Promise((resolve, reject) => {
    resize_height = resize_height == null ? resize_width : resize_height;
    let reader = new FileReader();
    reader.onload = e => {
      const img = document.createElement("img");
      const canvas = document.createElement("canvas");
      let ctx = canvas.getContext("2d");

      img.src = e.target.result;

      ctx.drawImage(img, 0, 0);
      // img width & height
      canvas.width = resize_width;
      canvas.height = resize_height;
      ctx2 = canvas.getContext("2d");
      ctx2.drawImage(img, 0, 0, resize_width, resize_height);

      resolve(url_to_base64(canvas.toDataURL(file.type)));
    };

    reader.readAsDataURL(file);
  });
}

window.onload = init;
