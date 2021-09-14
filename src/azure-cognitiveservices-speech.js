// azure-cognitiveservices-speech.js

const sdk = require('microsoft-cognitiveservices-speech-sdk');
const { Buffer } = require('buffer');
const { PassThrough } = require('stream');
const fs = require('fs');

/**
 * Node.js server code to convert text to speech
 * @returns stream
 * @param {*} key your resource key
 * @param {*} region your resource region
 * @param {*} text text to convert to audio/speech
 * @param {*} filename optional - best for long text - temp file for converted speech/audio
 */
const textToSpeech = async (key, region, text, filename, speed, pitch)=> {
    
    // convert callback function to promise
    return new Promise((resolve, reject) => {
        
        const speechConfig = sdk.SpeechConfig.fromSubscription(key, region);
        speechConfig.speechSynthesisOutputFormat = 5; // mp3
        speechConfig.speechRecognitionLanguage='th-TH'
       speechConfig.speechSynthesisLanguage='th-TH'
        console.log("speech-----------------")
        let audioConfig = null;
        
        if (filename) {
            audioConfig = sdk.AudioConfig.fromAudioFileOutput(filename);
        }
        let ssml = '<speak xmlns="http://www.w3.org/2001/10/synthesis" xmlns:mstts="http://www.w3.org/2001/mstts" xmlns:emo="http://www.w3.org/2009/10/emotionml" version="1.0" xml:lang="en-US"><voice name="th-TH-Pattara"><prosody rate="'+speed+'%" pitch="'+pitch+'%">'+text+'</prosody></voice></speak>'
        console.log("hherer",ssml)
        const synthesizer = new sdk.SpeechSynthesizer(speechConfig, audioConfig);
   synthesizer.speakSsmlAsync(
        ssml,
        result => {
                
                const { audioData } =  result;
                synthesizer.close();
                
                if (filename) {
                    
                    // return stream from file
                    const audioFile = fs.createReadStream(filename);
                    resolve(audioFile);
                    
                } else {
                    
                    // return stream from memory
                    const bufferStream = new PassThrough();
                    setTimeout(function(){
  bufferStream.end(Buffer.from(audioData));
                    resolve(bufferStream);

                    }, 2000)
                }
            },
            error => {
console.log("here ==", error)
                synthesizer.close();
                reject(error);
            }); 
    });
};

module.exports = {
    textToSpeech
};
