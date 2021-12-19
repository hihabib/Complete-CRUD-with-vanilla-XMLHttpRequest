const order = (res, time) => {

    const isOpen = true;

    return new Promise((resolve, reject)=> {
        if(isOpen) {
            setTimeout(()=>{
                resolve(res())
            }, time)
        } else {
            reject('Sorry..')
        }
    });

}

order(() => console.log('1st done'), 2000) .then ( () => order(() => console.log('2nd done'), 5000))

console.log('Hello world');

setTimeout(()=>{
    console.log('non blocking way');
}, 4000)