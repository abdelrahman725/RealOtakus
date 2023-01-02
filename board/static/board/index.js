
function validate_form_inputs() {

   const passwords_inputs = document.getElementsByClassName("passwords")
   const valid_inputs = document.getElementsByClassName("valid_input")
   const confirmed_pass = document.getElementById("confirmed_pass")
   const register_btn = document.getElementById("register_btn")

   // reject
   const leading_space = /^\s+/
   const extra_space = /\s{2,}/

   Array.from(valid_inputs).forEach(input => {

      input.addEventListener("input", (e) => {
         const value = e.target.value
         if (value.match(leading_space) != null || value.match(extra_space) != null) {
            e.target.value = e.target.value.slice(0, e.target.value.length - 1)
         }
      })

   })

   Array.from(passwords_inputs).forEach(input => {

      input.addEventListener("input", () => {

         if (passwords_inputs[0].value === passwords_inputs[1].value) {
            confirmed_pass.style.outline = "none"
            register_btn.disabled = false;
         }

         else {
            confirmed_pass.style.outline = "solid 2px"
            confirmed_pass.style.outlineColor = "red"
            register_btn.disabled = true;
         }

      })
   })

}


document.addEventListener("DOMContentLoaded", () => {

   const register_form = document.getElementById("register_form")
   const login_form = document.getElementById("login_form")

   console.log(sessionStorage.getItem("current_view"))

   if (sessionStorage.getItem("current_view") === "login") {
      register_form.hidden = true;
      login_form.hidden = false;
   }

   if (sessionStorage.getItem("current_view") === "register") {
      register_form.hidden = false;
      login_form.hidden = true;
   }

   validate_form_inputs()

   document.getElementById("to_login_form").addEventListener("click", (e) => {
      e.preventDefault()
      register_form.hidden = true;
      login_form.hidden = false;
      document.querySelector(".messages").innerHTML = ""
      document.getElementById("login_name").focus();
      sessionStorage.setItem("current_view", "login")
   })

   document.getElementById("to_register_form").addEventListener("click", (e) => {
      e.preventDefault()
      register_form.hidden = false;
      login_form.hidden = true;
      document.querySelector(".messages").innerHTML = ""
      document.getElementById("register_name").focus();
      sessionStorage.setItem("current_view", "register")
   })

   document.getElementById("authenticate").addEventListener("click", (e) => {
      window.location.href = e.target.value
   })

})
