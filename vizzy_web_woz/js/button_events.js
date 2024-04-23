var expanded = false;
var alreadySpeaking = false;
var expandedButtonId = 0;
var index=-1;
var isCorrect = false;



document.querySelector("#speaking_icon").classList.add('escondido');
document.querySelector("#free_icon").classList.add('escondido');
document.querySelector("#downloading_icon").classList.add('escondido');


function getIndex(number_lines)
{

  if(index >= (number_lines-1))
    index = 0;
  else index++;
  return index;

}


/* Function*/ 
function questionHandler(possible_text)
{
  var message = possible_text;
  var popup = document.getElementById("confirm_button");
  popup.style.display= "block";

  if (confirm("The person answered right?")) {
    message = corpus[language].dictionary["answer_right"].valor[Math.floor(Math.random() * 4)];
  } else {
    message = possible_text;
  }
  popup.style.display= "none";
  return make_goal(message);
}




/******************ROS STUFF ***********************************************/
  var ros = new ROSLIB.Ros({
    url : 'ws://127.0.0.1:9090'
  });

    
  var speechClient = new ROSLIB.ActionClient({
    ros : ros,
    serverName : '/gcloud_tts',
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
  });    console.log(text_say);


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

function make_goal(message){

  var goal = new ROSLIB.Goal({
    actionClient : speechClient,
    goalMessage : {
      language : language,
      voice: voice,
      message: message, //first ask the question
      speed: 2
    }
  });
  return goal;
}

function goal_send(goal)
{
  console.log("O button name "+ goal.goalMessage.language)

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


function speak_inner(toSay)
{
  
  
  if((toSay.name == "Charadas") || (toSay.name == "Piadas") || (toSay.name == "Pedra papel"))
  {

    var number_lines = toSay.valor.length; //To have more than 4 possible sentences per joint

    text_say = (toSay.valor[getIndex(number_lines)]).split("<break time='7s' />"); // break the string into question and answer
    console.log(text_say);
    goal = make_goal(text_say[0]); //Ask first the question
    goal_send(goal);
    while(!confirm("The kid understood?")){
      goal_send(goal);
    }
    goal = questionHandler(text_say[1]); //Wait for the user answer
    goal_send(goal);

  } else if(toSay.name == undefined){ //For custom text 

    goal = make_goal(toSay);
    console.log(toSay);
    goal_send(goal);

  } else {

    var number_lines = toSay.valor.length; //To have more than 4 possible sentences per joint

    text_say = toSay.valor[getIndex(number_lines)];
    goal = make_goal(text_say);
    console.log(text_say);
    goal_send(goal);
  }

  // goal_speak(goal);
 
  // console.log("O button name "+ goal.goalMessage.language)

  // goal.on('feedback', function(feedback) {
  //   console.log('Feedback: ' + feedback.status);
    
  //   if(feedback.status == 2)
  //     {
  //       document.querySelector("#speaking_icon").classList.remove('escondido');
  //       document.querySelector("#free_icon").classList.add('escondido');
  //       document.querySelector("#downloading_icon").classList.add('escondido');
  //     }
  //   else if(feedback.status == 1)
  //     {
  //       document.querySelector("#speaking_icon").classList.add('escondido');
  //       document.querySelector("#free_icon").classList.add('escondido');
  //       document.querySelector("#downloading_icon").classList.remove('escondido');
  //     }

  // });

  // goal.on('result', function(result) {
  //   console.log('Final Result: ' + result.success);
  //   alreadySpeaking = false;

  //   document.querySelector("#speaking_icon").classList.add('escondido');
  //   document.querySelector("#free_icon").classList.remove('escondido');
  //   document.querySelector("#downloading_icon").classList.add('escondido');
  // });

  // ros.on('connection', function() {
  //   console.log('Connected to websocket server.');
  // });

  // ros.on('error', function(error) {
  //   console.log('Error connecting to websocket server: ', error);
    
  //   document.querySelector("#status_failed_icon").classList.remove('escondido');
  //   document.querySelector("#status_failed_icon").classList.add('visivel');
  // });

  // ros.on('close', function() {
  //   console.log('Connection to websocket server closed.');
  // });

  // goal.send();
  // alreadySpeaking = true;

}


function speak(clickedJoint)
{

  if(alreadySpeaking)
    return;
	
	//Speak
	//Select a random sentence

	//Get the sentence of that joint button
	var toSay = corpus[language].dictionary[clickedJoint.id];


  speak_inner(toSay)

	
	//Vizzy spoke. Unexpand everything
	id = expandedButtonId;
	var query = ":not(#"+id+").group_button"
	var elementsToUnBlur = document.querySelectorAll(query);
	for(var i=0; i<elementsToUnBlur.length; i++)
	{
  		var button = elementsToUnBlur[i];
	  	button.classList.remove('chilled');
      button.style.removeProperty('display');
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
	  	button.classList.remove('chilled');
      button.style.removeProperty('display'); //btn_dentist svg was
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
  	button.classList.add('chilled');
    if(button.id == "btn_dentist"){
      console.log(button);
      button.style.display = "none";
    }
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
  console.log("The text to say is:", toSay.name)
  speak_inner(toSay)

  document.getElementById("text_to_say").value = ''
  expand(document.getElementById("btn_custom"))

}
