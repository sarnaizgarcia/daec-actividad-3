const virtualForm = {
    name: {
        value: '',
        dirty: false,
    },
    address: {
        value: '',
        dirty: false,
    },
    phone: {
        value: '',
        dirty: false,
    },
    email: {
        value: '',
        dirty: false,
    },
    pizzaSize: {
        value: '',
    },
    ingredients: {
        value: [],
    }
}

const pizzaSizesPrices = {
    small: 5,
    medium: 10,
    big: 15,
}

/**
 * Auxiliar functions
 */

function getTotalBill(formData) {
    const basePrice = pizzaSizesPrices[formData.pizzaSize.value];

    return basePrice + formData.ingredients.value.length;
}

function createLine(description, price, total) {
    const BILL_LINE_CLASS = 'bill-line'
    const LINE_DESCRIPTION_CLASS = 'bill-description'
    const LINE_PRICE_CLASS = 'bill-price';
    const LINE_TOTAL_CLASS = 'total';

    const billLine = document.createElement('div');
    billLine.classList.add(BILL_LINE_CLASS);

    const lineDescription = document.createElement('div');
    lineDescription.classList.add(LINE_DESCRIPTION_CLASS);

    const linePrice = document.createElement('div');
    linePrice.classList.add(LINE_PRICE_CLASS);

    if (total) {
        billLine.classList.add(LINE_TOTAL_CLASS);
        lineDescription.classList.add(LINE_TOTAL_CLASS);
        linePrice.classList.add(LINE_TOTAL_CLASS);
    }

    const lineDescriptionText = document.createTextNode(description.charAt(0).toUpperCase() + description.slice(1));
    const linePriceText = document.createTextNode(`${price} €`);

    lineDescription.appendChild(lineDescriptionText);
    linePrice.appendChild(linePriceText);
    billLine.appendChild(lineDescriptionText);
    billLine.appendChild(linePrice);

    return billLine;
}

function renderBill(formData) {
    const billDetails = document.querySelector('.modal .bill-set .bill-details');
    const basePrice = pizzaSizesPrices[formData.pizzaSize.value];

    billDetails.appendChild(createLine(formData.pizzaSize.value, basePrice, false));

    for (const ingredient of formData.ingredients.value) {
        billDetails.appendChild(createLine(ingredient, 1, false));
    }

    billDetails.appendChild(createLine('Total', getTotalBill(formData), true));

}

/**
 * Validations errors 
 */

/**
 * Valida si un valor es un string vacío.
 * @param value 
 * @returns Nulo si el valor no está vacío y un mensaje si lo está.
 */
function fieldRequiredError(value) {
    return (value === '') ? 'The field is required' : null;
}

/**
 * Valida si un valor comienza con mayúsculas.
 * @param value 
 * @returns Nulo si el valor comienza con mayúsculas y un mensaje si comienza con mayúsculas.
 */
function nameValidationFieldError(value) {
    const NAME_VALIDATION = /^[A-Z].*$/;

    return (!NAME_VALIDATION.test(value)) ? 'The name must start with caplocks' : null;
}

/**
 * Valida si un valor tiene el formato XXX XXX XXX.
 * @param value 
 * @returns Nulo si el valor tiene ese formato y un mensaje si no lo tiene. 
 */
function phoneValidationFieldError(value) {
    const PHONE_VALIDATION = /^[0-9]{3} [0-9]{3} [0-9]{3}$/;

    return (!PHONE_VALIDATION.test(value)) ? 'Wrong phone format': null;
}

/**
 * Valida si un email tiene el formato corecto.
 * @param {*} email 
 * @returns Nulo si tiene el formato correcto y un mensaje si no lo tiene.
 */
function emailValidationFieldError(email) {
    const EMAIL_VALIDATION = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

    return (!EMAIL_VALIDATION.test(email)) ? 'Wrong email format' : null;
}

/**
 * Form validations 
 */

/**
 * Valida que el valor del campo input del nombre tenga no esté vacío
 *  y que tenga el formato adecuado.
 * @param value 
 * @returns {boolean}
 */
function getNameValidationError(value) {
    return fieldRequiredError(value) || nameValidationFieldError(value);
}

/**
 * Valida que el valor del campo input de la dirección no esté vacio
 * @param value 
 * @returns {boolean}
 */
function getAddressValidationError(value) {
    return fieldRequiredError(value);
}

/**
 * Valida que el valor del campo input del teléfono no esté vacío
 *  y que tenga el formato adecuado.
 * @param value 
 * @returns {boolean}
 */
function getPhoneValidationError(value) {
    return fieldRequiredError(value) || phoneValidationFieldError(value);
}

/**
 * Valida que el valor del campo email del teléfono no esté vacío
 *  y que tenga el formato adecuado.
 * @param value 
 * @returns {boolean}
 */
function getEmailValidationError(value) {
    return fieldRequiredError(value) || emailValidationFieldError(value);
}

/**
 * Valida que se haya eligido un tamaño de pizza.
 * @param value 
 * @returns Devuelve nulo si se ha elegido un tamaño y un mensaje si no se ha elegido.
 */
function getPizzaSizeValidationError(value) {
    let result = null;

    if (fieldRequiredError(value)) {
        result = 'You must choose a pizza size';
    }

    return result;
}

/**
 * Valida que se haya al menos un ingrediente de la pizza.
 * @param listValues
 * @returns Devuelve nulo si se ha elegido algún ingrediente y un mensaje si no se ha elegido ninguno.
 */
function getPizzaIngredientsValidationError(listValues) {
    let result = null;

    if (listValues.length === 0) {
        result = 'You must choose, at least, one ingredient';
    }

    return result;
}

/**
 * Comprueba si todas las validaciones se cumplen.
 * @returns {boolean}
 */
function disableSubmitButton() {
    return getNameValidationError(virtualForm.name.value)
        || getAddressValidationError(virtualForm.address.value)
        || getPhoneValidationError(virtualForm.phone.value)
        || getEmailValidationError(virtualForm.email.value)
        || getPizzaSizeValidationError(virtualForm.pizzaSize.value)
        || getPizzaIngredientsValidationError(virtualForm.ingredients.value);
}

/**
 * Events hooks
 */

/**
 * OJO!!!
 */
function disableEnableSubmit() {
   document.querySelector('.pizza-form .buttons-set .btn.primary')
    .disabled = !!disableSubmitButton();
}

/**
 * Crea el texto de error si el campo input del nombre no es válido y
 *  desactiva el botón de enviar formulario.    
 * @param {Event} event 
 */
function onInputNameChange(event) {
    const errorField = document.querySelector('#field-name .text-error');
    const error = getNameValidationError(event.target.value);
    virtualForm.name.value = event.target.value;

    if (virtualForm.name.dirty && error) {
        errorField.innerHTML = error;
    } else {
        errorField.innerHTML = '';
    }

    disableEnableSubmit();
}

/**
 * Cuando el campo input nombre pierde el foco pone el valor de la propiedad "dirty"
 *  del campo nombre a true y llama a la función onInputNameChange.
 * @param {Event} event 
 */
function onInputNameBlur(event) {
    virtualForm.name.dirty = true;
    onInputNameChange(event);
}

function onInputAddressChange(event) {
    const errorField = document.querySelector('#field-address .text-error');
    const error = getAddressValidationError(event.target.value);
    virtualForm.address.value = event.target.value;

    if (virtualForm.address.dirty && error) {
        errorField.innerHTML = error;
    } else {
        errorField.innerHTML = '';
    }

    disableEnableSubmit();
}

function onInputAddressBlur(event) {
    virtualForm.address.dirty = true;
    onInputAddressChange(event);
}

function onInputPhoneChange(event) {
    const errorField = document.querySelector('#field-phone .text-error');
    const error = getPhoneValidationError(event.target.value);
    virtualForm.phone.value = event.target.value;

    if(virtualForm.phone.dirty && error) {
        errorField.innerHTML = error;
    } else {
        errorField.innerHTML = '';
    }

    disableEnableSubmit();
}

function onInputPhoneBlur(event) {
    virtualForm.phone.dirty = true;
    onInputPhoneChange(event);
}

function onInputEmailChange(event) {
    const errorField = document.querySelector('#field-email .text-error');
    const error = getEmailValidationError(event.target.value);
    virtualForm.email.value = event.target.value;

    if (virtualForm.email.dirty && error) {
        errorField.innerHTML = error;
    } else {
        errorField.innerHTML = '';
    }

    disableEnableSubmit();
}

function onInputEmailBlur(event) {
    virtualForm.email.dirty = true;
    onInputEmailChange(event);
}

function onInputPizzaSizeChange(event) {
    if (event.target.checked) {
        virtualForm.pizzaSize.value = event.target.value;
    }

    disableEnableSubmit();
}

function onInputIngredientsChange(event) {
    const ingredient = event.target.value;
    const errorField = document.querySelector('#field-pizza-ingredients .text-error');

    if (event.target.checked) {
        virtualForm.ingredients.value.push(ingredient);
    } else {
        virtualForm.ingredients.value = virtualForm.ingredients.value.filter((ing) => ing !== ingredient);
    }

    const error = getPizzaIngredientsValidationError([...virtualForm.ingredients.value]);

    if (error) {
        errorField.innerHTML = error;
    } else {
        errorField.innerHTML = '';
    }

    disableEnableSubmit();
}

function onResetButton() {
   for (const key in virtualForm) {
       switch(key) {
           case 'ingredients':
               virtualForm[key].value = [];
            break;
            case 'pizzaSize':
                virtualForm[key].value = '';
            break;
            case 'name':
            case 'address':
            case 'phone':
            case 'email':
                virtualForm[key].value = '';
                virtualForm[key].dirty = false;
            break;
       }
   }

   disableEnableSubmit();
}

function onSubmitEvent(event) {
    event.preventDefault();
    const modal = document.querySelector('.modal');

    renderBill(virtualForm);
    modal.classList.add('open');
}

/**
 * Cierra la ventana modal en la que se calcula el precio.
 * Elimina los estilos que muestran la modal 
 *  y el texto del nodo que contien los detalles del pago.
 */
function onModalClose() {
    const modal = document.querySelector('.modal');
    const billDetails = modal.querySelector('.bill-details');
    modal.classList.remove('open');
    billDetails.innerHTML = '';
}

// Registro de los eventos que se lanzan cuando se rellena el campo nombre
// y cuando este pierde el foco.
const inputName = document.querySelector('#field-name input');
inputName.addEventListener('input', onInputNameChange);
inputName.addEventListener('blur', onInputNameBlur);

// Registro de los eventos que se lanzan cuando se rellena el campo dirección
// y cuando este pierde el foco.
const inputAddress = document.querySelector('#field-address input');
inputAddress.addEventListener('input', onInputAddressChange);
inputAddress.addEventListener('blur', onInputAddressBlur);

// Registro de los eventos que se lanzan cuando se rellena el campo teléfono
// y cuando este pierde el foco.
const inputPhone = document.querySelector('#field-phone input');
inputPhone.addEventListener('input', onInputPhoneChange);
inputPhone.addEventListener('blur', onInputPhoneBlur);

// Registro de los eventos que se lanzan cuando se rellena el campo email
// y cuando este pierde el foco.
const inputEmail = document.querySelector('#field-email input');
inputEmail.addEventListener('input', onInputEmailChange);
inputEmail.addEventListener('blur', onInputEmailBlur);

// Registro del evento que se lanza para los radio buttons para comprobar cual está checked.
const inputsPizzaSize = document.querySelectorAll('#field-pizza-size input');
inputsPizzaSize.forEach((radioElement) => {
    radioElement.addEventListener('change', onInputPizzaSizeChange);
});

// Registro del evento que se lanza para los checkboxes para comprobar cuales están checked.
const inputsPizzaIngredients = document.querySelectorAll('#field-pizza-ingredients input');
inputsPizzaIngredients.forEach((checkbox) => {
    checkbox.addEventListener('change', onInputIngredientsChange);
});

// Registro del evento que se lanza cuando se clica el botón Reset
const resetButton = document.querySelector('.pizza-form .buttons-set .btn.secondary');
resetButton.addEventListener('click', onResetButton);

// Registro del evento que se lanza cuando se clica el botón de Envío
const form = document.querySelector('.pizza-form');
form.addEventListener('submit', onSubmitEvent);

// Registro del evento que se ejecuta al cerrar la ventana modal
const modalButtons = document.querySelectorAll('.modal .buttons-set .btn');
modalButtons.forEach((button) => {
    button.addEventListener('click', onModalClose);
});
