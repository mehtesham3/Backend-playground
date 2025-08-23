//Implement a custom event emitter

import { EventEmitter } from 'events'

const emitter = new EventEmitter();

emitter.on("greet", (name) => {
  console.log(`Hii, ${name} buddy`);
})
emitter.once("callme", (name) => {
  console.log(`Hii, ${name}`);
})
function notify(para) {
  console.log(`${para} Arrived`);
}
emitter.on("notify", notify); //Using a fucntion 

emitter.emit("greet", "Ehtesham")
emitter.emit("callme", "Ehtesham")

emitter.emit("greet", "Ehtesham")
emitter.emit("callme", "Ehtesham")

emitter.emit("notify", "Ehtesham") //Using a fucntion 

emitter.removeListener("notify", notify);
emitter.emit("notify", "Ehtesham") //Using a fucntion 
