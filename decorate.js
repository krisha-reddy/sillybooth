//display the saved photo
const takenPic = sessionStorage.getItem('boothPic');
const finalPhoto = document.getElementById('finalPic');

if (takenPic) {
    finalPhoto.src = takenPic;
} else {
    console.log("Picture not found!");
}