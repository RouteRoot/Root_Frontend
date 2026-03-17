export default function Topbar() {
  return (
    <div className="flex justify-between items-center mb-6">
      <div>
        <h2 className="text-xl font-semibold text-gray-900">
          민서님의 루트 🌱
        </h2>
        <p className="text-sm text-gray-500">오늘도 목표에 가까워지고 있어요</p>
      </div>

      <div className="flex items-center gap-4">
        <div className="text-gray-400">🔔</div>
        <div className="w-8 h-8 rounded-full bg-gray-200" />
      </div>
    </div>
  );
}
