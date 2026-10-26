async function login(email, password){
    const hashedPassword = await md5hash(password);

    let found = false;
    let user;
    let counter = 0;
    do{
        user = retrieveCookie("user"+counter);
        console.log(user);
        if(!user){
            break;
        }
        user = user.split("||");

        console.log(user[0].localeCompare(email, undefined, {sensitivity: 'accent'}) === 0);
        if(user[0].localeCompare(email, undefined, {sensitivity: 'accent'}) === 0 && user[1].localeCompare(hashedPassword) === 0){
            found = true;
            break;
        }
        counter++;
    }
    while(user);

    if(found){
        document.cookie = "logged="+counter+"; path=/";
        return true;
    }
    
    return false;
}

function loaded(){
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    const submit = document.getElementById("submit");
    const form = document.getElementsByTagName("form")[0];

    const submitMessage = submit.parentElement.getElementsByClassName("submit-message")[0];

    email.addEventListener("blur",(e)=>validateField(e.target, showEmailValidityMessage));
    email.addEventListener("input",validateFix);

    password.addEventListener("blur",(e)=>validateField(e.target, showPasswordValidityMessage));
    password.addEventListener("input",validateFix);

    submit.addEventListener("click",async ()=>{
        const result = validateField(email, showEmailValidityMessage) && validateField(password, showPasswordValidityMessage);

        if(result){
            if(await login(email.value, password.value)){
                submitMessage.textContent = "Pomyślnie zalogowano!";
                window.setTimeout(()=>{window.location.href="../index.html"},3000);
                submit.setAttribute("disabled","");
            }
            else{
                submitMessage.textContent = "Niepoprawny email lub hasło";
            }
        }
        else{
           submitMessage.textContent = "Wartości pól są nieprawidłowe";
        }

    });

    form.addEventListener("submit",(e)=>e.preventDefault());

}

window.addEventListener("DOMContentLoaded", loaded);