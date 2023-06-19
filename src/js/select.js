let currentMode = 'bottom'
let opened = false;

const openedTopClass = '.select__input--opened-top'
const openedBottomClass = '.select__input--opened-bottom'

let functionLink = null

document.addEventListener("DOMContentLoaded", function() {
    const selects = document.querySelectorAll('select')

    selects.forEach((select) => {
        const selectValueElement = select.nextElementSibling.querySelector('.select__value')
        const optionsList = select.nextElementSibling.nextElementSibling.querySelectorAll('.select__option')
        const optionsListParent = select.nextElementSibling.nextElementSibling
        const parent = select.parentNode

        const customSelect = select.nextSibling

        customSelect.addEventListener('click', (e) => {
            if(opened) {
                opened = false;

                if(currentMode === 'top') {
                    customSelect.classList.remove(openedTopClass.substring(1))
                } else {
                    customSelect.classList.remove(openedBottomClass.substring(1))
                }
                window.removeEventListener('scroll', functionLink)
            } else {
                opened = true;

                outsideClick(parent, customSelect)

                if(currentMode === 'top') {
                    customSelect.classList.add(openedTopClass.substring(1))
                } else {
                    customSelect.classList.add(openedBottomClass.substring(1))
                }

                functionLink = observe.bind(window, customSelect)

                window.addEventListener('scroll', functionLink)
            }
        })

        optionsList.forEach((option) => {
            option.addEventListener('click',  (e) => {
                if(option.classList.contains('select__option--selected')) return;

                const existedSelectOption = optionsListParent.querySelector('.select__option--selected')
                if(existedSelectOption) existedSelectOption.classList.remove('select__option--selected')

                option.classList.add('select__option--selected')

                select.value = e.target.dataset.value
                selectValueElement.innerHTML = `${e.target.dataset.value}`
                customSelect.classList.remove(currentMode === 'top' ? openedTopClass.substring(1) : openedBottomClass.substring(1))
                window.removeEventListener('scroll', functionLink)

                opened = false;
            })
        })
    })
});

const outsideClick = (parent, select) => {
    window.addEventListener('click', (e) => {
        const withinBoundaries = e.composedPath().includes(parent)

        if (!withinBoundaries) {
            if(currentMode === 'top') {
                select.classList.remove(openedTopClass.substring(1))
            } else {
                select.classList.remove(openedBottomClass.substring(1))
            }
            opened = false;
            window.removeEventListener('scroll', functionLink)
        }
    })
}

function observe(select) {
    const paramsEl = select.getBoundingClientRect()
    let selectHeight = select.offsetHeight
    let shouldBeOpenedToTop = (paramsEl.top + (selectHeight / 2)) > (document.documentElement.clientHeight / 1.5)

    let isVisible = isInViewport(select)

    if(!isVisible) {
        select.classList.remove(openedTopClass.substring(1))
        select.classList.remove(openedBottomClass.substring(1))
        opened = false;
        window.removeEventListener('scroll', functionLink)
        return;
    }

    if (opened) {
        if(shouldBeOpenedToTop && currentMode === 'bottom') {

            select.classList.remove(openedBottomClass.substring(1))
            select.classList.add(openedTopClass.substring(1))

            if(shouldBeOpenedToTop && currentMode === 'bottom') {
                currentMode = 'top'
            } else if(!shouldBeOpenedToTop && currentMode === 'top') {
                currentMode = 'bottom'
            }
        } else if(!shouldBeOpenedToTop && currentMode === 'top'){

            select.classList.remove(openedTopClass.substring(1))
            select.classList.add(openedBottomClass.substring(1))

            if(shouldBeOpenedToTop && currentMode === 'bottom') {
                currentMode = 'top'
            } else if(!shouldBeOpenedToTop && currentMode === 'top') {
                currentMode = 'bottom'
            }
        }
    } else {
        if(shouldBeOpenedToTop && currentMode === 'bottom') {
            currentMode = 'top'
        } else if(!shouldBeOpenedToTop && currentMode === 'top') {
            currentMode = 'bottom'
        }
    }
}

function isInViewport(el) {
    const rect = el.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
}