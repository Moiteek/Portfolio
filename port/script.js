// script.js
document.addEventListener('DOMContentLoaded', function() {
  // ======================
  // Smooth Scroll
  // ======================
  document.querySelectorAll('nav a').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      if (targetId === '#') return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        // Close mobile menu if open
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse.classList.contains('show')) {
          const bsCollapse = new bootstrap.Collapse(navbarCollapse, { toggle: false });
          bsCollapse.hide();
        }
        
        // Smooth scroll to target
        targetElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // ======================
  // Theme Toggle
  // ======================
  const themeToggle = document.getElementById('theme-toggle');
  const body = document.body;
  
  // Initialize theme
  function initTheme() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const savedTheme = localStorage.getItem('theme') || (prefersDark ? 'dark' : 'light');
    
    body.setAttribute('data-theme', savedTheme);
    themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
  }
  
  // Toggle theme
  themeToggle.addEventListener('click', () => {
    const currentTheme = body.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    body.setAttribute('data-theme', newTheme);
    themeToggle.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    localStorage.setItem('theme', newTheme);
    
    // Dispatch custom event for any theme-dependent components
    document.dispatchEvent(new CustomEvent('themeChanged', { detail: newTheme }));
  });
  
  initTheme();

  // ======================
  // Active Nav Link
  // ======================
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav a');
  
  function updateActiveNavLink() {
    let currentSection = '';
    const scrollPosition = window.scrollY + 200;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        currentSection = section.getAttribute('id');
      }
    });
    
    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSection}`) {
        link.classList.add('active');
      }
    });
  }
  
  window.addEventListener('scroll', updateActiveNavLink);
  updateActiveNavLink(); // Run once on load

  // ======================
  // Scroll-to-Top Button
  // ======================
  const scrollToTopBtn = document.createElement('button');
  scrollToTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
  scrollToTopBtn.classList.add('btn', 'scroll-to-top');
  document.body.appendChild(scrollToTopBtn);
  
  function toggleScrollToTop() {
    if (window.scrollY > 300) {
      scrollToTopBtn.classList.add('show');
    } else {
      scrollToTopBtn.classList.remove('show');
    }
  }
  
  scrollToTopBtn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
  
  window.addEventListener('scroll', toggleScrollToTop);
  toggleScrollToTop(); // Run once on load

  // ======================
  // Lazy Loading
  // ======================
  const lazyLoad = (target) => {
    const io = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          const src = img.getAttribute('data-src');
          
          if (src) {
            img.setAttribute('src', src);
            img.removeAttribute('data-src');
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        }
      });
    }, {
      rootMargin: '0px 0px 100px 0px'
    });
    
    target.forEach(image => {
      io.observe(image);
    });
  };
  
  lazyLoad(document.querySelectorAll('img[data-src]'));

  // ======================
  // Form Handling
  // ======================
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      
      const formData = new FormData(contactForm);
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalBtnText = submitBtn.textContent;
      
      try {
        // Show loading state
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...';
        
        // Simulate API call (replace with actual fetch)
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Show success message
        const toast = document.createElement('div');
        toast.classList.add('toast', 'show');
        toast.innerHTML = `
          <div class="toast-body bg-success text-white">
            <i class="fas fa-check-circle me-2"></i>
            Message sent successfully!
          </div>
        `;
        document.body.appendChild(toast);
        
        // Remove toast after delay
        setTimeout(() => {
          toast.classList.remove('show');
          setTimeout(() => toast.remove(), 300);
        }, 3000);
        
        // Reset form
        contactForm.reset();
      } catch (error) {
        alert('There was an error sending your message. Please try again.');
      } finally {
        // Reset button
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
    });
  }

  // ======================
  // Animations
  // ======================
  const animateOnScroll = () => {
    const elements = document.querySelectorAll('.animate-on-scroll');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px'
    });
    
    elements.forEach(element => {
      observer.observe(element);
    });
  };
  
  animateOnScroll();

  // ======================
  // Project Card Hover Effect
  // ======================
  const projectCards = document.querySelectorAll('#projects .card');
  projectCards.forEach(card => {
    const img = card.querySelector('.card-img-top');
    const overlay = document.createElement('div');
    overlay.classList.add('project-overlay');
    overlay.innerHTML = '<i class="fas fa-external-link-alt"></i>';
    card.appendChild(overlay);
    
    card.addEventListener('mouseenter', () => {
      if (img) {
        img.style.transform = 'scale(1.05)';
      }
      overlay.style.opacity = '1';
    });
    
    card.addEventListener('mouseleave', () => {
      if (img) {
        img.style.transform = 'scale(1)';
      }
      overlay.style.opacity = '0';
    });
  });

  // ======================
  // Skills Progress Animation
  // ======================
  const skillBars = document.querySelectorAll('.progress-bar');
  const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const width = entry.target.getAttribute('aria-valuenow');
        entry.target.style.width = `${width}%`;
        skillsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  skillBars.forEach(bar => {
    bar.style.width = '0%';
    skillsObserver.observe(bar);
  });

  // ======================
  // Current Year
  // ======================
  document.getElementById('year').textContent = new Date().getFullYear();
});