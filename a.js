var z = 10; 
function foo(){ 
        console.log(z); //词法作用域
}

(function(funArg){  
        console.log(funArg)
        var z = 20;
        funArg();
})(foo);
