export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 bg-slate-950 text-white">
      <div className="max-w-2xl text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-semibold uppercase tracking-wider">
          MIPS Training Center
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Maritime Integrated Port Simulator
        </h1>
        <p className="text-slate-400 text-sm sm:text-base">
          Taruna Training Simulation Demo — Operational Port Berthing
        </p>
      </div>
    </main>
  );
}
