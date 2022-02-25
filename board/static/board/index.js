let RegisterPage;
let LoginPage;

function ClearMessages()
{
    document.querySelector(".messages").innerHTML=""
}
function ShowRegister()
{
  ClearMessages()
  RegisterPage.style.display = "block";
  LoginPage.style.display = "none";
  document.getElementById("register_name").focus();

}

function ShowLogin()
{
  ClearMessages()
  RegisterPage.style.display = "none";
  LoginPage.style.display = "block";
  document.getElementById("login_name").focus();

}

function CheckPasswords()
{

    let pass_inputs = document.getElementsByClassName("pass");
    let RegisterBtn = document.getElementById("registerbtn");

    Array.from(pass_inputs).forEach(input =>
    {
        input.addEventListener("input",()=>
        {

            if(pass_inputs[0].value.length<6)
            {
                document.querySelector(".messages").innerHTML= "password must be at least 6 charcters length"
            }
            else
            {  
               document.querySelector(".messages").innerHTML= ""
            }
            

            if (pass_inputs[0].value.length>=6 && pass_inputs[0].value==pass_inputs[1].value)
            {
                RegisterBtn.disabled = false;
            }
            else
            {
                RegisterBtn.disabled = true;
            }

        })
    })

   
}

document.addEventListener("DOMContentLoaded",()=>
{
   RegisterPage = document.querySelector(".RegisterPage");
   LoginPage = document.querySelector(".LoginPage");
   CheckPasswords();

});
