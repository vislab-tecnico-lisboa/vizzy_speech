console.log("Loading utterances for offline robot speech...")
console.log(Object.keys(corpus).length)

var num_utterances = 0
var synthethised_utterances = 0
var i = 0
var j = 0
var k = 0
var utterance
var language
var voice
var increment_test = true

/******************ROS STUFF ***********************************************/
var ros = new ROSLIB.Ros({
    url : 'ws://localhost:9090'
  });

    
var speechClient = new ROSLIB.ActionClient({
    ros : ros,
    serverName : 'nuance_speech_tts',
    actionName : 'woz_dialog_msgs/SpeechAction'
  });

/****************************************************************************/

/*Get the maximum number o utterances to download*/
for(var i = 0; i < Object.keys(corpus).length; i++)
{
    for(var j = 0; j < Object.keys(corpus[Object.keys(corpus)[i]].dictionary).length; j++)
    {
        var utterance = Object.values(corpus[Object.keys(corpus)[i]].dictionary)[j]
        if(utterance.name == "EMPTY")
            continue
        else
        {
            for(var k = 0; k < utterance.valor.length; k++)
            {
                num_utterances++;
            }
        }
    }
}

console.log("Number of utterances: " + num_utterances)

reset_vars()
load_speech_cb()


function increment()
{
    if(k < utterance.valor.length-1)
    {
        k++;
        console.log("inc k")
        return true;
    }
    else if (j < Object.keys(corpus[Object.keys(corpus)[i]].dictionary).length-1)
    {
        j++;
        k = 0;
        console.log("inc j, reset k")
        utterance = Object.values(corpus[Object.keys(corpus)[i]].dictionary)[j]

        return true;
    }else if(i < Object.keys(corpus).length-1)
    {
        i++;
        j = 0;
        k = 0;
        utterance = Object.values(corpus[Object.keys(corpus)[i]].dictionary)[j]
        return true;
    }else{
        return false;
    }      
}

function load_speech_cb()
{
    if(synthethised_utterances >= num_utterances)
     {
        complete_bar();
        return;
     }
      
    
    language = Object.keys(corpus)[i]
    voice

    if(language == 'pt_PT')
        voice = 'Joaquim'
    else if(language == 'en_US')
        voice = 'Tom'
    else if(language == 'es_ES')
        voice = 'Jorge'
    else if(language == 'fr_FR')
        voice = 'Thomas'
    else if(language == 'nl_NL')
        voice = 'Xander'
    else if(language == 'de_DE')
        voice = 'Yannick'
    else if(language == 'it_IT')
        voice = 'Luca'
    
    while(utterance.name == "EMPTY")
    {
        var increment_test = increment()
        if(!increment_test)
        {
            complete_bar()
            return;
        }
            
    }

    speak_load(utterance.valor[k])  
    
}


function speak_load(toSay)
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
  });

  goal.on('result', function(result) {
    console.log('Final Result: ' + result.success);
    synthethised_utterances++;
    var increment_test = increment();
    if(!increment_test)
    {
        update_bar(synthethised_utterances/num_utterances);
        complete_bar();
        return; 
    }
    load_speech_cb();
    update_bar(synthethised_utterances/num_utterances)
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

}

function reset_vars()
{
    i = 0;
    j = 0;
    k = 0;
    utterance = Object.values(corpus[Object.keys(corpus)[i]].dictionary)[j];
    increment_test = true;
}

function update_bar(percentage) {
    percentage=percentage*100;
    var elem = document.getElementById("myBar");   
    elem.style.width = percentage + '%'; 
    elem.innerHTML = percentage * 1  + '%';
}

function complete_bar()
{
    var elem = document.getElementById("myBar");
    elem.style.backgroundColor = "green";
}