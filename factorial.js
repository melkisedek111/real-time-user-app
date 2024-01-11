function getFactorial(number) {
    // number will be based as 0 and 1
    if (number === 0 || number === 1) {

      return 1;

    } else {
        
      // this will be recursive process: number! = number * (number-1)!

      return number * getFactorial(number - 1);
    }
  }
  
  const factorial = getFactorial(10);
  console.log(factorial); 
  