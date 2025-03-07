document.addEventListener('DOMContentLoaded', () => {
    const purchaseBtn = document.getElementById('purchaseBtn');
    const screamerOverlay = document.getElementById('overlay');
    const screamSound = document.getElementById('sound');

    function showScreamer() {
        screamerOverlay.style.display = 'flex';
        screamSound.volume = 1.0;
        screamSound.currentTime = 0;
        screamSound.play();
    }

    function hideScreamer() {
        screamerOverlay.style.display = 'none';
        screamSound.pause();
    }

    purchaseBtn.addEventListener('click', showScreamer);
    screamerOverlay.addEventListener('click', hideScreamer);
});
