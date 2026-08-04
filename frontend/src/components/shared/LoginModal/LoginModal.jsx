import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, TrainFront } from "lucide-react";
import { login } from "../../../api/authApi";
import * as S from "./styles";

export default function LoginModal({ onClose }) {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            const res = await login(email, password);

            if (!res.data.status) {
                setError(res.data.message || "Could not log in.");
                return;
            }

            localStorage.setItem("auth_token", res.data.data.token);
            onClose();
            navigate("/admin/dashboard");
        } catch (err) {
            setError(err.response?.data?.message || "Could not log in. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <S.Overlay onClick={(e) => e.target === e.currentTarget && onClose()}>
            <S.Modal>
                <S.Header>
                    <div></div>
                    <S.Title>
                        <TrainFront size={20} />
                        LankaRail
                    </S.Title>
                    <S.CloseButton onClick={onClose}>✕</S.CloseButton>
                </S.Header>

                <form onSubmit={handleSubmit}>
                    <S.Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={isSubmitting}
                        autoFocus
                    />
                    <S.Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={isSubmitting}
                    />

                    {error && <S.ErrorText>{error}</S.ErrorText>}

                    <S.SubmitButton type="submit" disabled={isSubmitting}>
                        {isSubmitting && <Loader2 size={16} className="spin" />}
                        {isSubmitting ? "Logging in..." : "Log In"}
                    </S.SubmitButton>
                </form>
            </S.Modal>
        </S.Overlay>
    );
}