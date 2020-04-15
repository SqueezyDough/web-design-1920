const player = document.getElementById('video')
const indicators = document.querySelectorAll('.offscreen-sound-indicator')

console.log(indicators)

player.addEventListener('click', function() {   
    // player.play();

    indicators.forEach(indicator => {
        indicator.classList.add('active')
    })
});