import { useState, useEffect } from "react"
import { getCookie } from '@utils/cookies'

export const useCookieValue = (key) => {
    const [cookieValue, setCookieValue] =  useState(getCookie(key))

    useEffect(() => {
       const handleCookieChange = () => {
            setCookieValue(getCookie(key))
        }

        window.addEventListener('cookiechange', handleCookieChange)

        return () => {
        window.removeEventListener('cookiechange', handleCookieChange)
        }
    }, [key])

    return cookieValue
}
