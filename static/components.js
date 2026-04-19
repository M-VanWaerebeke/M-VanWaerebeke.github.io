class HeaderComponent extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <header>
        <nav>
          <div class="container">
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/content/talks.html">Talks</a></li>
              <li><a href="/content/publications.html">Publications</a></li>
              <li><a href="/files/Martin-Van_Waerebeke_resume.pdf" target="_blank">Resume</a></li>
              <li><a href="/content/contact.html">Contact</a></li>
            </ul>
          </div>
        </nav>
      </header>
    `;
  }
}

class FooterComponent extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer>
        <div class="container">
          <p>&copy; ${new Date().getFullYear()} Martin Van Waerebeke. All rights reserved.</p>
          <p>Last updated: <span id="last-updated-date">...</span></p>
        </div>
      </footer>
    `;

    fetch('https://api.github.com/repos/M-VanWaerebeke/M-VanWaerebeke.github.io/commits/main')
      .then(r => r.json())
      .then(data => {
        const date = new Date(data.commit.committer.date);
        document.getElementById('last-updated-date').textContent = date.toLocaleDateString();
      })
      .catch(() => {
        document.getElementById('last-updated-date').textContent = 'unknown';
      });
  }
}

customElements.define('header-component', HeaderComponent);
customElements.define('footer-component', FooterComponent);
