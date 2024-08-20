"use client";

import { startRegistration } from "@simplewebauthn/browser";
import {
  generateWebAuthnRegistrationOptions,
  verifyWebAuthnRegistration,
} from "../../lib/auth/webauthn";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  BuildingStorefrontIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

export default function Signup() {
  const router = useRouter();
  const [errorText, setErrorText] = useState("");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setErrorText("");

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email")?.toString();

    console.log(email);

    if (!email) {
      return;
    }

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

    router.push("/");
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        <BuildingStorefrontIcon className="size-12 mx-auto" />
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
          Create you account
        </h2>
      </div>

      {errorText && (
        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <div
            className="bg-red-100 border-t-4 border-red-500 rounded-b text-red-900 px-4 py-3 shadow-md"
            role="alert"
          >
            <div className="flex">
              <div className="py-1 mr-1">
                <ExclamationCircleIcon className="size-9" />
              </div>
              <div>
                <p className="font-bold">
                  There was an error while registering
                </p>
                <p className="text-sm">{errorText}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6 text-gray-900"
            >
              Email address
            </label>
            <div className="mt-2">
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Sign up
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
