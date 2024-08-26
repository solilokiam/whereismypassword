import Link from "next/link";
import { BuildingStorefrontIcon } from "@heroicons/react/24/outline";
import { getSession } from "@/lib/session/session";
import { find } from "@/lib/user/userStorage";

export default async function Home() {
  const session = await getSession();
  const email = session?.data.email;

  const user = email ? await find(email) : null;

  return (
    <div className="bg-white">
      <header className="absolute inset-x-0 top-0 z-50">
        <nav
          aria-label="Global"
          className="flex items-center justify-between p-6 lg:px-8"
        >
          <div className="flex lg:flex-1">
            <Link href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">Your Company</span>
              <BuildingStorefrontIcon className="size-12" />
            </Link>
          </div>
          <div className="flex gap-x-12"></div>
          <div className="flex flex-1">
            {!email ? (
              <Link
                href="/signin"
                className="text-sm font-semibold leading-6 text-gray-900"
              >
                Log in <span aria-hidden="true">&rarr;</span>
              </Link>
            ) : (
              <div className="text-sm font-semibold leading-6 text-gray-900">
                {email}
              </div>
            )}
          </div>
        </nav>
      </header>

      <div className="relative isolate px-6 pt-14 lg:px-8">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          />
        </div>
        <div className="mx-auto max-w-2xl py-32">
          {email ? (
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Welcome again
              </h1>
              <h2 className="mt-6 text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
                Your key info is:
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                {user?.devices.map((device) => (
                  <div
                    key={device.credentialID}
                    className="mx-auto mx-w-2xl my-2"
                  >
                    <div className="flex items-center bg-gray-900 p-4 rounded-md max-w-xl mx-auto mt-4">
                      <span className="text-teal-500">Email</span>
                      <div className="bg-gray-900 text-white p-0.5 outline-none ml-2 w-full">
                        {email}
                      </div>
                    </div>
                    <div className="flex items-center bg-gray-900 p-4 rounded-md max-w-xl mx-auto mt-4">
                      <span className="text-teal-500">CredentialID</span>
                      <div className="bg-gray-900 text-white p-0.5 outline-none ml-2 w-full">
                        {device.credentialID}
                      </div>
                    </div>
                    <div className="flex items-center bg-gray-900 p-4 rounded-md max-w-xl mx-auto mt-4">
                      <span className="text-teal-500">CredentialPublicKey</span>
                      <div className="bg-gray-900 text-white p-0.5 outline-none ml-2 w-full break-all">
                        {device.credentialPublicKey}
                      </div>
                    </div>
                  </div>
                ))}
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link
                  href="#"
                  className="text-sm font-semibold leading-6 text-gray-900"
                >
                  Learn more <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          ) : (
            <div className="text-center">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                Simple Passkeys Site
              </h1>
              <p className="mt-6 text-lg leading-8 text-gray-600">
                Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui
                lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat
                fugiat aliqua
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <Link
                  href="/signup"
                  className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Get started
                </Link>
                <Link
                  href="#"
                  className="text-sm font-semibold leading-6 text-gray-900"
                >
                  Learn more <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
