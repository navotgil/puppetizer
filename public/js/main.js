var synth = window.speechSynthesis;
// Chrome bug
let voices = synth.getVoices();
var applause = new Audio('/sound/applause.mp3');
function hideModal(){
    document.getElementById("modal").style.display = "none";
}
function showModal(){
    document.getElementById("modal").style.display = "flex";
}

function createCharacters(comments) {
    const stage = document.getElementById("charecters");
    stage.innerHTML = "";
    let unique = {};
    voices = synth.getVoices();
    for (i in comments){
        const user = comments[i].user;
        if (!(user.id in unique)){
            let puppet = document.createElement("div");
            let head = document.createElement("img");
            head.classList.add("puppet-head");
            head.src = user.avatar_url;
            puppet.appendChild(head);
            puppet.id = "puppet-" + user.id;
            puppet.classList.add("puppet");
            puppet.classList.add("hat-" + (user.id % 10));
            puppet.classList.add("body-" + (user.id % 6));
            puppet.style.left = `${3 + (user.id % 94)}%`;
            puppet.setAttribute("data-voice",(user.id % voices.length))
            stage.appendChild(puppet);
            unique[user.id] = true;
        }
    }
}
function play(title, comments) {
    showTitle(title);
    setTimeout(function(){
        hideCurtains();
        playComment(comments, 0)
    },2000)
}

function hideCurtains(){
    let curtains = document.getElementsByClassName("curtain");
    curtains[0].classList.add("hide")
    curtains[1].classList.add("hide")
}

function showCurtains(){
    let curtains = document.getElementsByClassName("curtain");
    curtains[0].classList.remove("hide")
    curtains[1].classList.remove("hide")
}

function showTitle(title){
    let titleEl = document.getElementById("title")
    titleEl.innerHTML = title;
    titleEl.classList.add("show")
}

function hideTitle(){
    let titleEl = document.getElementById("title")
    titleEl.classList.remove("show")
}

function showPuppet(comments, i){
    const currentPuppet = document.getElementsByClassName("speaking")[0];
    if (currentPuppet){
        currentPuppet.classList.remove("speaking");
    }
    const puppetToShow = document.getElementById("puppet-" + comments[i].user.id);
    puppetToShow.classList.add("speaking");
    return puppetToShow;
}

function endShow(){
    applause.play();
    hideTitle();
    showCurtains();
    document.getElementById("subtitles").innerHTML = "APPLAUSE";
    setTimeout(function(){
        showModal();
    },2000)
}

function removeLinks(text){
    var urlRegex = /(https?:\/\/[^\s]+)/g;
    return text.replace(urlRegex, function(url) {
        return 'link';
    })
}

function playComment(comments, i){
    let text = comments[i].body;
    text = removeLinks(text);
    let utterThis = new SpeechSynthesisUtterance(text);
    document.getElementById("subtitles").innerHTML = `<span style="color:orange;">${comments[i].user.login}</span>: ${text}`;
    utterThis.lang="en-US"
    let speakingPuppet = showPuppet(comments, i);
    utterThis.voice = synth.getVoices()[parseInt(speakingPuppet.getAttribute("data-voice"))];
    utterThis.addEventListener('end', function () {
        if (i < comments.length - 1){
            playComment(comments, i+1);
        }else{
            endShow();
        }
    })
    utterThis.onerror = function(event) {
        console.log('An error has occurred with the speech synthesis: ' + event.error);
      }
    console.log(utterThis);
    setTimeout(function(){
        synth.speak(utterThis);
    },10)
    
}



