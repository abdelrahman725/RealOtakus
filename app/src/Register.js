const Register = () => {
  const handleRegister =()=>
  {
    // to do 
  }
  return (
    <div>
      <h2>register form</h2>
      <form onSubmit={handleRegister}>
        <input type="text" placeholder="username"  required/>
        <br/>
        <input type="password" placeholder="password" required />
        <br />
        <input type="submit" value="register"/>
      </form>
      <button>sign up with google</button>
    </div>
  )
}

Register.defaultProps={
  color :'steelblue',
  text: 'button'
}

export default Register
