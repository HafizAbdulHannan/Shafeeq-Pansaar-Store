if(localStorage.getItem('token')) {
    window.location.href = 'Home.html';
}
const themeToggle = document.getElementById('themeToggle');
if(localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
}
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    if(document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        localStorage.setItem('theme', 'light');
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    }
});

async function loadStats() {
    try {
        const response = await fetch('http://localhost:5000/api/feedback/stats');
        if (response.ok) {
            const data = await response.json();
            document.getElementById('statsUsers').textContent = data.users;
            document.getElementById('statsRating').innerHTML = `${data.rating} <i class="fas fa-star" style="font-size: 1.5rem; color: #facc15;"></i>`;
            document.getElementById('statsReviews').textContent = data.reviews;

            const reviewsContainer = document.getElementById('recentReviewsContainer');
            if (data.recentReviews && data.recentReviews.length > 0) {
                reviewsContainer.innerHTML = '';
                data.recentReviews.forEach(r => {
                    const stars = Array(5).fill(0).map((_, i) => 
                        `<i class="fas fa-star" style="color: ${i < (r.rating || 5) ? '#facc15' : '#ccc'};"></i>`
                    ).join('');
                    
                    const reviewEl = document.createElement('div');
                    reviewEl.style.cssText = 'background: var(--surface-color); padding: 15px 20px; border-radius: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);';
                    reviewEl.innerHTML = `
                        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                            <strong>${r.name}</strong>
                            <div>${stars}</div>
                        </div>
                        <p style="margin: 0; color: var(--text-main); font-style: italic;">"${r.message}"</p>
                    `;
                    reviewsContainer.appendChild(reviewEl);
                });
            } else {
                reviewsContainer.innerHTML = '<p style="text-align: center; color: var(--text-muted);">No reviews yet.</p>';
            }
        }
    } catch (e) {
        console.error('Error fetching stats:', e);
    }
}

async function submitQuestion() {
    const name = document.getElementById('qName').value;
    const email = document.getElementById('qEmail').value;
    const question = document.getElementById('qText').value;

    if (!name || !email || !question) {
        alert('Please fill out all fields before submitting.');
        return;
    }

    try {
        const response = await fetch('http://localhost:5000/api/questions', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, question })
        });
        if (response.ok) {
            alert('Your question has been submitted! We will get back to you soon.');
            document.getElementById('qName').value = '';
            document.getElementById('qEmail').value = '';
            document.getElementById('qText').value = '';
        }
    } catch (e) {
        console.error('Error submitting question:', e);
    }
}

document.addEventListener('DOMContentLoaded', loadStats);
