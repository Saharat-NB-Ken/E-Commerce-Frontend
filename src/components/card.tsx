
interface CardProps {
  title: string;
  value: string | number;
  subtitle?: string;
}

export default function Card({ title, value, subtitle }: CardProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="text-sm text-gray-500">{title}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
      {subtitle && <div className="text-xs text-gray-400 mt-1">{subtitle}</div>}
    </div>
  );
}
