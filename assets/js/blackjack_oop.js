// move all the classes from the inline script in blackjack_starter.html here

// =========================================================================== //
// Create conditions to determine the outcome of the game:
const LOSE_MESSAGE = "You lose!";
const WIN_MESSAGE = "You win!";
const DRAW_MESSAGE = "Draw!";
let isPlayerTurn = true;
const winMsg = document.querySelector(".win-msg");

// Helper function to for deciding if the player has ended their turn

function playerTurn(playerPoints, textSelector) {
  if (playerPoints > 21) {
    // Lose so end game
    textSelector.style.color = "red";
    winMsg.style.color = "red";
    winMsg.textContent = LOSE_MESSAGE;
    return false;
  } else if (playerPoints === 21) {
    // Win so end game
    winMsg.textContent = WIN_MESSAGE;
    winMsg.style.color = "#2f9e44";
    return false;
  } else {
    // below 21 continue unless player Holds
    return true;
  }
}

// ========================================================================== //

function shuffle(array, seed = 1) {
  let currentIndex = array.length;
  let temporaryValue, randomIndex;

  let random = () => {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  while (0 !== currentIndex) {
    randomIndex = Math.floor(random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

// The code below runs when the page is loaded

window.addEventListener("DOMContentLoaded", function () {
  // Generates a new shuffled deck and takes a card from the top of the pile
  const deck = new Deck();
  deck.shuffle();
  const turnSpan = document.querySelector(".turn-span");
  const btnContainer = document.querySelector(".button-container");
  const contentDiv = document.querySelector(".content-container");

  // select div which contains the images of the cards:
  const card_imgs = document.querySelector("#playerCards");
  let initialPoints = 0;
  let dealerPoints = 0;

  // create helper function for drawing card images

  function drawCards(card, newImg, div) {
    if (card["rank"].includes("10")) {
      newImg.src = `https://deckofcardsapi.com/static/img/${
        0 + card["suit"]
      }.png`;
    } else if (card["rank"].includes("10") == false) newImg.src = `https://deckofcardsapi.com/static/img/${card["rank"] + card["suit"]}.png`;
    div.appendChild(newImg);
  }

  // Generate the player's initial hand with 2 cards:
  for (i = 0; i <= 1; i++) {
    const card = deck.draw();
    const newImg = document.createElement("img");
    console.log(card);
    initialPoints += card.points;
    drawCards(card, newImg, card_imgs);
    console.log(newImg.src);
  }

  // display the cards to the player
  // display the initial points to the player
  const playerPoints = document.querySelector(".points");
  playerPoints.textContent = `${initialPoints} points`;

  // repeat same process when button is pressed

  // select button element and listen to when user clicks it
  // every time button is clicked draw a new card and append value to the list

  // =========================== HIT BUTTON ============================== //

  const cardButton = document.querySelector(".draw-btn");
  const againBtn = document.createElement("button");
  const dealerCardsDiv = document.createElement("div");
  const backCard = document.querySelector(".back-card");
  dealerCardsDiv.setAttribute("class", "cards");
  dealerCardsDiv.setAttribute("id", "dealerCards");
  var id = null;

  function myMove() {
    var pos = 0;
    clearInterval(id);
    id = setInterval(frame, 10);
    function frame() {
      if (pos == 350) {
        clearInterval(id);
      } else {
        pos++;
        backCard.style.top = pos + "px";
        backCard.style.left = pos + "px";
      }
    }
  }

  cardButton.addEventListener("click", function () {
    isPlayerTurn = false;
    const card = deck.draw();
    const newImg = document.createElement("img");
    myMove();

    againBtn.textContent = "Play again?";
    againBtn.setAttribute("id", "againBtn");

    if (initialPoints < 21) {
      drawCards(card, newImg, card_imgs);
      initialPoints += card.points;
      playerPoints.textContent = `${initialPoints} points`;
    }
    playerTurn(initialPoints, playerPoints);
    //
    if (
      (initialPoints >= 21) &
      (document.querySelector("#againBtn") == undefined)
    ) {
      btnContainer.remove();
      contentDiv.appendChild(againBtn);
    }
    againBtn.addEventListener("click", function () {
      window.location.reload();
    });
  });

  // ========================= HOLD BUTTON ============================== //

  function playerPointsFunc() {
    playerPoints.textContent = `${dealerPoints} points`;
  }

  const holdButton = document.querySelector(".hold-btn");
  holdButton.addEventListener("click", function () {
    btnContainer.remove();
    turnSpan.textContent = "Dealer's turn";
    contentDiv.appendChild(dealerCardsDiv);
    for (i = 0; i <= 1; i++) {
      const card = deck.draw();
      const newImg = document.createElement("img");
      console.log(card);
      dealerPoints += card.points;
      drawCards(card, newImg, dealerCardsDiv);
      console.log(newImg.src);
    }
    playerPointsFunc();

    function dealerTurn(dealer, player) {
      if ((dealer > player) & (dealer < 22)) {
        winMsg.textContent = LOSE_MESSAGE;
        winMsg.style.color = "red";
      } else if (dealer < player || dealer > 21) {
        winMsg.textContent = WIN_MESSAGE;
        winMsg.style.color = "#2f9e44";
      } else if (dealer == player) {
        winMsg.textContent = DRAW_MESSAGE;
        winMsg.style.color = "blue";
      }

      againBtn.textContent = "Play again?";
      againBtn.setAttribute("id", "againBtn");
      contentDiv.appendChild(againBtn);
      againBtn.addEventListener("click", function () {
        window.location.reload();
      });
    }

    function displayDealerCards() {
      setTimeout(function () {
        if (dealerPoints < 17) {
          const card = deck.draw();
          const newImg = document.createElement("img");
          dealerPoints += card.points;
          drawCards(card, newImg, dealerCardsDiv);
          playerPointsFunc();
          displayDealerCards();
        } else {
          setTimeout(dealerTurn, 200, dealerPoints, initialPoints);
        }
      }, 1000);
    }
    displayDealerCards();
    //
  });
});

// ========================================================================== //

class Card {
  constructor(rank, suit) {
    this.rank = rank;
    this.suit = suit;
  }

  toString() {
    return `${this.rank}${this.suit}`;
  }

  get points() {
    if (this.rank === "A") {
      return 11;
    } else if (
      this.rank === "J" ||
      this.rank === "Q" ||
      this.rank === "K" ||
      this.rank === "10"
    ) {
      return 10;
    } else {
      for (let i = 2; i <= 9; i++) {
        if (this.rank === i.toString()) {
          return i;
        }
      }
    }
  }
}

class Hand {
  constructor(cards) {
    if (!cards.every((card) => card instanceof Card)) {
      throw new TypeError("A Hand can only contain Cards");
    }

    this.cards = cards;
  }

  get points() {
    let allPoints = [];
    for (let card of this.cards) {
      allPoints.push(card.points);
    }
    const sum = allPoints.reduce((accumulator, value) => {
      return accumulator + value;
    }, 0);

    if (allPoints[0] == 11 && allPoints[1] == 11) {
      return sum - 1;
    } else {
      return sum;
    }
  }
}
class Deck {
  constructor() {
    this.cards = this.genDeck();
  }
  //TODO Complete this method so the deck contains all the correct cards

  genDeck() {
    let cardArray = [];
    const suits = ["S", "D", "C", "H"];

    for (const i of suits) {
      cardArray.push(new Card("A", i));

      for (let j = 2; j <= 10; j++) {
        cardArray.push(new Card(`${j}`, i));
      }

      cardArray.push(new Card("J", i));
      cardArray.push(new Card("Q", i));
      cardArray.push(new Card("K", i));
    }

    return cardArray;
  }

  draw() {
    return this.cards.shift();
  }

  shuffle() {
    this.cards = shuffle(this.cards, Date.now());
  }
}
