import PulzShell from "@/components/PulzShell";

type Props = {
  params: { id: string };
};

export default function GameDetailsPage({ params }: Props) {
  const { id } = params;

  return (
    <PulzShell
      title={`Демо‑игра ${id}`}
      subtitle="В продакшене здесь будет iframe от игрового провайдера (например, SlotMatrix / EveryMatrix, Spribe и др.). Сейчас — статичный mock‑экран."
    >
      <div className="space-y-4 text-sm text-slate-200">
        <div className="aspect-[16/9] overflow-hidden rounded-3xl border border-white/10 bg-[radial-gradient(circle_at_top,_#ef4444,_transparent_60%),radial-gradient(circle_at_bottom,_#22c55e,_transparent_60%)]">
          <div className="flex h-full flex-col items-center justify-center gap-2 bg-black/40 text-center">
            <p className="text-base font-semibold text-white">
              Демо‑iframe игры <span className="text-pulzRed">{id}</span>
            </p>
            <p className="max-w-md text-xs text-slate-200">
              Здесь фронт просто показывает контейнер. На бою сюда подставляем
              URL от провайдера (по токену с бэкенда) и игра загружается в
              iframe.
            </p>
          </div>
        </div>
        <ul className="text-[11px] text-slate-300 space-y-1">
          <li>• В демо‑версии реальные ставки и выигрыши отключены.</li>
          <li>• Можно подключить crash‑игры, слоты, live‑казино через API.</li>
          <li>• Страница уже готова к интеграции бэкенда WynixBet.</li>
        </ul>
      </div>
    </PulzShell>
  );
}
