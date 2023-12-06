const authSecrets = {
    jwt : {
        secret : process.env.AUTH_SECRET || "default", 
        expiresIn : "7d"
    }
}


export {authSecrets};