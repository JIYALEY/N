/* 
  TEXT FADING ANIMATION SYSTEM
  ============================
  This function creates a sequential text fading effect for the opening section.
  Each text message fades in, stays visible for a set duration, then fades out
  as the next one appears. After all texts are shown, the envelope is revealed.
  
  How it works:
  1. Finds all text elements in the opening section
  2. Shows them one by one by adding the 'active' class
  3. Each text stays visible for 2.5 seconds
  4. After all texts are done, hides the opening section and shows the envelope
*/
function initTextFading() {
  // Get all the elements we need to work with
  const texts = document.querySelectorAll('.opening-section .text'); // All text messages
  const openingSection = document.querySelector('.opening-section'); // The opening section container
  const envelopeWrapper = document.querySelector('.envelope-wrapper'); // The envelope element
  
  // Safety check: if there are no text elements, just show the envelope immediately
  if (texts.length === 0) {
    if (envelopeWrapper) {
      envelopeWrapper.style.display = 'block';
    }
    if (openingSection) {
      openingSection.classList.add('hidden');
    }
    return; // Exit early if no texts found
  }

  // Animation timing configuration
  let currentTextIndex = 0; // Track which text we're currently showing
  const textDisplayDuration = 2500; // How long each text stays visible (2.5 seconds)
  const textTransitionDuration = 800; // How long the fade transition takes (0.8 seconds)

  /* 
    SHOW NEXT TEXT FUNCTION
    =======================
    This recursive function handles the sequential display of text messages.
    It removes the 'active' class from all texts, then adds it to the current one,
    creating a smooth fade-out/fade-in effect.
  */
  function showNextText() {
    // First, remove 'active' class from all texts to hide them
    // This makes the previous text fade out smoothly
    texts.forEach((text, index) => {
      text.classList.remove('active');
    });

    // Check if we still have more texts to show
    if (currentTextIndex < texts.length) {
      // Add 'active' class to the current text to make it fade in
      texts[currentTextIndex].classList.add('active');
      currentTextIndex++; // Move to the next text

      // Check if there are more texts to show
      if (currentTextIndex < texts.length) {
        // Schedule the next text to appear after the current one has been visible
        setTimeout(() => {
          showNextText(); // Recursively call this function for the next text
        }, textDisplayDuration);
      } else {
        // All texts have been shown, now transition to the envelope
        setTimeout(() => {
          // Hide the opening section with a smooth fade out
          if (openingSection) {
            openingSection.classList.add('hidden');
          }
          
          // Show the envelope after the fade transition completes
          // This creates a nice smooth handoff from text to envelope
          setTimeout(() => {
            if (envelopeWrapper) {
              envelopeWrapper.style.display = 'block';
            }
          }, textTransitionDuration);
        }, textDisplayDuration);
      }
    }
  }

  // Start the animation sequence after a short initial delay (0.5 seconds)
  // This gives the page time to fully load and render before starting animations
  setTimeout(() => {
    showNextText();
  }, 500);
}

/* 
  INITIALIZE ON PAGE LOAD
  =======================
  Wait for the DOM to be fully loaded before starting the text animation.
  This ensures all elements exist and are ready to be animated.
*/
$(document).ready(function() {
  initTextFading();
});

$(".js-open-envelope").on("click", function (event) {
  event.preventDefault();
  var $self = $(this);
  $self.find(".envelope").removeClass("tossing").addClass("open");
  var $card = $self.find(".envelope__card");
  $card.addClass("open");

  // Hide the heart
  $self.find(".heart use").fadeOut(300);
  
  // Auto-scroll functionality for the card content
  // When user scrolls to the bottom, automatically scroll back to top
  var cardContentElement = $card.find('.envelope__card-content')[0];
  if (cardContentElement) {
    // Wait a bit for the card animation to complete
    setTimeout(function() {
      cardContentElement.addEventListener('scroll', function() {
        // Check if scrolled to bottom (with 5px threshold for rounding)
        var isAtBottom = cardContentElement.scrollHeight - cardContentElement.scrollTop <= cardContentElement.clientHeight + 5;
        
        if (isAtBottom) {
          // Smoothly scroll back to top after a short delay
          setTimeout(function() {
            cardContentElement.scrollTo({
              top: 0,
              behavior: 'smooth'
            });
          }, 1000); // Wait 1 second before auto-scrolling back
        }
      });
    }, 1000); // Wait for card jump animation to complete
  }
});

// Animate all .envelope__card-text paragraphs
const textElements = document.querySelectorAll(".envelope__card-text");

textElements.forEach((textElement) => {
  // Remove hidden Windows carriage returns
  let html = textElement.innerHTML.replace(/\r/g, "").trim();

  // Split by <br>
  const lines = html.split(/<br\s*\/?>/gi);

  let finalHTML = "";
  let delay = 0;

  // Build letters with animation
  lines.forEach((line, i) => {
    [...line].forEach((char) => {
      const safeChar = char === " " ? "&nbsp;" : char;
      finalHTML += `<span style="animation-delay:${delay}s">${safeChar}</span>`;
      delay += 0.05;
    });

    if (i < lines.length - 1) finalHTML += "<br>";
  });

  textElement.innerHTML = finalHTML;
});

// Play background music on first click
    document.addEventListener("click", () => {
    document.getElementById("bgm").play();
});
