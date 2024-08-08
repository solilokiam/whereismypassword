"use client";

import {
  startAuthentication,
  startRegistration,
} from "@simplewebauthn/browser";
import {
  generateWebAuthnLoginOptions,
  generateWebAuthnRegistrationOptions,
  verifyWebAuthnLogin,
  verifyWebAuthnRegistration,
} from "../lib/auth/webauthn";
import styles from "./page.module.css";
import { useState } from "react";

export default function Home() {
  const [errorText, setErrorText] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email")?.toString();
    const type = formData.get("type")?.toString();

    if (!email) {
      return;
    }

    if (type === "register") {
      const response = await generateWebAuthnRegistrationOptions(email);

      if (!response.success || !response.data) {
        setErrorText(response.message ?? "Something went wrong!");
        return;
      }

      const localResponse = await startRegistration(response.data);
      const verifyResponse = await verifyWebAuthnRegistration(localResponse);

      if (!verifyResponse.success) {
        setErrorText(verifyResponse.message ?? "Something went wrong!");
        return;
      }

      alert("Registration successful!");
    } else {
      const response = await generateWebAuthnLoginOptions(email);

      if (!response.success || !response.data) {
        setErrorText(response.message ?? "Something went wrong!");
        return;
      }

      const localResponse = await startAuthentication(response.data);
      const verifyResponse = await verifyWebAuthnLogin(localResponse);

      if (!verifyResponse.success) {
        setErrorText(verifyResponse.message ?? "Something went wrong!");
        return;
      }

      setErrorText("Login successful!");
    }
  };

  return (
    <main className={styles.main}>
      {errorText ?? <div>{errorText}</div>}
      <form onSubmit={handleSubmit} className={styles.formContainer}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          className={styles.inputField}
        />

        <div className={styles.radioGroup}>
          <label className={styles.label}>
            <input
              type="radio"
              name="type"
              value="register"
              defaultChecked
              className={styles.radioInput}
            />
            Register
          </label>

          <label className={styles.label}>
            <input
              type="radio"
              name="type"
              value="login"
              className={styles.radioInput}
            />
            Login
          </label>
        </div>

        <input type="submit" value="Submit" className={styles.submitButton} />
      </form>
    </main>
  );
}
