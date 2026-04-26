import { NextRequest, NextResponse } from 'next/server';
import { TwitterApi } from 'twitter-api-v2';

type ApiNamedItem = {
  name: string;
  id: string;
};

// ツイート本文を組み立てる（280文字以内に収める）
function buildTweetText(item: {
  title: string;
  actress?: string;
  maker?: string;
}): string {
  const siteUrl = 'https://fanza-scroll.vercel.app';
  const hashtags = '#FANZA #アダルト動画 #サンプル動画';

  const actress = item.actress ? `👤 ${item.actress}\n` : '';
  // タイトルは最大40文字に切る
  const title = item.title.length > 40
    ? item.title.slice(0, 40) + '…'
    : item.title;

  return [
    '🎬 サンプル動画チェック！',
    '',
    actress + `📽️ ${title}`,
    '',
    'スワイプして無料視聴👇',
    siteUrl,
    '',
    hashtags,
  ].join('\n');
}

export async function GET(request: NextRequest) {
  // Cronからの呼び出しを認証（CRON_SECRET で保護）
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  // X APIの認証情報チェック
  const apiKey = process.env.TWITTER_API_KEY;
  const apiSecret = process.env.TWITTER_API_SECRET;
  const accessToken = process.env.TWITTER_ACCESS_TOKEN;
  const accessSecret = process.env.TWITTER_ACCESS_TOKEN_SECRET;

  if (!apiKey || !apiSecret || !accessToken || !accessSecret) {
    return NextResponse.json(
      { message: 'Twitter API認証情報が設定されていません' },
      { status: 500 }
    );
  }

  // FANZA APIの認証情報チェック
  const affiliateId = process.env.DMM_AFFILIATE_ID?.trim();
  const apiId = process.env.DMM_API_ID?.trim();

  if (!apiId || !affiliateId) {
    return NextResponse.json(
      { message: 'DMM API認証情報が設定されていません' },
      { status: 500 }
    );
  }

  try {
    // ① FANZAからランダムに1件取得
    const params = new URLSearchParams({
      api_id: apiId,
      affiliate_id: affiliateId,
      site: 'FANZA',
      service: 'digital',
      floor: 'videoa',
      hits: '100',
      sort: 'rank',
    });

    const dmmRes = await fetch(
      `https://api.dmm.com/affiliate/v3/ItemList?${params}`
    );

    if (!dmmRes.ok) {
      throw new Error(`FANZA APIエラー: ${dmmRes.status}`);
    }

    const dmmData = await dmmRes.json();

    if (!dmmData.result?.items?.length) {
      throw new Error('FANZAから商品が取得できませんでした');
    }

    // サンプル動画ありの商品だけに絞る
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const items = (dmmData.result.items as any[]).filter(
      (item) => item.sampleMovieURL?.size_720_480 || item.sampleMovieURL?.size_476_306
    );

    const randomItem = items[Math.floor(Math.random() * items.length)];

    const tweetData = {
      title: randomItem.title as string,
      actress: randomItem.iteminfo?.actress
        ?.slice(0, 2)
        .map((a: ApiNamedItem) => a.name)
        .join('・') as string | undefined,
      maker: randomItem.iteminfo?.maker?.[0]?.name as string | undefined,
    };

    // ② ツイート本文を作成
    const tweetText = buildTweetText(tweetData);

    // ③ X APIでツイート投稿
    const twitterClient = new TwitterApi({
      appKey: apiKey,
      appSecret: apiSecret,
      accessToken: accessToken,
      accessSecret: accessSecret,
    });

    const tweet = await twitterClient.v2.tweet(tweetText);

    return NextResponse.json({
      success: true,
      tweetId: tweet.data.id,
      text: tweetText,
    });

  } catch (error) {
    const msg = error instanceof Error ? error.message : '不明なエラー';
    console.error('auto-tweet error:', msg);
    return NextResponse.json({ message: msg }, { status: 500 });
  }
}
