now.clients = [];
now.runningTimers = [];

$(document).ready(function(){
  now.receiveMessage = function(name, message){
    $("#messages").append("<br>" + name + ": " + message);
  }
  
  $("#send-button").click(function(){
    now.distributeMessage($("#text-input").val());
    $("#text-input").val("");
  });
  $("#clear-button").click(function(){
    now.clearBoard();
  });
  
  now.updateList = function(){
    setTimeout(function(){
      var list = "LIST:<br>";
      console.log(now.clients);
      console.log(now.name);
      for (var i in now.clients) {
        list += now.clients[i].name+"<br>";
        var nm = now.clients[i].name
        if ($.inArray(nm, now.runningTimers)){
          now.runningTimers.push(nm);
          console.log("new timer");
          //setInterval(function(){drawing(nm);}, 100);  
        } 
      }
      /*
      $.each(now.clients, function(index, value){
        list += value+"<br>";
      });
      */
      $("#list").html(list);
    }, 1500);
  }
});

var paper;
var lastPoint = "";
var image = [];
var draw = false;
var r;

now.ready(function(){
  nameTaken = true;
//checkName("name?");
  now.askName = function(string){
    now.setName(prompt(string));
  }
  now.askName("Name?");
  start();
});



function start(){
  
  //nameTaken = now.ArrayIndexOf(now.clients, prompt("name?")) == -1 ? false : true;
  
  width = now.GAMEWIDE*now.GAMEUNIT;
  height = now.GAMEHIGH*now.GAMEUNIT;
  paper = Raphael(200,50,width,height);
  r = paper.rect(0,0,width,height).attr("fill","white").attr("stroke", "blue");
  var path = paper.path();
  $(window).mousedown(function(){
     draw = true;
     //console.log(draw);
  });
  $(window).mouseup(function(){
     draw = false;
     //now.addToImage({name:now.name,x:0,y:0});
   });

  var lp = "";  
  $(r.node).mousemove(function(e){
   if(draw){
     var x = Math.floor(e.offsetX/now.GAMEUNIT);
     var y = Math.floor(e.offsetY/now.GAMEUNIT);
     var cp = x+","+y;
     if (lp != cp){
       console.log ("lp="+lp+"//cp="+cp);
       lp = cp;
       now.addToImage({name:now.name,x:x, y:y});
     }
     //image.push({x:e.offsetX, y:e.offsetY});
     //console.log(image);
   }
  });
}

var colors = ["red", "blue", "green", "yellow"];

now.addToBoard = function(obj){
  var name = obj.name,
  x = obj.x*now.GAMEUNIT,
  y = obj.y*now.GAMEUNIT;
  paper.rect(x,y,now.GAMEUNIT,now.GAMEUNIT);
}



now.drawBoard = function(board){
  console.log("drawBoard called");
  if(board == "clear"){
    now.oldBoard = [];
    for(i= 0;i<now.GAMEWIDE;i++){
      now.oldBoard[i] = [];
      for(var j = 0; j < now.GAMEHIGH; j++){
        now.oldBoard[i][j] = -1;
      }
    }
   // console.log("new old board");
   // console.log(now.oldBoard);
    paper.clear();
    start();
  }
  else{
    for(x in board){
      if(jQuery.isArray(board[x])){
        for(y in board[x]){
          //console.log(board[x][y])
          if(board[x][y] != now.oldBoard[x][y]){
            paper.rect((x*now.GAMEUNIT),(y*now.GAMEUNIT),now.GAMEUNIT,now.GAMEUNIT).attr("fill","red");
          }
        }
      }
    }
    now.oldBoard = board;
    
  }
}

function drawing(varname){
   var me = ArrayIndexOf(now.clients, function(obj){
       return obj.name == varname;
   });
   if (now.clients[me].draw.length === 0) {
     return;
   }
   //console.log("array is:");
   //console.log(now.clients[me]);
   //console.log(now.clients[me].draw);
   var p = now.clients[me].draw.shift();
   //console.log(p);
   if(p.x == 0 && p.y == 0){
     console.log("restart");
     p = now.clients[me].draw.shift();
     lastPoint = p;
     path = paper.path("M"+(p.x-1)+" "+(p.y-1)+"L"+(p.x)+" "+(p.y));
   }
   else{
     path = paper.path("M"+(lastPoint.x)+" "+(lastPoint.y)+"L"+(p.x)+" "+(p.y));
     lastPoint = p;
   }
}
 
function ArrayIndexOf(a, fnc) {
    if (!fnc || typeof (fnc) != 'function') {
        return -1;
    }
    if (!a || !a.length || a.length < 1) return -1;
    for (var i = 0; i < a.length; i++) {
        if (fnc(a[i])) return i;
    }
    return -1;
}
