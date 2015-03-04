var cardScans = document.getElementById('cardScans');
var newCard = document.getElementById('newCard');
var newUser = document.getElementById('newUser');
var cardLists = document.getElementById('cardLists');

socket.on('unidentified', function (data) {
  cardScans.innerHTML+= "<p>" + data + "</p>";
});

function addCard() {
  if (!newCard.value){
    return;
  }
  socket.emit('addCard', {id: newCard.value, user:newUser.value});
  setTimeout(listCards, 2000);
}

socket.on('listCardsResult', function(cards){
  var html = [];

  for (var cardIndex in cards){
    var card = cards[cardIndex];
    html.push("<p class='cardListItem'><span class='card'>" + card.id + "</span><span class='user'>" + card.user + "</span><button class='cardInList' type='button' onClick='removeCard(\"" + card.id + "\")'> X </button></p>");
  }
  cardLists.innerHTML = html.join("");
});

function listCards() {
  socket.emit('listCards');
}

function removeCard(card){
  if (!card){
    return;
  }
  socket.emit('removeCard', {id:card});
}

listCards();
