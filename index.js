import os from "os";

console.log("OS:", os.type(), os.release(), os.version());
console.log("Platform:", os.platform(), "Arch:", os.arch());
console.log("Hostname:", os.hostname());
console.log("Uptime:", (os.uptime() / 3600).toFixed(2), "hours");
console.log("User:", os.userInfo().username);
console.log("Home dir:", os.homedir());
console.log("Total Memory:", (os.totalmem() / 1024 ** 3).toFixed(2), "GB");
console.log("Free Memory:", (os.freemem() / 1024 ** 3).toFixed(2), "GB");
console.log("CPU Cores:", os.cpus().length);
console.log("Network:", os.networkInterfaces());
