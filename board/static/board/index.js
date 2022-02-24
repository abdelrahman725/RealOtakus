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
        input.addEventListener("keyup",()=>
        {

            if (pass_inputs[0].value!=pass_inputs[1].value)
            {
                RegisterBtn.disabled = true;
            }
            else
            {
                RegisterBtn.disabled = false;
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
