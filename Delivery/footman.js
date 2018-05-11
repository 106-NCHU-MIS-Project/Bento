var loc=new Array();
var current=new Array();
var distance =new Array();
var now;
var endoint;
var waypoint=[];
var Farthest;


/////////////////取得位置資訊////////////////////
function getAddress(){

  $( "#card" ).empty();
  loc.length = 0;

  var query = firebase.database().ref("Orders").orderByKey();
  query.once("value").then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) {

      if(childSnapshot.child("OrderStatus").val() == "3"/** && snapshot.child("deliveryMid").val()=="3"**/){
        var idt = childSnapshot.key;
        var addt= childSnapshot.child("OrderInfo/Address").val();
        var namet= childSnapshot.child("OrderInfo/OrderMainName").val();
        var telt= childSnapshot.child("OrderInfo/TEL").val();

        $("<div class='col s12 m6'><div class='card'><div class='card-content black-text'><span class='card-title'><a class='waves-effect waves-light btn modal-trigger' href='#modal1'>"+idt+"</a></span><p>訂購人姓名："+namet+"</br>手機："+telt+"</br>地址："+addt+"</p></div><div class='card-action'><a class='waves-effect waves-light btn-small light-green accent-4' onclick='pantomap(\""+addt+"\")'><i class='material-icons left'>place</i>所在位置</a><a class='waves-effect waves-light btn-small light-green accent-4' onclick='setStatus(\""+idt+"\")'><i class='material-icons left'>check</i>已經送達</a></div></div></div>").appendTo("#card");
      var ref = firebase.database().ref("Orders/"+childSnapshot.key+"/OrderInfo/");
      ref.once("value")
        .then(function(snapshot) {

          if(snapshot.child("Address").val()!==""){
          $('.map').tinyMap('query', snapshot.child("Address").val(), function (addr) {

            loc.push({'addr':[addr.geometry.location.lat(),addr.geometry.location.lng()],'text':snapshot.ref.parent.key})

              });
            }
      });
    }
    });
  },function(error) {
  // The Promise was rejected.
  console.error(error);
});

  $('.modal').modal();
}

///////////////////////Initializemap////////////////////


function getDistant(){
  distance.length = 0;
  $('.map').tinyMap('modify',{
  'marker': loc,
  'markerFitBounds': true,
  'event': {
    'idle': {
      'func': function () {
          // 取得目前地圖中心
          now = new google.maps.LatLng(current[0], current[1]);
          waypoint.length = 0;
        $('.map').tinyMap('get', 'marker', function (markers) {
            markers.forEach(function (marker) {
              var meters = 0;
              // 忽略標有 ignore: true 屬性的標記
              if (!marker.hasOwnProperty('ignore')) {
              meters = google.maps.geometry.spherical.computeDistanceBetween(marker.getPosition(),now);
              distance.push(meters);
              marker.infoWindow.setContent(marker.infoWindow.getContent() + '<div>距離: ' + meters + ' 公尺</div>'
                  );
              console.log(meters);
            }
              else distance.push(0);
          });
              Farthest = distance.indexOf(Math.max.apply(Math, distance));
              if (false !== Farthest && -1 !== Farthest) {
                  if ('undefined' !== typeof markers[Farthest].infoWindow) {
                    // 開啟此標記的 infoWindow
                    markers[Farthest].infoWindow.open(this, markers[Farthest]);
                      // 移動此標記至地圖中心
                      this.panTo(markers[Farthest].position);
                      markers[Farthest].endpoint = true;
                      endoint=markers[Farthest].position;
                  }
              }
              markers.forEach(function (marker) {
                if(!marker.hasOwnProperty('ignore')&&!marker.hasOwnProperty('endpoint'))
                waypoint.push(marker.addr);
              })
          });
        },'once': true // 僅執行一次
      }
    },
    'direction': [
    {
        'from': now,
        'to': endoint,
        'waypoint':waypoint,
        'travel': 'driving',
        'suppressMarkers': true,
        'optimize': true,
      }
  ]
    });
}

/////////////////getNowPosition//////////////////
function getNowPosition(){
var getPosition = function (options) {
  return new Promise(function (resolve, reject) {
    navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}
getPosition()
  .then((position) => {
    current=[position.coords.latitude,position.coords.longitude];
    $('.map').tinyMap('modify',{
      'marker':[{'addr': current, 'text': '目前位置','ignore': true},
    ],
  }
  )
    console.log(position);
  })
  .catch((err) => {
    console.error(err.message);
  });
}
///////////////panTOmap//////////////////

function pantomap(addrs){
  if(addrs !== "" && addrs !== null){
  var geocoder = new google.maps.Geocoder();
  geocoder.geocode( { 'address': addrs}, function(results, status) {
  if (status == 'OK') {
    $('.map').tinyMap('panTo', results[0].geometry.location);
      } else {
        console.error('Geocode was not successful for the following reason: ' + status);
      }
    });
  }
}

////////////////setStatus/////////////////////////
function setStatus(tempid){
  if(tempid !==""){
    var database = firebase.database();
      database.ref("Orders/").child(tempid).update({
        "OrderStatus": 4,
          });
    getAddress();
   }else{
         console.error("錯誤");
       }
}
//////////////////modal/////////////////////

function madaldisplay(temp_id){
  var query = firebase.database().ref("Orders/"+temp_id+"/OrderDetail/").orderByKey();
  query.once("value").then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
      var ref = firebase.database().ref("Orders/"+temp_id+"/OrderDetail/"+childSnapshot.key+"/OrderPeople/").orderByKey();
      ref.once("value").then(function(cchildSnapshot) {
        cchildSnapshot.forEach(function(ccchildSnapshot) {
            $("#modal1").empty();
            $('#modal1').append('<div class="modal-content"><h4>訂單內容</h4><p>'+ccchildSnapshot.child("name").val()+ccchildSnapshot.child("number").val()+';</p></div><div class="modal-footer"><a href="#!" class="modal-close waves-effect waves-green btn-flat">確認</a></div>');
            window.setTimeout( function(){
                 window.location = "#modal1";
             }, 100 );
          })
        })
      })
    })
}

////////////////////////////////////////
$(document).ready(function(){
    $('.sidenav').sidenav();

    $('.map').tinyMap({
      'center': ['24.123783','120.685283'],
      'zoom'  : 12,
      'autoLocation': function (temp) {
        var geocoder = new google.maps.Geocoder;
        $('.map').tinyMap('panTo', [temp.coords.latitude,temp.coords.longitude]);
        var latlng = {lat: parseFloat(temp.coords.latitude), lng: parseFloat(temp.coords.longitude)};
        geocoder.geocode({'location': latlng}, function(results, status) {
          if (status === 'OK') {
            if (results[1]) {
              $('#position_p').text(results[0].formatted_address);
            } else {
              console.log('No results found');
            }
          } else {
              console.error('Geocoder failed due to: ' + status);
          }
        });
      }
  });
});
