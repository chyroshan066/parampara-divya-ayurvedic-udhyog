"use client";

import { useState } from "react";
import Link from "next/link";
import styles from "@/styles/auth-card.module.css";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      setMessage(
        data.message ||
          "If an account exists for that email, we've sent password reset instructions."
      );
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`ayur-bgcover ${styles.section}`}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-5 col-md-7 col-sm-10">
            <div className={styles.card}>
              <div className={`ayur-heading-wrap ${styles.heading}`}>
                <h5>Account Recovery</h5>
                <h3>Forgot Your Password?</h3>
                <p>Enter your email and we&apos;ll send you reset instructions</p>
              </div>

              {message ? (
                <p className={styles.success}>{message}</p>
              ) : (
                <form onSubmit={handleSubmit} className={styles.form}>
                  <div className={styles.formGroup}>
                    <label htmlFor="email">Email Address</label>
                    <input
                      id="email"
                      type="email"
                      autoComplete="username"
                      className={styles.input}
                      placeholder="Enter your email..."
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  {error && (
                    <p className={styles.error} role="alert">
                      {error}
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`ayur-btn ${styles.submitBtn}`}
                  >
                    {isSubmitting ? "Sending..." : "Send Reset Link"}
                  </button>
                </form>
              )}

              <p className={styles.switch}>
                Remembered your password?{" "}
                <Link href="/login" className={styles.link}>
                  Back to sign in
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
