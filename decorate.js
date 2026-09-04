//display the saved photo
const takenPic = sessionStorage.getItem('boothPic');
const finalPhoto = document.getElementById('finalPhoto');

if (takenPic) {
    finalPhoto.src = takenPic;
} else {
    console.log("Picture not found!");
}

const stickerSlots = document.querySelectorAll('.sticker-slot');
const photoWrap = document.querySelector('.polaroid-photo-wrap');

stickerSlots.forEach((slot) => {
    slot.addEventListener('click', () => {
        const iconImg = slot.querySelector('.sticker-icon');
        if (!iconImg) return;

        addSticker(iconImg.src);
    });
});

function addSticker(imageSrc) {
    const stickerDiv = document.createElement('div');
    stickerDiv.className = 'added-sticker';
    stickerDiv.style.left = '50%';
    stickerDiv.style.top = '50%';
    stickerDiv.style.width = '80px';
    stickerDiv.style.transform = 'translate(-50%, -50%)';

    const img = document.createElement('img');
    img.src = imageSrc;
    img.className = 'added-sticker-img';
    img.draggable = false;

    const resizeHandle = document.createElement('div');
    resizeHandle.className = 'resize-handle';

    const deleteHandle = document.createElement('button');
    deleteHandle.className = 'delete-handle';
    deleteHandle.textContent = 'X';

    stickerDiv.appendChild(img);
    photoWrap.appendChild(stickerDiv);
    stickerDiv.appendChild(resizeHandle);
    stickerDiv.appendChild(deleteHandle);

    makeDraggable(stickerDiv);
    makeResizable(stickerDiv, resizeHandle);
    makeDeletable(stickerDiv, deleteHandle);
    makeSelectable(stickerDiv);

    selectSticker(stickerDiv);
}

function makeDraggable(stickerDiv) {
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    function startDrag(clientX, clientY) {
        isDragging = true;

        const wrapRect = photoWrap.getBoundingClientRect();
        const stickerRect = stickerDiv.getBoundingClientRect();

        stickerDiv.style.transform = 'none';
        stickerDiv.style.left = (stickerRect.left - wrapRect.left) + 'px';
        stickerDiv.style.top = (stickerRect.top - wrapRect.top) + 'px';

        offsetX = clientX - stickerRect.left;
        offsetY = clientY - stickerRect.top;
    }

    function moveDrag(clientX, clientY) {
        if (!isDragging) return;

        const wrapRect = photoWrap.getBoundingClientRect();
        let newLeft = clientX - wrapRect.left - offsetX;
        let newTop = clientY - wrapRect.top - offsetY;

        stickerDiv.style.left = newLeft +'px';
        stickerDiv.style.top = newTop + 'px';
    }

    function endDrag() {
        isDragging = false;
    }

    //mouse events
    stickerDiv.addEventListener('mousedown', (e) => {
        startDrag(e.clientX, e.clientY);
        e.preventDefault(); 
    });

    document.addEventListener('mousemove', (e) => {
        moveDrag(e.clientX, e.clientY);
    });
    
    document.addEventListener('mouseup', endDrag);

    //touch events
    stickerDiv.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        startDrag(touch.clientX, touch.clientY);
    });

    document.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        moveDrag(touch.clientX, touch.clientY);
    });

    document.addEventListener('touchend', endDrag);
}

function makeResizable(stickerDiv, resizeHandle) {
    let isResizing = false;
    let startX = 0;
    let startWidth = 0;

    function startResize(clientX) {
        isResizing = true;
        startX = clientX;
        startWidth = stickerDiv.offsetWidth;
    }

    function moveResize(clientX) {
        if (!isResizing) return;

        const deltaX = clientX - startX;
        const newWidth = Math.max(20, startWidth + deltaX);
        stickerDiv.style.width = newWidth + 'px';
    }

    function endResize() {
        isResizing = false;
    }

    //mouse events
    resizeHandle.addEventListener('mousedown', (e) => {
        startResize(e.clientX);
        e.preventDefault();
        e.stopPropagation();
    });

    document.addEventListener('mousemove', (e) => {
        moveResize(e.clientX);
    });

    document.addEventListener('mouseup', endResize);

    //touch events
    resizeHandle.addEventListener('touchstart', (e) => {
        const touch = e.touches[0];
        startResize(touch.clientX);
        e.stopPropagation();
    });

    document.addEventListener('touchmove', (e) => {
        const touch = e.touches[0];
        moveResize(touch.clientX);
    });

    document.addEventListener('touchend', endResize);
}

function makeDeletable(stickerDiv, deleteHandle) {
    deleteHandle.addEventListener('click', (e) => {
        e.stopPropagation();
        stickerDiv.remove(); 
    });
}

function makeSelectable(stickerDiv) {
    stickerDiv.addEventListener('mousedown', () => {
        selectSticker(stickerDiv);
    });
}

function selectSticker(stickerDiv) {
    document.querySelectorAll('.added-sticker').forEach((sticker) => {
        sticker.classList.remove('selected');
    });

    stickerDiv.classList.add('selected');
}

//clicking anywhere outside the stickers will deselect all
photoWrap.addEventListener('mousedown', (e) => {
    if (e.target === photoWrap || e.target.id === 'finalPhoto') {
        document.querySelectorAll('.added-sticker').forEach((sticker) => {
            sticker.classList.remove('selected');
        });
    }
});