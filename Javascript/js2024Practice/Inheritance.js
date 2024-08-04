class Animal {
    constructor(name) {
        this.name = name;
    }

    breathe() {
        console.log(this.name + " is breathing...");
    }
}


class Dog extends Animal {
    constructor(name) {
        super(name);
    }
}

const wolfie = new Dog("nightwalker");
console.log(wolfie.name());
wolfie.breathe();