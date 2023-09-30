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

export const getCookie = (key) => {
    const cookies = document.cookie.split(';')
    for(const cookie of cookies) {
        const [name, value] = cookie.split('=')
        if(key === name) return value
    }
    return undefined
}

