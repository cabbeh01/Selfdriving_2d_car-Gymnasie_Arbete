/// In this file I write code for a stopwatch that I will use in my game and learning of the model

let ms = 0;
let s = 0;

// Function that counts
function add(){
    ms++;
    if(ms >= 100){
        ms = 0;
        s++;
    }
    startTimer();
}

// Function that starts the timer
function startTimer(){
    t = setTimeout(add,10);
}

//Function that starts 
function stopTimer(){
    clearTimeout(t);
    temp = (s+(0.1*ms)).toFixed(2);

    s = 0;
    ms = 0;
    return temp;
}