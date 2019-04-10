/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _mini_recorder_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./mini_recorder.js */ \"./src/mini_recorder.js\");\n\n\nconst METRONOME_URL = \"./dist/metronome_60bpm_5s_divided.wav\";\nconst RECORDING_DURATION = 5000; // 5s\n\nlet recordButton;\nlet waveformsContainer;\n\nlet miniRecorder;\n\nlet recordings = 0;\n\n\nconst setupDOM = () => {\n    recordButton = document.getElementById(\"record-button\");\n    waveformsContainer = document.getElementById(\"waveforms\");\n};\n\nconst setupMiniRecorder = () => {\n    miniRecorder = new _mini_recorder_js__WEBPACK_IMPORTED_MODULE_0__[\"default\"]();\n    miniRecorder.loadBackingTrack(METRONOME_URL);\n};\n\nconst addEventListeners = () => {\n    recordButton.addEventListener('click', (e) => {\n        recordButton.setAttribute(\"disabled\", \"\");\n        miniRecorder.record(RECORDING_DURATION).then((blob) => {\n            // Create new waveform elem\n            let newWaveform = document.createElement(\"div\");\n            let waveformId = 'waveform-'+recordings;\n            newWaveform.setAttribute('id', waveformId);\n            waveformsContainer.appendChild(newWaveform);\n\n            // Create new timeline elem\n            let waveformTimeline = document.createElement(\"div\");\n            waveformTimeline.setAttribute('id', waveformId + '-timeline');\n            waveformsContainer.appendChild(waveformTimeline);\n\n            // Initialize wavesurfer and timeline\n            let wavesurfer = WaveSurfer.create({\n                container: '#' + waveformId,\n                minPxPerSec: 10000,\n                normalize: true,\n                scrollParent: true,\n                plugins: [\n                    WaveSurfer.timeline.create({\n                        container: \"#\" + waveformId + \"-timeline\",\n                        timeInterval: .001,\n                    })\n                ]\n            });\n\n            // Load the blog\n            wavesurfer.loadBlob(blob);\n\n            // let waveformTimeline = document.createElement(\"div\");\n            // waveformTimeline.setAttribute('id', waveformId + '-timeline');\n            // wavesurfer.on('ready', () => {\n            //     var timeline = Object.create(WaveSurfer.Timeline);\n            //     timeline.init({\n            //       wavesurfer: wavesurfer,\n            //       container: waveformId+'-timeline'\n            //     });\n            //   });\n\n            recordings += 1;\n\n            recordButton.removeAttribute(\"disabled\");\n            setupMiniRecorder();\n        });\n    });\n};\n\n\nsetupDOM();\nsetTimeout(setupMiniRecorder, 500);\naddEventListeners();\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ "./src/mini_recorder.js":
/*!******************************!*\
  !*** ./src/mini_recorder.js ***!
  \******************************/
/*! exports provided: MiniRecorder, default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"MiniRecorder\", function() { return MiniRecorder; });\nwindow.SER_MEDIA_CONSTRAINTS = {audio: true};\nwindow.SAMPLE_RATE = 44100;\nwindow.CHANNELS_NUM = 1;\nwindow.AUDIO_TYPE = \"audio/wav\";\n\nclass MiniRecorder {\n    constructor() {\n        let AudioContext = window.AudioContext||window.webkitAudioContext;\n        this.audioContext = new AudioContext();\n\n        navigator.mediaDevices.getUserMedia(\n            {audio: true}\n        ).then((stream) => {\n            this.microphoneSource = this.audioContext.createMediaStreamSource(stream);\n        }).catch(() => {\n            alert(\"Can't record audio on your browser\");\n        });\n    };\n\n    _prepareRecorder() {\n        this.audioBuffers = [];\n        this.audioLength = 0;\n        this.recorderNode = this.audioContext.createScriptProcessor(0, 1, 1);\n        console.log(\"Audio processing buffer size: \" + this.recorderNode.bufferSize);\n        this.recorderNode.onaudioprocess = (audioProcessingEvent) => {\n            this.saveAudioChunk(audioProcessingEvent.inputBuffer);\n        }\n    }\n\n    saveAudioChunk(inputBuffer) {\n        // copy must be done\n        this.audioBuffers.push(inputBuffer.getChannelData(0).slice());\n        this.audioLength += inputBuffer.getChannelData(0).length;\n    }\n\n    loadBackingTrack(backing_track_url) {\n        let request = new XMLHttpRequest();\n        request.open('get', backing_track_url, true);\n        request.responseType = \"arraybuffer\";\n        request.onload = () => {\n            this.audioContext.decodeAudioData(request.response, (buffer) => {\n                this.decodedAudio = buffer;\n            });\n        };\n        request.send();\n    }\n\n    prepareBackingTrack() {\n        this.sourceNode = this.audioContext.createBufferSource();\n        this.sourceNode.buffer = this.decodedAudio;\n        this.sourceNode.connect(this.audioContext.destination);\n    }\n\n    playBackingTrack(scheduledTime) {\n        this.prepareBackingTrack();\n        this.sourceNode.start(scheduledTime);\n    }\n\n    stopBackingTrack(scheduledTime) {\n        this.sourceNode.stop(scheduledTime);\n    }\n\n    getAudioBlob() {\n        let mergedBuffer = this._mergeBuffers();\n        let dataView = this._encodeWAV(mergedBuffer);\n        let audioBlob = new Blob([dataView], {type: AUDIO_TYPE});\n        return audioBlob;\n    }\n\n    record(time) {\n        this._prepareRecorder();\n\n        return new Promise((resolve, reject) => {\n            let currentTime = this.audioContext.currentTime;\n            let startTime = currentTime;\n            let endTime = startTime + (time/1000);\n            this.playBackingTrack(startTime);\n            this.stopBackingTrack(endTime);\n            this.microphoneSource.connect(this.recorderNode);\n            this.recorderNode.connect(this.audioContext.destination);\n            setTimeout(() => {\n                this.recorderNode.disconnect(this.audioContext.destination);\n                this.microphoneSource.disconnect(this.recorderNode);\n                console.log(\"Start time: \" + startTime + \", end time: \" + endTime);\n                console.log(\"Audio length: \" + this.audioLength + \" samples\");\n                let resultBlob = this.getAudioBlob();\n                console.log(resultBlob);\n                resolve(resultBlob);\n            }, time);\n        });\n    }\n\n\n    _mergeBuffers() {\n        let resultBuffer = new Float32Array(this.audioLength);\n        let offset = 0;\n        window.audioBuffers = this.audioBuffers;\n        console.log(\"Merging buffers\");\n        console.log(\"Total buffers: \" + this.audioBuffers.length);\n        for (let i = 0; i < this.audioBuffers.length; ++i) {\n            // console.log(this.audioBuffers[i]);\n            resultBuffer.set(this.audioBuffers[i], offset);\n            offset += this.audioBuffers[i].length;\n        }\n        return resultBuffer;\n    };\n\n    _encodeWAV(samples) {\n        let buffer = new ArrayBuffer(44 + samples.length * 2);\n        let view = new DataView(buffer);\n\n        /* RIFF identifier */\n        this._writeString(view, 0, 'RIFF');\n        /* RIFF chunk length */\n        view.setUint32(4, 36 + samples.length * 2, true);\n        /* RIFF type */\n        this._writeString(view, 8, 'WAVE');\n        /* format chunk identifier */\n        this._writeString(view, 12, 'fmt ');\n        /* format chunk length */\n        view.setUint32(16, 16, true);\n        /* sample format (raw) */\n        view.setUint16(20, 1, true);\n        /* channel count */\n        view.setUint16(22, CHANNELS_NUM, true);\n        /* sample rate */\n        view.setUint32(24, SAMPLE_RATE, true);\n        /* byte rate (sample rate * block align) */\n        view.setUint32(28, SAMPLE_RATE * 4, true);\n        /* block align (channel count * bytes per sample) */\n        view.setUint16(32, CHANNELS_NUM * 2, true);\n        /* bits per sample */\n        view.setUint16(34, 16, true);\n        /* data chunk identifier */\n        this._writeString(view, 36, 'data');\n        /* data chunk length */\n        view.setUint32(40, samples.length * 2, true);\n\n        this._floatTo16BitPCM(view, 44, samples);\n\n        return view;\n    };\n\n    _writeString(view, offset, string) {\n        for (let i = 0; i < string.length; i++) {\n            view.setUint8(offset + i, string.charCodeAt(i));\n        }\n    };\n\n    _floatTo16BitPCM(output, offset, input) {\n        for (let i = 0; i < input.length; i++, offset += 2) {\n            let s = Math.max(-1, Math.min(1, input[i]));\n            output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);\n        }\n    };\n}\n\n/* harmony default export */ __webpack_exports__[\"default\"] = (MiniRecorder);\n\n//# sourceURL=webpack:///./src/mini_recorder.js?");

/***/ })

/******/ });