/* ========================================
   CYBERSHIELD ACADEMY — PHISHING AWARENESS
   Main Script — Slide Navigation, Quiz, 
   Particles, Certificate
   ======================================== */

// ====== STATE ======
let currentSlide = 0;
const totalSlides = 10;
let quizScore = 0;
let quizAnswered = 0;
const quizTotal = 5;

// ====== QUIZ DATA ======
const quizData = [
    {
        question: "You receive an email from 'security@paypa1-support.com' asking you to verify your account. What should you do?",
        options: [
            "Click the link immediately — it might be urgent",
            "Reply with your password to prove your identity",
            "Ignore it and go directly to PayPal.com to check your account",
            "Forward it to all your colleagues as a warning"
        ],
        correct: 2,
        explanation: "Never click links in suspicious emails. Instead, manually navigate to the official website (paypal.com) by typing it in your browser. The email uses a '1' instead of 'l' in the domain — a classic typosquatting trick."
    },
    {
        question: "Which of these is the MOST reliable way to verify if an email from your CEO is legitimate?",
        options: [
            "Check if the email has the company logo",
            "Look at the email signature for their title",
            "Contact the CEO through a separate, known channel (phone, Slack, etc.)",
            "Check if the email address ends with your company domain"
        ],
        correct: 2,
        explanation: "Email addresses, logos, and signatures can all be spoofed. The most reliable method is out-of-band verification — contacting the person through a completely separate communication channel you already trust."
    },
    {
        question: "What is 'spear phishing' specifically?",
        options: [
            "Phishing that targets mobile phone users",
            "A mass email campaign sent to thousands of people",
            "A highly targeted attack customized for a specific individual or organization",
            "Phishing that uses malware-infected USB drives"
        ],
        correct: 2,
        explanation: "Spear phishing is a targeted form of phishing directed at specific individuals or organizations. Attackers research their targets and personalize messages to increase credibility, making them much harder to detect than mass phishing campaigns."
    },
    {
        question: "You see a URL: https://amazon.com.secure-login.xyz/account. What's suspicious?",
        options: [
            "Nothing — it has 'amazon.com' in it so it must be legitimate",
            "The actual domain is 'secure-login.xyz', not amazon.com — 'amazon.com' is just a subdomain",
            "It uses HTTPS which means it's always safe",
            "The URL is too long"
        ],
        correct: 1,
        explanation: "The actual domain is 'secure-login.xyz'. Everything before it ('amazon.com') is a subdomain that anyone can create. HTTPS only means the connection is encrypted — it does NOT mean the site is legitimate. Always check the root domain."
    },
    {
        question: "If you accidentally clicked a phishing link and entered your password, what should you do FIRST?",
        options: [
            "Nothing — just be more careful next time",
            "Delete the email and pretend it didn't happen",
            "Change your password immediately and enable MFA, then notify IT/security",
            "Turn off your computer and wait 24 hours"
        ],
        correct: 2,
        explanation: "Time is critical after credentials are compromised. Immediately change your password and enable multi-factor authentication to prevent unauthorized access. Then notify your IT/security team so they can monitor for suspicious activity and take additional protective measures."
    }
];

// ====== INITIALIZATION ======
document.addEventListener('DOMContentLoaded', () => {
    initParticles();
    initQuiz();
    initKeyboardNavigation();
    updateProgress();
    setCertDate();
    hideKeyboardHintAfterDelay();
});

// ====== SLIDE NAVIGATION ======
function goToSlide(index) {
    if (index < 0 || index >= totalSlides) return;

    const slides = document.querySelectorAll('.slide');
    const currentSlideEl = slides[currentSlide];
    const nextSlideEl = slides[index];

    // Determine direction
    const goingForward = index > currentSlide;

    // Exit current slide
    currentSlideEl.classList.remove('active');
    currentSlideEl.classList.add(goingForward ? 'exit-left' : '');
    currentSlideEl.style.transform = goingForward ? 'translateX(-60px)' : 'translateX(60px)';
    currentSlideEl.style.opacity = '0';

    // After transition, clean up
    setTimeout(() => {
        currentSlideEl.classList.remove('exit-left');
        currentSlideEl.style.transform = '';
    }, 500);

    // Prepare incoming slide
    nextSlideEl.style.transform = goingForward ? 'translateX(60px)' : 'translateX(-60px)';
    nextSlideEl.style.opacity = '0';

    // Trigger reflow
    void nextSlideEl.offsetWidth;

    // Animate in
    nextSlideEl.classList.add('active');
    nextSlideEl.style.transform = 'translateX(0)';
    nextSlideEl.style.opacity = '1';

    // Scroll to top of the new slide
    nextSlideEl.scrollTop = 0;

    currentSlide = index;
    updateProgress();
    updateNavigation();
}

function nextSlide() {
    if (currentSlide < totalSlides - 1) {
        goToSlide(currentSlide + 1);
    }
}

function prevSlide() {
    if (currentSlide > 0) {
        goToSlide(currentSlide - 1);
    }
}

function updateProgress() {
    const progress = (currentSlide / (totalSlides - 1)) * 100;
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    progressBar.style.width = progress + '%';
    progressText.textContent = Math.round(progress) + '%';
}

function updateNavigation() {
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const slideCounter = document.getElementById('slideCounter');
    const navTitle = document.getElementById('navSectionTitle');
    const currentSlideEl = document.querySelectorAll('.slide')[currentSlide];

    prevBtn.disabled = currentSlide === 0;
    nextBtn.disabled = currentSlide === totalSlides - 1;
    slideCounter.textContent = `${currentSlide + 1} / ${totalSlides}`;
    navTitle.textContent = currentSlideEl.dataset.title || '';
}

function initKeyboardNavigation() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
            e.preventDefault();
            nextSlide();
        } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
            e.preventDefault();
            prevSlide();
        }
    });
}

function hideKeyboardHintAfterDelay() {
    setTimeout(() => {
        const hint = document.getElementById('keyboardHint');
        if (hint) hint.classList.add('hidden');
    }, 6000);
}

// ====== EMAIL DEMO ======
function showEmailWarning() {
    document.getElementById('emailWarning').classList.add('show');
}

function hideEmailWarning() {
    document.getElementById('emailWarning').classList.remove('show');
}

// ====== QUIZ ENGINE ======
function initQuiz() {
    const container = document.getElementById('quizContainer');
    if (!container) return;

    let html = '';
    quizData.forEach((q, qi) => {
        const letters = ['A', 'B', 'C', 'D'];
        html += `
            <div class="quiz-question" id="question${qi}">
                <div class="question-header">
                    <div class="question-number">${qi + 1}</div>
                    <div class="question-text">${q.question}</div>
                </div>
                <div class="quiz-options">
                    ${q.options.map((opt, oi) => `
                        <div class="quiz-option" id="q${qi}o${oi}" onclick="answerQuestion(${qi}, ${oi})">
                            <div class="option-letter">${letters[oi]}</div>
                            <div class="option-text">${opt}</div>
                            <div class="option-feedback"></div>
                        </div>
                    `).join('')}
                </div>
                <div class="quiz-explanation" id="explanation${qi}">
                    💡 ${q.explanation}
                </div>
            </div>
        `;
    });

    html += `
        <div class="quiz-submit-area" id="quizSubmitArea" style="display:none;">
            <button class="cta-button" onclick="showResults()">
                View Results
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
            </button>
        </div>
    `;

    container.innerHTML = html;
}

function answerQuestion(questionIndex, optionIndex) {
    const question = document.getElementById(`question${questionIndex}`);
    if (question.classList.contains('answered')) return;

    question.classList.add('answered');
    quizAnswered++;

    const correct = quizData[questionIndex].correct;
    const isCorrect = optionIndex === correct;

    if (isCorrect) quizScore++;

    // Highlight correct and wrong
    const selectedOption = document.getElementById(`q${questionIndex}o${optionIndex}`);
    const correctOption = document.getElementById(`q${questionIndex}o${correct}`);

    correctOption.classList.add('correct');
    correctOption.querySelector('.option-feedback').textContent = '✓ Correct';

    if (!isCorrect) {
        selectedOption.classList.add('wrong');
        selectedOption.querySelector('.option-feedback').textContent = '✗ Wrong';
    }

    // Show explanation
    const explanation = document.getElementById(`explanation${questionIndex}`);
    explanation.classList.add('show');

    // Show results button when all answered
    if (quizAnswered === quizTotal) {
        document.getElementById('quizSubmitArea').style.display = 'flex';
        document.getElementById('quizSubmitArea').style.animation = 'fadeSlideIn 0.4s ease';
    }
}

function showResults() {
    document.getElementById('quizContainer').style.display = 'none';
    const results = document.getElementById('quizResults');
    results.style.display = 'block';

    document.getElementById('scoreNumber').textContent = quizScore;

    // Icon and message based on score
    let icon, title, message;
    if (quizScore === 5) {
        icon = '🏆';
        title = 'Perfect Score!';
        message = 'Outstanding! You have excellent phishing awareness. You\'re well-equipped to spot and avoid phishing attacks.';
    } else if (quizScore >= 4) {
        icon = '🌟';
        title = 'Great Job!';
        message = 'You have a strong understanding of phishing tactics. Review the questions you missed to strengthen your knowledge.';
    } else if (quizScore >= 3) {
        icon = '👍';
        title = 'Good Effort!';
        message = 'You have decent awareness, but there\'s room for improvement. Consider reviewing the training material.';
    } else {
        icon = '📚';
        title = 'Keep Learning!';
        message = 'Phishing awareness is critical for your security. We recommend reviewing the training material and retaking the quiz.';
    }

    document.getElementById('resultsIcon').textContent = icon;
    document.getElementById('resultsTitle').textContent = title;
    document.getElementById('resultsMessage').textContent = message;

    // Build breakdown
    const breakdown = document.getElementById('resultsBreakdown');
    let breakdownHtml = '';
    quizData.forEach((q, i) => {
        const wasCorrect = document.getElementById(`question${i}`).querySelector('.quiz-option.wrong') === null;
        breakdownHtml += `
            <div class="result-item">
                <span class="result-icon">${wasCorrect ? '✅' : '❌'}</span>
                <span>Q${i + 1}: ${wasCorrect ? 'Correct' : 'Incorrect'}</span>
            </div>
        `;
    });
    breakdown.innerHTML = breakdownHtml;
}

function retakeQuiz() {
    quizScore = 0;
    quizAnswered = 0;

    document.getElementById('quizResults').style.display = 'none';
    document.getElementById('quizContainer').style.display = 'block';

    initQuiz();
}

// ====== CERTIFICATE ======
function setCertDate() {
    const dateEl = document.getElementById('certDate');
    if (dateEl) {
        const now = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        dateEl.textContent = now.toLocaleDateString('en-US', options);
    }
}

function downloadCertificate() {
    const name = document.getElementById('certName').value.trim() || 'Participant';
    const date = document.getElementById('certDate').textContent;

    // Create a downloadable text certificate
    const certText = `
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║                   🛡️  CYBERSHIELD ACADEMY  🛡️                ║
║                                                              ║
║              ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━                ║
║                                                              ║
║                 CERTIFICATE OF COMPLETION                     ║
║                                                              ║
║              ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━                ║
║                                                              ║
║                   This certifies that                        ║
║                                                              ║
║                      ${name.padStart(Math.floor((40 + name.length) / 2)).padEnd(40)}        ║
║                                                              ║
║             has successfully completed the                   ║
║                                                              ║
║              PHISHING AWARENESS TRAINING                     ║
║                                                              ║
║                   Quiz Score: ${quizScore}/${quizTotal}                          ║
║                                                              ║
║                  Date: ${date.padEnd(30)}        ║
║                                                              ║
║              ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━                ║
║                                                              ║
║   "Think before you click. You are the first and last        ║
║    line of defense against phishing."                        ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
    `.trim();

    const blob = new Blob([certText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Phishing_Awareness_Certificate_${name.replace(/\s+/g, '_')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

// ====== PARTICLE BACKGROUND ======
function initParticles() {
    const canvas = document.getElementById('particleCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    let width, height;

    function resize() {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
    }

    resize();
    window.addEventListener('resize', resize);

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.4 + 0.1;
            // Cycle through different accent colors
            const colors = [
                '0, 212, 255',    // cyan
                '79, 124, 255',   // blue
                '168, 85, 247',   // purple
            ];
            this.color = colors[Math.floor(Math.random() * colors.length)];
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (this.x < 0 || this.x > width) this.speedX *= -1;
            if (this.y < 0 || this.y > height) this.speedY *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
            ctx.fill();
        }
    }

    // Create particles (fewer on mobile)
    const particleCount = width < 768 ? 30 : 60;
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function connectParticles() {
        const maxDist = 150;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < maxDist) {
                    const opacity = (1 - dist / maxDist) * 0.12;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(79, 124, 255, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        connectParticles();
        requestAnimationFrame(animate);
    }

    animate();
}
