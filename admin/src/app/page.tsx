import { requireAdminPage } from "@/lib/auth/require-admin";
import { createCsrfToken } from "@/lib/auth/csrf";

export default async function AdminHomePage() {
  const session = await requireAdminPage();
  const csrfToken = createCsrfToken(session);

  return (
    <>
      <header className="admin-header">
        <div className="admin-header__inner">
          <div>
            <div className="admin-brand">AzurSysTech Admin</div>
            <div className="admin-muted">Facebook publishing foundation</div>
          </div>
          <form action="/api/auth/logout" method="post">
            <input name="csrfToken" type="hidden" value={csrfToken} />
            <button className="admin-button" type="submit">
              Logout
            </button>
          </form>
        </div>
      </header>
      <main className="admin-main">
        <section className="admin-panel">
          <h1>Operations</h1>
          <p className="admin-muted">
            Signed in as {session.sub}. Meta publishing, Telegram wiring, and deployment are not enabled in this phase.
          </p>
          <div className="admin-grid">
            <div>
              <h2>Posts</h2>
              <p className="admin-muted">Draft/list/schedule API contracts are available behind auth.</p>
            </div>
            <div>
              <h2>Scheduler</h2>
              <p className="admin-muted">Publish-due is dry-run only until Meta publishing is approved.</p>
            </div>
            <div>
              <h2>Database</h2>
              <p className="admin-muted">Social schema must be applied separately to local/test or live DB after approval.</p>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
