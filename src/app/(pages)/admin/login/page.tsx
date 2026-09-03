"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeSlash } from "@phosphor-icons/react";

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/admin/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      router.push(redirectTo);
      router.refresh();
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="ayur-admin-login-page">
      <div className="ayur-admin-login-card">
        <div className="ayur-admin-login-logo">
          <img src="/images/logo.webp" alt="Parampara Divya Ayurvedic" />
        </div>

        <div className="ayur-heading-wrap ayur-admin-login-heading">
          <h5>Admin Access</h5>
          <h3>Welcome Back</h3>
          <p>Sign in to manage Parampara Divya Ayurvedic</p>
        </div>

        <form onSubmit={handleSubmit} className="ayur-admin-login-form">
          <div className="ayur-admin-form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              autoComplete="username"
              className="ayur-admin-input"
              placeholder="Enter your email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="ayur-admin-form-group">
            <label htmlFor="password">Password</label>
            <div className="ayur-admin-password-wrap">
              <input
                id="password"
                type={isPasswordVisible ? "text" : "password"}
                autoComplete="current-password"
                className="ayur-admin-input"
                placeholder="Enter your password..."
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setIsPasswordVisible((prev) => !prev)}
                className="ayur-admin-eye-btn"
                aria-label={
                  isPasswordVisible ? "Hide password" : "Show password"
                }
                tabIndex={-1}
              >
                {isPasswordVisible ? (
                  <EyeSlash size={20} weight="bold" />
                ) : (
                  <Eye size={20} weight="bold" />
                )}
              </button>
            </div>
          </div>

          {error && (
            <p className="ayur-admin-error" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="ayur-btn ayur-admin-submit-btn"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>

      <style jsx>{`
        .ayur-admin-login-page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background-color: var(--ayur-primary-lightcolor);
          background-image: url("/images/bg-leaf2.webp");
          background-repeat: no-repeat;
          background-position: top right;
          background-size: 240px auto;
        }

        .ayur-admin-login-card {
          width: 100%;
          max-width: 440px;
          background-color: var(--ayur-white-color);
          border-radius: 24px;
          padding: 48px 40px;
          box-shadow: 3px 4px 29.6px 0px #0000000f;
        }

        .ayur-admin-login-logo {
          display: flex;
          justify-content: center;
          margin-bottom: 24px;
        }

        .ayur-admin-login-logo img {
          height: 52px;
          width: auto;
          object-fit: contain;
        }

        .ayur-admin-login-heading {
          margin-bottom: 32px !important;
        }

        .ayur-admin-login-heading p {
          margin-top: 8px;
          font-size: 14px;
        }

        .ayur-admin-login-form {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .ayur-admin-form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .ayur-admin-form-group label {
          font-size: 13px;
          font-weight: 600;
          letter-spacing: 0.02em;
          text-transform: uppercase;
          color: var(--ayur-heading-color);
        }

        .ayur-admin-input {
          width: 100%;
          height: 48px !important;
          padding: 0 16px;
          background-color: var(--ayur-primary-lightcolor);
          border: 1px solid var(--ayur-border-color);
          border-radius: 10px;
          font-size: 15px;
          color: var(--ayur-heading-color);
          transition: border-color 0.2s ease;
        }

        .ayur-admin-input::placeholder {
          color: var(--ayur-text-color);
        }

        .ayur-admin-input:focus {
          border-color: var(--ayur-primary-color);
        }

        .ayur-admin-password-wrap {
          position: relative;
        }

        .ayur-admin-password-wrap .ayur-admin-input {
          padding-right: 48px;
        }

        .ayur-admin-eye-btn {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--ayur-text-color);
          cursor: pointer;
        }

        .ayur-admin-eye-btn:hover {
          color: var(--ayur-primary-color);
        }

        .ayur-admin-error {
          font-size: 14px;
          color: #d64646;
          font-weight: 500;
        }

        .ayur-admin-submit-btn {
          width: 100%;
          min-height: 48px;
          border: none;
          cursor: pointer;
        }

        .ayur-admin-submit-btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }

        .ayur-admin-submit-btn:hover::after {
          width: 300%;
          height: 900%;
        }

        @media (max-width: 480px) {
          .ayur-admin-login-card {
            padding: 36px 24px;
          }
        }
      `}</style>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={null}>
      <AdminLoginForm />
    </Suspense>
  );
}
