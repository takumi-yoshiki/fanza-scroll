import { NextResponse } from 'next/server';

type ApiNamedItem = {
  name: string;
  id: string;
};

export async function GET() {
  const affiliateId = process.env.DMM_AFFILIATE_ID?.trim();
  const apiId = process.env.DMM_API_ID?.trim();

  if (!apiId || !affiliateId) {
    return NextResponse.json(
      { message: 'API IDまたはアフィリエイトIDが環境変数に設定されていません。' },
      { status: 500 }
    );
  }

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
    const response = await fetch(requestUrl, { next: { revalidate: 300 } }); // 5分キャッシュ

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
      mainImageURL: randomItem.imageURL?.list || '',
      actress: randomItem.iteminfo?.actress?.map((a: ApiNamedItem) => a.name).join(', ') || '',
      maker: randomItem.iteminfo?.maker?.[0]?.name || '',
      // ジャンル：最大3つまでカンマ区切りで返す
      genre: randomItem.iteminfo?.genre
        ?.slice(0, 3)
        .map((g: ApiNamedItem) => g.name)
        .join(' · ') || '',
    };

    return NextResponse.json(formattedItem);

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : '不明なエラーが発生しました';
    console.error("APIルートでエラーが発生しました:", errorMessage);
    return NextResponse.json(
      { message: `サーバー内部でエラーが発生しました: ${errorMessage}` },
      { status: 500 }
    );
  }
}
