/**
 * @param {string} key
 * @param {string | object} value
 * @param {number} expirationDate
 */
export const setCookie = (key, value, minutesToExpire = 5) => {
    if (typeof value == 'object') {
        value = JSON.stringify(value)
    }
    const expDate = new Date(
        new Date().getTime + minutesToExpire * 60 * 1000
    ).toUTCString()
    document.cookie = `${key}=${value};${expDate};path=/`
}

/**
 *
 * @param {string} key
 * @returns
 */
export const getCookie = (key) => {
    const cookies = document.cookie.split(';').reduce((acc = {}, cookie) => {
        const [key, value] = cookie.trim().split('=')
        acc[key] = value
        return acc
    }, {})

    return cookies[key] ?? ''
}
