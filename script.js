/*
   Blog Website JavaScript
   Author: Your Name
   Description: Handles navigation, search, comments, and interactivity
*/

// Blog posts data
const blogPosts = [
    {
        id: 1,
        title: "The Future of Web Development: Trends to Watch in 2024",
        category: "technology",
        date: "January 15, 2024",
        image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=400&fit=crop",
        excerpt: "Explore the latest trends shaping web development in 2024, from AI-powered tools to serverless architecture."
    },
    {
        id: 2,
        title: "Machine Learning in Everyday Applications: Beyond the Hype",
        category: "ai",
        date: "February 8, 2024",
        image: "https://images.unsplash.com/photo-1555255707-c07966088b7b?w=800&h=400&fit=crop",
        excerpt: "Discover how machine learning is quietly revolutionizing everyday applications and user experiences."
    },
    {
        id: 3,
        title: "Digital Minimalism: Finding Balance in a Connected World",
        category: "lifestyle",
        date: "March 3, 2024",
        image: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop",
        excerpt: "Learn how to adopt digital minimalism principles for a more intentional relationship with technology."
    }
];

// DOM elements
const navLinks = document.querySelectorAll('.nav-link');
const contentSections = document.querySelectorAll('.content-section');
const mobileToggle = document.getElementById('mobileToggle');
const navMenu = document.querySelector('.nav-menu');
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const categoryFilter = document.getElementById('categoryFilter');
const postsGrid = document.getElementById('postsGrid');

// Initialize the blog
document.addEventListener('DOMContentLoaded', function() {
    initializeBlog();
    setupEventListeners();
    renderPosts();
    loadComments();
});

// Initialize blog functionality
function initializeBlog() {
    // Set active navigation
    const homeLink = document.querySelector('.nav-link[data-post="all"]');
    if (homeLink) {
        homeLink.classList.add('active');
    }
    
    // Show home section by default
    showSection('home');
}

// Setup all event listeners
function setupEventListeners() {
    // Navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', handleNavigation);
    });
    
    // Mobile menu toggle
    mobileToggle.addEventListener('click', toggleMobileMenu);
    
    // Search functionality
    searchBtn.addEventListener('click', handleSearch);
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            handleSearch();
        }
    });
    
    // Category filter
    categoryFilter.addEventListener('change', handleCategoryFilter);
    
    // Comment forms
    setupCommentForms();
    
    // Social share buttons
    setupSocialShare();
    
    // Post card clicks
    setupPostCardClicks();
}

// Handle navigation between sections
function handleNavigation(e) {
    e.preventDefault();
    
    // Remove active class from all links
    navLinks.forEach(link => link.classList.remove('active'));
    
    // Add active class to clicked link
    e.target.classList.add('active');
    
    // Get target section
    const postId = e.target.getAttribute('data-post');
    
    if (postId === 'all') {
        showSection('home');
    } else {
        showSection(`post${postId}`);
    }
    
    // Close mobile menu if open
    navMenu.classList.remove('active');
}

// Show specific section
function showSection(sectionId) {
    // Hide all sections
    contentSections.forEach(section => {
        section.classList.remove('active');
    });
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Toggle mobile menu
function toggleMobileMenu() {
    navMenu.classList.toggle('active');
}

// Handle search functionality
function handleSearch() {
    const searchTerm = searchInput.value.toLowerCase().trim();
    
    if (searchTerm === '') {
        renderPosts();
        return;
    }
    
    const filteredPosts = blogPosts.filter(post => 
        post.title.toLowerCase().includes(searchTerm) ||
        post.excerpt.toLowerCase().includes(searchTerm) ||
        post.category.toLowerCase().includes(searchTerm)
    );
    
    renderPosts(filteredPosts);
    
    // Show home section to display results
    showSection('home');
    
    // Update active navigation
    navLinks.forEach(link => link.classList.remove('active'));
    document.querySelector('.nav-link[data-post="all"]').classList.add('active');
}

// Handle category filtering
function handleCategoryFilter() {
    const selectedCategory = categoryFilter.value;
    
    if (selectedCategory === 'all') {
        renderPosts();
    } else {
        const filteredPosts = blogPosts.filter(post => post.category === selectedCategory);
        renderPosts(filteredPosts);
    }
    
    // Show home section to display results
    showSection('home');
    
    // Update active navigation
    navLinks.forEach(link => link.classList.remove('active'));
    document.querySelector('.nav-link[data-post="all"]').classList.add('active');
}

// Render blog posts
function renderPosts(posts = blogPosts) {
    if (!postsGrid) return;
    
    if (posts.length === 0) {
        postsGrid.innerHTML = '<p class="no-results">No posts found matching your criteria.</p>';
        return;
    }
    
    postsGrid.innerHTML = posts.map(post => `
        <div class="post-card" data-post-id="${post.id}">
            <img src="${post.image}" alt="${post.title}">
            <div class="post-card-content">
                <div class="meta">
                    <span class="category ${post.category}">${post.category.toUpperCase()}</span>
                    <span class="date">${post.date}</span>
                </div>
                <h3>${post.title}</h3>
                <p class="excerpt">${post.excerpt}</p>
            </div>
        </div>
    `).join('');
    
    // Re-setup post card clicks
    setupPostCardClicks();
}

// Setup post card click handlers
function setupPostCardClicks() {
    const postCards = document.querySelectorAll('.post-card');
    postCards.forEach(card => {
        card.addEventListener('click', function() {
            const postId = this.getAttribute('data-post-id');
            
            // Update navigation
            navLinks.forEach(link => link.classList.remove('active'));
            const targetLink = document.querySelector(`.nav-link[data-post="${postId}"]`);
            if (targetLink) {
                targetLink.classList.add('active');
            }
            
            // Show post section
            showSection(`post${postId}`);
        });
    });
}

// Setup comment forms
function setupCommentForms() {
    for (let i = 1; i <= 3; i++) {
        const form = document.getElementById(`commentForm${i}`);
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                handleCommentSubmission(i);
            });
        }
    }
}

// Handle comment submission
function handleCommentSubmission(postId) {
    const nameInput = document.getElementById(`commentName${postId}`);
    const messageInput = document.getElementById(`commentMessage${postId}`);
    
    const name = nameInput.value.trim();
    const message = messageInput.value.trim();
    
    if (name === '' || message === '') {
        alert('Please fill in both name and message fields.');
        return;
    }
    
    // Create comment object
    const comment = {
        id: Date.now(),
        name: name,
        message: message,
        date: new Date().toLocaleDateString()
    };
    
    // Save comment to localStorage
    saveComment(postId, comment);
    
    // Display comment
    displayComment(postId, comment);
    
    // Update comment count
    updateCommentCount(postId);
    
    // Clear form
    nameInput.value = '';
    messageInput.value = '';
    
    // Show success message
    showNotification('Comment posted successfully!');
}

// Save comment to localStorage
function saveComment(postId, comment) {
    const storageKey = `comments_post_${postId}`;
    let comments = JSON.parse(localStorage.getItem(storageKey)) || [];
    comments.push(comment);
    localStorage.setItem(storageKey, JSON.stringify(comments));
}

// Load comments from localStorage
function loadComments() {
    for (let i = 1; i <= 3; i++) {
        const storageKey = `comments_post_${i}`;
        const comments = JSON.parse(localStorage.getItem(storageKey)) || [];
        
        comments.forEach(comment => {
            displayComment(i, comment);
        });
        
        updateCommentCount(i);
    }
}

// Display comment in the UI
function displayComment(postId, comment) {
    const commentsList = document.getElementById(`commentsList${postId}`);
    if (!commentsList) return;
    
    const commentElement = document.createElement('div');
    commentElement.className = 'comment-item';
    commentElement.innerHTML = `
        <div class="comment-header">
            <span class="comment-author">${escapeHtml(comment.name)}</span>
            <span class="comment-date">${comment.date}</span>
        </div>
        <div class="comment-text">${escapeHtml(comment.message)}</div>
    `;
    
    commentsList.appendChild(commentElement);
}

// Update comment count
function updateCommentCount(postId) {
    const storageKey = `comments_post_${postId}`;
    const comments = JSON.parse(localStorage.getItem(storageKey)) || [];
    const countElement = document.getElementById(`commentCount${postId}`);
    
    if (countElement) {
        countElement.textContent = comments.length;
    }
}

// Setup social share buttons
function setupSocialShare() {
    const shareButtons = document.querySelectorAll('.share-btn');
    
    shareButtons.forEach(button => {
        button.addEventListener('click', function() {
            const platform = this.getAttribute('data-platform');
            const url = window.location.href;
            const title = document.title;
            
            let shareUrl = '';
            
            switch (platform) {
                case 'twitter':
                    shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`;
                    break;
                case 'facebook':
                    shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
                    break;
                case 'linkedin':
                    shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`;
                    break;
            }
            
            if (shareUrl) {
                window.open(shareUrl, '_blank', 'width=600,height=400');
            }
        });
    });
}

// Utility function to escape HTML
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #4CAF50;
        color: white;
        padding: 1rem 2rem;
        border-radius: 5px;
        z-index: 10000;
        animation: slideIn 0.3s ease;
    `;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
    `;
    document.head.appendChild(style);
    
    // Add to page
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.remove();
        style.remove();
    }, 3000);
}

// Handle window resize for responsive behavior
window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
        navMenu.classList.remove('active');
    }
});

// Smooth scrolling for anchor links
document.addEventListener('click', function(e) {
    if (e.target.tagName === 'A' && e.target.getAttribute('href').startsWith('#')) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});
