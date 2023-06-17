document.addEventListener("DOMContentLoaded", function() {
    document.getElementById('system-type').selectedIndex = -1;
    initForm();
});

function initForm() {
    const rangeInputs = document.querySelectorAll('input[type=range]')
    const selects = document.querySelectorAll('select')
    const fileInputs = document.querySelectorAll('input[type=file]')
    const form = document.getElementById('form-order')
    const selectValue = document.querySelectorAll('.select__value')

    rangeInputs.forEach((input) => {
        const viewValue = input.previousSibling

        input.addEventListener('change', (e) => {
            viewValue.innerHTML = `${e.target.value} %`;
        })
        input.addEventListener('input', (e) => {
            viewValue.innerHTML = `${e.target.value} %`;
        })
    })

    fileInputs.forEach((input) => {
        const titleElement = input.nextElementSibling.nextElementSibling

        input.addEventListener('change', (e) => {
            if(e.target.files[0])
                titleElement.innerHTML = `${e.target.files[0].name}`

            titleElement.addEventListener('click', (e) => {
                e.stopPropagation();
                e.preventDefault();

                input.value = "";
                titleElement.innerHTML = "";
            })
        })
    })


    if(form)
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            if(!form.classList.contains('order-form--submitted')) form.classList.add('order-form--submitted');
            let formData = new FormData(e.target);

            // send form data
            console.log(Object.fromEntries(formData));

            form.reset()
            fileInputs.forEach((input) => {
                const titleElement = input.nextElementSibling.nextElementSibling;
                titleElement.innerHTML = "";
            })
            selects.forEach((select) => {
                select.selectedIndex = -1;
            })

            selectValue.forEach((value) => {
                value.innerHTML = `${value.dataset.default}`
            })
        })
}

const config = {
    root: null,
    rootMargin: '0px',
    threshold: [0.5, 1]
};


let observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        const isIntersecting = entry.isIntersecting
        const element = entry.target;

        if(isIntersecting) {
            element.classList.add('in-view')
        }
    })
}, config);


document.addEventListener("DOMContentLoaded", function(event) {
    const observeList = document.querySelectorAll('[data-observe]')

    observeList.forEach((element) => {
        observer.observe(element)
    })
})
let currentMode = 'bottom'
let opened = false;

const openedTopClass = '.select__input--opened-top'
const openedBottomClass = '.select__input--opened-bottom'

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
                window.removeEventListener('scroll', () => observe(customSelect))
            } else {
                opened = true;

                outsideClick(parent, customSelect)

                if(currentMode === 'top') {
                    customSelect.classList.add(openedTopClass.substring(1))
                } else {
                    customSelect.classList.add(openedBottomClass.substring(1))
                }

                window.addEventListener('scroll', () => observe(customSelect))
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
                window.removeEventListener('scroll', () => observe(select))

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
        }
    })
}

const observe = (select) => {
    const paramsEl = select.getBoundingClientRect()
    let selectHeight = select.offsetHeight
    let shouldBeOpenedToTop = (paramsEl.top + (selectHeight / 2)) > (document.documentElement.clientHeight / 1.5)

    let isVisible = isInViewport(select)

    if(!isVisible) {
        select.classList.remove(openedTopClass.substring(1))
        select.classList.remove(openedBottomClass.substring(1))
        opened = false;
        window.removeEventListener('scroll', () => observe(select))
        return;
    }

    if (opened) {
        console.warn(`OPENED ${shouldBeOpenedToTop} ${currentMode}`)
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