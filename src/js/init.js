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
    const defaultValues = document.querySelectorAll('.form-order__value')

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

            defaultValues.forEach((value) => {
                value.innerHTML = `${value.dataset.default}`
            })
        })
}
