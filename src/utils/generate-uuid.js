import crypto from 'crypto'

export const generateUUID = () => {
    const buffer = crypto.randomBytes(16)
    buffer[6] = (buffer[6] & 0x0f) | 0x40
    buffer[8] = (buffer[8] & 0x3f) | 0x80

    return buffer.toString('hex').toUpperCase()
}
