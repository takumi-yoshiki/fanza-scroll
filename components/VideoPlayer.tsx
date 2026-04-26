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
    } catch { /* キャンセル時など */ }
  };

  if (!item.movieURL) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-black">
        <p className="text-gray-500 text-sm">サンプル動画がありません</p>
      </div>
    );
  }

  const isMP4 = item.movieURL.toLowerCase().includes('.mp4');

  return (
    <div className="w-full h-full flex flex-col bg-black">

      {/* ── 動画エリア：画面高さの60%を占める ── */}
      <div className="relative w-full flex-shrink-0" style={{ height: '60%' }}>

        {isMP4 ? (
          <video
            key={item.id}
            className="absolute inset-0 w-full h-full bg-black"
            src={item.movieURL}
            controls
            playsInline
            preload="metadata"
            style={{ objectFit: 'contain' }}
          />
        ) : (
          <iframe
            key={item.id}
            className="absolute inset-0 w-full h-full"
            src={item.movieURL}
            allow="autoplay; encrypted-media"
            allowFullScreen
            style={{ border: 0 }}
          />
        )}

        {/* 右サイドボタン */}
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex flex-col items-center gap-3 z-10">
          <button
            onClick={onPrev}
            className="w-9 h-9 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-full text-white active:scale-90 transition-all shadow"
            aria-label="前の動画へ"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
            </svg>
          </button>

          <button
            onClick={handleShare}
            className={`w-9 h-9 flex items-center justify-center backdrop-blur-sm rounded-full text-white active:scale-90 transition-all shadow ${shared ? 'bg-green-500/70' : 'bg-black/50'}`}
            aria-label="シェア"
          >
            {shared ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" />
              </svg>
            )}
          </button>

          <button
            onClick={onNext}
            className="w-9 h-9 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-full text-white active:scale-90 transition-all shadow"
            aria-label="次の動画へ"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
            </svg>
          </button>
        </div>
      </div>

      {/* ── 情報エリア：残り40%を使い切る ── */}
      <div className="flex-1 flex flex-col justify-center px-4 gap-2">

        {/* 女優名 */}
        {item.actress && (
          <p className="text-pink-400 text-sm font-bold leading-tight">
            👤 {item.actress}
          </p>
        )}

        {/* タイトル */}
        <p className="text-white text-sm font-semibold leading-snug line-clamp-2">
          {item.title}
        </p>

        {/* メーカー・ジャンル */}
        <p className="text-gray-400 text-xs">
          {[item.maker, item.genre].filter(Boolean).join('　')}
        </p>

        {/* 購入ボタン */}
        <a
          href={item.affiliateURL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full mt-1
                     bg-gradient-to-r from-pink-500 to-rose-600
                     hover:from-pink-400 hover:to-rose-500
                     active:scale-95 transition-all
                     text-white font-bold py-3 px-4 rounded-2xl text-sm shadow-xl"
        >
          🎬 FANZAで今すぐ見る
        </a>
      </div>

    </div>
  );
}
