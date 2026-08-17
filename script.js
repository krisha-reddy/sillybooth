//accessing webcam using getUserMedia
let video = document.querySelector("#videoElement");

if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({video: true})
    .then(function (stream) {
        video.srcObject = stream;
    }) 
    .catch (function(error) {
        console.log("Something went wrong");
    })

} else {
    console.log("getUserMedia not supported on this device");
}

const clickButton = document.getElementById('click-btn');
const overlayCountdown = document.getElementById('overlayCountdown');
const overlayFlash = document.getElementById('overlayFlash');

clickButton.addEventListener('click', () => {
    let count = 3;
    clickButton.disabled = true;
    overlayCountdown.classList.remove('hidden');
    showCount(count);

    const interval = setInterval(() => {
        count--;

        if (count > 0) {
            showCount(count);
        } else {
            clearInterval(interval);
            overlayCountdown.classList.add('hidden');
            triggerFlash();
            takePic();
            clickButton.disabled = false;
        }
    }, 1000);
});

function showCount(num) {
    overlayCountdown.textContent = num;
    overlayCountdown.classList.remove('pulse');
    void overlayCountdown.offsetWidth;
    overlayCountdown.classList.add('pulse');
}

function triggerFlash() {
    overlayFlash.classList.remove('flash-active');
    void overlayFlash.offsetWidth;
    overlayFlash.classList.add('flash-active');
}

function takePic() {
    const canvas = document.getElementById('capture-pic');
    const context = canvas.getContext('2d');

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context.translate(canvas.width, 0);
    context.scale(-1, 1);
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    //convert to base64 img string
    const imageData = canvas.toDataURL('img/png');

    sessionStorage.setItem('boothPic', imageData);
}