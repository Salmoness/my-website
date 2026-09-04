export interface SmokeIslandProps {
  message: string;
}

export function SmokeIsland({ message }: SmokeIslandProps) {
  return (
    <div className="react-smoke-island bg-amber-500 text-slate-900 p-4 rounded-xl">
      <span className="font-mono text-sm">{message}</span>
    </div>
  );
}

export default SmokeIsland;
