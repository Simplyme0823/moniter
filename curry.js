function accumulate(){
    const arg = [].slice.call(arguments)
    return function(...args){
        if(args.length === 0){
            // default 
            return 
        }
        if( args.length === 1 && typeof args[0] === "function"){
            return args[0](...arg.slice(0, arg.length))
        }
        const newArgs = arg.concat(args)
        return accumulate(...newArgs)
    }
}

const add = (...args)=>{
    return args.reduce((prev, cur)=>{
        prev = prev + cur
        return prev
    },0)
}

const he = accumulate(1)(4,5,6)(7)(8)(add)
console.log(he)