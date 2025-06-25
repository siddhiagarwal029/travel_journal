document.addEventListener('DOMContentLoaded', function () {
 
    var forms = document.querySelectorAll('.needs-validation');

    Array.prototype.slice.call(forms).forEach(function (form) {
        form.addEventListener('submit', function (event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
    });

    var arrivalDateInput = document.getElementById('arrivalDate');
    var departureDateInput = document.getElementById('departureDate');

    if (arrivalDateInput && departureDateInput) {
        arrivalDateInput.addEventListener('change', function () {
            if (new Date(arrivalDateInput.value) > new Date(departureDateInput.value)) {
                departureDateInput.setCustomValidity('Departure date must be after arrival date.');
            } else {
                departureDateInput.setCustomValidity('');
            }
        });

        departureDateInput.addEventListener('change', function () {
            if (new Date(arrivalDateInput.value) > new Date(departureDateInput.value)) {
                departureDateInput.setCustomValidity('Departure date must be after arrival date.');
            } else {
                departureDateInput.setCustomValidity('');
            }
        });
    }


    var ratingInput = document.getElementById('rating');
    if (ratingInput) {
        ratingInput.addEventListener('input', function () {
            if (ratingInput.value < 1 || ratingInput.value > 5) {
                ratingInput.setCustomValidity('Rating must be between 1 and 5.');
            } else {
                ratingInput.setCustomValidity('');
            }
        });
    }
});