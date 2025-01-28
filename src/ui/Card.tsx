type CardProps = {
  game: string;
  gameId: string;
  geekListItemId: string;
  urls: string[];
};

export function Card({ game, geekListItemId, urls }: CardProps) {
  return (
    <div className="card bg-base-200 shadow mt-5 w-full">
      <div className="card-body">
        <a
          href={`https://boardgamegeek.com/geeklist/186909/item/${geekListItemId}`}
          className="link link-hover"
        >
          {game}
        </a>
        <table className="table">
          <tbody>
            {urls.map((url) => (
              <tr key={url}>
                <td>
                  <a href={url} className="link link-hover">
                    {url}
                  </a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
