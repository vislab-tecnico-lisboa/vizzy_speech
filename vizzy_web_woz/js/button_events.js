var expanded = false;
var alreadySpeaking = false;
var expandedButtonId = 0;
var index=0;



document.querySelector("#speaking_icon").classList.add('escondido');
document.querySelector("#free_icon").classList.add('escondido');
document.querySelector("#downloading_icon").classList.add('escondido');


function getIndex()
{
  if(index == 3)
    index = 0;
  else index++;
  return index;

}




/******************ROS STUFF ***********************************************/
  var ros = new ROSLIB.Ros({
    url : 'ws://localhost:9090'
  });

    
    var speechClient = new ROSLIB.ActionClient({
    ros : ros,
    serverName : 'nuance_speech_tts',
    actionName : 'woz_dialog_msgs/SpeechAction'
  });

  document.querySelector("#free_icon").classList.remove('escondido');





/***************************************************************************/
/*
function speakYesNo(button)
{
	if(expanded)
	  return;

	//var index = Math.floor(Math.random() * (3 - 0 + 1)) + 0;
	var toSay = {};

	if(button.id == "btn_yes")
	{
		toSay = dictionary["btn_yes"].valor[getIndex()];
	}
	else
	{
		toSay = dictionary["btn_no"].valor[getIndex()];
	}

	  var goal = new ROSLIB.Goal({
    actionClient : speechClient,
    goalMessage : {
      language : 'pt_PT',
      voice: 'Joana',
      message: toSay
    }
  });

  goal.on('feedback', function(feedback) {
    console.log('Feedback: ' + feedback.sequence);
  });

  goal.on('result', function(result) {
    console.log('Final Result: ' + result.success);
  });

  ros.on('connection', function() {
    console.log('Connected to websocket server.');
  });

  ros.on('error', function(error) {
    console.log('Error connecting to websocket server: ', error);
  });

  ros.on('close', function() {
    console.log('Connection to websocket server closed.');
  });

	goal.send();


}*/

function speak_inner(toSay)
{

  console.log("Saying: "+ toSay)

  var goal = new ROSLIB.Goal({
    actionClient : speechClient,
    goalMessage : {
      language : language,
      voice: voice,
      message: toSay
    }
  });

  goal.on('feedback', function(feedback) {
    console.log('Feedback: ' + feedback.status);
    
    if(feedback.status == 2)
      {
        document.querySelector("#speaking_icon").classList.remove('escondido');
        document.querySelector("#free_icon").classList.add('escondido');
        document.querySelector("#downloading_icon").classList.add('escondido');
      }
    else if(feedback.status == 1)
      {
        document.querySelector("#speaking_icon").classList.add('escondido');
        document.querySelector("#free_icon").classList.add('escondido');
        document.querySelector("#downloading_icon").classList.remove('escondido');
      }

  });

  goal.on('result', function(result) {
    console.log('Final Result: ' + result.success);
    alreadySpeaking = false;

    document.querySelector("#speaking_icon").classList.add('escondido');
    document.querySelector("#free_icon").classList.remove('escondido');
    document.querySelector("#downloading_icon").classList.add('escondido');
  });

  ros.on('connection', function() {
    console.log('Connected to websocket server.');
  });

  ros.on('error', function(error) {
    console.log('Error connecting to websocket server: ', error);
    
    document.querySelector("#status_failed_icon").classList.remove('escondido');
    document.querySelector("#status_failed_icon").classList.add('visivel');
  });

  ros.on('close', function() {
    console.log('Connection to websocket server closed.');
  });

  goal.send();
  alreadySpeaking = true;

}


function speak(clickedJoint)
{

  if(alreadySpeaking)
    return;
	
	//Speak
	//Select a random sentence
	//var index = Math.floor(Math.random() * (3 - 0 + 1)) + 0;

	//Get the sentence of that joint button
	var toSay = corpus[language].dictionary[clickedJoint.id].valor[getIndex()];

  speak_inner(toSay)

	
	//Vizzy spoke. Unexpand everything
	id = expandedButtonId;
	var query = ":not(#"+id+").group_button"
	var elementsToUnBlur = document.querySelectorAll(query);

	for(var i=0; i<elementsToUnBlur.length; i++)
	{
  		var button = elementsToUnBlur[i];
	  	button.classList.remove('chilled');
	}

	unexpand_inner(id);

	expanded = false;
	expandedButtonId = 0;
}

function expand(clickedButton)
{
  
  var id = clickedButton.id;
  var query = ":not(#"+id+").group_button"


  if(expanded)
  {
  	if(expandedButtonId == id)
  	{
  	  var elementsToUnBlur = document.querySelectorAll(query);

  	  for(var i=0; i<elementsToUnBlur.length; i++)
	  {
	  	var button = elementsToUnBlur[i];
	  	button.classList.remove('chilled')
	  }

	  unexpand_inner(id);

	  expanded = false;
	  expandedButtonId = 0;




  	}else
  	  return;
  }else{

  //Glass out all other elements not belonging to the clicked button
  var elementsToBlur = document.querySelectorAll(query);

  for(var i=0; i<elementsToBlur.length; i++)
  {
  	var button = elementsToBlur[i];
  	button.classList.add('chilled')
  }


  //Expand the the option buttons

  expand_inner(id);

  expanded = true;
  expandedButtonId = id;
  }


}

function expand_inner(id)
{
	var query = "."+id+"_joint";
	var elementsToSee = document.querySelectorAll(query);

	for(var i=0; i < elementsToSee.length; i++)
	{
		var joint = elementsToSee[i];
		joint.style.display = "block";
	}

}

function unexpand_inner(id)
{

	var query = "."+id+"_joint";
	var elementsToSee = document.querySelectorAll(query);

	for(var i=0; i < elementsToSee.length; i++)
	{
		var joint = elementsToSee[i];
		joint.style.display = "none";
	}

}


function speak_custom()
{
  if(alreadySpeaking)
    return;

  var toSay = document.getElementById("text_to_say").value
  speak_inner(toSay)

  document.getElementById("text_to_say").value = ''
  expand(document.getElementById("btn_custom"))

}