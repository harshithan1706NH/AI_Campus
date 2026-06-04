function Register() {
  return (
    <div>
      <h1>Register</h1>

      <form>
        <input type="text" placeholder="Enter Name" />
        <br /><br />

        <input type="email" placeholder="Enter Email" />
        <br /><br />

        <input type="password" placeholder="Enter Password" />
        <br /><br />

        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;