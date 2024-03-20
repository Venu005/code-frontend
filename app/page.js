import Image from "next/image";
import { ProfileForm } from "./_form/page";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="rounded-lg border-black border-4 px-4 py-4 h-full w-full">
        <ProfileForm />
      </div>
    </main>
  );
}
