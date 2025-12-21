import React, { useState } from 'react';
import Login from './Login';
import LoginMobileGlass from './LoginMobileGlass';
import SignupMobileGlass from './SignupMobileGlass';

const AuthPage: React.FC = () => {
    const [mobileMode, setMobileMode] = useState<'login' | 'signup'>('login');

    return (
        <>
            <div className="hidden sm:block">
                <Login />
            </div>
            <div className="block sm:hidden">
                {mobileMode === 'login' ? (
                    <LoginMobileGlass onRegisterClick={() => setMobileMode('signup')} />
                ) : (
                    <SignupMobileGlass onLoginClick={() => setMobileMode('login')} />
                )}
            </div>
        </>
    );
};

export default AuthPage;
