const host2 = document.createElement("div");
host2.id = "shadow";
const shadow2 = host2.attachShadow({ mode: "open" });
shadow2.innerHTML = `
<style>
:host {
    width: 200px;
    height: 200px;
},
</style>
`;

const container = document.createElement("div");
container.id = "video_local";
container.style.position = "fixed";
container.style.height = "200px";
container.style.width = "200px";
container.style.borderRadius = "50%";
container.style.bottom = "30px";
container.style.right = "30px";
container.style.zIndex = "999999999999999";
const video = document.createElement("video");
video.style.height = "200px";
video.style.width = "200px";
video.style.objectFit = "cover";
video.style.borderRadius = "200px";
video.autoplay = true;
container.append(video);
shadow2.appendChild(container);
document.body.append(host2);

function playStream(stream) {
  video.srcObject = stream;
}

function muteCamera() {
  const constraints = {
    video: true,
  };
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((stream) => {
      const videoTrack = stream.getVideoTracks()[0];
      videoTrack.enabled = false;
      playStream(stream);
      document.body.removeChild(host2);
    })
    .catch((error) => {
      console.log(error);
    });
}
function playCamera() {
  const constraints = {
    video: true,
  };
  navigator.mediaDevices
    .getUserMedia(constraints)
    .then((stream) => {
      const videoTrack = stream.getVideoTracks()[0];
      videoTrack.enabled = true;
      playStream(stream);
      document.body.append(host2);
    })
    .catch((error) => {
      console.log(error);
    });
}

function blobToBase64(blob) {
  return new Promise((resolve, _) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result.split(",")[1]);
    reader.readAsDataURL(blob);
  });
}

async function helpMeOutstartRecorder(currentTab) {
  const mediaConstraints = {
    preferCurrentTab: currentTab,
    video: { mediaSource: "screen" },
    audio: true,
  };

  const stream = await navigator.mediaDevices.getDisplayMedia(mediaConstraints);
  return stream;
}

async function helpMeOutOnAccessApproved(stream, chromeId) {
  let videoId = "";
  let blobIndex = 0;
  var recorder = null;

  const mimeType = MediaRecorder.isTypeSupported("video/webm;codecs=vp9")
    ? "video/webm;codecs=vp9"
    : "video/webm;codecs=vp8";

  recorder = new MediaRecorder(stream, { mimeType });

  recorder.start(5000);

  recorder.onstart = async () => {
    const createUser = await fetch(
      `https://www.cofucan.tech/srce/api/start-recording/?username=${chromeId}`,
      {
        method: "POST",
        body: {},
      }
    );
    const response = await createUser.json();
    videoId = response.video_id;
  };
  recorder.ondataavailable = async (e) => {
    blobIndex++;
    const blob = new Blob([e.data]);
    sendChunkToServer(blobIndex, blob, chromeId, videoId, false);
  };

  recorder.onstop = async (e) => {
    stream.getTracks().forEach(async (track) => {
      if (track.readyState === "live") {
        track.stop();
      }
    });
    const blob = new Blob([e.data]);
    await sendChunkToServer(blobIndex + 1, blob, chromeId, videoId, true);
    window.open(
      `https://helpmeout-dev.vercel.app/RecordingReadyPage?videoID=${videoId}`,
      "_blank"
    );
  };
  return recorder;
}

async function sendChunkToServer(blobIndex, blob, chromeId, videoId, last) {
  blobToBase64(blob).then(async (base64) => {
    const data = await fetch(`https://www.cofucan.tech/srce/api/upload-blob/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: chromeId,
        video_id: videoId,
        blob_index: blobIndex,
        blob_object: base64,
        is_last: last,
      }),
    });
    await data.json();
  });
}

function pauseRecorderHelpMeOut(recorder) {
  recorder.pause();
}

function resumeRecorderHelpMeOut(recorder) {
  recorder.resume();
}

function stopRecorderHelpMeOut(recorder) {
  recorder.stop();
}

var pauseSvg = `<svg width="10" height="14" viewBox="0 0 10 14" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1 1.5L1 12.5" stroke="black" stroke-width="2" stroke-linecap="round"/>
<path d="M9 1.5L9 12.5" stroke="black" stroke-width="2" stroke-linecap="round"/>
</svg>`;

var playSvg = `<svg width="128" height="128" viewBox="0 0 256 256" xmlns="http://www.w3.org/2000/svg" class="icon">
<path fill="" d="M240 128a15.74 15.74 0 0 1-7.6 13.51L88.32 229.65a16 16 0 0 1-16.2.3A15.86 15.86 0 0 1 64 216.13V39.87a15.86 15.86 0 0 1 8.12-13.82a16 16 0 0 1 16.2.3l144.08 88.14A15.74 15.74 0 0 1 240 128Z"/>
</svg>`;

var stopSvg = `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.25 3.5C1.25 2.25736 2.25736 1.25 3.5 1.25H12.5C13.7426 1.25 14.75 2.25736 14.75 3.5V12.5C14.75 13.7426 13.7426 14.75 12.5 14.75H3.5C2.25736 14.75 1.25 13.7426 1.25 12.5V3.5Z" stroke="#0F172A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

var micSvg = `<svg width="14" height="24" viewBox="0 0 14 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M7 18.75C10.3137 18.75 13 16.0637 13 12.75V11.25M7 18.75C3.68629 18.75 1 16.0637 1 12.75V11.25M7 18.75V22.5M3.25 22.5H10.75M7 15.75C5.34315 15.75 4 14.4069 4 12.75V4.5C4 2.84315 5.34315 1.5 7 1.5C8.65685 1.5 10 2.84315 10 4.5V12.75C10 14.4069 8.65685 15.75 7 15.75Z" stroke="#0F172A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

var videoSvg = `<svg width="22" height="16" viewBox="0 0 22 16" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M14.75 6.5L19.4697 1.78033C19.9421 1.30786 20.75 1.64248 20.75 2.31066V13.6893C20.75 14.3575 19.9421 14.6921 19.4697 14.2197L14.75 9.5M3.5 14.75H12.5C13.7426 14.75 14.75 13.7426 14.75 12.5V3.5C14.75 2.25736 13.7426 1.25 12.5 1.25H3.5C2.25736 1.25 1.25 2.25736 1.25 3.5V12.5C1.25 13.7426 2.25736 14.75 3.5 14.75Z" stroke="#0F172A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

var cancelVideo = `<svg width="30px" height="30px" viewBox="-2.4 -2.4 28.80 28.80" fill="none" xmlns="http://www.w3.org/2000/svg" transform="matrix(1, 0, 0, -1, 0, 0)rotate(0)"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round" stroke="#CCCCCC" stroke-width="0.048"></g><g id="SVGRepo_iconCarrier"> <path d="M5 5C3.34315 5 2 6.34315 2 8V16C2 17.6569 3.34315 19 5 19H14C15.3527 19 16.4962 18.1048 16.8705 16.8745M17 12L20.6343 8.36569C21.0627 7.93731 21.2769 7.72312 21.4608 7.70865C21.6203 7.69609 21.7763 7.76068 21.8802 7.88238C22 8.02265 22 8.32556 22 8.93137V15.0686C22 15.6744 22 15.9774 21.8802 16.1176C21.7763 16.2393 21.6203 16.3039 21.4608 16.2914C21.2769 16.2769 21.0627 16.0627 20.6343 15.6343L17 12ZM17 12V9.8C17 8.11984 17 7.27976 16.673 6.63803C16.3854 6.07354 15.9265 5.6146 15.362 5.32698C14.7202 5 13.8802 5 12.2 5H9.5M2 2L22 22" stroke="#000000" stroke-width="1.344" stroke-linecap="round" stroke-linejoin="round"></path> </g></svg>`;

var trashSvg = `<svg width="18" height="22" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M11.7404 8L11.3942 17M6.60577 17L6.25962 8M16.2276 4.79057C16.5696 4.84221 16.9104 4.89747 17.25 4.95629M16.2276 4.79057L15.1598 18.6726C15.0696 19.8448 14.0921 20.75 12.9164 20.75H5.08357C3.90786 20.75 2.93037 19.8448 2.8402 18.6726L1.77235 4.79057M16.2276 4.79057C15.0812 4.61744 13.9215 4.48485 12.75 4.39432M0.75 4.95629C1.08957 4.89747 1.43037 4.84221 1.77235 4.79057M1.77235 4.79057C2.91878 4.61744 4.07849 4.48485 5.25 4.39432M12.75 4.39432V3.47819C12.75 2.29882 11.8393 1.31423 10.6606 1.27652C10.1092 1.25889 9.55565 1.25 9 1.25C8.44435 1.25 7.89078 1.25889 7.33942 1.27652C6.16065 1.31423 5.25 2.29882 5.25 3.47819V4.39432M12.75 4.39432C11.5126 4.2987 10.262 4.25 9 4.25C7.73803 4.25 6.48744 4.2987 5.25 4.39432" stroke="#BEBEBE" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`;

var micInactive = ` <svg width="20px" height="20px" viewBox="-3.5 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns">
    
    <title>microphone-off</title>
    <desc>Created with Sketch Beta.</desc>
    <defs>

</defs>
    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">
        <g id="Icon-Set" sketch:type="MSLayerGroup" transform="translate(-154.000000, -307.000000)" fill="#000000">
            <path d="M167,333 C165.061,333 163.236,332.362 161.716,331.318 L160.31,332.742 C161.944,333.953 163.892,334.765 166,334.955 L166,337 L165,337 C164.448,337 164,337.448 164,338 C164,338.553 164.448,339 165,339 L169,339 C169.552,339 170,338.553 170,338 C170,337.448 169.552,337 169,337 L168,337 L168,334.955 C172.938,334.51 177.117,330.799 178,326 L176,326 C175.089,330.007 171.282,333 167,333 L167,333 Z M167,329 C166.136,329 165.334,328.761 164.625,328.375 L163.168,329.85 C164.27,330.572 165.583,331 167,331 C170.866,331 174,327.866 174,324 L174,318.887 L172,320.911 L172,324 C172,326.762 169.761,329 167,329 L167,329 Z M162,314 C162,311.238 164.239,309 167,309 C169.174,309 171.005,310.396 171.694,312.334 L173.198,310.812 C172.035,308.558 169.711,307 167,307 C163.134,307 160,310.134 160,314 L160,324 C160,324.053 162,322.145 162,322.145 L162,314 L162,314 Z M177.577,310.013 L153.99,332.597 L155.418,334.005 L179.014,311.433 L177.577,310.013 L177.577,310.013 Z M158.047,326.145 C158.035,326.095 158.011,326.05 158,326 L156,326 C156.109,326.596 156.271,327.175 156.478,327.733 L158.047,326.145 L158.047,326.145 Z" id="microphone-off" sketch:type="MSShapeGroup">

</path>
        </g>
    </g>
</svg>`;

var isPlaying = false;
var timerInterval;
var startTime;
var elapsedTime = 0;
var isRunning = false;

function updateTimer(hoursDisplay, minutesDisplay, secondsDisplay) {
  const currentTime = Date.now();
  elapsedTime = Math.floor((currentTime - startTime) / 1000);

  const hours = Math.floor(elapsedTime / 3600);
  const minutes = Math.floor((elapsedTime % 3600) / 60);
  const seconds = elapsedTime % 60;

  hoursDisplay.textContent = String(hours).padStart(2, "0");
  minutesDisplay.textContent = String(minutes).padStart(2, "0");
  secondsDisplay.textContent = String(seconds).padStart(2, "0");
}

function startTimer(hoursDisplay, minutesDisplay, secondsDisplay) {
  isPlaying = true;
  if (!isRunning) {
    startTime = Date.now() - elapsedTime * 1000;
    timerInterval = setInterval(() => {
      updateTimer(hoursDisplay, minutesDisplay, secondsDisplay);
    }, 1000);
    isRunning = true;
  }
}

function pauseTimer() {
  isPlaying = false;
  if (isRunning) {
    clearInterval(timerInterval);
    isRunning = false;
  }
}

function resumeTimer(hoursDisplay, minutesDisplay, secondsDisplay) {
  isPlaying = true;
  if (!isRunning) {
    startTime = Date.now() - elapsedTime * 1000;
    timerInterval = setInterval(() => {
      updateTimer(hoursDisplay, minutesDisplay, secondsDisplay);
    }, 1000);
    isRunning = true;
  }
}

function clearRecordingAndTimer() {
  clearInterval(timerInterval);
  isRunning = false;
  isPlaying = false;
  elapsedTime = 0;

  // Reset the displayed timer
  const hoursDisplay = document.querySelector(".hours");
  const minutesDisplay = document.querySelector(".minutes");
  const secondsDisplay = document.querySelector(".seconds");
  hoursDisplay.textContent = "00";
  minutesDisplay.textContent = "00";
  secondsDisplay.textContent = "00";
}

async function control(audio, currentTab, chromeId) {
  try {
    const stream = await helpMeOutstartRecorder(currentTab);
    const recorder = await helpMeOutOnAccessApproved(stream, chromeId);
    const r = await fetch(chrome.runtime.getURL("/control.html"));
    const html = await r.text();
    document.body.insertAdjacentHTML("beforeend", html);

    dragElement(document.getElementById("controlHelpMeOut"));
    const control = document.getElementById("controlHelpMeOut");
    const pauseControl = document.querySelector(".pause");
    const stopControl = document.querySelector(".stop");
    const trashControl = document.querySelector(".trash");
    const videoControl = document.querySelector(".video");
    const videoCancel = document.querySelector(".cancel-video");
    const micControl = document.querySelector(".mic");
    const hoursDisplay = document.querySelector(".hours");
    const minutesDisplay = document.querySelector(".minutes");
    const secondsDisplay = document.querySelector(".seconds");
    const pauseText = document.querySelector(".pauseText");
    const timer = document.querySelector("#controlHelpMeOut");
    const hide = document.querySelector(".hide");

    hide.onclick = () => {
      control.style.visibility = "hidden";
    };

    startTimer(hoursDisplay, minutesDisplay, secondsDisplay);

    pauseControl.innerHTML = pauseSvg;
    stopControl.innerHTML = stopSvg;
    trashControl.innerHTML = trashSvg;
    videoControl.innerHTML = videoSvg;
    videoCancel.innerHTML = cancelVideo;
    videoCancel.style.display = "none";
    micControl.innerHTML = audio ? micSvg : micInactive;

    pauseControl.addEventListener("click", () => {
      if (isPlaying) {
        pauseControl.innerHTML = playSvg;
        pauseText.textContent = "Resume";
        pauseRecorderHelpMeOut(recorder);
        pauseTimer(hoursDisplay, minutesDisplay, secondsDisplay);
      } else {
        pauseControl.innerHTML = pauseSvg;
        pauseText.textContent = "Pause";
        resumeRecorderHelpMeOut(recorder);
        resumeTimer(hoursDisplay, minutesDisplay, secondsDisplay);
      }
    });
    videoControl.onclick = () => {
      muteCamera();
      videoControl.style.display = "none";
      videoCancel.style.display = "grid";
    };

    videoCancel.onclick = () => {
      playCamera();
      videoControl.style.display = "grid";
      videoCancel.style.display = "none";
    };
    stopControl.addEventListener("click", () => {
      stopRecorderHelpMeOut(recorder);
      clearRecordingAndTimer();
      document.body.removeChild(timer);
    });
    trashControl.addEventListener("click", () => {
      clearRecordingAndTimer();
      document.body.removeChild(timer);
      window.location.reload();
    });
    return true;
  } catch (error) {
    return error;
  }
}

function dragElement(elmnt) {
  var pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;

  if (document.getElementById(elmnt.id + "header")) {
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    elmnt.style.top = elmnt.offsetTop - pos2 + "px";
    elmnt.style.left = elmnt.offsetLeft - pos1 + "px";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
  if (message.action === "startCamera") {
    navigator.mediaDevices.getUserMedia = console.log(message);
    navigator.mediaDevices.getUserMedia ||
      navigator.mediaDevices.webkitGetUserMedia ||
      navigator.mediaDevices.mozGetUserMedia;

    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({
          audio: true,
          video: {
            facingMode: "user",
            width: { min: 1024, ideal: 1280, max: 1920 },
            height: { min: 576, ideal: 720, max: 1080 },
            frameRate: { ideal: 30, max: 60 },
          },
        })
        .then((stream) => {
          playStream(stream);
        })
        .catch((err) => {
          console.log(err.message);
        });
    } else {
      console.log("getUserMedia not supported");
    }
  }
  if (message.action === "stopCamera") {
    console.log("stop camera");
  }
  if (message.action === "start") {
    const currentTab = message.currentTab;
    const chromeId = message.chromeId;
    const audio = message.audio;
    await control(audio, currentTab, chromeId);
  }
});
