const animationsPath = '../media/CC/cc-animations.json'

initAnimations()

async function initAnimations() {
    const animations = await fetchAnimations(animationsPath)
    
    console.log(animations)

    displayAnimations(animations)
}

function fetchAnimations(path) {
    return fetch(path)
        .then(res => res.json())
        .then(json => addIds(json))
}

function displayAnimations(animations) {
    console.log(animations)

    video.addEventListener('timeupdate', e => {
        animationsController(e, animations)
    })
}

function animationsController(e, animations) {
    const currentTime = e.target.currentTime
    const matchingAnimation = findAnimation(animations, currentTime)

    if (matchingAnimation) {
        createAnimation(matchingAnimation)
    }
}

function findAnimation(animations, time) {
    return animations.find(an => time >= an.startTime && time <= an.endTime)
}

function addIds(animations) {
    return animations.animations.map((an, i) => {
        return Object.assign(an, {id: i + 1})
    })  
}

function createAnimation(animation) {
    console.log(animation.type)
    const textContainer = document.getElementById('cc-text')
    const textItem = document.createElement('span')

    if (animation.type === 'text') {
        if (!animationIsInDOM(animation)) {         
            textItem.setAttribute('data-an-id', animation.id)
            textItem.textContent = animation.text
            textContainer.appendChild(textItem)

            if (animation.size) {
                console.log(animation)
                textItem.setAttribute('style', `
                font-size: ${animation.size}
            `)
            }
        }
        

        // remove if player time exceeds endtime
        video.addEventListener('timeupdate', e => {
            if (e.target.currentTime >= animation.endTime && animationIsInDOM(animation)) {
               try {
                    textContainer.removeChild(textItem)   
                } catch {
                    console.log('el not found')
                    return     
               }                           
            }
        })
    }
}

function animationIsInDOM(animation) {
    return document.querySelector(`[data-an-id="${animation.id}"]`)
}
