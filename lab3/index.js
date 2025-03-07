document.addEventListener('DOMContentLoaded', () => {
    let pet = {
        name: '',
        hunger: 50,
        energy: 50,
        health: 100,
        isAlive: true,
        age: 0
    };

    const startGameButton = document.getElementById('startGameBtn');

    startGameButton.addEventListener('click', startGame);

    function startGame() {
        pet.name = prompt('Дайте имя вашему питомцу:') || 'noname';
        if (!pet.name.trim()) pet.name = 'noname';

        startGameButton.textContent = `Ухаживать за ${pet.name}`;
        gameLoop();
    }

    function gameLoop() {
        if (!pet.isAlive) return;

        const action = prompt(`${pet.name}:
        1 - Покормить
        2 - Поиграть
        3 - Лечить
        4 - Уложить спать
        5 - Статус
        6 - Выход`);

        handleAction(action);
    }

    function handleAction(action) {
        switch(action) {
            case '1':
                if (confirm('Купить еду за 10 здоровья?')) {
                    if (pet.health >= 10) {
                        pet.hunger = Math.max(0, pet.hunger - 30);
                        pet.health -= 10;
                        showAlert(`Голод: -30\nЗдоровье: -10`);
                    } else {
                        showAlert('Недостаточно здоровья!');
                    }
                }
                break;

            case '2':
                if (confirm('Играть 30 минут?')) {
                    if (pet.energy >= 20) {
                        pet.energy -= 20;
                        pet.health = Math.min(100, pet.health + 15);
                        showAlert(`Энергия: -20\nЗдоровье: +15`);
                    } else {
                        showAlert('Питомец слишком устал!');
                    }
                }
                break;

            case '3':
                if (confirm('Использовать лекарство за 50 энергии?')) {
                    if (pet.energy >= 50) {
                        pet.energy -= 50;
                        pet.health = Math.min(100, pet.health + 40);
                        showAlert(`Энергия: -50\nЗдоровье: +40`);
                    } else {
                        showAlert('Недостаточно энергии!');
                    }
                }
                break;

            case '4':
                const hours = parseInt(prompt('Сколько часов спать? (1-12)'));
                if (hours && hours >= 1 && hours <= 12) {
                    pet.energy = Math.min(100, pet.energy + hours * 8);
                    pet.hunger = Math.min(100, pet.hunger + hours * 5);
                    showAlert(`Энергия: +${hours*8}\nГолод: +${hours*5}`);
                } else {
                    showAlert('Некорректное время сна!');
                }
                break;

            case '5':
                showStatus();
                break;

            case '6':
                if (confirm('Точно хотите выйти?')) {
                    showAlert('Игра завершена!');
                    return;
                }
                break;

            default:
                showAlert('Некорректное действие!');
                break;
        }

        updateStatus();
        checkConditions();
        if (pet.isAlive) gameLoop();
    }

    function updateStatus() {
        pet.age++;
        pet.hunger = Math.min(100, pet.hunger + 5);
        pet.energy = Math.max(0, pet.energy - 3);

        if (pet.hunger >= 100) pet.health -= 15;
        if (pet.energy <= 0) pet.health -= 10;
    }

    function checkConditions() {
        if (pet.health <= 0) {
            pet.isAlive = false;
            showAlert(`💀 ${pet.name} умер в возрасте ${pet.age} дней!`);
            startGameButton.textContent = 'Начать заново';
            startGameButton.addEventListener('click', () => location.reload());
        }
    }

    function showStatus() {
        alert(`Состояние ${pet.name}:
        🍔 Голод: ${pet.hunger}%
        ⚡️ Энергия: ${pet.energy}%
        ❤️ Здоровье: ${pet.health}%
        🎂 Возраст: ${pet.age} дней`);
    }

    function showAlert(message) {
        alert(message);
    }
});