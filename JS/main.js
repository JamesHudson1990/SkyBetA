import { Game } from '/JS/game.js';

//global objects, variables and event listener for page load
var blackjackGame = new Game();
var remindMe = true;
window.addEventListener("load", async (event) => {displayRedirectPopUp(await checkOnlineStatus());});


const checkOnlineStatus = async () => { // this function controls the online/offline api to simulate being connected to the internet
    try {
      const online = await fetch("https://bet.sbgcdn.com/content/cadmin/700f32ed29c1554daddeb32776c4aa04.jpg", {cache: "no-store"});
      return online.status >= 200 && online.status < 300; // either true or false
    } catch (err) {
        return false; // definitely offline
    }
  };

setInterval(async () =>{ // this function will check the online/offline status every 60 seconds
    const connected = await checkOnlineStatus();
    displayRedirectPopUp(connected); // if the user is online, a popup with a button taking you to the skybet website will appear
}, 60000);

function displayRedirectPopUp(connection){
    if (connection && remindMe) { // checksif they're online and haven't selected the do not remind me again check box, if both are true the pop up shows
        const popUp = document.getElementById("status-popup");
        popUp.style.display = "block";
    }
}

function hideRedirectPopUp(){ // hides the online connected popup shown to the user
    const popUp = document.getElementById("status-popup");
    popUp.style.display = "none";
}

function redirectToSkyBet() { 
    window.location.href = "https://m.skybet.com/";
}

function setRemindMeAboutRedirect(){ // when the pop up shows, there a check box the user can select to block the pop up from showing
    const checkbox = document.getElementById("remind-checkbox");
    remindMe = !checkbox.checked;
}

function startGame(){ // when the button to start a new game this function will start the music, hide the home screen buttons and call a function shoing the betting controls
    startAudioLoopAndSetVolume();
    document.getElementById("overlay").style.display = "none";
    document.getElementById("dealer-text").innerHTML = "Dealer";
    blackjackGame.clearHandAndAwaitUserBet();
}

function startAudioLoopAndSetVolume(){
    const gameAudio = document.getElementById("gameSound");
    gameAudio.loop = true;
    gameAudio.volume = 0.0;
    gameAudio.play();
}

function toggleSound(){
    var gameAudio = document.getElementById("gameSound");
    var audioButton = document.getElementById("sound-button-img");

    if(gameAudio.muted)
    {
        gameAudio.muted = false;
        audioButton.src = "./CSS/pinkSoundOn.png";
    }
    else
    {
        gameAudio.muted = true;
        audioButton.src = "./CSS/pinkSoundOff.png";
    }
}

function newGame(){
  document.getElementById("overlay").style.display = "none";
}

function tutorialMode(){
    //debugger;
    document.getElementById("tips-blur").style.display = "block";
}

function exitPage(){
    var tipsBox = document.getElementById("tips-blur");
    tipsBox.style.display = "none";
}

function rulesMode(){
    document.getElementById("rules-blur").style.display = "block";
}

function exitRulesPage(){
    var rulesBox = document.getElementById("rules-blur");
    rulesBox.style.display = "none";
}

window.hideRedirectPopUp = hideRedirectPopUp;
window.setRemindMeAboutRedirect = setRemindMeAboutRedirect;
window.hideRedirectPopUp = hideRedirectPopUp;
window.startGame = startGame;
window.startAudioLoopAndSetVolume = startAudioLoopAndSetVolume;
window.toggleSound = toggleSound;
window.newGame = newGame;
window.tutorialMode = tutorialMode;
window.exitPage = exitPage;
window.rulesMode = rulesMode;
window.exitRulesPage = exitRulesPage;
window.blackjackGame =  blackjackGame;