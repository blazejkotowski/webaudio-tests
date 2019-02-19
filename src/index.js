import MediaStreamRecorder from 'msr';
import MiniRecorder from './mini_recorder.js';

const METRONOME_URL = "./dist/metronome_60bpm_5s_divided.wav";
const RECORDING_DURATION = 5000; // 5s
let mediaRecorder;
let recordButton;
let downloadPart;

  navigator.getUserMedia ||
  navigator.webkitGetUserMedia ||
  navigator.mozGetUserMedia;

const setUp = (stream) => {
    mediaRecorder = new MediaStreamRecorder(stream);
    mediaRecorder.mimeType = 'audio/wav';
};

const onMicrophoneAccessError = () => {
    alert("Can't record audio on your browser");
};


// Playing metronome track
window.AudioContext = window.AudioContext||window.webkitAudioContext;
let context = new AudioContext();
let metronomeBuffer;
const loadMetronomeTrack = () => {
    let request = new XMLHttpRequest();
    request.open('get', METRONOME_URL, true);
    request.responseType = "arraybuffer";
    request.onload = () => {
        context.decodeAudioData(request.response, (buffer) => {
            metronomeBuffer = buffer;
        });
    };
    request.send();
};

const playMetronome = () => {
    let source = context.createBufferSource();
    source.buffer = metronomeBuffer;
    source.connect(context.destination);
    source.start(0);
};
// End playing metronome track



const constraints = { audio: true };

const setUpRecorder = () => {
    navigator.mediaDevices
        .getUserMedia(constraints)
        .then(setUp)
        .catch(onMicrophoneAccessError)
};

const stopRecorder = () => mediaRecorder && mediaRecorder.stop();

const processRecording = (blob, resolve) => {
    stopRecorder();
    let blobURL = URL.createObjectURL(blob);
    downloadPart.innerHTML = "<a href='" + blobURL + "' download='audio.wav'>Download audio</a>";
    if(resolve) {
        resolve();
    }
};

const startRecording = () => {
    return new Promise((resolve, reject) => {
        if(mediaRecorder) {
            mediaRecorder.stop();
            mediaRecorder.ondataavailable = blob => {
                processRecording(blob, resolve);
            };
            mediaRecorder.start(RECORDING_DURATION*2);
            playMetronome();
            setInterval(() => {
                stopRecorder();
            }, RECORDING_DURATION);
        }
        else {
            reject();
        }
    });4
};

const setupDOM = () => {
    recordButton = document.getElementById("record-button");
    downloadPart = document.getElementById("download-part")
};

const addEventListeners = () => {
    recordButton.addEventListener('click', (e) => {
        recordButton.setAttribute("disabled", "");
        startRecording().then(() => {
            recordButton.removeAttribute("disabled");
        });
    });
};


loadMetronomeTrack();
setUpRecorder();
setupDOM();
addEventListeners();