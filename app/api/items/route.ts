import { NextResponse } from 'next/server';

export async function GET() {
  const affiliateId = process.env.DMM_AFFILIATE_ID?.trim();
  const apiId = process.env.DMM_API_ID?.trim();

  if (!affiliateId || !apiId) {
    // ... (省略)
  }

  // ▼▼▼【変更点】女優やメーカーの型を定義します ▼▼▼
  type ApiNamedItem = {
    name: string;
    id: string;
  };

  try {
    const params = new URLSearchParams({
      api_id: apiId,
      affiliate_id: affiliateId,
      site: 'FANZA',
      service: 'digital',
      floor: 'videoa',
      hits: '100',
      sort: 'rank',
    });

    const requestUrl = `https://api.dmm.com/affiliate/v3/ItemList?${params}`;

    const response = await fetch(requestUrl);

    if (!response.ok) {
      throw new Error(`APIからの応答が正常ではありません: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.result || !data.result.items || data.result.items.length === 0) {
      throw new Error('APIから有効な商品が取得できませんでした。');
    }

    const items = data.result.items;
    const randomIndex = Math.floor(Math.random() * items.length);
    const randomItem = items[randomIndex];

    const formattedItem = {
      id: randomItem.content_id,
      title: randomItem.title,
      affiliateURL: randomItem.affiliateURL,
      movieURL: randomItem.sampleMovieURL?.size_720_480 || randomItem.sampleMovieURL?.size_476_306 || '',
      // ▼▼▼【変更点】(a: any) を (a: ApiNamedItem) に修正します ▼▼▼
      actress: randomItem.iteminfo?.actress?.map((a: ApiNamedItem) => a.name).join(', '),
      maker: randomItem.iteminfo?.maker?.[0]?.name,
    };

    return NextResponse.json(formattedItem);

  } catch (error) {
    // ... (省略)
  }
}