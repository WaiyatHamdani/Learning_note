//console array push(),pop(),reverse(),sort(),shift()
//console.log(listA.length);

const marveluniverse =["avenger", "xforce","waiyatforce"];
console.log("originally: "+marveluniverse);
marveluniverse.push("xmen");
console.log("we pushing xmen to marvel universe" +marveluniverse);
marveluniverse.pop();
console.log("we poping something to marvel universe" +marveluniverse);
marveluniverse.reverse();
console.log(`we reverse something ${marveluniverse}`);




const weapon = new Array("knive", "handgun", "katana");
weapon.push("M4 rifle");
weapon.push("grannade");
console.log(`we push something: ${weapon}`);
weapon.pop();
console.log(`We pop something: ${weapon}`);
weapon.shift();
console.log(`we shift something: ${weapon}`);

//destructuring array
const arraydestru =[...marveluniverse,...weapon];
console.log(`destruturing spread: ${arraydestru}`);


//Object 
const person ={
    name: "waiyat",
    age: 20,
    gender: "male"
};
console.log(person);


const persons ={
    jobs: "junior dev",
    languange:["indonesia","english"]
}
console.log(persons);


//destructuring object
const objdestructuring = {...person,...persons};
console.log(objdestructuring);