"use client";

import { useState } from 'react';

interface Item {
  id: string;
  title: string;
  affiliateURL: string;
  movieURL: string;
  mainImageURL?: string;
  actress?: string;
  maker?: string;
  genre?: string;
}

interface VideoPlayerProps {
  item: Item;
  onPrev: () => void;
  onNext: () => void;
}

export default function VideoPlayer({ item, onPrev, onNext }: VideoPlayerProps) {
  const [shared, setShared] = useState(false);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: item.title,
          text: `${item.actress ? item.actress + 'の' : ''}サンプル動画をチェック！`,
          url: item.affiliateURL,
        });
      } else {
        await navigator.clipboard.writeText(item.affiliateURL);
        setShared(true);
        setTimeout(() => setShared(false), 2000);
      }
    } catch {
      // ユーザーがキャンセルした場合など
    }
  };

  if (!item.movieURL) {
    return (
      <div className="w-full h-full flex items-center justify-center text-white bg-gray-900">
        <p className="text-gray-400">サンプル動画がありません</p>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full flex items-center justify-center bg-black overflow-hidden">

      {/* ── 動画本体 ── */}
      <div
        className="relative bg-black"
        style={{
          /* スマホ: 縦全画面 / デスクトップ: 9:16 の縦型カラムを中央に */
          width: 'min(100vw, calc(100vh * 9 / 16))',
          height: '100%',
        }}
      >
        <iframe
          key={item.id}
          className="w-full h-full"
          src={item.movieURL}
          allow="autoplay; encrypted-media"
          allowFullScreen
          style={{ border: 0, display: 'block' }}
        />

        {/* ── 上部グラデーション（薄め）── */}
        <div className="pointer-events-none absolute top-0 left-0 right-0 h-24
                        bg-gradient-to-b from-black/50 to-transparent" />

        {/* ── 下部情報オーバーレイ ── */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pt-16 pb-5
                        bg-gradient-to-t from-black/90 via-black/60 to-transparent">

          {/* 女優名 */}
          {item.actress && (
            <p className="text-sm font-bold text-pink-400 mb-1 drop-shadow">
              👤 {item.actress}
            </p>
          )}

          {/* タイトル */}
          <h2 className="text-sm font-semibold text-white leading-snug mb-1 drop-shadow"
              style={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}>
            {item.title}
          </h2>

          {/* メーカー */}
          {item.maker && (
            <p className="text-xs text-gray-400 mb-3">{item.maker}</p>
          )}

          {/* ジャンル */}
          {item.genre && (
            <p className="text-xs text-gray-300 mb-3">{item.genre}</p>
          )}

          {/* 購入ボタン */}
          <a
            href={item.affiliateURL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full
                       bg-gradient-to-r from-pink-500 to-rose-600
                       hover:from-pink-400 hover:to-rose-500
                       active:scale-95 transition-all
                       text-white font-bold py-3 px-4 rounded-2xl text-sm shadow-xl"
          >
            🎬 FANZAで今すぐ見る
          </a>
        </div>
      </div>

      {/* ── 右サイドボタン（TikTok風）── */}
      <div className="absolute right-3 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4 z-10">

        {/* 前の動画 */}
        <button
          onClick={onPrev}
          className="flex flex-col items-center gap-1 group"
          aria-label="前の動画へ"
        >
          <span className="w-10 h-10 flex items-center justify-center
                           bg-black/40 backdrop-blur-sm rounded-full
                           text-white group-hover:bg-black/70 group-active:scale-90
                           transition-all shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                 strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
            </svg>
          </span>
        </button>

        {/* シェアボタン */}
        <button
          onClick={handleShare}
          className="flex flex-col items-center gap-1 group"
          aria-label="シェア"
        >
          <span className={`w-10 h-10 flex items-center justify-center
                            backdrop-blur-sm rounded-full
                            transition-all shadow-lg
                            group-active:scale-90
                            ${shared
                              ? 'bg-green-500/70 text-white'
                              : 'bg-black/40 text-white group-hover:bg-black/70'}`}>
            {shared ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                   strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                   strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round"
                      d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
              </svg>
            )}
          </span>
          <span className="text-white text-[10px] drop-shadow">
            {shared ? 'コピー済' : 'シェア'}
          </span>
        </button>

        {/* 次の動画 */}
        <button
          onClick={onNext}
          className="flex flex-col items-center gap-1 group"
          aria-label="次の動画へ"
        >
          <span className="w-10 h-10 flex items-center justify-center
                           bg-black/40 backdrop-blur-sm rounded-full
                           text-white group-hover:bg-black/70 group-active:scale-90
                           transition-all shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                 strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </span>
        </button>
      </div>

    </div>
  );
}
