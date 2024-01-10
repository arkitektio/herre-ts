import { useCallback, useState } from "react";
import { CancelableRequest, LoginRequest, useHerre } from "../HerreContext";
import { Token } from "../types";


export const useLogin = (request: LoginRequest) => {

    const { token, login: herreLogin, logout: herreLogout } = useHerre();

    const [progress, setProgress] = useState<string | undefined>(undefined);
    const [error, setError] = useState<string | undefined>(undefined);
    const [promise, setPromise] = useState<CancelableRequest<Token> | null>(null);
   

    const login = useCallback((other: Partial<LoginRequest> = {}) => {
        if (promise) {
            promise.cancel();
        }
        else {

            let causedRequest = {...request, ...other}

            setError(undefined)
            const newPromise = herreLogin({
                ...causedRequest, 
                onProgress: (progress) => {
                    causedRequest.onProgress && causedRequest.onProgress(progress)
                    setProgress(progress);
                }
            });
            
            newPromise.promise.then(x => {
                setPromise(null)
                setProgress(undefined)
            
            
            }).catch((e) => {
                console.log("Error", e);
                
                setPromise(null)
                setError(e.message)
            })



            setPromise(newPromise)
        }
    }
    , [promise, herreLogin, request]);


    const logout = useCallback(() => {
        if (promise) {
            promise.cancel();
        }
        else {
            herreLogout()
        }
    }, [promise, herreLogout])

    return {
        progress,
        loading : promise != null,
        login,
        logout,
        error,
        token
    }
    




}