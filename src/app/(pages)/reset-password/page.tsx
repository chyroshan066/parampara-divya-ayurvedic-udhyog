"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Eye, EyeSlash } from "@phosphor-icons/react";
import styles from "@/styles/auth-card.module.css";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";
  const email = searchParams.get("email") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const missingLink = !token || !email;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      setIsDone(true);
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
                <h3>Set A New Password</h3>
                <p>Choose a new password for your account</p>
              </div>

              {missingLink ? (
                <p className={styles.error}>
                  This reset link is missing or invalid. Please request a new
                  one from the{" "}
                  <Link href="/forgot-password" className={styles.link}>
                    forgot password
                  </Link>{" "}
                  page.
                </p>
              ) : isDone ? (
                <p className={styles.success}>
                  Your password has been updated.{" "}
                  <Link href="/login" className={styles.link}>
                    Sign in
                  </Link>
                </p>
              ) : (
                <form onSubmit={handleSubmit} className={styles.form}>
                  <div className={styles.formGroup}>
                    <label htmlFor="password">New Password</label>
                    <div className={styles.passwordWrap}>
                      <input
                        id="password"
                        type={isPasswordVisible ? "text" : "password"}
                        autoComplete="new-password"
                        className={styles.input}
                        placeholder="Enter a new password..."
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        minLength={8}
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setIsPasswordVisible((prev) => !prev)}
                        className={styles.eyeBtn}
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

                  <div className={styles.formGroup}>
                    <label htmlFor="confirmPassword">Confirm New Password</label>
                    <input
                      id="confirmPassword"
                      type={isPasswordVisible ? "text" : "password"}
                      autoComplete="new-password"
                      className={styles.input}
                      placeholder="Re-enter your new password..."
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      minLength={8}
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
                    {isSubmitting ? "Updating..." : "Update Password"}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <ResetPasswordForm />
    </Suspense>
  );
}
