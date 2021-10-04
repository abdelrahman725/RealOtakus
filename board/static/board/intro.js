let RegisterPage;
let LoginPage;

function ShowRegister()
{
  RegisterPage.style.display = "block";
  LoginPage.style.display = "none";
  document.getElementsByName("registerusername")[0].focus();

}

function ShowLogin()
{
  RegisterPage.style.display = "none";
  LoginPage.style.display = "block";
  document.getElementsByName("loginusername")[0].focus();

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
                console.log("not equal")

            }
            else
            {
                RegisterBtn.disabled = false;
                console.log("equal")

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
