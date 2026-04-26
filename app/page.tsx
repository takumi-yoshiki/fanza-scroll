"use client";

import { useState, useEffect } from 'react';
import VideoPlayer from "@/components/VideoPlayer";

import { Swiper, SwiperSlide } from 'swiper/react';
import { Mousewheel } from 'swiper/modules';
import type { Swiper as SwiperClass } from 'swiper/types';

import 'swiper/css';

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

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [swiper, setSwiper] = useState<SwiperClass | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const fetchMoreItems = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/items');
      if (!res.ok) return;
      const newItem: Item = await res.json();
      setItems((prevItems) => {
        if (!prevItems.some(item => item.id === newItem.id)) {
          return [...prevItems, newItem];
        }
        return prevItems;
      });
    } catch (error) {
      console.error("動画の取得に失敗しました", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 初期ロード：3本先読み
  useEffect(() => {
    fetchMoreItems();
    fetchMoreItems();
    fetchMoreItems();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // キーボード操作
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowUp') swiper?.slidePrev();
      else if (event.key === 'ArrowDown') swiper?.slideNext();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [swiper]);

  return (
    <main className="w-screen h-screen bg-black overflow-hidden">
      {items.length === 0 && (
        <div className="w-full h-full flex items-center justify-center text-white">
          <div className="flex flex-col items-center gap-3">
            <div className="w-10 h-10 border-4 border-pink-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-sm text-gray-400">読み込み中...</p>
          </div>
        </div>
      )}

      <Swiper
        direction="vertical"
        className="w-full h-full"
        modules={[Mousewheel]}
        mousewheel={true}
        onReachEnd={fetchMoreItems}
        onSwiper={setSwiper}
        onSlideChange={(swiperInstance) => {
          setActiveIndex(swiperInstance.activeIndex);
          // 残り2本以下になったら追加読み込み
          if (swiperInstance.activeIndex >= items.length - 2) {
            fetchMoreItems();
          }
        }}
      >
        {items.map((item, index) => (
          <SwiperSlide key={item.id}>
            <div className="w-full h-full">
              {index === activeIndex && (
                <VideoPlayer
                  item={item}
                  onPrev={() => swiper?.slidePrev()}
                  onNext={() => swiper?.slideNext()}
                />
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </main>
  );
}
