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
          <p>Last updated: ${new Date().toLocaleDateString()}</p>
        </div>
      </footer>
    `;
  }
}

customElements.define('header-component', HeaderComponent);
customElements.define('footer-component', FooterComponent);
