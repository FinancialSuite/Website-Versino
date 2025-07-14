document.addEventListener("DOMContentLoaded", () => {
    
    const isEnglish = window.location.pathname.includes('/en/');
    const basePath = isEnglish ? '../' : '';

    const loadComponent = (url, placeholderId) => {
        const fullUrl = basePath + url;
        return fetch(fullUrl)
            .then(response => {
                if (!response.ok) throw new Error(`Fehler beim Laden von ${fullUrl}: ${response.statusText}`);
                return response.text();
            })
            .then(data => {
                const placeholder = document.getElementById(placeholderId);
                if (!placeholder) return;

                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = data;

                if (isEnglish && placeholderId === 'header-placeholder') {
                    tempDiv.querySelectorAll('img').forEach(img => {
                        const src = img.getAttribute('src');
                        if (src && !src.startsWith('http')) {
                            img.src = basePath + src;
                        }
                    });
                    tempDiv.querySelectorAll('a').forEach(a => {
                        const href = a.getAttribute('href');
                        if (href && href === 'index.html') {
                           a.href = basePath + href;
                        }
                    });
                }
                
                placeholder.replaceWith(...tempDiv.children);
            });
    };

    function handleVisitedLinks() {
        const navLinks = document.querySelectorAll('nav a');
        const storageKey = 'visitedWikiLinks';
        
        const visitedLinks = JSON.parse(sessionStorage.getItem(storageKey)) || [];

        navLinks.forEach(link => {
            const cleanLinkHref = link.href.split('#')[0];
            if (visitedLinks.includes(cleanLinkHref)) {
                link.classList.add('nav-link-visited');
            }
        });

        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                const cleanLinkHref = link.href.split('#')[0];
                if (!visitedLinks.includes(cleanLinkHref)) {
                    visitedLinks.push(cleanLinkHref);
                    sessionStorage.setItem(storageKey, JSON.stringify(visitedLinks));
                }
            });
        });
    }

    function handleActiveLink() {
        const navLinks = document.querySelectorAll('nav a');
        const cleanCurrentPageUrl = window.location.href.split('#')[0];

        navLinks.forEach(link => {
            const cleanLinkHref = link.href.split('#')[0];
            if (cleanLinkHref === cleanCurrentPageUrl) {
                link.classList.add('nav-link-active');
            }
        });
    }

    function handleLanguageSwitcher() {
        const langDE = document.getElementById('lang-de');
        const langEN = document.getElementById('lang-en');
        if (!langDE || !langEN) return;

        const currentPath = window.location.pathname;
        let currentPage = 'index.html';
        const pageName = currentPath.substring(currentPath.lastIndexOf('/') + 1);
        if (pageName) {
            currentPage = pageName;
        }

        if (isEnglish) {
            langEN.classList.add('lang-active');
            langEN.href = 'javascript:void(0);';
            langDE.href = `../${currentPage}`;
        } else {
            langDE.classList.add('lang-active');
            langDE.href = 'javascript:void(0);';
            langEN.href = `en/${currentPage}`;
        }
    }

    const navFile = isEnglish ? 'en/nav.html' : 'nav.html';
    const footerFile = isEnglish ? 'en/footer.html' : 'footer.html';

    const loadingPromises = [
        loadComponent('header.html', 'header-placeholder'),
        loadComponent(navFile, 'nav-placeholder'),
        loadComponent(footerFile, 'footer-placeholder')
    ];

    Promise.all(loadingPromises)
        .then(() => {
            handleVisitedLinks();
            handleActiveLink();
            handleLanguageSwitcher();
            initializeChat();
            initializeContactForm();

            if (window.location.hash) {
                const targetElement = document.querySelector(window.location.hash);
                if (targetElement) {
                   setTimeout(() => targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
                }
            }
        })
        .catch(error => {
            console.error("Ein Fehler ist beim Laden der Seitenkomponenten aufgetreten:", error);
        });

    // ===================================
    // VOLLSTÄNDIGER CHAT-CODE
    // ===================================
    function initializeChat() {
        const chatButton = document.getElementById('chat-button');
        if (!chatButton) return;

        const chatWindow = document.getElementById('chat-window');
        const closeButton = document.getElementById('chat-close');
        const sendButton = document.getElementById('chat-send');
        const chatInput = document.getElementById('chat-input');
        const messagesContainer = document.getElementById('chat-messages');

        const toggleChat = (event) => {
            event.stopPropagation();
            chatWindow.classList.toggle('active');
        };

        chatButton.addEventListener('click', toggleChat);
        closeButton.addEventListener('click', toggleChat);

        const addMessage = (text, type) => {
            const messageDiv = document.createElement('div');
            messageDiv.className = `message ${type}-message`;
            messageDiv.textContent = text;
            messagesContainer.appendChild(messageDiv);
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        };

        const sendMessage = () => {
            const userText = chatInput.value.trim();
            if (userText === "") return;
            addMessage(userText, 'user');
            chatInput.value = "";
            setTimeout(() => {
                const botResponse = "I am too shy, pls use the Kontaktformular! Or write an E-Mail to projects-support@versino.de! Thanks a lot";
                addMessage(botResponse, 'bot');
            }, 1000);
        };
        
        sendButton.addEventListener('click', sendMessage);
        chatInput.addEventListener('keydown', (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                sendMessage();
            }
        });
    }

    // ===================================
    // VOLLSTÄNDIGER KONTAKTFORMULAR-CODE
    // ===================================
    function initializeContactForm() {
        const contactForm = document.querySelector('.contact-form');
        if (contactForm) {
            contactForm.addEventListener('submit', function(event) {
                event.preventDefault();
                const name_from_form = document.getElementById('name').value;
                const email_from_form = document.getElementById('email').value;
                const subject_from_form = document.getElementById('subject').value;
                const message_from_form = document.getElementById('message').value;
                
                const finalSubject = "Financial Suite Website - " + subject_from_form;
                const finalBody = `Hallo Support-Team,\n\nfolgende Anfrage von ${name_from_form} (${email_from_form}) wurde über das Kontaktformular gestellt:\n\n${message_from_form}`;
                const mailtoLink = `mailto:projects-support@versino.de?subject=${encodeURIComponent(finalSubject)}&body=${encodeURIComponent(finalBody)}`;
                
                window.location.href = mailtoLink;
            });
        }
    }
});