import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden font-sans">
      {/* Background image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/coffee-barista.jpg"
          alt="Barista Academy"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-[#3b2e2e]/80"></div>
      </div>

      {/* Centered Content */}
      <div className="flex flex-col items-center justify-center min-h-screen text-center px-6">
        <h1 className="text-4xl md:text-6xl font-bold text-[#f6f4f1] drop-shadow-lg">
          Barista Teaching Academy
        </h1>
        <p className="mt-4 text-lg md:text-xl text-[#e0cfc1] max-w-2xl drop-shadow-md leading-relaxed">
          Welcome to your one-stop platform to manage everything from student
          enrollments to course tracking and financial records. Whether you're
          just starting or already running a successful barista school, we’ve
          built the tools you need — brewed to perfection.
        </p>
        <p className="mt-6 text-base md:text-lg text-[#d8bfa5] max-w-xl drop-shadow-md">
          Easily record student details, track payments, log income & expenses,
          generate performance reports, and focus on what you love — teaching
          the art of coffee.
        </p>

        <Link href="/dashboard">
          <button className="mt-10 px-8 py-3 bg-[#7b4b3a] text-white text-lg font-semibold rounded-xl shadow-xl hover:bg-[#5e362c] focus:ring-4 focus:ring-[#a47e65] transition-all duration-300">
            Visit Dashboard
          </button>
        </Link>
      </div>
    </main>
  );
}
