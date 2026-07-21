type WorldSummary = {
    id: string
    name: string
    description: string
}

export default function FirebaseTest() {
    function registerWithEmail() {
        // Validate

        // Create user
    }

    function registerWithGoogle() {

    }

    function registerWithFacebook() {

    }

    function loginWithEmail() {
        // Validate

    }

    function loginWithGoogle() {

    }

    function loginWithFacebook() {

    }

    function updateUserDetails() {
        
    }

    function logout() {
        
    }

    function getWorlds(): WorldSummary[] {
        return [];
    }

    return (
        <div>
            <div id='register' className='bg-gray-100'>
                <h1>Register</h1>
                <input type='text' id='username' placeholder='Username' />
                <input type='text' id='displayName' placeholder='Display Name' />
                <input type='text' id='email' placeholder='Email' />
                <input type='password' id='password' placeholder='Password' />
                <input type='password' id='confirmPassword' placeholder='Confirm Password' />
                <button id='registerBtn' onClick={registerWithEmail}>
                    Register
                </button>
                <button id='googleBtn' onClick={registerWithGoogle}>
                    Register with Google
                </button>
                <button id='facebookBtn' onClick={registerWithFacebook}>
                    Register with Facebook
                </button>
            </div>
            <div id='login' className='pt-10 bg-gray-100'>
                <h1>Login</h1>
                <input type='text' id='email' placeholder='Email' />
                <input type='password' id='password' placeholder='Password' />
                <button id='loginBtn' onClick={loginWithEmail}>
                    Login
                </button>
                <button id='googleBtn' onClick={loginWithGoogle}>
                    Login with Google
                </button>
                <button id='facebookBtn' onClick={loginWithFacebook}>
                    Login with Facebook
                </button>
            </div>
            <div id='account' className='pt-10 bg-gray-100'>
                <h1>Account</h1>
                <input type='text' id='username' placeholder='Username' />
                <input type='text' id='displayName' placeholder='Display Name' />
                <input type='text' id='email' placeholder='Email' />
                <input type='password' id='password' placeholder='Password' />
                <input type='password' id='confirmPassword' placeholder='Confirm Password' />
                <button id='updateBtn' onClick={updateUserDetails}>
                    Update
                </button>
                <button id='logoutBtn' onClick={logout}>
                    Logout
                </button>
            </div>
            <div id='worlds' className='pt-10 bg-gray-100'>
                <h1>Worlds</h1>
                {
                    getWorlds().map((world) => {
                        return (
                            <div key={world.id}>
                                <h2>{world.name}</h2>
                                <p>{world.description}</p>
                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}
