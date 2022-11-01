document.addEventListener("DOMContentLoaded",()=>{

   const register_form = document.getElementById("register_form"); 
   const login_form = document.getElementById("login_form")

   document.getElementById("to_login_form").addEventListener("click",(e)=>{
      e.preventDefault()
      register_form.hidden=true;
      login_form.hidden=false;
      document.getElementById("login_name").focus();
   })
   
   document.getElementById("to_register_form").addEventListener("click",(e)=>{
      e.preventDefault()
      register_form.hidden=false;
      login_form.hidden=true;
      document.getElementById("register_name").focus();
   })

   document.getElementById("authenticate").addEventListener("click",(e)=>{
    window.location.href = e.target.value
   })

})
