const videoEl = document.querySelector("video");
const output = document.getElementById("overlay");
const models = "https://simhub.github.io/avatar-face-expression/models";
const emotionDiv = document.getElementById("emotion");
const score = document.getElementById("score");
let i = 0;
let timer = document.getElementById("timer");
let errortxt = document.getElementById("error");
const getRandom = (data) => data[Math.floor(Math.random() * data.length)];
let face = document.getElementById("face");
let emoji;
let playbtn = document.getElementById("playbtn");
let beginbtn = document.getElementById("beginbtn");
beginbtn.disabled = true;
let emojimain = document.getElementById("emojimain");
let welcome = document.getElementById("welcomescreen");
let round = document.getElementById("round");
let start = document.getElementById("start");
let bestScore = document.getElementById("bestscore");
let best = document.getElementById("best");
let picture = document.getElementById("picture");
let maxScore = 0;
let allow = 0;

/*AUDIO*/

let countdown = new Audio('audio/countdown.mp3');
let playsound = new Audio('audio/play.mp3')
let main = new Audio('audio/MainTheme.mp3');
let finish = new Audio('audio/finish.mp3');
let go = new Audio('audio/go.mp3');
let cling = new Audio('audio/cling.mp3');
main.play();
main.loop=true;

const happy = {
  emotion: "happy",
  url:"images/happy.png"
};

const neutral = {
  emotion: "neutral",
  url:"images/neutral.png"
};

const surprised = {
  emotion: "surprised",
  url:"images/surprise.png"
};

const sad = {
  emotion: "sad",
  url:"images/sad.png"
};

const angry = {
  emotion: "angry",
  url:"images/angry.png"
};

const fearful = {
  emotion: "fearful",
  url:"images/fearful.png"
};

const disgusted = {
  emotion: "disgusted",
  url:"images/disgusted.png"
};

const play = [happy,neutral,surprised,sad,angry,fearful,disgusted];
const faceapi = window.faceapi;


let emojiDisplay;
emoji = play[0];
face.src = emoji.url;
let a = 0;
let b = 0;

navigator.mediaDevices.getUserMedia({video: true})
    .then(function (stream) {

        if (stream.getVideoTracks().length > 0){
          allow = 1;
          beginbtn.textContent = "Let's play";
          beginbtn.disabled = false;
          errortxt.style.display="none";
          } else {
            allow = 2;
          }
    })
   .catch(function (error) { 
     allow = 0;
    });


setInterval(function(){
  emojiDisplay = getRandom(play);
  while(emojimain.attributes.src.nodeValue === emojiDisplay.url){
    emojiDisplay = getRandom(play);
  }
  emojimain.src = emojiDisplay.url
}, 3000);


async function initVideo() {
  const stream = await navigator.mediaDevices.getUserMedia({ video: {} });
  videoEl.srcObject = stream;
}

Promise.all([
  faceapi.nets.tinyFaceDetector.loadFromUri(models),
  faceapi.nets.faceExpressionNet.loadFromUri(models)
]).then(initVideo);

async function onPlay() {
  // TODO get faceDetectorOptions
  const options = new faceapi.TinyFaceDetectorOptions();
  const result = await faceapi
    .detectSingleFace(videoEl, options)
    .withFaceExpressions();

  if (result) {
    const dimensions = faceapi.matchDimensions(output, videoEl, true);
    const emotions = {
      happy: "images/happy.png",
      angry: "images/angry.png",
      disgusted: "images/disgusted.png",
      fearful: "images/fearful.png",
      neutral: "images/neutral.png",
      surprised: "images/surprise.png",
      sad: "images/sad.png",
    };
    const currentEmotion = result.expressions.asSortedArray()[0].expression;
    emotionDiv.src = emotions[currentEmotion] || currentEmotion;

    if (emoji.emotion === currentEmotion && a == 1 && b == 0){
      cling.pause();
      cling.currentTime = 0;
      cling.play();
      i++;
      score.textContent = i;
      b = 1;
      face.style.animation= "exitfadeface 0.8s ease-in-out";
      setTimeout(function(){
        while (emoji.url === face.attributes.src.nodeValue){
          emoji = getRandom(play);
        }
        face.src = emoji.url;
        b = 0;
        face.style.animation= "enterfadeface 0.4s ease-in-out";
        cling.pause();
      },800)
    }
  }

  requestAnimationFrame(() => onPlay());
}

/*TIMER */
function timerfct(){
  if (face.src === ""){
    face.style.display = "none";
  } else {
    face.removeAttribute('style');
  }
  playbtn.style.display ="none";

  var timeleft = 59;
  var downloadTimer = setInterval(function(){
    a = 1;
    if(timeleft == 20){
      picture.getContext('2d').drawImage(videoEl, 0, 0, picture.width, picture.height);
    }
    if(timeleft <= 10){
      timer.classList.add("danger");
    }
    if(timeleft == 4){
      countdown.volume = 0.8;
      countdown.play();
    }
    if(timeleft <= 0){
      clearInterval(downloadTimer);
      finish.play();
      playsound.pause();
      main.play();
      a = 0;
      playbtn.removeAttribute('style');
      picture.classList.remove("none");
      timer.style.display = "none";
      face.style.display = "none";
      if(i > maxScore){
        maxScore = i;
      }
      bestScore.textContent = maxScore;
      best.classList.remove("none");
    }
    timer.textContent = timeleft;
    timeleft -= 1;
  }, 1000);
}


/*PLAY AGAIN */

document.addEventListener("click", function(e){
  if(e.target === playbtn || e.target === beginbtn && allow === 1){
            picture.classList.add("none");
            go.volume = 0.7;        
            go.play();
            main.pause();
            playsound.play();
            playsound.loop=true;
           timer.classList.remove("danger");
           best.classList.add("none");
           round.classList.remove("none");
           timer.removeAttribute('style');
           welcome.style.display = "none";
           emoji = getRandom(play);
           while (emoji.url == face.src){
             emoji = getRandom(play);
           }
           face.src = emoji.url;
           face.style.display = "block";
           a = 0;
           i = 0;
           timerfct();
  } else if( allow === 0){
    start.classList.add("wizz");
    setTimeout(function(){
      start.classList.remove("wizz");      
    },300);
    errortxt.textContent ="Please allow your camera to play.";
  } else {
    errortxt.textContent ="You need a camera to play.";
  }
})


/*capture*/
