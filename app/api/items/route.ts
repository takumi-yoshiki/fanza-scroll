// app/api/items/route.ts
import { NextResponse } from 'next/server';

export async function GET() {
  // .env.localからIDを読み込み、前後の空白を削除(念のため)
  const affiliateId = process.env.DMM_AFFILIATE_ID?.trim();
  const apiId = process.env.DMM_API_ID?.trim();

  // IDの存在チェック
  if (!affiliateId || !apiId) {
    return NextResponse.json(
      { message: 'API IDまたはアフィリエイトIDが.env.localに設定されていません。' },
      { status: 500 }
    );
  }

  try {
    // DMM APIに送信するパラメータを構築
    const params = new URLSearchParams({
      api_id: apiId,
      affiliate_id: affiliateId,
      site: 'FANZA', // ★★★これが解決の鍵でした★★★
      service: 'digital',
      floor: 'videoa',
      hits: '100', // 100件取得してランダムに選ぶ
      sort: 'rank',
    });

    const requestUrl = `https://api.dmm.com/affiliate/v3/ItemList?${params}`;

    // デバッグ用にリクエスト情報をターミナルに表示
    console.log("【DMM APIへのリクエスト情報】", requestUrl);

    // DMM APIへリクエストを送信
    const response = await fetch(requestUrl);

    // DMMからの応答が正常でない場合はエラーを投げる
    if (!response.ok) {
      throw new Error(`APIからの応答が正常ではありません: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();

    // 結果のアイテムリストが存在しない、または空の場合はエラー
    if (!data.result || !data.result.items || data.result.items.length === 0) {
      throw new Error('APIから有効な商品が取得できませんでした。');
    }

    // 取得したリストからランダムに1件選ぶ
    const items = data.result.items;
    const randomIndex = Math.floor(Math.random() * items.length);
    const randomItem = items[randomIndex];

    // フロントエンドで使いやすいようにデータを整形
    const formattedItem = {
      id: randomItem.content_id,
      title: randomItem.title,
      affiliateURL: randomItem.affiliateURL,
      movieURL: randomItem.sampleMovieURL?.size_720_480 || randomItem.sampleMovieURL?.size_476_306 || '',
      actress: randomItem.iteminfo?.actress?.map((a: any) => a.name).join(', '),
      maker: randomItem.iteminfo?.maker?.[0]?.name,
    };

    // 整形したデータをJSON形式でフロントエンドに返す
    return NextResponse.json(formattedItem);

  } catch (error) {
    // tryブロックの途中でエラーが発生した場合の処理
    console.error("APIルートでエラーが発生しました:", error);
    const errorMessage = error instanceof Error ? error.message : '不明なエラーが発生しました';
    return NextResponse.json(
      { message: `サーバー内部でエラーが発生しました: ${errorMessage}` },
      { status: 500 }
    );
  }
}