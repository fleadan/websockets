function initToast(player) {
  var msg = 'your are: ' + player;
  $.toast({
    text : msg,
    position : "top-right",
    icon: 'connection established',
    hideAfter: false
  })
}

function playerAddedToast(player) {
  var msg = player + " Game on";
  $.toast({
    text : msg,
    position : "top-right",
    icon: 'info'
  })
}

function sendLetra(letra){
  var letra = letra;
  $("#letra").text(letra);
  $("#startButton").hide();
  $("#gameForm").show();
  $("#stop").show();
  
}

function playGame(){
  $("input[type='text']").prop("disabled", false);
  $("input[type='text']").removeClass('is-valid is-invalid')
  $("input[type='text']").val('')
  $("#stop").show();
  $("#revenge").hide();
  window.socket.emit("start");
}

function bastaGame(){
  window.socket.emit("end")
}

function grade(letra){
  var cont = 0;
  $("input[type='text']").prop("disabled", true);

  if($("#name").val().charAt(0) == letra ){
    $("#name").addClass("is-valid");
    cont+=12.5;
  } else { $("#name").addClass("is-invalid"); }
  if($("#color").val().charAt(0) == letra){
    $("#color").addClass("is-valid");
    cont+=12.5;
  } else { $("#color").addClass("is-invalid"); }
  if($("#pais").val().charAt(0) == letra ){
    $("#pais").addClass("is-valid");
    cont+=12.5;
  } else { $("#pais").addClass("is-invalid"); }
  if($("#animal").val().charAt(0) == letra){
    $("#animal").addClass("is-valid");
    cont+=12.5;
  } else { $("#animal").addClass("is-invalid"); }
  if($("#flowerFruit").val().charAt(0) == letra){
    $("#flowerFruit").addClass("is-valid");
    cont+=12.5;
  } else { $("#flowerFruit").addClass("is-invalid"); }
  if($("#videoJuego").val().charAt(0) == letra ){
    $("#videoJuego").addClass("is-valid");
    cont+=12.5;
  } else { $("#videoJuego").addClass("is-invalid"); }
  if($("#marca").val().charAt(0) == letra ){
    $("#marca").addClass("is-valid");
    cont+=12.5;
  } else { $("#marca").addClass("is-invalid"); }
  if($("#cancion").val().charAt(0) == letra){
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

  window.socket.on('New player', function(data) {
    var players = data.names;
    var last_player = players[players.length - 1];
    playerAddedToast(last_player);
  });

  window.socket.on('start', function (data) {
    sendLetra(data.letra);
  })

  window.socket.on('score', function (data) {
    grade(data.letra);
    $("#stop").hide();
    $("#revenge").show();
    
  })
  
}


$(function() {
  connectToSocketIo()
})
