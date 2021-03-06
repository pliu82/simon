// This file is written in vanilla javascript

var start = document.getElementsByClassName('start')[0];        // variable for start button
var submit = document.getElementsByClassName('submit')[0];      // variable for submit button
var square = document.getElementsByClassName('square');         // variable for each square, this will be a node list
var color = ['red', 'green', 'blue', 'yellow'];                 // array to store the 4 selectable colors
var pattern = [];                                               // array to store the color pattern that will be flashed on screen
var answer = [];                                                // array to store the response from the user
var patternCount;                                               // variable to count the # of inputs by the user
var mainContainer  = document.querySelector('.main');

// This function will select a random element in the "color" array, and push it onto the pattern array
function makePattern () {   
    var pickColor = color[ Math.floor(Math.random() * 4 ) ];
    pattern.push(pickColor);
}

// When this function is called, the "pattern" array should already have element(s) in it representing the colors.
// This function finds the element of the colors listed in "pattern", and changes it's CSS class to "square on_blue/green/red/yellow".  
// CSS class change is how colors get changed from "dull" to "bright".
var highlight = function(i) {
    document.querySelector( '.' + pattern[i] ).className = "square on_" + pattern[i];

// After 500ms, change the class back to what it originally was..."square blue/green/red/yellow"
// This'll change color from "bright" to "dull".
    setTimeout( function () {
        document.querySelector( '.on_' + pattern[i] ).className = "square " + pattern[i];
    }, 500);
}

// This function is called to play a sound everytime a color circle is pressed on screen.
// The "color" argument represents the name of sound file to play
var soundOff = function (color) {       
    document.querySelector('.sound').innerHTML = "<audio autoplay='autoplay' controls='controls'><source src= sounds/" + color + ".wav /></audio>"
}

// This function calls: highlight() and soundOff() to display the color pattern on screen
function flashPattern () {  
    setTimeout( function () {
        highlight(patternCount);                        // "patternCount" is the array index # to call in the "pattern" array.
        soundOff( pattern[patternCount] );              // pattern[patternCount] is string for the color that you want sound to play for.
        patternCount++;                                 // increment patternCount
        if ( patternCount < pattern.length) {           // check if the end of the "pattern" array has been reached, if not, then recursively call flashPattern()
            flashPattern();
        }
    }, 1000);   
}


function startRound() {
    patternCount = 0;                               // initialize patternCount (the index for the "pattern" array) to 0.  Always want to start from beginning of the pattern.
    makePattern();                                  // add a new color to the pattern.  So each time start is pressed, the pattern gets longer.
    flashPattern();                                 // flash that pattern, always start from the first color in the pattern array.
}

// Event handler for user pushes "start" button.  
// This will start a brand new game, or continue to the next round that features a longer pattern. 
start.addEventListener('click', function () {
    start.classList.add('hide');                    // hide the start button when game begings
    startRound();                                   // call startRound function
});

// Event handler for whenever the user clicks the colored squares.  
mainContainer.addEventListener('click', function(e) {
    if (e.target.classList.contains('square')) {                                        // if user clicked a square...
        // Highlight the square that was clicked with CSS class "on", 
        // then after 500ms, remove "on" CSS class to change colors back
        if ( e.target.className.indexOf("on") == -1 ) {                                 // if the CSS class of the square element does not have "on" (has dull color)
            var colorName = e.target.className.replace("square ", "");                  // extract the color of the square into "colorName"
            e.target.className = "square on_" + colorName;                              // rewrite the element's class name to be "on" (has bright color)
            
            // After 500ms, change the color back to it's original dull shade
            setTimeout( function() {                                                    // After 500ms, set the class name back to w/out "on" (back to dull color)
                e.target.className = "square " + colorName;
            }, 500);
            
            soundOff(colorName);                                                        // have the browser play the sound for that color square            
        }        
        answer.push(colorName);    
    }
})

// When user clicks the submit button, verify if their answer is wrong/right
submit.addEventListener('click', function () {
    
    if ( answer.length === pattern.length) {                                            // check if the two arrays "answer" & "pattern" have same # of colors
        var correct = answer.every(function(elem, ind, answer) {                        // use .every() to check if every pair of elements in both arrays match
            return answer[ind] == pattern[ind];                                         // "correct" will either be true or false
        }) // END .every()


        if (correct) {                                                                  // if "correct" is true, user got the pattern right
            answer = [];                                                                // clear the "answer" array, user will need to guess from 1st color on next round
            alert("you're correct!!");                                                  // alert a 'correct' message
            startRound();
        }
        else {                                                                          // else means user's guess was wrong
            answer = [];                                                                // clear the "answer" array, user will need to guess again from 1st color
            soundOff("fail");                                                           // play the "fail" sound
            alert("wrong input, try again");                                            // alert user to "try again"            
        }
    }
    else {                                                                              // else branch means user input the wrong # of colors
        answer = [];                                                                    // clear the 'answer' array, user will have to guess again from 1st color
        soundOff("fail");                                                               // play the "fail" sound
        alert("wrong # of colors, try again");                                          // alert the user "wrong # of colors"
    }
});