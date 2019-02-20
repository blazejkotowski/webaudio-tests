window.SER_MEDIA_CONSTRAINTS = {audio: true};
window.SAMPLE_RATE = 44100;
window.CHANNELS_NUM = 1;
window.AUDIO_TYPE = "audio/wav";

export class MiniRecorder {
    constructor() {
        let AudioContext = window.AudioContext||window.webkitAudioContext;
        this.audioContext = new AudioContext();

        navigator.mediaDevices.getUserMedia(
            {audio: true}
        ).then((stream) => {
            this.microphoneSource = this.audioContext.createMediaStreamSource(stream);
        }).catch(() => {
            alert("Can't record audio on your browser");
        });
    };

    _prepareRecorder() {
        this.audioBuffers = [];
        this.audioLength = 0;
        this.recorderNode = this.audioContext.createScriptProcessor(0, 1, 1);
        console.log("Audio processing buffer size: " + this.recorderNode.bufferSize);
        this.recorderNode.onaudioprocess = (audioProcessingEvent) => {
            this.saveAudioChunk(audioProcessingEvent.inputBuffer);
        }
    }

    saveAudioChunk(inputBuffer) {
        // copy must be done
        this.audioBuffers.push(inputBuffer.getChannelData(0).slice());
        this.audioLength += inputBuffer.getChannelData(0).length;
    }

    loadBackingTrack(backing_track_url) {
        let request = new XMLHttpRequest();
        request.open('get', backing_track_url, true);
        request.responseType = "arraybuffer";
        request.onload = () => {
            this.audioContext.decodeAudioData(request.response, (buffer) => {
                this.decodedAudio = buffer;
            });
        };
        request.send();
    }

    prepareBackingTrack() {
        this.sourceNode = this.audioContext.createBufferSource();
        this.sourceNode.buffer = this.decodedAudio;
        this.sourceNode.connect(this.audioContext.destination);
    }

    playBackingTrack(scheduledTime) {
        this.prepareBackingTrack();
        this.sourceNode.start(scheduledTime);
    }

    stopBackingTrack(scheduledTime) {
        this.sourceNode.stop(scheduledTime);
    }

    getAudioBlob() {
        let mergedBuffer = this._mergeBuffers();
        let dataView = this._encodeWAV(mergedBuffer);
        let audioBlob = new Blob([dataView], {type: AUDIO_TYPE});
        return audioBlob;
    }

    record(time) {
        this._prepareRecorder();

        return new Promise((resolve, reject) => {
            let currentTime = this.audioContext.currentTime;
            let startTime = currentTime;
            let endTime = startTime + (time/1000);
            this.playBackingTrack(startTime);
            this.stopBackingTrack(endTime);
            this.microphoneSource.connect(this.recorderNode);
            this.recorderNode.connect(this.audioContext.destination);
            setTimeout(() => {
                while (this.audioContext.currentTime < endTime) {
                    // wait
                }
                this.recorderNode.disconnect(this.audioContext.destination);
                this.microphoneSource.disconnect(this.recorderNode);
                console.log("Start time: " + startTime + ", end time: " + endTime);
                console.log("Audio length: " + this.audioLength + " samples");
                let resultBlob = this.getAudioBlob();
                console.log(resultBlob);
                resolve(resultBlob);
            }, time);
        });
    }


    _mergeBuffers() {
        let resultBuffer = new Float32Array(this.audioLength);
        let offset = 0;
        window.audioBuffers = this.audioBuffers;
        console.log("Merging buffers");
        console.log("Total buffers: " + this.audioBuffers.length);
        for (let i = 0; i < this.audioBuffers.length; ++i) {
            // console.log(this.audioBuffers[i]);
            resultBuffer.set(this.audioBuffers[i], offset);
            offset += this.audioBuffers[i].length;
        }
        return resultBuffer;
    };

    _encodeWAV(samples) {
        let buffer = new ArrayBuffer(44 + samples.length * 2);
        let view = new DataView(buffer);

        /* RIFF identifier */
        this._writeString(view, 0, 'RIFF');
        /* RIFF chunk length */
        view.setUint32(4, 36 + samples.length * 2, true);
        /* RIFF type */
        this._writeString(view, 8, 'WAVE');
        /* format chunk identifier */
        this._writeString(view, 12, 'fmt ');
        /* format chunk length */
        view.setUint32(16, 16, true);
        /* sample format (raw) */
        view.setUint16(20, 1, true);
        /* channel count */
        view.setUint16(22, CHANNELS_NUM, true);
        /* sample rate */
        view.setUint32(24, SAMPLE_RATE, true);
        /* byte rate (sample rate * block align) */
        view.setUint32(28, SAMPLE_RATE * 4, true);
        /* block align (channel count * bytes per sample) */
        view.setUint16(32, CHANNELS_NUM * 2, true);
        /* bits per sample */
        view.setUint16(34, 16, true);
        /* data chunk identifier */
        this._writeString(view, 36, 'data');
        /* data chunk length */
        view.setUint32(40, samples.length * 2, true);

        this._floatTo16BitPCM(view, 44, samples);

        return view;
    };

    _writeString(view, offset, string) {
        for (let i = 0; i < string.length; i++) {
            view.setUint8(offset + i, string.charCodeAt(i));
        }
    };

    _floatTo16BitPCM(output, offset, input) {
        for (let i = 0; i < input.length; i++, offset += 2) {
            let s = Math.max(-1, Math.min(1, input[i]));
            output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
        }
    };
}

export default MiniRecorder;