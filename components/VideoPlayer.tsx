interface Item {
    id: string;
    title: string;
    affiliateURL: string;
    movieURL: string;
    actress?: string;
    maker?: string;
  }
  
  // ▼▼▼ 親から受け取るpropsの型に関数を追加 ▼▼▼
  interface VideoPlayerProps {
    item: Item;
    onPrev: () => void;
    onNext: () => void;
  }
  
  export default function VideoPlayer({ item, onPrev, onNext }: VideoPlayerProps) {
    if (!item.movieURL) {
      // (省略...以前のコードと同じ)
      return (
        <div className="w-full h-full flex items-center justify-center text-white bg-gray-900 rounded-lg">
          サンプル動画がありません。
        </div>
      );
    }
  
    return (
      <div className="relative w-[56.25vh] max-h-[95vh] max-w-[95vw] aspect-[9/16] bg-black shadow-lg 
                     md:w-screen md:h-screen md:max-w-none md:rounded-none">
        
        <iframe
          key={item.id}
          className="w-full h-full"
          src={item.movieURL}
          allow="autoplay; encrypted-media"
          allowFullScreen
          style={{ border: 0 }}
        ></iframe>
  
        {/* ▼▼▼ ここからがナビゲーションボタンの追加部分 ▼▼▼ */}
        {/* 上矢印ボタン */}
        <button
          onClick={onPrev}
          className="absolute right-4 top-1/2 -translate-y-12 p-2 bg-black/30 rounded-full text-white hover:bg-black/60 transition-colors"
          aria-label="前の動画へ"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
          </svg>
        </button>
  
        {/* 下矢印ボタン */}
        <button
          onClick={onNext}
          className="absolute right-4 top-1/2 translate-y-2 p-2 bg-black/30 rounded-full text-white hover:bg-black/60 transition-colors"
          aria-label="次の動画へ"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
          </svg>
        </button>
        {/* ▲▲▲ ここまでが追加部分 ▲▲▲ */}
  
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/60 to-transparent text-white pointer-events-none">
          <h1 className="text-lg font-bold drop-shadow-lg">{item.title}</h1>
          <p className="text-sm text-gray-200 drop-shadow-lg">{item.actress}</p>
          <a
            href={item.affiliateURL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-block bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded pointer-events-auto"
          >
            FANZAで見る
          </a>
        </div>
      </div>
    );
  }