//display the saved photo
const takenPic = sessionStorage.getItem('boothPic');
const finalPic = document.getElementById('finalPic');

if (takenPic) {
    finalPic.src = takenPic;
} else {
    console.log("Picture not found!");
}