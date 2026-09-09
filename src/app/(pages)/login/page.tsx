// "use client";

// import { Suspense, useState } from "react";
// import Link from "next/link";
// import { useRouter, useSearchParams } from "next/navigation";
// import { Eye, EyeSlash } from "@phosphor-icons/react";
// import styles from "@/styles/auth-card.module.css";

// function CustomerLoginForm() {
//   const router = useRouter();
//   const searchParams = useSearchParams();
//   const redirectTo = searchParams.get("redirectTo") || "/";

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [isPasswordVisible, setIsPasswordVisible] = useState(false);
//   const [error, setError] = useState<string | null>(null);
//   const [isSubmitting, setIsSubmitting] = useState(false);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setError(null);
//     setIsSubmitting(true);

//     try {
//       const res = await fetch("/api/auth/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ email, password }),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         setError(data.error || "Something went wrong. Please try again.");
//         return;
//       }

//       router.push(redirectTo);
//       router.refresh();
//     } catch {
//       setError("Something went wrong. Please try again.");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   return (
//     <div className={`ayur-bgcover ${styles.section}`}>
//       <div className="container">
//         <div className="row justify-content-center">
//           <div className="col-lg-5 col-md-7 col-sm-10">
//             <div className={styles.card}>
//               <div className={`ayur-heading-wrap ${styles.heading}`}>
//                 <h5>Welcome Back</h5>
//                 <h3>Sign In To Your Account</h3>
//                 <p>Sign in to track orders and check out faster</p>
//               </div>

//               <form onSubmit={handleSubmit} className={styles.form}>
//                 <div className={styles.formGroup}>
//                   <label htmlFor="email">Email Address</label>
//                   <input
//                     id="email"
//                     type="email"
//                     autoComplete="username"
//                     className={styles.input}
//                     placeholder="Enter your email..."
//                     value={email}
//                     onChange={(e) => setEmail(e.target.value)}
//                     required
//                   />
//                 </div>

//                 <div className={styles.formGroup}>
//                   <div className={styles.labelRow}>
//                     <label htmlFor="password">Password</label>
//                     <Link href="/forgot-password" className={styles.linkSmall}>
//                       Forgot password?
//                     </Link>
//                   </div>
//                   <div className={styles.passwordWrap}>
//                     <input
//                       id="password"
//                       type={isPasswordVisible ? "text" : "password"}
//                       autoComplete="current-password"
//                       className={styles.input}
//                       placeholder="Enter your password..."
//                       value={password}
//                       onChange={(e) => setPassword(e.target.value)}
//                       required
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setIsPasswordVisible((prev) => !prev)}
//                       className={styles.eyeBtn}
//                       aria-label={isPasswordVisible ? "Hide password" : "Show password"}
//                       tabIndex={-1}
//                     >
//                       {isPasswordVisible ? (
//                         <EyeSlash size={20} weight="bold" />
//                       ) : (
//                         <Eye size={20} weight="bold" />
//                       )}
//                     </button>
//                   </div>
//                 </div>

//                 {error && (
//                   <p className={styles.error} role="alert">
//                     {error}
//                   </p>
//                 )}

//                 <button
//                   type="submit"
//                   disabled={isSubmitting}
//                   className={`ayur-btn ${styles.submitBtn}`}
//                 >
//                   {isSubmitting ? "Signing in..." : "Sign In"}
//                 </button>
//               </form>

//               <p className={styles.switch}>
//                 New here?{" "}
//                 <Link href="/register" className={styles.link}>
//                   Create an account
//                 </Link>
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default function CustomerLoginPage() {
//   return (
//     <Suspense fallback={null}>
//       <CustomerLoginForm />
//     </Suspense>
//   );
// }




































"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeSlash } from "@phosphor-icons/react";
import styles from "@/styles/auth-card.module.css";
import { useToast } from "@/components/ToastProvider";

function CustomerLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/";
  const { showToast } = useToast();

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
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      showToast("success", "Welcome back! You're signed in.");
      router.push(redirectTo);
      router.refresh();
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
                <h5>Welcome Back</h5>
                <h3>Sign In To Your Account</h3>
                <p>Sign in to track orders and check out faster</p>
              </div>

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

                <div className={styles.formGroup}>
                  <div className={styles.labelRow}>
                    <label htmlFor="password">Password</label>
                    <Link href="/forgot-password" className={styles.linkSmall}>
                      Forgot password?
                    </Link>
                  </div>
                  <div className={styles.passwordWrap}>
                    <input
                      id="password"
                      type={isPasswordVisible ? "text" : "password"}
                      autoComplete="current-password"
                      className={styles.input}
                      placeholder="Enter your password..."
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setIsPasswordVisible((prev) => !prev)}
                      className={styles.eyeBtn}
                      aria-label={isPasswordVisible ? "Hide password" : "Show password"}
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
                  <p className={styles.error} role="alert">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`ayur-btn ${styles.submitBtn}`}
                >
                  {isSubmitting ? "Signing in..." : "Sign In"}
                </button>
              </form>

              <p className={styles.switch}>
                New here?{" "}
                <Link href="/register" className={styles.link}>
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CustomerLoginPage() {
  return (
    <Suspense fallback={null}>
      <CustomerLoginForm />
    </Suspense>
  );
}