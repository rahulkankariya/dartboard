export function DashboardStats() {
  const stats = [
    { label: "System", value: "Online", subValue: "Ready" },
    { label: "Accuracy", value: "84.2%", subValue: "+2.4%" },
    { label: "Darts", value: "1,204", subValue: "Total" },
  ];

  return (
    <div className="grid grid-cols-3 gap-2 md:gap-4 mb-4 shrink-0">
      {stats.map((stat) => (
        <div key={stat.label} className="p-3 md:p-5 border border-app-border bg-app-text/3 rounded-sm">
          <p className="text-[8px] md:text-[10px] opacity-30 uppercase tracking-[0.2em] font-bold truncate mb-1">{stat.label}</p>
          <p className="text-xl md:text-3xl font-serif text-app-text leading-none">{stat.value}</p>
          <p className="text-[8px] opacity-20 uppercase tracking-tighter mt-1">{stat.subValue}</p>
        </div>
      ))}
    </div>
  );
}