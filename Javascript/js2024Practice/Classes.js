class person{
    firstname;
    lastname;
    gender;

    constructor(){}

    setfirstname(firstname){
        this.firstname=firstname;
    }
    getfirstname(){
        return this.firstname;
    }
    setlastname(lastname){
        this.lastname=lastname;
    }
    getlastname(){
        return this.lastname;
    }
    setgender(gender){
        this.gender=gender;
    }
    getgender(){
        return this.gender;
    }

}

const agent1 = new person();
agent1.setfirstname("Jack");
agent1.setlastname("Reacher");
agent1.setgender("male");
console.log(agent1);