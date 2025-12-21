import React, { useState, useEffect } from "react";
import { api, handleApiError } from "../src/api/client";
import { useAuth } from "../context/AuthContext";
import { useNavigate, useLocation } from "react-router-dom";
import { useToast } from "../context/ToastContext";
import AnimatedButton from "../components/AnimatedButton";

const LoginMobile: React.FC = () => {
    const { user, login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const { showToast } = useToast();

    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    useEffect(() => {
        if (user) navigate("/");
    }, [user, navigate]);

    useEffect(() => {
        const params = new URLSearchParams(location.search);
        if (params.get("mode") === "signup") {
            setIsLogin(false);
        }
    }, [location]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const endpoint = isLogin ? "/auth/login" : "/auth/signup";
            const { data } = await api.post(endpoint, formData);

            login(data);
            showToast(
                isLogin ? "Welcome back!" : "Account created successfully!",
                "success"
            );

            if (data.user.role === "owner") navigate("/admin");
            else navigate("/");
        } catch (err: any) {
            showToast(handleApiError(err), "error");
        }
    };

    return (
        <div className="min-h-screen bg-white flex flex-col justify-center px-6 sm:hidden">
            <h1 className="text-2xl font-extrabold text-center text-[#008B9E] mb-8">
                {isLogin ? "Login" : "Create Account"}
            </h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                {!isLogin && (
                    <input
                        type="text"
                        placeholder="Full Name"
                        required
                        className="w-full border border-gray-300 rounded-lg px-4 py-4 text-base focus:outline-none focus:border-[#008B9E]"
                        value={formData.name}
                        onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                        }
                    />
                )}

                <input
                    type="email"
                    placeholder="Email Address"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-4 text-base focus:outline-none focus:border-[#008B9E]"
                    value={formData.email}
                    onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                    }
                />

                <input
                    type="password"
                    placeholder="Password"
                    required
                    className="w-full border border-gray-300 rounded-lg px-4 py-4 text-base focus:outline-none focus:border-[#008B9E]"
                    value={formData.password}
                    onChange={(e) =>
                        setFormData({ ...formData, password: e.target.value })
                    }
                />

                <AnimatedButton
                    type="submit"
                    className="w-full h-14 text-sm font-bold uppercase tracking-widest"
                >
                    {isLogin ? "Login" : "Sign Up"}
                </AnimatedButton>
            </form>

            <button
                onClick={() => setIsLogin(!isLogin)}
                className="mt-6 text-center text-xs uppercase tracking-widest text-gray-500"
            >
                {isLogin
                    ? "New here? Create Account"
                    : "Already have an account? Login"}
            </button>
        </div>
    );
};

export default LoginMobile;
