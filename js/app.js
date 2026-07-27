// Particle System for Background Animation
class ParticleSystem {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.particles = [];
        this.particleCount = window.innerWidth > 768 ? 20 : 10;
        this.init();
    }

    init() {
        this.createParticles();
        this.animate();
    }

    createParticles() {
        for (let i = 0; i < this.particleCount; i++) {
            const particle = {
                x: Math.random() * window.innerWidth,
                y: Math.random() * window.innerHeight,
                size: Math.random() * 100 + 50,
                duration: Math.random() * 20 + 15,
                delay: Math.random() * 5,
                tx: (Math.random() - 0.5) * window.innerWidth,
                ty: (Math.random() - 0.5) * window.innerHeight,
            };

            const el = document.createElement('div');
            el.className = 'particle';
            el.style.left = particle.x + 'px';
            el.style.top = particle.y + 'px';
            el.style.width = particle.size + 'px';
            el.style.height = particle.size + 'px';
            el.style.setProperty('--tx', particle.tx + 'px');
            el.style.setProperty('--ty', particle.ty + 'px');
            el.style.animationDuration = particle.duration + 's';
            el.style.animationDelay = particle.delay + 's';

            this.container.appendChild(el);
            this.particles.push(particle);
        }
    }

    animate() {
        setInterval(() => {
            this.particles.forEach((particle, index) => {
                particle.tx = (Math.random() - 0.5) * window.innerWidth;
                particle.ty = (Math.random() - 0.5) * window.innerHeight;
            });
        }, 25000);
    }
}

// DistroHub Application
class DistroHub {
    constructor() {
        this.distros = [];
        this.filteredDistros = [];
        this.darkMode = this.getDarkModeSetting();
        this.init();
    }

    async init() {
        // Initialize particle system
        const particleContainer = document.getElementById('particleBackground');
        if (particleContainer) {
            new ParticleSystem('particleBackground');
        }

        // Hide loading animation
        this.hideLoadingAnimation();

        await this.loadDistributions();
        this.setupTheme();
        this.setupEventListeners();
        this.renderDistributions();
        this.populateCompareSelects();
    }

    hideLoadingAnimation() {
        const loadingAnimation = document.getElementById('loadingAnimation');
        if (loadingAnimation) {
            setTimeout(() => {
                loadingAnimation.classList.add('hidden');
                setTimeout(() => {
                    loadingAnimation.style.display = 'none';
                }, 500);
            }, 800);
        }
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

        const searchBarCompact = document.getElementById('searchBarCompact');
        searchBarCompact?.addEventListener('input', (e) => this.handleSearch(e.target.value));

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

        // Random distro button
        document.getElementById('randomDistroBtn')?.addEventListener('click', () => this.showRandomDistro());

        // Contact form
        document.getElementById('contactForm')?.addEventListener('submit', (e) => this.handleContactSubmit(e));

        // Close sidebar when clicking outside on mobile
        document.addEventListener('click', (e) => {
            const sidebar = document.getElementById('sidebar');
            const mobileMenuBtn = document.getElementById('mobileMenuBtn');
            if (window.innerWidth < 768 && !sidebar.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                this.closeMobileMenu();
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    handleNavClick(e) {
        e.preventDefault();
        const page = e.target.closest('.nav-link')?.dataset.page;
        if (page) {
            this.showPage(page);
            this.closeMobileMenu();
            this.updateBreadcrumb(page);
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

        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    updateBreadcrumb(pageName) {
        const breadcrumb = document.getElementById('breadcrumb');
        if (breadcrumb) {
            const pageNames = {
                home: 'Home',
                distros: 'Distributions',
                compare: 'Compare',
                about: 'About',
                contact: 'Contact'
            };
            breadcrumb.textContent = pageNames[pageName] || 'Home';
        }
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
            container.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 4rem 2rem;">
                    <i class="fas fa-search" style="font-size: 48px; color: var(--text-tertiary); margin-bottom: 1rem; display: block;"></i>
                    <p style="color: var(--text-secondary); font-size: 1.1rem; font-weight: 500;">No distributions found matching your search</p>
                </div>
            `;
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

    showRandomDistro() {
        if (this.distros.length === 0) return;

        const randomIndex = Math.floor(Math.random() * this.distros.length);
        const randomDistro = this.distros[randomIndex];

        // Show the distro details in a modal
        this.showDistroDetails(randomDistro.name);

        // Show a notification
        this.showNotification(`🎲 Random Pick: ${randomDistro.name}!`);
    }

    showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            color: white;
            padding: 16px 24px;
            border-radius: 12px;
            font-weight: 600;
            z-index: 5000;
            animation: slideInRight 0.3s ease;
            box-shadow: 0 8px 24px rgba(99, 102, 241, 0.4);
        `;
        notification.textContent = message;

        document.body.appendChild(notification);

        // Remove after 3 seconds
        setTimeout(() => {
            notification.style.animation = 'slideInRight 0.3s ease reverse';
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
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
            this.showNotification('⚠️ Select at least 2 distributions to compare');
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
        this.showNotification(`✅ Thanks ${data.name}! We'll get back to you soon.`);
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

    handleResize() {
        if (window.innerWidth > 768) {
            this.closeMobileMenu();
        }
    }
}

// Initialize app
const app = new DistroHub();
