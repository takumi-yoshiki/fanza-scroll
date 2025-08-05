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
  actress?: string;
  maker?: string;
}

export default function Home() {
  const [items, setItems] = useState<Item[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [swiper, setSwiper] = useState<SwiperClass | null>(null);
  // ▼▼▼【変更点1】現在表示中のスライド番号を管理するstateを追加 ▼▼▼
  const [activeIndex, setActiveIndex] = useState(0);

  const fetchMoreItems = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/items');
      if (!res.ok) return;
      const newItem = await res.json();
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

  useEffect(() => {
    fetchMoreItems();
    fetchMoreItems();
    fetchMoreItems();
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'ArrowUp') {
        swiper?.slidePrev();
      } else if (event.key === 'ArrowDown') {
        swiper?.slideNext();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [swiper]);

  return (
    <main className="min-h-screen bg-black">
      <Swiper
        direction={'vertical'}
        className="w-full h-screen"
        modules={[Mousewheel]}
        mousewheel={true}
        onReachEnd={() => {
          fetchMoreItems();
        }}
        onSwiper={setSwiper}
        // ▼▼▼【変更点2】スライドが切り替わった時に、現在の番号をstateに保存 ▼▼▼
        onSlideChange={(swiperInstance) => {
          setActiveIndex(swiperInstance.activeIndex);
        }}
      >
        {items.map((item, index) => (
          <SwiperSlide key={item.id}>
            <div className="w-full h-full grid place-items-center">
              {/* ▼▼▼【変更点3】現在表示中のスライドだけVideoPlayerを描画する ▼▼▼ */}
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