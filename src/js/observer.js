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