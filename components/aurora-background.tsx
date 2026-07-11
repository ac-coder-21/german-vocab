export function AuroraBackground() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 overflow-hidden [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_75%)]"
    >
      <div className="bg-grid-slate absolute inset-0 opacity-[0.4] dark:opacity-[0.15]" />
      <div className="animate-aurora-1 absolute left-1/4 top-0 h-[32rem] w-[32rem] rounded-full bg-primary/25 blur-3xl dark:bg-primary/20" />
      <div className="animate-aurora-2 absolute right-1/4 top-1/3 h-[28rem] w-[28rem] rounded-full bg-chart-2/25 blur-3xl dark:bg-chart-2/20" />
      <div className="animate-aurora-3 absolute bottom-0 left-1/3 h-[26rem] w-[26rem] rounded-full bg-chart-4/20 blur-3xl dark:bg-chart-4/15" />
    </div>
  );
}
