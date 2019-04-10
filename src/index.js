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
            // Create new waveform elem
            let newWaveform = document.createElement("div");
            let waveformId = 'waveform-'+recordings;
            newWaveform.setAttribute('id', waveformId);
            waveformsContainer.appendChild(newWaveform);

            // Create new timeline elem
            let waveformTimeline = document.createElement("div");
            waveformTimeline.setAttribute('id', waveformId + '-timeline');
            waveformsContainer.appendChild(waveformTimeline);

            // Initialize wavesurfer and timeline
            let wavesurfer = WaveSurfer.create({
                container: '#' + waveformId,
                minPxPerSec: 10000,
                normalize: true,
                scrollParent: true,
                plugins: [
                    WaveSurfer.timeline.create({
                        container: "#" + waveformId + "-timeline",
                        timeInterval: .001,
                    })
                ]
            });

            // Load the blog
            wavesurfer.loadBlob(blob);

            // let waveformTimeline = document.createElement("div");
            // waveformTimeline.setAttribute('id', waveformId + '-timeline');
            // wavesurfer.on('ready', () => {
            //     var timeline = Object.create(WaveSurfer.Timeline);
            //     timeline.init({
            //       wavesurfer: wavesurfer,
            //       container: waveformId+'-timeline'
            //     });
            //   });

            recordings += 1;

            recordButton.removeAttribute("disabled");
            setupMiniRecorder();
        });
    });
};


setupDOM();
setTimeout(setupMiniRecorder, 500);
addEventListeners();