async function register(email, password, name, surname, phone, city, street, houseNr, postal, voivodeship, newsletter){
    let passwordHash = await md5hash(password);

    let cookieString = [email, passwordHash, name, surname, phone, city, street, houseNr, postal, voivodeship, newsletter].join("||");
    
    let userCount = retrieveCookie("userCount");

    if(userCount === null){
        userCount = 0;
    }

    document.cookie = `user${userCount}=${encodeURIComponent(cookieString)}; path=/`;
    document.cookie = `userCount=${userCount+1}; path=/`;
    document.cookie = `logged=${userCount}; path=/`;

    return true;
}

function validateRepeatedPassword(target, passwordElement){
    target.setCustomValidity("");

    if(!target.validity.valid && target.validity.valueMissing){
        target.setCustomValidity("Pole wymagane");
        target.reportValidity();
        target.classList.add("invalid");
        return false;
    }

    const otherPassword = passwordElement.value;

    console.log(otherPassword);
    console.log(target.value);

    if(target.value.localeCompare(otherPassword) !== 0){
        target.setCustomValidity("Hasła są różne");
        target.reportValidity();
        target.classList.add("invalid");
        return false;
    }
    
    return true;
}

function validateFixRepeatedPassword(target, passwordElement){
    const message = target.validationMessage;
    target.setCustomValidity("");

    if(target.classList.contains("invalid") && target.validity.valid){
        const otherPassword = passwordElement.value;
        if(target.value.localeCompare(otherPassword) !== 0){
            target.setCustomValidity(message);
        }
        else{
            target.classList.remove("invalid");
        }
    }
    else{
        target.setCustomValidity(message);
    }
}

function showPostalValidityMessage(element){
    const validityState = element.validity;

    if(validityState.valueMissing){
        element.setCustomValidity("Pole wymagane");
    }
    else if(validityState.patternMismatch){
        element.setCustomValidity("Nieprawidłowy kod pocztowy. Wymagany format to 00-000");
    }
}

function showSelectValidityMessage(element){
    if(element.validity.valueMissing){
        element.setCustomValidity("Wybierz odpowiednią wartość");
    }
}

function loaded(){
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const passwordRepeated = document.getElementById("password2");
    const name = document.getElementById("name");
    const surname = document.getElementById("surname");
    const phone = document.getElementById("phone");
    const city = document.getElementById("city");
    const street = document.getElementById("street");
    const houseNr = document.getElementById("house-number");
    const postal = document.getElementById("postal");
    const voivodeship = document.getElementById("voivodeship");
    const newletterButton = document.getElementById("newsletter1");
    const submit = document.getElementById("submit");
    const form = document.getElementsByTagName("form")[0];

    const submitMessage = submit.parentElement.getElementsByClassName("submit-message")[0];

    email.addEventListener("blur",(e)=>validateField(e.target, showEmailValidityMessage));
    email.addEventListener("input",validateFix);

    password.addEventListener("blur",(e)=>validateField(e.target, showPasswordValidityMessage));
    password.addEventListener("input", (e)=>{validateFix(e); validateFixRepeatedPassword(passwordRepeated, password)});

    passwordRepeated.addEventListener("blur",(e)=>validateRepeatedPassword(e.target, password));
    passwordRepeated.addEventListener("input",(e)=>validateFixRepeatedPassword(e.target, password));

    name.addEventListener("blur", (e)=>validateField(e.target,showTextValidityMessage));
    name.addEventListener("input", validateFix);

    surname.addEventListener("blur", (e)=>validateField(e.target,showTextValidityMessage));
    surname.addEventListener("input", validateFix);

    phone.addEventListener("blur", (e)=>validateField(e.target,showPhoneValidityMessage));
    phone.addEventListener("input", validateFix);

    city.addEventListener("blur", (e)=>validateField(e.target,showTextValidityMessage));
    city.addEventListener("input", validateFix);

    street.addEventListener("blur", (e)=>validateField(e.target,showTextValidityMessage));
    street.addEventListener("input", validateFix);

    houseNr.addEventListener("blur", (e)=>validateField(e.target,showTextValidityMessage));
    houseNr.addEventListener("input", validateFix);

    postal.addEventListener("blur",(e)=>validateField(e.target, showPostalValidityMessage));
    postal.addEventListener("input", validateFix);

    voivodeship.addEventListener("blur",(e)=>validateField(e.target, showSelectValidityMessage));
    voivodeship.addEventListener("input", validateFix);

    submit.addEventListener("click",async ()=>{
        let result = validateField(email, showEmailValidityMessage) && validateField(password, showPasswordValidityMessage) &&
                     validateRepeatedPassword(passwordRepeated, password) && validateField(name, showTextValidityMessage) &&
                     validateField(surname, showTextValidityMessage) && validateField(phone, showPhoneValidityMessage) &&
                     validateField(city, showTextValidityMessage) && validateField(street, showTextValidityMessage) &&
                     validateField(houseNr, showTextValidityMessage) && validateField(postal, showPostalValidityMessage) &&
                     validateField(voivodeship, showSelectValidityMessage);

        if(result){
            if(await register(email.value, password.value, name.value, surname.value, phone.value, city.value, street.value, houseNr.value, postal.value, voivodeship.value, newletterButton.checked)){
                window.setTimeout(()=>{window.location.href="../index.html"},3000);
                submitMessage.textContent = "Rejestracja przebiegła pomyślnie";
            }
            else{
                submitMessage.textContent = "Coś poszło nie tak";
            }
        }
        else{
            submitMessage.textContent = "Wartości pól są nieprawidłowe";
        }
    });

    form.addEventListener("submit",(e)=>e.preventDefault());
}

window.addEventListener("DOMContentLoaded",loaded);