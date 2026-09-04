// "use client";

// import { useState, type ChangeEvent, type FormEvent } from "react";

// interface FormState {
//   firstName: string;
//   lastName: string;
//   email: string;
//   subject: string;
//   message: string;
// }

// const INITIAL_STATE: FormState = {
//   firstName: "",
//   lastName: "",
//   email: "",
//   subject: "",
//   message: "",
// };

// type Status = "idle" | "submitting" | "success" | "error";

// export const Contact = () => {
//   const [form, setForm] = useState<FormState>(INITIAL_STATE);
//   const [status, setStatus] = useState<Status>("idle");
//   const [errorMessage, setErrorMessage] = useState<string | null>(null);

//   const handleChange =
//     (field: keyof FormState) =>
//     (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
//       setForm((prev) => ({ ...prev, [field]: e.target.value }));
//     };

//   const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     setStatus("submitting");
//     setErrorMessage(null);

//     try {
//       const res = await fetch("/api/contact", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(form),
//       });

//       const data = await res.json();

//       if (!res.ok) {
//         setErrorMessage(data.error ?? "Something went wrong. Please try again.");
//         setStatus("error");
//         return;
//       }

//       setStatus("success");
//       setForm(INITIAL_STATE);
//     } catch {
//       setErrorMessage("Network error. Please check your connection and try again.");
//       setStatus("error");
//     }
//   };

//   const isSubmitting = status === "submitting";

//   return (
//     <div className="ayur-bgcover ayur-contactpage-wrapper">
//       <div className="container">
//         <div className="ayur-contactpage-box">
//           <div className="ayur-contact-map">
//             <iframe
//               src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3531.894235842704!2d85.36133587423706!3d27.720551624911174!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb197bd3686a41%3A0xbaad8e64eb67d9eb!2sParampara%20Divya%20Ayurvedic%20%7C%20Ayurvedic%20Clinic%20in%20Boudha%2C%20Kathmandu!5e0!3m2!1sen!2snp!4v1788407150239!5m2!1sen!2snp"
//               loading="lazy"
//               referrerPolicy="strict-origin-when-cross-origin"
//               allowFullScreen
//             />
//           </div>
//           <div className="ayur-contact-pageinfo">
//             <div className="ayur-contact-heading">
//               <h3>Get in touch with us</h3>
//               <p>
//                 Have a question about our products or services? Reach out to
//                 us and our team will get back to you as soon as possible.
//               </p>
//             </div>
//             <div className="ayur-contact-form-wrapper">
//               <form onSubmit={handleSubmit} className="ayur-contact-form">
//                 <div className="row">
//                   <div className="col-lg-6 col-md-6 col-sm-6">
//                     <div className="ayur-form-input">
//                       <input
//                         type="text"
//                         className="form-control require"
//                         placeholder="First Name"
//                         value={form.firstName}
//                         onChange={handleChange("firstName")}
//                         required
//                         disabled={isSubmitting}
//                       />
//                     </div>
//                   </div>
//                   <div className="col-lg-6 col-md-6 col-sm-6">
//                     <div className="ayur-form-input">
//                       <input
//                         type="text"
//                         className="form-control require"
//                         placeholder="Last Name"
//                         value={form.lastName}
//                         onChange={handleChange("lastName")}
//                         required
//                         disabled={isSubmitting}
//                       />
//                     </div>
//                   </div>
//                   <div className="col-lg-6 col-md-6 col-sm-6">
//                     <div className="ayur-form-input">
//                       <input
//                         type="email"
//                         className="form-control require"
//                         name="email"
//                         placeholder="Your Email"
//                         value={form.email}
//                         onChange={handleChange("email")}
//                         required
//                         disabled={isSubmitting}
//                       />
//                     </div>
//                   </div>
//                   <div className="col-lg-6 col-md-6 col-sm-6">
//                     <div className="ayur-form-input">
//                       <input
//                         type="text"
//                         className="form-control require"
//                         placeholder="Subject"
//                         value={form.subject}
//                         onChange={handleChange("subject")}
//                         disabled={isSubmitting}
//                       />
//                     </div>
//                   </div>
//                   <div className="col-lg-12 col-md-12">
//                     <div className="ayur-form-input">
//                       <textarea
//                         name="your-message"
//                         cols={3}
//                         rows={8}
//                         className="form-control require"
//                         placeholder="Your Message..."
//                         value={form.message}
//                         onChange={handleChange("message")}
//                         required
//                         disabled={isSubmitting}
//                       />
//                     </div>
//                   </div>
//                   <div className="col-lg-12 col-md-12">
//                     <button
//                       type="submit"
//                       className="ayur-btn ayur-con-btn submitForm"
//                       disabled={isSubmitting}
//                     >
//                       {isSubmitting ? "Sending..." : "Send Message"}
//                     </button>
//                     <div className="response">
//                       {status === "success" && (
//                         <p style={{ color: "green" }}>
//                           Thanks! Your message has been sent — we&apos;ll get
//                           back to you soon.
//                         </p>
//                       )}
//                       {status === "error" && (
//                         <p style={{ color: "red" }}>{errorMessage}</p>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };
























"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { Toast, type ToastType } from "@/components/Toast";

interface FormState {
  firstName: string;
  lastName: string;
  email: string;
  subject: string;
  message: string;
}

const INITIAL_STATE: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  subject: "",
  message: "",
};

type SubmitState = "idle" | "submitting";

export const Contact = () => {
  const [form, setForm] = useState<FormState>(INITIAL_STATE);
  const [submitState, setSubmitState] = useState<SubmitState>("idle");
  const [toast, setToast] = useState<{ type: ToastType; message: string } | null>(
    null
  );

  const handleChange =
    (field: keyof FormState) =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setForm((prev) => ({ ...prev, [field]: e.target.value }));
    };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitState("submitting");
    setToast(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setToast({
          type: "error",
          message: data.error ?? "Something went wrong. Please try again.",
        });
        return;
      }

      setToast({
        type: "success",
        message: "Thanks! Your message has been sent — we'll get back to you soon.",
      });
      setForm(INITIAL_STATE);
    } catch {
      setToast({
        type: "error",
        message: "Network error. Please check your connection and try again.",
      });
    } finally {
      setSubmitState("idle");
    }
  };

  const isSubmitting = submitState === "submitting";

  return (
    <div className="ayur-bgcover ayur-contactpage-wrapper">
      <div className="container">
        <div className="ayur-contactpage-box">
          <div className="ayur-contact-map">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3531.894235842704!2d85.36133587423706!3d27.720551624911174!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39eb197bd3686a41%3A0xbaad8e64eb67d9eb!2sParampara%20Divya%20Ayurvedic%20%7C%20Ayurvedic%20Clinic%20in%20Boudha%2C%20Kathmandu!5e0!3m2!1sen!2snp!4v1788407150239!5m2!1sen!2snp"
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
              allowFullScreen
            />
          </div>
          <div className="ayur-contact-pageinfo">
            <div className="ayur-contact-heading">
              <h3>Get in touch with us</h3>
              <p>
                Have a question about our products or services? Reach out to
                us and our team will get back to you as soon as possible.
              </p>
            </div>
            <div className="ayur-contact-form-wrapper">
              <form onSubmit={handleSubmit} className="ayur-contact-form">
                <div className="row">
                  <div className="col-lg-6 col-md-6 col-sm-6">
                    <div className="ayur-form-input">
                      <input
                        type="text"
                        className="form-control require"
                        placeholder="First Name"
                        value={form.firstName}
                        onChange={handleChange("firstName")}
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-6">
                    <div className="ayur-form-input">
                      <input
                        type="text"
                        className="form-control require"
                        placeholder="Last Name"
                        value={form.lastName}
                        onChange={handleChange("lastName")}
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-6">
                    <div className="ayur-form-input">
                      <input
                        type="email"
                        className="form-control require"
                        name="email"
                        placeholder="Your Email"
                        value={form.email}
                        onChange={handleChange("email")}
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  <div className="col-lg-6 col-md-6 col-sm-6">
                    <div className="ayur-form-input">
                      <input
                        type="text"
                        className="form-control require"
                        placeholder="Subject"
                        value={form.subject}
                        onChange={handleChange("subject")}
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12">
                    <div className="ayur-form-input">
                      <textarea
                        name="your-message"
                        cols={3}
                        rows={8}
                        className="form-control require"
                        placeholder="Your Message..."
                        value={form.message}
                        onChange={handleChange("message")}
                        required
                        disabled={isSubmitting}
                      />
                    </div>
                  </div>
                  <div className="col-lg-12 col-md-12">
                    <button
                      type="submit"
                      className="ayur-btn ayur-con-btn submitForm"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
};