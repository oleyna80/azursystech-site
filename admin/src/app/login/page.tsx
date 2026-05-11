export default function LoginPage() {
  return (
    <main className="admin-main">
      <section className="admin-panel">
        <h1>Admin login</h1>
        <p className="admin-muted">Owner-only access for AzurSysTech operations.</p>
        <form className="admin-form" action="/api/auth/login" method="post">
          <label>
            Password
            <input autoComplete="current-password" name="password" required type="password" />
          </label>
          <button className="admin-button" type="submit">
            Login
          </button>
        </form>
      </section>
    </main>
  );
}
