function initToast(player) {
  var msg = 'your are: ' + player;
  $.toast({
    text : msg,
    position : "top-right",
    icon: 'success',
    hideAfter: false
  })
}

function playerAddedToast(player) {
  var msg = player + " now playing";
  $.toast({
    text : msg,
    position : "top-right",
    icon: 'info'
  })
}

function sendLetter(letter){
  var letter = letter;
  $("#letter").text(letter);
  $("#startButton").hide();
  $("#gameForm").show();
  $("#bastaButton").show();
  
}

function playGame(){
  $("input[type='text']").prop("disabled", false);
  $("input[type='text']").removeClass('is-valid is-invalid')
  $("input[type='text']").val('')
  $("#bastaButton").show();
  $("#playAgainButton").hide();
  window.socket.emit("play");
}

function bastaGame(){
  window.socket.emit("end")
}

function gradingAnswers(letter){
  var cont = 0;
  $("input[type='text']").prop("disabled", true);

  if($("#name").val().charAt(0) == letter ){
    $("#name").addClass("is-valid");
    cont+=12.5;
  } else { $("#name").addClass("is-invalid"); }
  if($("#color").val().charAt(0) == letter){
    $("#color").addClass("is-valid");
    cont+=12.5;
  } else { $("#color").addClass("is-invalid"); }
  if($("#pais").val().charAt(0) == letter ){
    $("#pais").addClass("is-valid");
    cont+=12.5;
  } else { $("#pais").addClass("is-invalid"); }
  if($("#animal").val().charAt(0) == letter){
    $("#animal").addClass("is-valid");
    cont+=12.5;
  } else { $("#animal").addClass("is-invalid"); }
  if($("#flowerFruit").val().charAt(0) == letter){
    $("#flowerFruit").addClass("is-valid");
    cont+=12.5;
  } else { $("#flowerFruit").addClass("is-invalid"); }
  if($("#videoJuego").val().charAt(0) == letter ){
    $("#videoJuego").addClass("is-valid");
    cont+=12.5;
  } else { $("#videoJuego").addClass("is-invalid"); }
  if($("#marca").val().charAt(0) == letter ){
    $("#marca").addClass("is-valid");
    cont+=12.5;
  } else { $("#marca").addClass("is-invalid"); }
  if($("#cancion").val().charAt(0) == letter ){
    $("#cancion").addClass("is-valid");
    cont+=12.5;
  } else { $("#cancion").addClass("is-invalid"); }
  $("#score").text(cont);
}

window.socket = null
function connectToSocketIo(){
  let server = window.location.protocol + '//' + window.location.host
  window.socket = io.connect(server)

  window.socket.on('init', function(data) {
    player = data.player;
    initToast(player);
  });

  window.socket.on('player added', function(data) {
    var players = data.player_names;
    var last_player = players[players.length - 1];
    playerAddedToast(last_player);
  });

  window.socket.on('play', function (data) {
    sendLetter(data.letter);
  })

  window.socket.on('gradeAnswers', function (data) {
    gradingAnswers(data.letter);
    $("#bastaButton").hide();
    $("#playAgainButton").show();
    
  })
  window.socket.on('getres', function (data) {
    gradingAnswers(data.letter);
    $("#bastaButton").hide();
    $("#playAgainButton").show();
    
  })
}


$(function() {
  connectToSocketIo()
})
