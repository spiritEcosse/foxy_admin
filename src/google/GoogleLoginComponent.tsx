import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google'
import '../styles/GoogleLoginComponent.css'
import { dataProvider } from '../dataProvider'
import { jwtDecode } from 'jwt-decode'
interface GoogleCredential {
    iss: string
    nbf: number
    aud: string
    sub: string
    email: string
    email_verified: boolean
    azp: string
    name: string
    picture: string
    given_name: string
    family_name: string
    iat: number
    exp: number
    jti: string
}

const GoogleLoginComponent = () => {
    return (
        <GoogleOAuthProvider
            clientId={import.meta.env.VITE_APP_GOOGLE_CLIENT_ID}
        >
            <div className="login-overlay">
                <GoogleLogin
                    auto_select={true}
                    useOneTap={true}
                    onSuccess={async (credentialResponse: any) => {
                        if (!credentialResponse.credential) {
                            console.log('Credential is undefined')
                            return
                        }
                        const credential =
                            credentialResponse.credential as string
                        // Decode the JWT
                        const decodedCredential =
                            jwtDecode<GoogleCredential>(credential)

                        // Log the parsed credentials
                        console.log('Parsed credentials:', decodedCredential)
                        fetch(
                            dataProvider.getUrl(
                                'api/v1/auth/admin/google_login',
                            ),
                            {
                                method: 'POST',
                                headers: {
                                    'Content-Type': 'application/json',
                                },
                                body: JSON.stringify({
                                    credentials: credential,
                                }),
                            },
                        ).then((response) => {
                            if (!response.ok) {
                                throw new Error('Network response was not ok')
                            }
                            localStorage.setItem('auth', credential)
                            window.dispatchEvent(new Event('storage'))
                        })
                    }}
                    onError={() => {
                        console.log('Login Failed')
                    }}
                />
            </div>
        </GoogleOAuthProvider>
    )
}

export default GoogleLoginComponent
