import { NextResponse } from 'next/server';

type ApiNamedItem = {
  name: string;
  id: string;
};

export async function GET() {
  const affiliateId = process.env.DMM_AFFILIATE_ID?.trim();
  const apiId = process.env.DMM_API_ID?.trim();

  // IDが存在しない場合は、ここで処理を中断してエラーを返す
  if (!apiId || !affiliateId) {
    return NextResponse.json(
      { message: 'API IDまたはアフィリエイトIDが環境変数に設定されていません。' },
      { status: 500 }
    );
  }

  // この行以降、TypeScriptは apiId と affiliateId が string 型であることを認識します。
  
  try {
    const params = new URLSearchParams({
      api_id: apiId, // ここではもう undefined の可能性はない
      affiliate_id: affiliateId, // ここではもう undefined の可能性はない
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
      mainImageURL: randomItem.imageURL.list,
      actress: randomItem.iteminfo?.actress?.map((a: ApiNamedItem) => a.name).join(', '),
      maker: randomItem.iteminfo?.maker?.[0]?.name,
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