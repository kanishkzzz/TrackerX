import Image from "next/image";
import Link from "next/link";

function ArrowIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 20 20" fill="none">
      <path d="M4.5 10h10.75M10 4.75 15.25 10 10 15.25" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 18 18" fill="none">
      <path d="m4.5 9.25 2.8 2.8 6.2-6.3" />
    </svg>
  );
}

const sampleTasks = [
  { title: "Send the project outline", priority: "Low", done: true },
  { title: "Finish assessment draft", priority: "High", done: false },
  { title: "Reply to Nina", priority: "Medium", done: false },
  { title: "Tidy up meeting notes", priority: "Low", done: false },
];

export default function Home() {
  return (
    <main className="site-shell">
      <section className="hero" id="top">
        <Image
          src="/pexels-landingPage.jpg"
          alt="Warm sunset over a quiet lake and wooded hills"
          fill
          priority
          sizes="100vw"
          className="hero-image"
        />
        <div className="hero-overlay" />

        <header className="site-header">
          <Link className="brand" href="#top" aria-label="TaskNest home">
            <Image className="brand-icon" src="/iconicicon.jpg" alt="" width={40} height={40} priority />
            <span>tasknest</span>
          </Link>

          <nav className="main-nav" aria-label="Main navigation">
            <a href="#features">Why TaskNest</a>
            <a href="#preview">A look inside</a>
          </nav>

          <div className="header-actions">
            <Link className="header-login" href="/sign-in">
              Log in
            </Link>
            <Link className="header-signup" href="/sign-up">
              Get started <ArrowIcon />
            </Link>
          </div>
        </header>

        <div className="hero-copy">
          <div className="hero-eyebrow">
            <span className="eyebrow-spark" aria-hidden="true">✳</span>
            A little more focus, a lot less noise
          </div>
          <h1>
            Make space for
            <br />
            <span>what matters.</span>
          </h1>
          <p>
            Gather your to-dos, choose what matters first, and move through your
            day one good step at a time.
          </p>
          <div className="hero-actions">
            <Link className="button-primary" href="/sign-up">
              Start your day <ArrowIcon />
            </Link>
            <a className="button-secondary" href="#preview">
              See how it works
            </a>
          </div>
          <div className="hero-note">
            <span className="note-check"><CheckIcon /></span>
            A clear list. A calmer mind. Your pace.
          </div>
        </div>

        <div className="preview-wrap" id="preview">
          <div className="task-preview" aria-label="Example TaskNest task list">
            <div className="task-preview-top">
              <div>
                <span className="preview-kicker">YOUR DAY</span>
                <h2>One step at a time.</h2>
              </div>
              <span className="day-chip">Today <span aria-hidden="true">→</span></span>
            </div>
            <div className="task-progress-row">
              <span>Daily progress</span>
              <span><strong>1</strong> of 4 done</span>
            </div>
            <div className="task-progress-track"><span /></div>
            <ul className="preview-task-list">
              {sampleTasks.map((task) => (
                <li className="preview-task" key={task.title}>
                  <span className={`task-check ${task.done ? "is-done" : ""}`}>
                    {task.done ? <CheckIcon /> : null}
                  </span>
                  <span className={`task-title ${task.done ? "is-complete" : ""}`}>
                    {task.title}
                  </span>
                  <span className={`priority-pill priority-${task.priority.toLowerCase()}`}>
                    {task.priority}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <aside className="focus-card">
            <div className="focus-card-orbit" aria-hidden="true">
              <span />
            </div>
            <span className="preview-kicker">A GENTLER KIND OF PRODUCTIVITY</span>
            <h2>Progress is built from small things done well.</h2>
            <p>Keep the next important thing in view. Let the rest wait its turn.</p>
            <div className="focus-priority">
              <span className="priority-dot" />
              <span>Next up</span>
              <strong>High priority</strong>
            </div>
          </aside>
        </div>
        <a className="scroll-cue" href="#features">
          <span /> Keep exploring
        </a>
      </section>

      <section className="features-section" id="features">
        <div className="section-heading">
          <span className="section-eyebrow">A simpler way to stay on track</span>
          <h2>Less juggling.<br /><span>More forward.</span></h2>
          <p>TaskNest gives your day just enough structure to help you follow through.</p>
        </div>
        <div className="feature-grid">
          <article className="feature-card">
            <span className="feature-number">01</span>
            <span className="feature-icon feature-icon-list" aria-hidden="true"><i /><i /><i /></span>
            <h3>Keep it all together</h3>
            <p>Put the things on your mind in one clear, easy-to-scan list.</p>
          </article>
          <article className="feature-card">
            <span className="feature-number">02</span>
            <span className="feature-icon feature-icon-priority" aria-hidden="true"><i /><i /><i /></span>
            <h3>Choose what comes first</h3>
            <p>Give each task a low, medium, or high priority and find your next step.</p>
          </article>
          <article className="feature-card">
            <span className="feature-number">03</span>
            <span className="feature-icon feature-icon-check" aria-hidden="true"><CheckIcon /></span>
            <h3>Notice your progress</h3>
            <p>Mark tasks done and make room for the next thing, without the noise.</p>
          </article>
        </div>
      </section>

      <section className="closing-section" id="get-started">
        <div className="closing-copy">
          <span className="section-eyebrow">Your next step starts here</span>
          <h2>Make today<br />feel more doable.</h2>
        </div>
        <Link className="button-primary closing-button" href="/sign-up">
          Create your account <ArrowIcon />
        </Link>
        <span className="closing-decoration" aria-hidden="true">✳</span>
      </section>

      <footer className="site-footer">
        <Link className="brand footer-brand" href="#top">
          <span className="brand-mark" aria-hidden="true"><span /><span /><span /></span>
          <span>tasknest</span>
        </Link>
        <span>Small steps count.</span>
        <a href="#top">Back to top ↑</a>
      </footer>
    </main>
  );
}
