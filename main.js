#!/usr/bin/env node
/*
Grass Free API [ver 2.0.0-alpha2]
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
console.log("Grass Free API [v2.0.0-alpha2]");
console.log("Copyright (c) 2022 Grass Development Team.");
let port = 9000;
let include = [];
let config;
if(fs.existsSync("./config.json")){
    config = fs.readJsonSync("./config.json", "UTF-8");
    func.log.success("Successfully read the config file.");
}
if(config){
    func.log.success("Successfully parse the config.");
    if(
        config.port &&
        typeof config.port == "number" &&
        config.port > 0 &&
        config.port <= 25565
    ){
        port = config.port;
        func.log.success(`Successfully change the port to the \x1B[32m${port}\x1B[0m`);
    }
    else{
        func.log.warn(`You didn't set the port. The app will start on the default port \x1B[32m9000\x1B[0m`);
    }
    if(
        config.include &&
        typeof config.include == "object"
    ){
        include = config.include;
        func.log.success(`Success load the include lists.`);
    }
    else{
        func.log.warn(`You didn't set the include. That is meant, you cannot do anything by the API.`);
    }
}
if(!fs.existsSync("./app")){
    fs.mkdirSync("./app");
    func.log.success(`Successfully create the app dir.`);
}
server.use(cors());
let app = [];
module.exports = {
    server: server,
    fs: fs,
    os: os,
    func: func.func,
    log: func.log,
    maindir: __dirname,
    http: http,
    https: https
};
for(let i = 0; i < include.length; i++){
    const app_tmp = {
        name: include[i].name,
        path: include[i].path.replace(/(.app)|(.mod)/gi, "/main")
                             .replace(/%include%/gi, "./include"),
        enable: false
    };
    if(fs.existsSync(app_tmp.path + ".js")){
        require(app_tmp.path);
        func.log.success(`Successfully load the plugin '${app_tmp.name}'.`);
        app_tmp.enable = true;
    }
    else{
        func.log.warn(`Failed to load plugin '${app_tmp.name}', please check the plugin.`);
    }
    app_tmp.path = undefined;
    app[i] = app_tmp;
}
if(fs.existsSync("./public")){
    server.use("/", express.static("./public"));
}
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
if(
    config &&
    config.allValueShowed
){
    server.get("*", (req, res) => {
        res.send({
            name: "Grass Free API",
            version: "v2.0.0-alpha",
            plugin: app
        });
    });
}
else{
    server.get("/about", (req, res) => {
        res.send({
            name: "Grass Free API",
            version: "v2.0.0-alpha",
            plugin: app
        });
    });
}
server.listen(port, () => {
    func.log.success(`Grass Free API was listened on :${port}`);
});