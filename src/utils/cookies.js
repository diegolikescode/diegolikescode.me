/**
 * @param {string} key
 * @param {string | object} value
 * @param {number} expirationDate
 */
export const setCookie = (key, value, minutesToExpire) => {
    if (typeof value == 'object') {
        value = JSON.stringify(value)
    }
    const expDate = new Date(
        new Date().getTime + minutesToExpire * 60 * 1000
    ).toUTCString()
    document.cookie = `${key}=${value};${expDate};path=/`
}
