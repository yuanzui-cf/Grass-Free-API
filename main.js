#!/usr/bin/env node
/*
Grass Free API [ver 2.0.0-alpha]
Author: Grass Development Team
Website: https://mystu.net/
Github: https://github.com/yuanzui-cf/Grass-Free-API/
*/
const os = require("os"),
      fs = require("fs-extra"),
      express = require("express"),
      cors = require("cors"),
      http = require("http"),
      https = require("https"),
      func = require("./functions"),
      server = express();
let port = 9000;
let include = [];
let config;
if(fs.existsSync("./config.json")){
    config = fs.readJsonSync("./config.json", "UTF-8");
}
if(config){
    if(
        config.port &&
        typeof config.port == "number" &&
        config.port > 0 &&
        config.port <= 25565
    ){
        port = config.port;
    }
    if(
        config.include &&
        typeof config.include == "object"
    ){
        include = config.include;
    }
}
if(!fs.existsSync("./app")){
    fs.mkdirSync("./app");
}
server.use(cors());
let app = [];
module.exports = {
    server: server,
    fs: fs,
    os: os,
    func: func.func,
    maindir: __dirname,
    http: http,
    https: https
};
server.get("/status", (req, res) => {
    const data = {
        system: {
            cpu: os.cpus(),
            os: os.version()
        },
        memory: process.memoryUsage(),
        cpu: process.cpuUsage()
    };
    res.send( data );
});
for(let i = 0; i < include.length; i++){
    const app_tmp = {
        name: include[i].name,
        path: include[i].path.replace(/(.app)|(.mod)/gi, "/main")
                             .replace(/%include%/gi, "./include"),
        enable: false
    };
    if(fs.existsSync(app_tmp.path + ".js")){
        require(app_tmp.path);
        app_tmp.enable = true;
    }
    app_tmp.path = undefined;
    app[i] = app_tmp;
}
if(fs.existsSync("./public")){
    server.use("/", express.static("./public"));
}
server.get("*", (req, res) => {
    res.send({
        name: "Grass Free API",
        version: "v2.0.0-alpha",
        plugin: app
    });
});
server.listen(port, () => {
    console.log(`Grass Free API was listened on ${port}`);
});