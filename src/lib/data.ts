import xml2js from "xml2js";

const parser = new xml2js.Parser({
  explicitArray: false,
});
const MAX_ATTEMPTS = 5;

export async function getUserData(username: string) {
  const data = await fetch(
    `https://www.boardgamegeek.com/xmlapi2/user?name=${username}`
  );
  const xml = await data.text();
  return parseString(xml, (err, data) => {
    if (err) {
      console.log("Error parsing XML", err);
      throw new Error("Error parsing XML");
    }
    console.log(data);
    return data;
  });
}

export async function getUserCollection(
  username: string,
  attempts: number = 0
) {
  try {
    const result = await fetch(
      `https://www.boardgamegeek.com/xmlapi/collection/${username}?own=1&subtype=boardgame`
    );
    console.log(result.status);
    if (attempts > MAX_ATTEMPTS) {
      throw new Error("Max attempts reached");
    }
    if (result.status === 202) {
      return setTimeout(() => getUserCollection(username, attempts + 1), 1000);
    }
    const xml = await result.text();
    const data = await parser.parseStringPromise(xml);
    return data;
  } catch (err) {
    const error = err as Error;
    console.error(error.message);
    throw new Error(`Error parsing XML: ${error.message}`);
  }
}

export async function getGeekListData(attempts: number = 0) {
  try {
    const result = await fetch(
      `http://boardgamegeek.com/xmlapi/geeklist/186909?comments=1`
    );

    console.log(result.status);
    if (attempts > MAX_ATTEMPTS) {
      throw new Error("Max attempts reached");
    }
    if (result.status === 202) {
      return setTimeout(() => getGeekListData(attempts + 1), 1000);
    }
    const xml = await result.text();
    const data = await parser.parseStringPromise(xml);
    return data;
  } catch (err) {
    const error = err as Error;
    console.error(error.message);
    throw new Error(`Error parsing XML: ${error.message}`);
  }
}
