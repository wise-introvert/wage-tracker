// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import fetch, { Response } from "node-fetch";
import cheerio from "cheerio";

type Data = {
  [key: string]: string | number;
};

type Query = {
  salary: string;
  from: "hour" | "day" | "week" | "month" | "year";
  region:
    | "Alberta"
    | "British Columbia"
    | "Manitoba"
    | "New Brunswick"
    | "Newfoundland and Labrador"
    | "Northwest Territories"
    | "Nova Scotia"
    | "Nunavut"
    | "Ontario"
    | "Prince Edward Island"
    | "Quebec"
    | "Saskatchewan"
    | "Yukon";
};

const sanitize = (data: string, toFloat: boolean = false): number | string => {
  const cleaned: string = data
    .replace(/[\n\*]/gi, "")
    .trim()
    .replace(/[ ]{1,}\?.*/gi, "")
    .replace(/[\$\%\-]/gi, "")
    .trim();

  return toFloat ? parseFloat(cleaned) : cleaned;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<{ data: Data }>
): Promise<void> {
  const { salary, from, region }: Query = req.query as Query;
  const url: string = `https://ca.talent.com/tax-calculator?salary=${salary}&from=${from}&region=${region}`;

  const response: Response = await fetch(url, {
    headers: {
      accept:
        "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
      "accept-language": "en-US,en;q=0.9",
      "sec-fetch-dest": "document",
      "sec-fetch-mode": "navigate",
      "sec-fetch-site": "same-origin",
      "sec-fetch-user": "?1",
      "sec-gpc": "1",
      "upgrade-insecure-requests": "1",
    },
    referrer:
      "https://ca.talent.com/tax-calculator?salary=14.25&from=hour&region=Ontario",
    referrerPolicy: "strict-origin-when-cross-origin",
    body: null,
    method: "GET",
    mode: "cors",
    credentials: "include",
  });
  const text: string = await response.text();
  const $ = cheerio.load(text);
  const outerDiv: cheerio.Cheerio = $(
    "#taxes > div:nth-child(2) > div.c-card.c-card--bottom > div > div.l-card__deductions-holder"
  );
  const divs = outerDiv.children();
  let data: { [key: string]: number | string } = {};
  for (let i: number = 0; i < divs.length; i++) {
    const children = $(divs[i]).children();
    if (children.length == 2) {
      const firstChild = sanitize($(children[0]).text());
      const lastChild = sanitize($(children[1]).text(), true);

      data[firstChild] = lastChild;
    }
  }

  res.status(200).json({
    data,
  });
}
