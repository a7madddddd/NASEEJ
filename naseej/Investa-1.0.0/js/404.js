const steps = document.querySelectorAll(".form-step");
const nextBtns = document.querySelectorAll(".next-step");
const prevBtns = document.querySelectorAll(".prev-step");

let currentStep = 0;

nextBtns.forEach(button => {
    button.addEventListener("click", () => {
        steps[currentStep].style.display = "none";
        currentStep++;
        steps[currentStep].style.display = "block";
    });
});

prevBtns.forEach(button => {
    button.addEventListener("click", () => {
        steps[currentStep].style.display = "none";
        currentStep--;
        steps[currentStep].style.display = "block";
    });
});








function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'ar',
        autoDisplay: false,
    }, 'google_translate_element');

    // Wait for the Google Translate dropdown to load
    const waitForDropdown = setInterval(() => {
        const selectElement = document.querySelector("#google_translate_element select");
        if (selectElement) {
            clearInterval(waitForDropdown); // Stop checking once the element is found
            selectElement.selectedIndex = 1; // Select Arabic (index 1)
            selectElement.dispatchEvent(new Event('change')); // Trigger the change event

            // Apply RTL styles based on the selected language
            setInterval(() => {
                const lang = document.documentElement.lang; // Detect the current language
                if (lang === 'ar') {
                    document.body.style.direction = 'rtl'; // Set text direction to RTL
                    document.body.style.textAlign = 'right'; // Align text to the right
                } else {
                    document.body.style.direction = 'ltr'; // Default to LTR
                    document.body.style.textAlign = 'left'; // Align text to the left
                }
            }, 1000); // Check periodically
        }
    }, 100); // Check every 100ms
}






// Function to protect email addresses from translation
function protectEmails() {
    const emailRegex = /\b[\w.-]+@[\w.-]+\.[\w.-]+\b/g;

    const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        {
            acceptNode: node =>
                node.parentNode.closest('[translate="no"]') ? NodeFilter.FILTER_SKIP : NodeFilter.FILTER_ACCEPT,
        }
    );

    let node;
    while ((node = walker.nextNode())) {
        const text = node.nodeValue;
        const matches = text.match(emailRegex);

        if (matches) {
            const parent = node.parentNode;

            matches.forEach(email => {
                const span = document.createElement('span');
                span.setAttribute('translate', 'no');
                span.textContent = email;
                span.style.unicodeBidi = 'bidi-override';
                span.style.direction = 'ltr';

                const parts = text.split(email);
                const fragment = document.createDocumentFragment();

                if (parts[0]) {
                    fragment.appendChild(document.createTextNode(parts[0]));
                }

                fragment.appendChild(span);

                if (parts[1]) {
                    fragment.appendChild(document.createTextNode(parts[1]));
                }

                parent.replaceChild(fragment, node);
            });
        }
    }
}

// Function to observe dynamic changes and reapply email protection
function observeDOMChanges() {
    const observer = new MutationObserver(() => {
        protectEmails();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true,
    });
}

// Run the function after the page loads
document.addEventListener('DOMContentLoaded', () => {
    protectEmails();
    observeDOMChanges(); // Observe dynamic content changes
});
