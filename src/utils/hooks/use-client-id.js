import { setCookie, getCookie } from "@utils/cookies"
import { generateUUID } from "@utils/generate-uuid"
import { useEffect, useMemo } from "react"

function useClientID () {
    const clientID = useMemo(() => {
        const stored = getCookie('clientID')
        if(!stored) {
            const newClientID = generateUUID()
            setCookie('clientID', newClientID)
            return newClientID
        }
        return stored
    }, [])

    useEffect(() => {
        const clientIDExpired = CookieIsExpired('clientID')
        if(clientIDExpired) {
            const newClientID = generateUUID()
            setCookie('clientID', newClientID)
        }
    }, [])

    return clientID
}

export default useClientID
