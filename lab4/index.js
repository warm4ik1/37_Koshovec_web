document.addEventListener('DOMContentLoaded', () => {
    const purchaseBtn = document.getElementById('purchaseBtn');
    const screamerOverlay = document.getElementById('overlay');
    const screamSound = document.getElementById('sound');

    purchaseBtn.addEventListener('click', () => {
        screamerOverlay.style.display = 'flex';
        screamSound.volume = 1.0;
        screamSound.currentTime = 0;
        screamSound.play();
    });

    screamerOverlay.addEventListener('click', () => {
        screamerOverlay.style.display = 'none';
        screamSound.pause();
    });

    const themeSwitchBtn = document.getElementById('themeSwitchBtn');
    let darkTheme = false;

    themeSwitchBtn.addEventListener('click', () => {
        darkTheme = !darkTheme;

        if (darkTheme) {
            document.body.style.background = "url('/static/background_black.gif') repeat";
            document.querySelectorAll('.logo').forEach(logo => {
                logo.src = '/static/logo_black.gif';
            });
            document.body.classList.add('dark-theme');
        } else {
            document.body.style.background = "url('/static/background.gif') repeat";
            document.querySelectorAll('.logo').forEach(logo => {
                logo.src = '/static/logo.gif';
            });
            document.body.classList.remove('dark-theme');
        }
    });

    let reviews = [];
    try {
        const reviewsCookie = getCookie('reviews');
        reviews = reviewsCookie ? JSON.parse(reviewsCookie) : [];
    } catch (e) {
        console.error('Ошибка чтения отзывов из куки:', e);
        reviews = [];
    }

    if (reviews.length === 0) {
        reviews = [
            { name: 'Ыгыдык', text: 'Прочистил проход, мне всё понравилось.', image: '' },
            { name: 'Бздыш', text: 'Надёжно.', image: '' },
            { name: 'Асланубек', text: 'Рекомендую к покупке.', image: '' }
        ];
    }

    const reviewsList = document.getElementById('reviews-list');
    const reviewForm = document.getElementById('reviewForm');
    const reviewName = document.getElementById('reviewName');
    const reviewText = document.getElementById('reviewText');
    const reviewImage = document.getElementById('reviewImage');
    const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB

    function renderReviews() {
        reviewsList.innerHTML = '';
        reviews.forEach(review => {
            const reviewDiv = document.createElement('div');
            reviewDiv.classList.add('review');
            reviewDiv.innerHTML = `<strong>${review.name}</strong>
                                   <p>${review.text}</p>`;
            if (review.image) {
                const img = document.createElement('img');
                img.src = review.image;
                img.alt = 'Изображение отзыва';
                img.style.maxWidth = '200px';
                reviewDiv.appendChild(img);
            }
            reviewsList.appendChild(reviewDiv);
        });
    }

    renderReviews();

    function escapeHTML(str) {
        return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    reviewForm.addEventListener('submit', (e) => {
        e.preventDefault();
        let name = reviewName.value.trim();
        let text = reviewText.value.trim();

        if (!name || !text) {
            alert('Пожалуйста, заполните все поля.');
            return;
        }
        if (name.length > 50) {
            alert('Имя не должно превышать 50 символов.');
            return;
        }
        if (!/^[a-zA-Zа-яА-ЯёЁ\s]+$/.test(name)) {
            alert('Имя должно содержать только буквы.');
            return;
        }

        name = escapeHTML(name);
        text = escapeHTML(text);

        const newReview = { name, text, image: '' };

        const file = reviewImage.files[0];
        if (file) {
            if (file.size > MAX_FILE_SIZE) {
                alert('Размер изображения не должен превышать 2 МБ.');
                return;
            }
            const reader = new FileReader();
            reader.onload = function (event) {
                newReview.image = event.target.result;
                reviews.push(newReview);
                setCookie('reviews', JSON.stringify(reviews), 6);
                renderReviews();
                reviewForm.reset();
            };
            reader.readAsDataURL(file);
        } else {
            reviews.push(newReview);
            setCookie('reviews', JSON.stringify(reviews), 6);
            renderReviews();
            reviewForm.reset();
        }
    });
});
