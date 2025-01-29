export const runtime = "edge";

import {
  GeekListDataItem,
  getGeekListData,
  getUserCollection,
} from "@/lib/data";
import { Card } from "@/ui/Card";

type OwnedItem = GeekListDataItem & {
  urls: string[];
};

export default async function Page({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const userData = await getUserCollection(username);
  const geekListData = await getGeekListData();

  function extractUrls(text: string): string[] {
    const urlRegex =
      /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])/gi;

    const result = [...text.matchAll(urlRegex)];
    return result.map((match) => match[0]);
  }

  const ownedItems: OwnedItem[] = userData.items.item.reduce((accum, item) => {
    const objectId = item.$.objectid;
    const geekListItem = geekListData.geeklist.item.find(
      (item) => item.$.objectid === objectId
    );
    if (!geekListItem) return accum;
    let urls = [];

    urls.push(extractUrls(geekListItem.body));

    if (geekListItem.comment) {
      const commentsUrls = Array.isArray(geekListItem.comment)
        ? geekListItem.comment.map((comment) => extractUrls(comment._))
        : [extractUrls(geekListItem.comment._)];
      urls.push(...commentsUrls);
    }

    urls = [...new Set(urls.flat())];
    return [
      ...accum,
      {
        ...geekListItem,
        urls,
      } as OwnedItem,
    ];
  }, [] as OwnedItem[]);

  return (
    <div className="flex flex-row flex-wrap gap-4 p-4">
      {ownedItems.map((item) => (
        <Card
          key={item.$.id}
          game={item.$.objectname}
          gameId={item.$.objectid}
          geekListItemId={item.$.id}
          urls={item.urls}
        />
      ))}
      {/* <pre>{JSON.stringify(ownedItems, null, 2)}</pre> */}
    </div>
  );
}
