from django.shortcuts import redirect

def login_required(f):
    def wraper(request,*args,**kwargs):
        if not request.user.is_authenticated:
            return redirect("/")
        else: 
            old_function=f(request,*args,**kwargs)
            return old_function
    return wraper  

def ValidatePassword(password):
    if len(str(password))>=3:
        return True
    return False