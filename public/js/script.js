// const { json } = require("express");

const socket = io()
const videoGrid = document.getElementById('video-grid');
//NOTE: removing settings from peer constructor solved join-room event not emitting!
const myPeer = new Peer();


function checkSafari() {
    let seemsChrome = navigator.userAgent.indexOf("Chrome") > -1;
    let seemsSafari = navigator.userAgent.indexOf("Safari") > -1;
    return seemsSafari && !seemsChrome;
  }

  let peerOptions = {};

  if (checkSafari()) {
    peerOptions.serialization = "json";
  }
// conn = peer.connect('ABCDEFG', peerOptions);


let myVideoStream;
const myVideo = document.createElement('video')
myVideo.muted = true;
const peers = {};
navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true
}).then(stream => {
    myVideoStream = stream;
    addVideoStream(myVideo, stream)
    myPeer.on('call', call => {
        peerOptions
        call.answer(stream)
        const video = document.createElement('video')
        call.on('stream', userVideoStream => {
            addVideoStream(video, userVideoStream)
        })
    })


    socket.on('user-connected', userId => {
            peerOptions
            alert("New user!");
            connectToNewUser(userId, stream)
        })
        // input value
    let text = $("input");
    // when press enter send message
    $('html').keydown(function(e) {
        let value = text.val();
        if (e.which == 13 && value.length !== 0) {
            socket.emit('message', value);
            text.val('')

        }
    });
    socket.on("createMessage", message => {
        peerOptions
        $("ul").append(`<li class="message"><b>user</b><br/>${message}</li>`);
        scrollToBottom()
    })
})

socket.on('user-disconnected', userId => {
    peerOptions
    if (peers[userId]) peers[userId].close()
})

myPeer.on('open', id => {
    peerOptions
    socket.emit('join-room', ROOM_ID, id, peerOptions)
})

function connectToNewUser(userId, stream) {
    const call = myPeer.call(userId, stream)
    const video = document.createElement('video')

    call.on('stream', userVideoStream => {
        peerOptions
        addVideoStream(video, userVideoStream)
    })
    call.on('close', () => {
        video.remove()
    })

    peers[userId] = call
}

function addVideoStream(video, stream) {
    video.srcObject = stream
    video.autoplay = true;
    video.setAttribute('playsinline', 'playsinline');
    video.addEventListener('loadedmetadata', () => {
        video.play()
    })
    // videoGrid.append(video)
}



const scrollToBottom = () => {
    var d = $('.main__chat_window');
    d.scrollTop(d.prop("scrollHeight"));
}


const muteUnmute = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getAudioTracks()[0].enabled = false;
        setUnmuteButton();
    } else {
        setMuteButton();
        myVideoStream.getAudioTracks()[0].enabled = true;
    }
}

const playStop = () => {
    console.log('object')
    let enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
        myVideoStream.getVideoTracks()[0].enabled = false;
        setPlayVideo()
    } else {
        setStopVideo()
        myVideoStream.getVideoTracks()[0].enabled = true;
    }
}






const setMuteButton = () => {
    const html = `
    <i class="fas fa-microphone"></i>
    <span>Mute</span>
  `
    document.querySelector('.main__mute_button').innerHTML = html;
}

const setUnmuteButton = () => {
    const html = `
    <i class="unmute fas fa-microphone-slash"></i>
    <span>Unmute</span>
  `
    document.querySelector('.main__mute_button').innerHTML = html;
}

const setStopVideo = () => {
    const html = `
    <i class="fas fa-video"></i>
    <span>Stop Video</span>
  `
    document.querySelector('.main__video_button').innerHTML = html;
}

const setPlayVideo = () => {
    const html = `
  <i class="stop fas fa-video-slash"></i>
    <span>Play Video</span>
  `
    document.querySelector('.main__video_button').innerHTML = html;
}