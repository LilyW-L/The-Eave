document.addEventListener('DOMContentLoaded', function() {
    const helicopter = document.querySelector('.helicopter-overlay');
    const initialTop = 10;
    const maxTop = 30;
    
    window.addEventListener('scroll', function() {
        const scrollPos = window.scrollY;
        const viewportHeight = window.innerHeight;
        let newTop = initialTop + (scrollPos / viewportHeight * 100 * 0.2);
        
        if (newTop < maxTop) {
            helicopter.style.top = `${newTop}vh`;
        }
    });
});

// Load base image
const baseImage = document.querySelector('.base-image');
baseImage.onload = function() {
    const imageHeight = baseImage.offsetHeight;
    const imageWidth = baseImage.offsetWidth;
    const rect = container.getBoundingClientRect();
    
    overlay.style.height = imageHeight + 'px';
    v15Overlay.style.height = imageHeight + 'px';
    
    // Make v2 image match v1 dimensions exactly
    topImage.style.width = imageWidth + 'px';
    topImage.style.height = imageHeight + 'px';
    
    overlay.style.width = '0%';
    const centerX = rect.left + (rect.width / 2);
    sliderLeft.style.left = centerX + 'px';
    sliderRight.style.left = centerX + 'px';
}

// Recalculate slider positions on window resize
window.addEventListener('resize', function() {
    const imageHeight = baseImage.offsetHeight;
    const imageWidth = baseImage.offsetWidth;
    const rect = container.getBoundingClientRect();
    
    overlay.style.height = imageHeight + 'px';
    v15Overlay.style.height = imageHeight + 'px';
    
    // Update v2 image dimensions to match v1
    topImage.style.width = imageWidth + 'px';
    topImage.style.height = imageHeight + 'px';
    
    const currentWidth = parseFloat(overlay.style.width) || 0;
    const centerX = rect.width / 2;
    const offsetFromCenter = (currentWidth / 100) * (rect.width / 2);
    sliderLeft.style.left = (rect.left + centerX - offsetFromCenter) + 'px';
    sliderRight.style.left = (rect.left + centerX + offsetFromCenter) + 'px';
});

// Iris modal functionality with slider
document.addEventListener('DOMContentLoaded', function() {
    const irisButton = document.getElementById('irisButton');
    const irisModal = document.getElementById('irisModal');
    const irisContainer = document.getElementById('irisCompare');
    const irisOverlay = document.getElementById('irisOverlay');
    const irisSliderLeft = document.getElementById('irisSliderLeft');
    const irisSliderRight = document.getElementById('irisSliderRight');
    const irisBaseImage = document.querySelector('.iris-compare-base');
    const irisTopImage = document.querySelector('.iris-compare-top');
    let scrollPosition = 0;
    let isDraggingIris = false;
    let dragSideIris = null;

    irisButton.addEventListener('click', function(e) {
        e.stopPropagation();
        scrollPosition = window.pageYOffset;
        const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
        document.body.style.paddingRight = scrollbarWidth + 'px';
        document.body.classList.add('no-scroll');
        document.body.style.top = `-${scrollPosition}px`;
        irisModal.classList.add('active');
        
        // Initialize slider positions after modal is shown
        setTimeout(function() {
            if (irisContainer && irisBaseImage.complete) {
                const imageHeight = irisBaseImage.offsetHeight;
                const imageWidth = irisBaseImage.offsetWidth;
                
                irisOverlay.style.height = imageHeight + 'px';
                irisTopImage.style.width = imageWidth + 'px';
                irisTopImage.style.height = imageHeight + 'px';
                
                const rect = irisContainer.getBoundingClientRect();
                const centerX = rect.width / 2;
                irisSliderLeft.style.left = centerX + 'px';
                irisSliderRight.style.left = centerX + 'px';
            }
        }, 100);
    });

    function closeModal() {
        irisModal.classList.remove('active');
        document.body.classList.remove('no-scroll');
        document.body.style.top = '';
        document.body.style.paddingRight = '';
        window.scrollTo(0, scrollPosition);
        
        // Reset slider positions
        irisOverlay.style.width = '0%';
        isDraggingIris = false;
        dragSideIris = null;
    }

    irisModal.addEventListener('click', function(e) {
        if (e.target === irisModal) {
            closeModal();
        }
    });

    function updateIrisSliders(e) {
        const rect = irisContainer.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const centerX = rect.width / 2;
        
        if (dragSideIris === null) {
            dragSideIris = mouseX < centerX ? 'left' : 'right';
        }
        
        let distanceFromCenter = 0;
        
        if (dragSideIris === 'left') {
            distanceFromCenter = Math.max(0, centerX - mouseX);
        } else {
            distanceFromCenter = Math.max(0, mouseX - centerX);
        }
        
        const maxDistance = rect.width / 2;
        const revealPercentage = Math.min((distanceFromCenter / maxDistance) * 100, 100);
        
        irisOverlay.style.width = revealPercentage + '%';
        
        const offsetFromCenter = (revealPercentage / 100) * (rect.width / 2);
        irisSliderLeft.style.left = (centerX - offsetFromCenter) + 'px';
        irisSliderRight.style.left = (centerX + offsetFromCenter) + 'px';
    }

    function startDragIris(e) {
        e.preventDefault();
        e.stopPropagation();
        isDraggingIris = true;
        dragSideIris = null;
    }

    function stopDragIris() {
        if (isDraggingIris) {
            isDraggingIris = false;
            dragSideIris = null;
        }
    }

    function dragIris(e) {
        if (isDraggingIris) {
            e.preventDefault();
            e.stopPropagation();
            updateIrisSliders(e);
        }
    }

    irisSliderLeft.addEventListener('mousedown', startDragIris);
    irisSliderRight.addEventListener('mousedown', startDragIris);
    document.addEventListener('mouseup', stopDragIris);
    document.addEventListener('mousemove', dragIris);

    irisSliderLeft.addEventListener('touchstart', startDragIris);
    irisSliderRight.addEventListener('touchstart', startDragIris);
    document.addEventListener('touchend', stopDragIris);

    document.addEventListener('touchmove', function(e) {
        if (isDraggingIris) {
            e.preventDefault();
            e.stopPropagation();
            const touch = e.touches[0];
            updateIrisSliders(touch);
        }
    });

    // Update sizes on image load
    irisBaseImage.onload = function() {
        const rect = irisContainer.getBoundingClientRect();
        const imageHeight = irisBaseImage.offsetHeight;
        const imageWidth = irisBaseImage.offsetWidth;
        
        irisOverlay.style.height = imageHeight + 'px';
        irisTopImage.style.height = imageHeight + 'px';
        irisTopImage.style.width = imageWidth + 'px';
        
        const centerX = rect.width / 2;
        irisSliderLeft.style.left = centerX + 'px';
        irisSliderRight.style.left = centerX + 'px';
        irisOverlay.style.width = '0%';
    }
});