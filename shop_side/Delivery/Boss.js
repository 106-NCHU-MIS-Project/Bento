var loc=new Array();
var bicons=["bike/green.png","bike/red.png","bike/blue.png","bike/yellow.png","bike/orange.png","bike/pink.png","bike/purple.png","bike/teal.png","bike/sky.png"];

  /////////////////初始化////////////////////
  function getAddress(){
    var count=0;
    loc.length = 0;
    $( "#collapsible1" ).empty();

    var query = firebase.database().ref("Deliverys");
    query.once("value").then(function(snapshot) {
      snapshot.forEach(function(childSnapshot) {

          var idt = childSnapshot.key;
          var lat= childSnapshot.child("Latitude").val();
          var lon= childSnapshot.child("Longitude").val();
          var telt= childSnapshot.child("phone").val();
          var name= childSnapshot.child("name").val();
          loc.push({'addr':[parseFloat(lat),parseFloat(lon)],'text':idt,'icon': {'url': bicons[count],'scaledSize': [20,20]}});
          if(count>9)count=0;
          $("<li>  <div class='collapsible-header'><i class='material-icons'>person</i>"+idt+"&emsp;&emsp;外送者姓名 : "+name
          +"&emsp;&emsp;電話 : "+telt+"&emsp;<a href='#' onclick='pantomap(\""+idt+"\")'>我的位置</a></div><div class='collapsible-body'><span id='span"+idt+"'></br></span></div></li>").appendTo("#collapsible1");
          count++;
      });
      resetMarker();
    },function(error) {
    // The Promise was rejected.
    console.error(error);
  });


     $('.collapsible').collapsible();
  }

///////////////////////Initializemap////////////////////


function resetMarker(){
  $('.map').tinyMap('clear', 'marker');
  $('.map').tinyMap('modify',{
  'marker': loc,
  'zoom': 12,
  'markerFitBounds': true,
});
}

function pantomap(temp){
  window.scrollTo(500, 100);
  var m = $('.map').data('tinyMap'),
        markers = m._markers,
        marker = {},
        i = 0;
    for (i; i < markers.length; i += 1) {
        markers[i].infoWindow.close();
    }
  var markers = $('.map').tinyMap('get', 'marker');

  setTimeout(function(){
    if(markers !== "" && markers !== null){
      markers.forEach(function(marker){
        if(marker.text == temp){
          $('.map').tinyMap('panTo', marker.addr);
          var m = $('.map').data('tinyMap');
          var infoWindow = marker.infoWindow;
          infoWindow.open(m.map,marker);
        }
      })
      }
   }, 700);

}

$(document).ready(function(){
    $('.sidenav').sidenav();

      $('.map').tinyMap({
      'center': ['24.1175214', '120.6738148'],
      'zoom': 12,
      'markerFitBounds': true,
    });
  getAddress();
  var query = firebase.database().ref("Deliverys");
  query.on('child_changed', function(childSnapshot, prevChildKey){
    getAddress();
  });
  query.on('child_removed', function(childSnapshot, prevChildKey){
    getAddress();
  });

});

//window.setTimeout("resetMarker()",3000);
//window.setInterval("getcurrent()",4000);
