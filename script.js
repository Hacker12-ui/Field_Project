document.addEventListener('DOMContentLoaded', () => {
    // Smooth scrolling for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                // Adjusting for fixed navbar height
                const navHeight = document.querySelector('.site-header').offsetHeight;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - navHeight - 20;
  
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Intersection Observer for subtle scroll reveals
    const revealElements = document.querySelectorAll('.reveal');

    const revealOptions = {
        threshold: 0, // Trigger as soon as the element enters the viewport
        rootMargin: "0px 0px 100px 0px" // Trigger 100px before it even enters
    };

    const revealOnScroll = new IntersectionObserver(function(
        entries,
        observer
    ) {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            } else {
                entry.target.classList.add('active');
                observer.unobserve(entry.target);
            }
        });
    }, revealOptions);

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });

    // Lightbox Logic
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    const lightboxDetails = document.getElementById('lightbox-details');
    const lightboxDetailsContainer = document.getElementById('lightbox-details-container');
    const closeBtn = document.querySelector('.lightbox-close');
    const prevBtn = document.getElementById('lightbox-prev');
    const nextBtn = document.getElementById('lightbox-next');

    let currentGallery = [];
    let currentIndex = 0;

    const findingImages = Array.from(document.querySelectorAll('.finding-card img, .report-figure img'));
    const otherImages = Array.from(document.querySelectorAll('.evidence-item img'));

    function openLightbox(index, galleryType) {
        currentIndex = index;
        if (galleryType === 'findings') {
            currentGallery = findingImages;
            const img = findingImages[currentIndex];
            const card = img.closest('.finding-card');
            const layout = img.closest('.figure-layout');
            
            let title = '';
            let detailsHtml = '';

            if (card) {
                title = card.querySelector('.finding-title').innerText;
                detailsHtml = card.querySelector('.finding-text').innerHTML;
            } else if (layout) {
                const caption = layout.querySelector('figcaption');
                title = caption ? caption.innerText : 'Demographic Overview';
                detailsHtml = layout.querySelector('.prose').innerHTML;
            }
            
            lightboxImg.src = img.src;
            lightboxTitle.innerText = title;
            lightboxDetails.innerHTML = detailsHtml;
            lightboxDetailsContainer.classList.remove('hidden');
            
            const content = lightboxDetailsContainer.querySelector('.lightbox-details-content');
            content.style.animation = 'none';
            content.offsetHeight; // trigger reflow
            content.style.animation = null;
        } else {
            currentGallery = otherImages;
            const img = otherImages[currentIndex];
            lightboxImg.src = img.src;
            lightboxDetailsContainer.classList.add('hidden');
        }
        lightbox.classList.add('show');
    }

    findingImages.forEach((img, index) => {
        img.addEventListener('click', () => openLightbox(index, 'findings'));
    });

    otherImages.forEach((img, index) => {
        img.addEventListener('click', () => openLightbox(index, 'other'));
    });

    function showPrev() {
        if (currentGallery.length > 0) {
            currentIndex = (currentIndex - 1 + currentGallery.length) % currentGallery.length;
            const type = currentGallery === findingImages ? 'findings' : 'other';
            openLightbox(currentIndex, type);
        }
    }

    function showNext() {
        if (currentGallery.length > 0) {
            currentIndex = (currentIndex + 1) % currentGallery.length;
            const type = currentGallery === findingImages ? 'findings' : 'other';
            openLightbox(currentIndex, type);
        }
    }

    prevBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showPrev();
    });

    nextBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        showNext();
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('show')) return;
        
        if (e.key === 'ArrowLeft') {
            showPrev();
        } else if (e.key === 'ArrowRight') {
            showNext();
        } else if (e.key === 'Escape') {
            lightbox.classList.remove('show');
        }
    });

    // Close handlers
    closeBtn.addEventListener('click', () => {
        lightbox.classList.remove('show');
    });
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.classList.contains('lightbox-body') || e.target.classList.contains('lightbox-img-container')) {
            lightbox.classList.remove('show');
        }
    });
});
