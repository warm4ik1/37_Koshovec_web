/**
 * cookie.js
 *
 * Этот файл содержит функции для работы с cookie.
 *
 * Функции:
 *  - setCookie(name, value, hours): Устанавливает cookie с указанным именем, значением и сроком действия в часах.
 *  - getCookie(name): Получает значение cookie по имени.
 *  - deleteCookie(name): Удаляет cookie с указанным именем.
 */

/**
 * Устанавливает cookie с указанным именем, значением и сроком действия в часах.
 *
 * @param {string} name - Имя cookie.
 * @param {string} value - Значение cookie.
 * @param {number} hours - Количество часов до истечения срока действия cookie.
 */
function setCookie(name, value, hours) {
    const expires = new Date(Date.now() + hours * 3600000).toUTCString();
    document.cookie = name + '=' + encodeURIComponent(value) + '; expires=' + expires + '; path=/';
}

/**
 * Получает значение cookie по имени.
 *
 * @param {string} name - Имя cookie.
 * @returns {string|null} Значение cookie или null, если cookie не найден.
 */
function getCookie(name) {
    return document.cookie.split('; ').reduce((r, v) => {
        const parts = v.split('=');
        return parts[0] === name ? decodeURIComponent(parts[1]) : r;
    }, null);
}

/**
 * Удаляет cookie с указанным именем.
 *
 * @param {string} name - Имя cookie для удаления.
 */
function deleteCookie(name) {
    setCookie(name, '', -1);
}
