var language = localStorage.getItem("language");
var voice = localStorage.getItem("voice");


console.log("language: " + language)
console.log("Voice: " + voice)

if(language == null)
  language = 'por-PRT'
  voice = 'Joaquim'


//Rewrite button titles according to current language
setListOfButtons(document.getElementsByClassName('btn_social_joint'))
setListOfButtons(document.getElementsByClassName('btn_persuade_joint'))
setListOfButtons(document.getElementsByClassName('btn_userinstr_joint'))
setListOfButtons(document.getElementsByClassName('btn_motivation_joint'))
setListOfButtons(document.getElementsByClassName('btn_game_doubts_joint'))
setListOfButtons(document.getElementsByClassName('btn_game_ask_joint'))
setListOfButtons(document.getElementsByClassName('btn_afterpersuade_joint'))
setListOfButtons(document.getElementsByClassName('btn_yes_joint'))
setListOfButtons(document.getElementsByClassName('btn_gameinfo_joint'))
setListOfButtons(document.getElementsByClassName('btn_no_joint'))
setListOfButtons(document.getElementsByClassName('btn_id_joint'))
setListOfButtons(document.getElementsByClassName('btn_joking_joint'))


var yes_button_text = document.getElementById('yes_text')
yes_button_text.textContent = corpus[language].dictionary["btn_yes_joint_1"].name;

var textlen = yes_button_text.getComputedTextLength()
var currentX = yes_button_text.getAttribute('x')
currentX = parseInt(currentX)
yes_button_text.setAttribute('x', currentX-textlen/2)	

var no_button_text = document.getElementById('no_text')
no_button_text.textContent = corpus[language].dictionary["btn_no_joint_1"].name;
textlen = no_button_text.getComputedTextLength()
currentX = no_button_text.getAttribute('x')
currentX = parseInt(currentX)
no_button_text.setAttribute('x', currentX-textlen/2)	


function setListOfButtons(list)
{
	for (var i = 0; i < list.length; i++)
      setButtonTitle(list[i])
}

function setButtonTitle(item)
{
	var button_name = item.id+"_text"
	element = document.getElementById(button_name)

	if(element == null)
	{
		console.log("Error["+button_name+"]: "+"The current layout does not have enough buttons for this list of utterances...")
		return;
	}

	element.textContent = corpus[language].dictionary[item.id].name;



	if(element.getAttribute('adjust') == "true")
	{
		var textlen = element.getComputedTextLength()
		var currentX = element.getAttribute('x')
		currentX = parseInt(currentX)

		if(element.getAttribute('middle') == "true")
			textlen = textlen/2

		element.setAttribute('x', currentX-textlen)		
	}

}


function setLanguage(lang)
{
  language = lang

  if(lang == 'por-PRT')
    voice = 'Joaquim'
  else if(lang == 'eng-USA')
    voice = 'Tom'
  else if(lang == 'spa-ESP')
    voice = 'Jorge'
  else if(lang == 'fra-FRA')
    voice = 'Thomas'
  else if(lang == 'nld-NLD')
    voice = 'Xander'
  else if(lang == 'deu-DEU')
    voice = 'Yannick'
  else if(lang == 'ita-ITA')
    voice = 'Luca'

  localStorage.setItem("language", language);
  localStorage.setItem("voice", voice);

  //Reload page
  location.reload();
}

