async function md5hash(string){
    const encoder = new TextEncoder();
    const data = encoder.encode(string);
    try{
        const hashBuffer = await crypto.subtle.digest('SHA256', data);
    }
    catch(ex){
        return string;
    }
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2,'0')).join('');

    return hashHex
}

function showTextValidityMessage(element){
    const validityState = element.validity;

    let min = element.minLength;
    let max = element.maxLength;

    if(validityState.tooLong){
        element.setCustomValidity(`Wprowadzony tekst jest za długi - maksymalna długość ${max}, obecna ${element.value.length}`);
    }
    else if(validityState.tooShort){
        element.setCustomValidity(`Wprowadzony tekst jest za krótki - minimalna długość ${min}, obecna ${element.value.length}`);
    }
    else if(validityState.valueMissing){
        element.setCustomValidity("Pole wymagane");
    }
}

function showEmailValidityMessage(element){
    if(element.validity.typeMismatch){
        element.setCustomValidity("Nieprawidłowy adres email");
    }
    else if(element.validity.valueMissing){
        element.setCustomValidity("Wprowadź adres email");
    }
}

function showPhoneValidityMessage(element){
    const validityState = element.validity;
    if(validityState.patternMismatch){
        element.setCustomValidity("Nieprawidłowy numer telefonu");
    }
    else if(validityState.valueMissing){
        element.setCustomValidity("Wprowadź numer telefonu");
    }
}

function showPasswordValidityMessage(element){
    const validityState = element.validity;

    if(validityState.valueMissing){
        element.setCustomValidity("Pole wymagane");
    }
    else if(validityState.patternMismatch){
        element.setCustomValidity("Hasło jest za słabe - wymagane jest 8 znaków, w tym jedna litera mała, jedna litera duża, liczba i znak specjalny");
    }
}

function validateField(target, validityMessageFunction){
    target.setCustomValidity("");
    if(!target.validity.valid){
        target.classList.add("invalid");
        validityMessageFunction(target);
        target.reportValidity();
        return false;
    }
    else{
        target.classList.remove("invalid");
    }

    return true;
}

function validateFix(event){
    const target = event.target;

    const message = target.validationMessage;
    target.setCustomValidity("");

    if(target.classList.contains("invalid") && target.validity.valid){
        target.classList.remove("invalid");
    }
    else{
        target.setCustomValidity(message);
    }
}

function lock(elements){
    elements.forEach(element => {
        element.style.height = "auto";
    });

    let maxHeight = 0;

    for(let element of elements){
        maxHeight = Math.max(maxHeight, element.getBoundingClientRect().height);
    }

    for(let element of elements){
        element.style.height = maxHeight+"px";
    }
}

function retrieveCookie(name){
    const cookies = document.cookie.split('; ');
    for (let cookie of cookies) {
        const [key, value] = cookie.split('=');
        if (key === name){
            return decodeURIComponent(value);
        }
    }
  return null;  
}

function deleteCookie(fullname){
    document.cookie = fullname+"; max-age=0";
}

function generateLoginInterface(container){

    const subpage = window.location.pathname.includes("/subpages/");

    let frag = document.createDocumentFragment();
    let loginLink = document.createElement("a");
    loginLink.setAttribute("href", subpage?"logowanie.html":"subpages/logowanie.html");
    loginLink.appendChild(document.createTextNode("Logowanie"));
    frag.appendChild(loginLink);

    let registerLink = document.createElement("a");
    registerLink.setAttribute("href", subpage?"rejestracja.html":"subpages/rejestracja.html");
    registerLink.appendChild(document.createTextNode("Rejestracja"));
    frag.appendChild(registerLink);

    container.append(frag);
}

function generateAccountInterface(){
    const container = document.getElementById("login-container");

    let loggedUser = retrieveCookie("logged");

    if(loggedUser !== null){
        let user = retrieveCookie("user"+loggedUser).split("||"); //0 - email, 1 - password, 2 - name, 3 - surname, 4 - phone, 5 - city, 6 - street, 7 - house number, 8 - postal, 9 - voivodeship, 10 - newletter

        let frag = document.createDocumentFragment();

        let welcome = document.createElement("span");
        if(window.screen.width >= "768"){
            welcome.appendChild(document.createTextNode(`Witaj z powrotem, ${user[2]}!`));
        }
        else{
            welcome.appendChild(document.createTextNode(user[2]));
        }
        frag.appendChild(welcome);

        let logout = document.createElement("a");
        logout.classList.add("pointer");
        logout.appendChild(document.createTextNode("Wyloguj"));
        logout.addEventListener("click", ()=>{
            deleteCookie("logged=; path=/");
            window.location.reload();
        });
        frag.appendChild(logout);

        container.appendChild(frag);
    }
    else{
        generateLoginInterface(container);
    }
}

function onLoad(){
    generateAccountInterface();
}

window.addEventListener("DOMContentLoaded", onLoad);