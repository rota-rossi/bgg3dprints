import xml2js from "xml2js";
import fetchRetry from "fetch-retry";

const fetch = fetchRetry(global.fetch);

export type UserItemCollection = {
  $: {
    objecttype: string;
    objectid: string;
    subtype: string;
    collid: string;
  };
  name: {
    _: string;
    $: {
      sortIndex: string;
    };
  };
  yearpublished: string;
  image: string;
  thumbnail: string;
};

type UserCollection = {
  items: {
    $: {
      totalItems: string;
    };
    item: UserItemCollection[];
  };
};

type GeekListItemComment = {
  _: string;
  $: {
    username: string;
    date: string;
    postdate: string;
    editdate: string;
    thumbs: string;
  };
};

export type GeekListDataItem = {
  $: {
    id: string;
    objectid: string;
    objectname: string;
  };
  body: string;
  comment: GeekListItemComment | GeekListItemComment[];
};

type GeekListData = {
  geeklist: {
    $: {
      id: string;
      termsofuse: string;
    };
    item: GeekListDataItem[];
  };
};

const parser = new xml2js.Parser({
  explicitArray: false,
});

export async function getUserData(username: string) {
  try {
    const result = await fetch(
      `https://www.boardgamegeek.com/xmlapi2/user?name=${username}`
    );
    const xml = await result.text();
    const data = await parser.parseStringPromise(xml);
    return data;
  } catch (err) {
    const error = err as Error;
    console.error(error.message);
    throw new Error(`Error parsing XML: ${error.message}`);
  }
}

export async function getUserCollection(
  username: string
): Promise<UserCollection> {
  try {
    const result = await fetch(
      `https://www.boardgamegeek.com/xmlapi/collection/${username}?own=1&subtype=boardgame`,
      {
        retries: 5,
        retryDelay: 1000,
        retryOn: [202],
      }
    );
    const xml = await result.text();
    const data = (await parser.parseStringPromise(xml)) as UserCollection;
    return data;
  } catch (err) {
    const error = err as Error;
    console.error(error.message);
    throw new Error(`Error parsing XML: ${error.message}`);
  }
}

export async function getGeekListData() {
  try {
    const result = await fetch(
      `http://boardgamegeek.com/xmlapi/geeklist/186909?comments=1`,
      {
        retries: 5,
        retryDelay: 1000,
        retryOn: [202],
      }
    );
    const xml = await result.text();
    const data = (await parser.parseStringPromise(xml)) as GeekListData;
    return data;
  } catch (err) {
    const error = err as Error;
    console.error(error.message);
    throw new Error(`Error parsing XML: ${error.message}`);
  }
}
