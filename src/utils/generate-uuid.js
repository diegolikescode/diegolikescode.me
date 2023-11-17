export const generateUUID = () => {
    const randomHex = (length) => {
        let result = ''
        for (let i = 0; i < length; i++) {
            result += Math.floor(Math.random() * 16).toString(16)
        }
        return result
    }

    const newUUID = `${randomHex(8)}-${randomHex(4)}
        -${randomHex(3)}-${randomHex(12)}`
    return newUUID
}
