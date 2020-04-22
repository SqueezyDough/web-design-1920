const video = document.getElementById('video')
const grid = document.getElementsByName('soundGrid')

fetch('../media/CC/directional-sound-indicators.json')
    .then(res => res.json())
    .then(json => addIdToIndicators(json))
    .then(json => displaySoundDirection(json))

function displaySoundDirection(indicators) {
    console.log(indicators)

    video.addEventListener('timeupdate', e => {
        const currentTime = e.target.currentTime
        const matchingIndicator = findIndicator(indicators, currentTime)

        if (matchingIndicator && !indicatorIsInDOM(matchingIndicator)) {
            createIndicator(matchingIndicator)
        }
    })
}

function addIdToIndicators(indicators) {
    return indicators.dsi.map((ind, i) => {
        return Object.assign(ind, {id: i + 1})
    })  
}

function createIndicator(indicator) {    
    const duration = indicator.endTime - indicator.startTime
    const gridContainer = document.getElementById('soundGrid')
    const gridItem = document.createElement('div')

    gridItem.setAttribute('data-id', indicator.id)

    if (indicator.location) {
        gridItem.classList.add('base-sound-indicator')
        gridItem.setAttribute('style', `
            grid-column: ${indicator.location.x};
            grid-row: ${indicator.location.y};
            color: #${indicator.color};
            animation: volume-${indicator.volumeLevel} ${duration}s;
        `)

        gridContainer.append(gridItem)

    } else {
        gridItem.setAttribute('style', `
            grid-column: 1 / 7;
            grid-row: 1 / 7;
            color: #${indicator.color};
            opacity: ${indicator.volumeLevel / 10 * 2};
            animation: cover-grid ${duration}s;
        `)

        gridContainer.append(gridItem)
    }
   
    // remove if player time exceeds endtime
    video.addEventListener('timeupdate', e => {
        if (e.target.currentTime >= indicator.endTime && indicatorIsInDOM(indicator)) {
            gridContainer.removeChild(gridItem)    
        }
    })
}

function findIndicator(indicators, time) {
    return indicators.find(ind => time >= ind.startTime && time <= ind.endTime)
}

function indicatorIsInDOM(indicator) {
    return document.querySelector(`[data-id="${indicator.id}"]`)
}