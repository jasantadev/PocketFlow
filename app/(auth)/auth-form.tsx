"use client";

import { useFormStatus } from "react-dom";

type AuthFormProps = {
  title: string;
  submitText: string;
  footerText: string;
  footerHref: string;
  footerLinkText: string;
  action: (formData: FormData) => void | Promise<void>;
  error?: string | undefined;
};

function SubmitButton({ text }: { text: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-md bg-slate-900 px-4 py-2 font-medium text-white transition hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-60"
    >
      {pending ? "Procesando..." : text}
    </button>
  );
}

export function AuthForm({
  title,
  submitText,
  footerText,
  footerHref,
  footerLinkText,
  action,
  error,
}: AuthFormProps) {
  return (
    <div className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h1 className="mb-6 text-2xl font-semibold text-slate-900">{title}</h1>
      <form action={action} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none ring-slate-300 transition focus:ring-2"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="mb-1 block text-sm font-medium text-slate-700"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            minLength={6}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-slate-900 outline-none ring-slate-300 transition focus:ring-2"
          />
        </div>
        {error ? (
          <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
            {error}
          </p>
        ) : null}
        <SubmitButton text={submitText} />
      </form>
      <p className="mt-4 text-sm text-slate-600">
        {footerText}{" "}
        <a href={footerHref} className="font-medium text-slate-900 underline">
          {footerLinkText}
        </a>
      </p>
    </div>
  );
}
