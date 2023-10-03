import { useEffect, useState} from "react"
import { getCookie } from '@utils/cookies'

export const useCookieValue = (key) => {
    const [cookie, setCookie]  =  useState(getCookie(key))

    useEffect(() => {
        const intervalID = setInterval(() => {
            const newCookieValue = getCookie(key)

            if(newCookieValue !== cookie) {
                setCookie(newCookieValue)
            }
        }, 1000)

        return () => clearInterval(intervalID)
    }, [key])

    return cookie
}

