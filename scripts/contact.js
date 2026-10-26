function loaded(){
    const messageArea = document.getElementById("message-area");
    const name = document.getElementById("name");
    const surname = document.getElementById("surname");
    const email = document.getElementById("email");
    const phone = document.getElementById("phone");
    const submit = document.getElementById("submit");
    const form = document.getElementsByTagName("form")[0];

    const submitMessage = submit.parentElement.getElementsByClassName("submit-message")[0];

    messageArea.addEventListener("blur", (e)=>validateField(e.target,showTextValidityMessage));
    messageArea.addEventListener("input", validateFix);

    name.addEventListener("blur", (e)=>validateField(e.target,showTextValidityMessage));
    name.addEventListener("input", validateFix);

    surname.addEventListener("blur", (e)=>validateField(e.target,showTextValidityMessage));
    surname.addEventListener("input", validateFix);

    email.addEventListener("blur", (e)=>validateField(e.target,showEmailValidityMessage));
    email.addEventListener("input", validateFix);

    phone.addEventListener("blur", (e)=>validateField(e.target,showPhoneValidityMessage));
    phone.addEventListener("input", validateFix);
        
    submit.addEventListener("click",()=>{
        const result = validateField(messageArea, showTextValidityMessage) && validateField(name, showTextValidityMessage) &&
        validateField(surname, showTextValidityMessage) && validateField(email, showEmailValidityMessage) && 
        validateField(phone, showPhoneValidityMessage);

        if(result){
            submitMessage.textContent = "Pomyślnie wysłano";
        }
        else{
            submitMessage.textContent = "Wysyłanie nie powiodło się";
        }
    });

    form.addEventListener("submit",(e)=>e.preventDefault());

    const loggedUser = retrieveCookie("logged");
    
    if(loggedUser !== null){
        const user = retrieveCookie(`user${loggedUser}`);
        if(user !== null){
            const userData = user.split("||");
            name.value = userData[2];
            surname.value = userData[3];
            email.value = userData[0];
            phone.value = userData[4];
        }
    }
}


window.addEventListener("DOMContentLoaded", loaded);