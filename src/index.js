import MiniRecorder from './mini_recorder.js';

const METRONOME_URL = "./dist/metronome_60bpm_5s_divided.wav";
const RECORDING_DURATION = 5000; // 5s

let recordButton;
let waveformsContainer;

let miniRecorder;

let recordings = 0;


const setupDOM = () => {
    recordButton = document.getElementById("record-button");
    waveformsContainer = document.getElementById("waveforms");
};

const setupMiniRecorder = () => {
    miniRecorder = new MiniRecorder();
    miniRecorder.loadBackingTrack(METRONOME_URL);
};

const addEventListeners = () => {
    recordButton.addEventListener('click', (e) => {
        recordButton.setAttribute("disabled", "");
        miniRecorder.record(RECORDING_DURATION).then((blob) => {
            let newWaveform = document.createElement("div");
            let waveformId = 'waveform-'+recordings;
            newWaveform.setAttribute('id', waveformId);

            waveformsContainer.appendChild(newWaveform);

            let wavesurfer = WaveSurfer.create({
                container: '#' + waveformId
            });
            wavesurfer.loadBlob(blob);
            recordings += 1;

            recordButton.removeAttribute("disabled");
            setupMiniRecorder();
        });
    });
};


setupDOM();
setTimeout(setupMiniRecorder, 500);
addEventListeners();