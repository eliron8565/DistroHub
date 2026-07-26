// DistroHub Application
class DistroHub {
    constructor() {
        this.distros = [];
        this.filteredDistros = [];
        this.darkMode = this.getDarkModeSetting();
        this.init();
    }

    async init() {
        await this.loadDistributions();
        this.setupTheme();
        this.setupEventListeners();
        this.renderDistributions();
        this.populateCompareSelects();
    }

    async loadDistributions() {
        try {
            const response = await fetch('data/distros.json');
            this.distros = await response.json();
            this.filteredDistros = [...this.distros];
        } catch (error) {
            console.error('Error loading distributions:', error);
        }
    }

    setupTheme() {
        if (this.darkMode) {
            document.body.classList.remove('light-mode');
            this.updateThemeIcon();
        } else {
            document.body.classList.add('light-mode');
            this.updateThemeIcon();
        }
    }

    toggleTheme() {
        this.darkMode = !this.darkMode;
        this.setDarkModeSetting(this.darkMode);
        this.setupTheme();
    }

    getDarkModeSetting() {
        const saved = localStorage.getItem('distroHubDarkMode');
        if (saved !== null) return JSON.parse(saved);
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    setDarkModeSetting(value) {
        localStorage.setItem('distroHubDarkMode', JSON.stringify(value));
    }

    updateThemeIcon() {
        const icon = document.getElementById('themeToggle')?.querySelector('i');
        if (icon) {
            icon.className = this.darkMode ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => this.handleNavClick(e));
        });

        // Page buttons in hero
        document.querySelectorAll('[data-page]').forEach(btn => {
            btn.addEventListener('click', () => {
                const page = btn.dataset.page;
                this.showPage(page);
            });
        });

        // Search
        const searchBar = document.getElementById('searchBar');
        searchBar?.addEventListener('input', (e) => this.handleSearch(e.target.value));

        // Theme toggle
        document.getElementById('themeToggle')?.addEventListener('click', () => this.toggleTheme());

        // Mobile menu
        document.getElementById('mobileMenuBtn')?.addEventListener('click', () => this.toggleMobileMenu());
        document.getElementById('sidebarToggle')?.addEventListener('click', () => this.toggleMobileMenu());

        // Close modal
        document.getElementById('modalClose')?.addEventListener('click', () => this.closeModal());
        document.getElementById('distroModal')?.addEventListener('click', (e) => {
            if (e.target.id === 'distroModal') this.closeModal();
        });

        // Compare button
        document.getElementById('compareBtn')?.addEventListener('click', () => this.handleCompare());

        // Contact form
        document.getElementById('contactForm')?.addEventListener('submit', (e) => this.handleContactSubmit(e));
    }

    handleNavClick(e) {
        e.preventDefault();
        const page = e.target.closest('.nav-link')?.dataset.page;
        if (page) {
            this.showPage(page);
            this.closeMobileMenu();
        }
    }

    showPage(pageName) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        // Show selected page
        const page = document.getElementById(pageName);
        if (page) {
            page.classList.add('active');
        }

        // Update nav links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.toggle('active', link.dataset.page === pageName);
        });
    }

    handleSearch(query) {
        if (!query.trim()) {
            this.filteredDistros = [...this.distros];
        } else {
            const lowerQuery = query.toLowerCase();
            this.filteredDistros = this.distros.filter(distro =>
                distro.name.toLowerCase().includes(lowerQuery) ||
                distro.description.toLowerCase().includes(lowerQuery) ||
                distro.category.toLowerCase().includes(lowerQuery)
            );
        }
        this.renderDistributions();
    }

    renderDistributions() {
        const container = document.getElementById('distrosContainer');
        if (!container) return;

        if (this.filteredDistros.length === 0) {
            container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 2rem;"><p>No distributions found</p></div>';
            return;
        }

        container.innerHTML = this.filteredDistros.map(distro => `
            <div class="distro-card">
                <div class="distro-card-logo">${distro.icon}</div>
                <h3 class="distro-card-name">${distro.name}</h3>
                <span class="distro-card-category">${distro.category}</span>
                <p class="distro-card-description">${distro.description}</p>
                <div class="distro-card-info">
                    <div><strong>Base:</strong> ${distro.base}</div>
                    <div><strong>Release:</strong> ${distro.release}</div>
                </div>
                <div class="distro-card-buttons">
                    <button class="btn-download" onclick="app.downloadDistro('${distro.name}', '${distro.downloadUrl}')">
                        <i class="fas fa-download"></i> Download
                    </button>
                    <button class="btn-details" onclick="app.showDistroDetails('${distro.name}')">
                        <i class="fas fa-info-circle"></i> Details
                    </button>
                </div>
            </div>
        `).join('');
    }

    showDistroDetails(distroName) {
        const distro = this.distros.find(d => d.name === distroName);
        if (!distro) return;

        const modal = document.getElementById('distroModal');
        const modalBody = document.getElementById('modalBody');

        modalBody.innerHTML = `
            <h2>${distro.name}</h2>
            <div class="modal-info">
                <div class="modal-info-item">
                    <div class="modal-info-label">Category</div>
                    <div class="modal-info-value">${distro.category}</div>
                </div>
                <div class="modal-info-item">
                    <div class="modal-info-label">Base</div>
                    <div class="modal-info-value">${distro.base}</div>
                </div>
                <div class="modal-info-item">
                    <div class="modal-info-label">Release Date</div>
                    <div class="modal-info-value">${distro.release}</div>
                </div>
                <div class="modal-info-item">
                    <div class="modal-info-label">Support</div>
                    <div class="modal-info-value">${distro.support}</div>
                </div>
            </div>
            <div class="modal-description">${distro.fullDescription}</div>
            <div class="modal-links">
                <a href="${distro.downloadUrl}" target="_blank"><i class="fas fa-download"></i> Download Latest</a>
                <a href="${distro.website}" target="_blank"><i class="fas fa-globe"></i> Official Website</a>
                <a href="${distro.wiki}" target="_blank"><i class="fas fa-book"></i> Documentation</a>
            </div>
        `;

        modal.classList.add('active');
    }

    downloadDistro(name, url) {
        window.open(url, '_blank');
    }

    closeModal() {
        const modal = document.getElementById('distroModal');
        modal?.classList.remove('active');
    }

    populateCompareSelects() {
        const selects = ['compare1', 'compare2', 'compare3'];
        const options = this.distros.map(d => `<option value="${d.name}">${d.name}</option>`).join('');

        selects.forEach(id => {
            const select = document.getElementById(id);
            if (select) {
                const currentValue = select.value;
                select.innerHTML = '<option value="">Select a distribution</option>' + options;
                select.value = currentValue;
            }
        });
    }

    handleCompare() {
        const selected = [
            document.getElementById('compare1')?.value,
            document.getElementById('compare2')?.value,
            document.getElementById('compare3')?.value
        ].filter(v => v);

        if (selected.length < 2) {
            alert('Please select at least 2 distributions to compare');
            return;
        }

        const toCompare = this.distros.filter(d => selected.includes(d.name));
        this.renderComparisonTable(toCompare);
    }

    renderComparisonTable(distros) {
        const container = document.getElementById('comparisonTable');
        if (!container) return;

        const table = `
            <table>
                <thead>
                    <tr>
                        <th>Feature</th>
                        ${distros.map(d => `<th>${d.name}</th>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td><strong>Category</strong></td>
                        ${distros.map(d => `<td>${d.category}</td>`).join('')}
                    </tr>
                    <tr>
                        <td><strong>Base</strong></td>
                        ${distros.map(d => `<td>${d.base}</td>`).join('')}
                    </tr>
                    <tr>
                        <td><strong>Release</strong></td>
                        ${distros.map(d => `<td>${d.release}</td>`).join('')}
                    </tr>
                    <tr>
                        <td><strong>Support</strong></td>
                        ${distros.map(d => `<td>${d.support}</td>`).join('')}
                    </tr>
                    <tr>
                        <td><strong>Package Manager</strong></td>
                        ${distros.map(d => `<td>${d.packageManager}</td>`).join('')}
                    </tr>
                    <tr>
                        <td><strong>Desktop Environment</strong></td>
                        ${distros.map(d => `<td>${d.desktopEnvironment}</td>`).join('')}
                    </tr>
                </tbody>
            </table>
        `;

        container.innerHTML = table;
        container.style.display = 'block';
        container.scrollIntoView({ behavior: 'smooth' });
    }

    handleContactSubmit(e) {
        e.preventDefault();
        const form = e.target;
        const formData = new FormData(form);
        const data = Object.fromEntries(formData);
        
        console.log('Contact form submitted:', data);
        alert(`Thank you for your message, ${data.name}! We'll get back to you soon.`);
        form.reset();
    }

    toggleMobileMenu() {
        const sidebar = document.getElementById('sidebar');
        sidebar?.classList.toggle('active');
    }

    closeMobileMenu() {
        const sidebar = document.getElementById('sidebar');
        sidebar?.classList.remove('active');
    }
}

// Initialize app
const app = new DistroHub();