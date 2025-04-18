import { useState, useEffect } from "react";
import { EyeIcon, EyeOffIcon, Lock, User, ArrowLeft } from 'lucide-react';
import { ToastContainer, toast } from 'react-toastify';
import axios from 'axios';

const Component = () => {
    // Login state
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [isLoggedIn, setIsLoggedin] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Registration state
    const [isRegistering, setIsRegistering] = useState(false);
    const [registerData, setRegisterData] = useState({
        username: '',
        password: '',
        name: '',
        confirmPassword: ''
    });
    const [showRegisterPassword, setShowRegisterPassword] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        try {
            const response = await axios.post('https://ott-analyzer.onrender.com/login', {
                username, password
            });

            if (response.data.success) {
                setIsLoggedin(true);
                setCurrentUser(response.data.user);
                toast.success("Welcome back!");
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Login Failed');
            toast.error(err.response?.data?.error || 'Login Failed');
        } finally {
            setIsLoading(false);
        }
    };

    const handleRegister = async (e) => {
        e.preventDefault();
        
        // Validate passwords match
        if (registerData.password !== registerData.confirmPassword) {
            toast.error("Passwords don't match");
            return;
        }

        try {
            const response = await axios.post('https://ott-analyzer.onrender.com/register', {
                username: registerData.username,
                password: registerData.password,
                name: registerData.name
            });

            if (response.data.success) {
                toast.success('Registration successful! Please login');
                setIsRegistering(false);
                setRegisterData({ username: '', password: '', name: '', confirmPassword: '' });
            }
        } catch (err) {
            toast.error(err.response?.data?.error || 'Registration failed');
        }
    };

    const handleLogout = () => {
        toast.info("Successfully logged out!");
        setIsLoggedin(false);
        setCurrentUser(null);
        setUsername('');
        setPassword('');
    };

    useEffect(() => {
        const formElements = document.querySelectorAll('.animate-in');
        formElements.forEach((element, index) => {
            setTimeout(() => {
                element.classList.add('animated');
            }, 100 * (index + 1));
        });
    }, [isLoggedIn, isRegistering]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 font-sans p-4">
            <ToastContainer />
            <div className={`bg-gray-800 bg-opacity-95 backdrop-blur rounded-2xl shadow-xl border border-white/5 text-center ${isLoggedIn ? 'w-full max-w-6xl' : 'w-full max-w-md'} p-8`}>
                {isLoggedIn ? (
                    <div className="text-center">
                        <div className="animate-in opacity-0 translate-y-2 transition-all duration-400 ease-out mb-6">
                            <h1 className="text-3xl font-bold text-white mb-2">Welcome, {currentUser.name}!</h1>
                            <p className="text-gray-400">You are now viewing the OTT dashboard</p>
                        </div>

                        <div className="animate-in opacity-0 translate-y-2 transition-all duration-400 ease-out">
                            <div className="w-full overflow-hidden rounded-lg border border-white/10 bg-black/20 mb-6">
                            <iframe title="ott dashboard" width="1140" height="541.25" src="https://app.powerbi.com/reportEmbed?reportId=bade79cd-1eb4-462f-bb47-459aba106027&autoAuth=true&ctid=23035d1f-133c-44b5-b2ad-b3aef17baaa1" frameborder="0" allowFullScreen="true">
                            </iframe>
                            </div>
                        </div>

                        <button
                            onClick={handleLogout}
                            className="animate-in opacity-0 translate-y-2 transition-all duration-400 ease-out py-3 px-6 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-colors mt-6"
                        >
                            Logout
                        </button>
                    </div>
                ) : isRegistering ? (
                    <div>
                        <div className="text-center mb-8 animate-in opacity-0 translate-y-2 transition-all duration-400 ease-out">
                            <div className="w-16 h-16 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center">
                                <User className="text-white" size={24} />
                            </div>
                            <h2 className="text-xl text-white font-semibold mb-2">Create Account</h2>
                            <p className="text-gray-400 text-sm">Register to access the dashboard</p>
                        </div>

                        <form onSubmit={handleRegister} className="text-left">
                            <div className="mb-4 animate-in opacity-0 translate-y-2 transition-all duration-400 ease-out">
                                <label className="block text-gray-300 text-sm mb-2">Full Name</label>
                                <input
                                    type="text"
                                    value={registerData.name}
                                    onChange={(e) => setRegisterData({...registerData, name: e.target.value})}
                                    required
                                    placeholder="Your full name "
                                    className="w-full py-3 px-4 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 placeholder-gray-500"
                                />
                            </div>

                            <div className="mb-4 animate-in opacity-0 translate-y-2 transition-all duration-400 ease-out">
                                <label className="block text-gray-300 text-sm mb-2">Username</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        value={registerData.username}
                                        onChange={(e) => setRegisterData({...registerData, username: e.target.value})}
                                        required
                                        placeholder="Choose a username"
                                        className="w-full py-3 pl-10 pr-4 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 placeholder-gray-500"
                                    />
                                </div>
                            </div>

                            <div className="mb-4 animate-in opacity-0 translate-y-2 transition-all duration-400 ease-out">
                                <label className="block text-gray-300 text-sm mb-2">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type={showRegisterPassword ? "text" : "password"}
                                        value={registerData.password}
                                        onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
                                        required
                                        placeholder="Create a password"
                                        className="w-full py-3 pl-10 pr-12 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 placeholder-gray-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                    >
                                        {showRegisterPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                                    </button>
                                </div>
                            </div>

                            <div className="mb-6 animate-in opacity-0 translate-y-2 transition-all duration-400 ease-out">
                                <label className="block text-gray-300 text-sm mb-2">Confirm Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type={showRegisterPassword ? "text" : "password"}
                                        value={registerData.confirmPassword}
                                        onChange={(e) => setRegisterData({...registerData, confirmPassword: e.target.value})}
                                        required
                                        placeholder="Confirm your password"
                                        className="w-full py-3 pl-10 pr-12 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/20 placeholder-gray-500"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors animate-in opacity-0 translate-y-2 transition-all duration-400 ease-out"
                            >
                                Create Account
                            </button>

                            <button
                                type="button"
                                onClick={() => setIsRegistering(false)}
                                className="w-full py-3 text-gray-400 mt-4 flex items-center justify-center gap-2 animate-in opacity-0 translate-y-2 transition-all duration-400 ease-out"
                            >
                                <ArrowLeft size={16} /> Back to Login
                            </button>
                        </form>
                    </div>
                ) : (
                    <div>
                        <div className="text-center mb-8 animate-in opacity-0 translate-y-2 transition-all duration-400 ease-out">
                            <div className="w-16 h-16 mx-auto mb-4 bg-purple-500 rounded-full flex items-center justify-center">
                                <Lock className="text-white" size={24} />
                            </div>
                            <h2 className="text-xl text-white font-semibold mb-2">Login</h2>
                            <p className="text-gray-400 text-sm">Sign in to access your dashboard</p>
                        </div>

                        <form onSubmit={handleLogin} className="text-left">
                            <div className="mb-6 animate-in opacity-0 translate-y-2 transition-all duration-400 ease-out">
                                <label htmlFor="username" className="block text-gray-300 text-sm mb-2">Username</label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type="text"
                                        id="username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        required
                                        placeholder="Enter your username"
                                        className="w-full py-3 pl-10 pr-4 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 placeholder-gray-500"
                                    />
                                </div>
                            </div>

                            <div className="mb-6 animate-in opacity-0 translate-y-2 transition-all duration-400 ease-out">
                                <label htmlFor="password" className="block text-gray-300 text-sm mb-2">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        id="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        required
                                        placeholder="Enter your password"
                                        className="w-full py-3 pl-10 pr-12 bg-white/5 border border-white/10 rounded-lg text-white focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20 placeholder-gray-500"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                                    >
                                        {showPassword ? <EyeOffIcon size={18} /> : <EyeIcon size={18} />}
                                    </button>
                                </div>
                            </div>

                            {error && (
                                <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-500 rounded-lg text-center text-sm animate-in opacity-0 translate-y-2 transition-all duration-400 ease-out">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full py-3 bg-purple-500 text-white rounded-lg font-medium transition-colors animate-in opacity-0 translate-y-2 transition-all duration-400 ease-out ${isLoading ? 'opacity-70 cursor-not-allowed' : 'hover:bg-purple-600'}`}
                            >
                                {isLoading ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin w-5 h-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </div>
                                ) : (
                                    'Sign in'
                                )}
                            </button>

                            <div className="text-center mt-4 animate-in opacity-0 translate-y-2 transition-all duration-400 ease-out">
                                <button
                                    type="button"
                                    onClick={() => setIsRegistering(true)}
                                    className="text-purple-300 hover:text-purple-400 text-sm transition-colors"
                                >
                                    Don't have an account? Register
                                </button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
            <style jsx>{`
                .animate-in.animated {
                    opacity: 1;
                    transform: translateY(0);
                }
            `}</style>
        </div>
    );
};

export default Component;