import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google'
import '../styles/GoogleLoginComponent.css'
import { dataProvider } from '../dataProvider'

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
