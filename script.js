document.addEventListener('DOMContentLoaded', () => {
    // -----------------------------------------
    // 1. Navigation Active Scroll Spy Link Track
    // -----------------------------------------
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-links a');

    window.addEventListener('scroll', () => {
        let activeId = '';
        sections.forEach(section => {
            if (window.scrollY >= (section.offsetTop - 240)) {
                activeId = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href')?.substring(1) === activeId) {
                link.classList.add('active');
            }
        });
    });

    // -----------------------------------------
    // 2. Local Storage Persistent Color Mode Switch
    // -----------------------------------------
    const themeSwitch = document.querySelector('#checkbox');
    if (localStorage.getItem('theme') === 'light') {
        document.body.classList.add('light-mode');
        if (themeSwitch) themeSwitch.checked = true;
    }
    if (themeSwitch) {
        themeSwitch.addEventListener('change', (e) => {
            if (e.target.checked) {
                document.body.classList.add('light-mode');
                localStorage.setItem('theme', 'light');
            } else {
                document.body.classList.remove('light-mode');
                localStorage.setItem('theme', 'dark');
            }
        });
    }

    // -----------------------------------------
    // 3. Initialize Lightbox Core Engine
    // -----------------------------------------
    setupGlobalLightboxEngine();
});

/**
 * Landscape Viewcard Sibling Image Slider Controller
 */
function shiftInlineSlide(sliderContainerId, stepDirection) {
    event.stopPropagation(); // Stop parent modal overlay bubbles
    const sliderBox = document.getElementById(sliderContainerId);
    if (!sliderBox) return;

    const slides = sliderBox.querySelectorAll('.modal-slide-img');
    let currentIdx = Array.from(slides).findIndex(el => el.classList.contains('active'));
    
    if (currentIdx === -1) return;

    slides[currentIdx].classList.remove('active');
    let dynamicTargetIdx = (currentIdx + stepDirection + slides.length) % slides.length;
    slides[dynamicTargetIdx].classList.add('active');
}

/**
 * Global Portfolio Lightbox Frame Orchestrator
 */
let globalLightboxActiveIndex = 0;
let globalLightboxActiveSlidesArray = [];

function setupGlobalLightboxEngine() {
    const lightboxOverlay = document.getElementById('universal-lightbox');
    const singleImageNode = document.getElementById('lightbox-single-img');
    const galleryViewport = document.getElementById('lightbox-gallery-viewport');

    if (!lightboxOverlay) return;

    // A. Single View Payloads (Certifications, Profiles)
    document.querySelectorAll('.popup-trigger').forEach(triggerNode => {
        triggerNode.addEventListener('click', (e) => {
            e.stopPropagation();
            const sourceUrl = triggerNode.getAttribute('data-img-src');
            if (!sourceUrl) return;

            lightboxOverlay.setAttribute('data-mode', 'single');
            singleImageNode.setAttribute('src', sourceUrl);
            lightboxOverlay.classList.add('is-active');
            document.body.style.overflow = 'hidden';
        });
    });

    // B. Project & Scholarship Multi-Slide Verification Array Interceptions
    document.querySelectorAll('.popup-gallery-trigger').forEach(galleryTrigger => {
        galleryTrigger.addEventListener('click', (e) => {
            e.stopPropagation();
            
            const siblingImages = galleryTrigger.querySelectorAll('.modal-slide-img');
            if (siblingImages.length === 0) return;

            galleryViewport.innerHTML = ''; 
            globalLightboxActiveSlidesArray = [];
            globalLightboxActiveIndex = 0;

            siblingImages.forEach((imgEl, index) => {
                const cloneSrcUrl = imgEl.getAttribute('src');
                const altText = imgEl.getAttribute('alt') || 'Data Screenshot View';
                
                const lightboxImg = document.createElement('img');
                lightboxImg.setAttribute('src', cloneSrcUrl);
                lightboxImg.setAttribute('alt', altText);
                lightboxImg.classList.add('lightbox-slide-item-img');
                
                if (imgEl.classList.contains('active')) {
                    lightboxImg.classList.add('active');
                    globalLightboxActiveIndex = index;
                }

                galleryViewport.appendChild(lightboxImg);
                globalLightboxActiveSlidesArray.push(lightboxImg);
            });

            lightboxOverlay.setAttribute('data-mode', 'gallery');
            lightboxOverlay.classList.add('is-active');
            document.body.style.overflow = 'hidden';
        });
    });
}

function closeUniversalLightbox() {
    const lightboxOverlay = document.getElementById('universal-lightbox');
    if (lightboxOverlay) {
        lightboxOverlay.classList.remove('is-active');
        document.body.style.overflow = '';
    }
}

function shiftLightboxGallerySlide(stepDirection) {
    if (globalLightboxActiveSlidesArray.length <= 1) return;

    globalLightboxActiveSlidesArray[globalLightboxActiveIndex].classList.remove('active');
    globalLightboxActiveIndex = (globalLightboxActiveIndex + stepDirection + globalLightboxActiveSlidesArray.length) % globalLightboxActiveSlidesArray.length;
    globalLightboxActiveSlidesArray[globalLightboxActiveIndex].classList.add('active');
}