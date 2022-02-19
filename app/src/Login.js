const Login = () => {
  const handleLogin =()=>
  {

  }
  return (
    <div>
      <h2>Login form</h2>
      <form onSubmit={handleLogin}>
        <input type="text" placeholder="username" />
        <br/>
        <input type="password" placeholder="password" />
        <br />
        <input type="submit" value="Login"/>
      </form>
      <button>login with google</button>
    </div>
  )
}


export default Login
