interface GameParams {
  params: {
    id: string;
  };
}

export default function GamePage({ params }: GameParams) {
  const games = {
    robinson: {
      id: "robinson",
      name: "RobinzON Island",
      provider: "Pulz Originals",
      description: "Эксклюзивная игра Pulz Casino.",
    },
  };

  const game = games[params.id];

  if (!game) {
    return (
      <div className="text-center text-slate-300 mt-20">
        Игра не найдена 😢
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-50">
        {game.name}
      </h1>

      <p className="text-sm text-slate-300">{game.description}</p>

      <iframe
        src="/robinzON/index.html"
        className="w-full h-[80vh] rounded-2xl border border-slate-800"
      />
    </div>
  );
}
