// lexical funtion  or closure funtion 

function Calculator(a,b){

    function addition(a,b){
        return a + b;
    }

    function substraction(a,b){
        return a-b;
    }

    function multiplication(a,b){
        return a*b
    }

    function division(a,b){
        if(b!=0){
            return a/b;
        }
            return "are you stupid you cannot divide anything by zero ";
    }

    return {
        addition,
        substraction,
        multiplication,
        division
    };

}


let mycalculator = Calculator();
console.log(mycalculator.addition(10,5));
console.log(mycalculator.substraction(10,5));
console.log(mycalculator.multiplication(10,5));
console.log(mycalculator.division(10,0));
console.log(mycalculator.division(10,5));