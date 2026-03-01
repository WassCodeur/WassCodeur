// Configuration
const SUBSTACK_URL = 'https://wasscodeur.substack.com';
const SUBSTACK_FEED = `${SUBSTACK_URL}/feed`;
const ARTICLES_PER_PAGE = 6;

let allArticles = [];
let currentPage = 1;

// Fetch articles from Substack RSS feed
async function fetchArticles() {
    try {
        const response = await fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(SUBSTACK_FEED)}`);
        const data = await response.json();

        if (data.items) {
            allArticles = data.items
                .filter(item => item.title && item.pubDate)
                .map(item => ({
                    title: item.title,
                    excerpt: stripHtml(item.description).substring(0, 150) + '...',
                    link: item.link,
                    date: new Date(item.pubDate),
                    author: item.author || 'WassCodeur'
                }))
                .sort((a, b) => b.date - a.date);

            displayArticles();
            displayPagination();
        } else {
            showError('Impossible de charger les articles');
        }
    } catch (error) {
        console.error('Error fetching articles:', error);
        showError('Erreur lors du chargement des articles. Veuillez réessayer plus tard.');
    }
}

// Strip HTML tags from text
function stripHtml(html) {
    const div = document.createElement('div');
    div.innerHTML = html;
    return div.textContent || div.innerText || '';
}

// Format date in French
function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('fr-FR', options);
}

// Display articles for current page
function displayArticles() {
    const container = document.getElementById('articlesContainer');
    container.innerHTML = '';

    if (allArticles.length === 0) {
        container.innerHTML = '<div class="no-articles">Aucun article disponible pour le moment.</div>';
        return;
    }

    const startIndex = (currentPage - 1) * ARTICLES_PER_PAGE;
    const endIndex = startIndex + ARTICLES_PER_PAGE;
    const pageArticles = allArticles.slice(startIndex, endIndex);

    pageArticles.forEach(article => {
        const articleCard = document.createElement('div');
        articleCard.className = 'article-card';
        articleCard.innerHTML = `
            <div class="article-header">
                <div class="article-title">${escapeHtml(article.title)}</div>
            </div>
            <div class="article-content">
                <div class="article-meta">
                    <span><i class="far fa-calendar"></i> ${formatDate(article.date)}</span>
                    <span><i class="far fa-user"></i> ${article.author}</span>
                </div>
                <div class="article-excerpt">${article.excerpt}</div>
                <a href="${article.link}" target="_blank" class="article-link">
                    Lire plus <i class="fas fa-arrow-right"></i>
                </a>
            </div>
        `;
        container.appendChild(articleCard);
    });
}

// Display pagination buttons
function displayPagination() {
    const container = document.getElementById('paginationContainer');
    container.innerHTML = '';

    if (allArticles.length <= ARTICLES_PER_PAGE) {
        return;
    }

    const totalPages = Math.ceil(allArticles.length / ARTICLES_PER_PAGE);

    // Previous button
    const prevBtn = document.createElement('button');
    prevBtn.textContent = '← Précédent';
    prevBtn.disabled = currentPage === 1;
    prevBtn.onclick = () => {
        if (currentPage > 1) {
            currentPage--;
            displayArticles();
            displayPagination();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };
    container.appendChild(prevBtn);

    // Page buttons
    const pageButtonsContainer = document.createElement('div');
    pageButtonsContainer.style.display = 'flex';
    pageButtonsContainer.style.gap = '5px';
    pageButtonsContainer.style.flexWrap = 'wrap';

    for (let i = 1; i <= totalPages; i++) {
        const pageBtn = document.createElement('button');
        pageBtn.textContent = i;
        pageBtn.className = i === currentPage ? 'active' : '';
        pageBtn.onclick = () => {
            currentPage = i;
            displayArticles();
            displayPagination();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        };
        pageButtonsContainer.appendChild(pageBtn);
    }
    container.appendChild(pageButtonsContainer);

    // Next button
    const nextBtn = document.createElement('button');
    nextBtn.textContent = 'Suivant →';
    nextBtn.disabled = currentPage === totalPages;
    nextBtn.onclick = () => {
        if (currentPage < totalPages) {
            currentPage++;
            displayArticles();
            displayPagination();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };
    container.appendChild(nextBtn);
}

// Handle newsletter subscription
function handleNewsletterSubscribe(event) {
    event.preventDefault();
    const email = document.getElementById('emailInput').value;
    const messageDiv = document.getElementById('subscribeMessage');

    if (!email) {
        messageDiv.textContent = '❌ Veuillez entrer un email valide';
        messageDiv.style.color = '#ff6b6b';
        return;
    }

    // Redirect to Substack subscription page
    window.open(`${SUBSTACK_URL}?utm_source=portfolio`, '_blank');

    messageDiv.textContent = '✅ Redirection vers Substack en cours...';
    messageDiv.style.color = '#51cf66';

    // Clear email input
    document.getElementById('emailInput').value = '';

    // Reset message after 5 seconds
    setTimeout(() => {
        messageDiv.textContent = '';
    }, 5000);
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// Show error message
function showError(message) {
    const container = document.getElementById('articlesContainer');
    container.innerHTML = `<div class="error">${message}</div>`;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', fetchArticles);
