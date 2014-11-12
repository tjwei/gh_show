function showParticipants() {
  var participants = gapi.hangout.getParticipants();

  var retVal = '<p>Participant..s: </p><ul>';

  for (var index in participants) {
    var participant = participants[index];

    if (!participant.person) {
      retVal += '<li>A participant not running this app</li>';
    }
    retVal += '<li>' + participant.person.displayName + '</li>';
  }

  retVal += '</ul>';

  var div = document.getElementById('participantsDiv');

  div.innerHTML = retVal;
 
}

function animation(){
        var topHat = gapi.hangout.av.effects.createImageResource(        'http://b81.org/s/img/pypy-logo.png');
        var overlay = topHat.showOverlay( {position: {x: 0, y:0}, rotation: 0});
       var x=0;
       var y=0;
       var r=0;
       var spin=true;
       overlay.setScale(0.1, gapi.hangout.av.effects.ScaleReference.HEIGHT);
       setInterval(function(){ overlay.setRotation(r);if(spin){r=r+0.1;}else{r=r+0.02;}}, 70);
       document.getElementById('keycanvas').onkeydown=function(evt){
                 if(evt.keyIdentifier=="Up"){ y=y-0.01;}
                 if(evt.keyIdentifier=="Down"){ y=y+0.01;}
                 if(evt.keyIdentifier=="Left"){ x=x+0.01;}
                 if(evt.keyIdentifier=="Right"){ x=x-0.01;}
                 if(evt.keyIdentifier=="U+0020"){ spin=!spin;}
                 console.log(evt);
                 overlay.setPosition({x:x, y:y});               
       }
}

function get_anim(){
   return animation;
}
function init() {
  // When API is ready...                                                         
  gapi.hangout.onApiReady.add(
      function(eventObj) {
        if (eventObj.isApiReady) {
          document.getElementById('showParticipants') .style.visibility = 'visible';
         animation();
        }
     
      });
}

