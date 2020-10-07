const gameContainer = document.getElementById("game");
const COLORS = [
  "red",
  "blue",
  "green",
  "orange",
  "purple",
  "red",
  "blue",
  "green",
  "orange",
  "purple"
];

let card1 = null;
let card2 = null;
let preventClick = false;
let matchedCount = 0;
let flippedCount = 0;
let currentScore = 0;
//start the load by grabbing the previous best score from localStorage. if it doesn't exist (if no game has been played before), set it's value to 0;
let bestScore = localStorage.getItem('bestScore') | 0;
let gameStarted = false;
//start the loading process by shuffling the colors around.
let shuffledColors = shuffle(COLORS);

//this function renders the scores onto the screen after each click or other corresponding events
function updateScores(){
  document.querySelector('#currentScore').innerText = currentScore;
  document.querySelector('#bestScore').innerText = bestScore;
};
//this functions quickly goes through each element in a nodelist and removes them to be replaced with fresh elements later
function removeElements(){
  let elements = document.querySelectorAll('#game div');
  for(element of elements){
    element.remove();
  }
}
//this function corresponds to the reset button and does what you would think it would do
function reset(){
  //remove the elements
  removeElements();
  //shuffle the colors again
  shuffledColors = shuffle(COLORS);
  //assign the colors to the DIV elements
  createDivsForColors(shuffledColors);
  //reset the currentScore
  currentScore = 0;
  //update the scoreboard
  updateScores();
}
//this function starts the game and gets disabled in the middle of play so you can't start another game
function start(){
  createDivsForColors(shuffledColors);
}
//function that came default with the project. left as-is
function shuffle(array) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;
}
//function that came default with the project. left as-is
function createDivsForColors(colorArray) {
  // this function loops over the array of colors
  // it creates a new div and gives it a class with the value of the color
  // it also adds an event listener for a click for each card
    for (let color of colorArray) {
      // create a new div
      const newDiv = document.createElement("div");
  
      // give it a class attribute for the value we are looping over
      newDiv.classList.add(color);
  
      // call a function handleCardClick when a div is clicked on
      newDiv.addEventListener("click", handleCardClick);
  
      // append the div to the element with an id of game
      gameContainer.append(newDiv);
    }
}
//primary function we were charged with implementing. this function gets called inside of the function createDivsForColors inside of the event listener for the #game div. 
function handleCardClick(event) {
  const card = event.target;
  //if clicking is being prevented for whatever reason, don't do anything
  if(preventClick) return console.log('preventClick');
  console.log(card.dataset.flipped);
  //if the user clicked on a card they already flipped over, don't do anything
  if(card.dataset.flipped === true) return console.log('flipped');
  //incrememt the currentScore
  currentScore++;
  //update the scoreboard
  updateScores();
  //set the clicked cards background to the color in the className
  card.style.backgroundColor = card.className;
  //tell the system the card is flipped over
  card.dataset.flipped = true;
  //if at least 1 card has yet to be flipped, assign this current card to the 1st Card slot
  if(!card1){
    card1 = card;
    console.log('set card 1');
  //else, if there was already a card in play, assign this current card to the 2nd card slot
  }else{
    card2 = card;
    console.log('set card 2');
  }
  //if both card slots have a card assigned
  if(card1 && card2){
    //prevent a third card from being selected
    preventClick = true;
    //if both cards backgroundColor attributes are identical
    if(card1.style.backgroundColor === card2.style.backgroundColor){
      //after 1 second
      setTimeout(function(){
        //set both cards to flipped
        card1.removeEventListener('click', handleCardClick);
        card2.removeEventListener('click', handleCardClick);
        //remove the cards from the card placeholders
        card1 = null;
        card2 = null;
        //undo click prevention to allow people to select new cards
        preventClick = false;
      }, 1000);
      matchedCount += 2;
    //if the cards don't match
    }else{
      //in 1 second
      setTimeout(function(){
        //reset the background color on the cards
        card1.style.backgroundColor = '';
        card2.style.backgroundColor = '';
        //flip the cards back over
        card1.dataset.flipped = false;
        card2.dataset.flipped = false;
        //delete the cards from the selection
        card1 = null;
        card2 = null;
        //disable click prevention
        preventClick = false;
      }, 1000)
    }
  }
  //if all cards are now matched
  if(matchedCount === 10){
    //select all the cards on the table
    //in 1 second
    setTimeout(function(){
      //send out a winning alert that needs to be acknowledged
      alert("you've won!");
      //remove the elements from the table
      
      if((bestScore > currentScore) || bestScore === 0){
        //replace the old score in local storage
        localStorage.setItem('bestScore', currentScore);
        //update bestScore
        bestScore = localStorage.getItem('bestScore');
        //send an alert informing of new high score
        alert(`A new high score: ${currentScore}`);
      }
      removeElements();
      matchedCount = 0;
      gameStarted = false;
      currentScore = 0;
      //render the scores onto the screen
      updateScores();
    }, 1000)
  }
};

//start by loading the scoreboard. 
updateScores(); 

//event listener for the start and reset buttons. both contained within a #buttons div element. Utilizes event delegation. 
document.querySelector('#buttons').addEventListener('click', function(event){
  let button = event.target;
  if(button.classList.contains('start')){
    if(gameStarted) return;
    start();
    gameStarted = true;
  }else{
    reset();
  }
});





