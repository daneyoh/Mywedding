import React, { useState, useEffect, useRef } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import { InvitationData } from './types';
import Preview from './components/Preview';
import { Volume2, VolumeX } from 'lucide-react';

/**
 * [메인 컴포넌트] App
 * - 역할: 전체 웹사이트의 레이아웃, 배경음악, 데이터 관리
 */
const App: React.FC = () => {
  // [데이터] 청첩장에 표시될 모든 텍스트 및 정보
  const [data] = useState<InvitationData>({
    groomName: '동훈',
    brideName: '정은',
    groomPhone: '010-5227-0696', 
    bridePhone: '010-9383-9912',
    groomParents: '오일교 · 박선희',
    brideParents: '심창용 · 임미혜',
    date: '2026.03.28',
    time: '토요일 오후 3시 30분',
    location: '빌라드지디 안양',
    locationDetail: '3층 크리스탈캐슬',
    address: '경기 안양시 동안구 관악대로 254',
    welcomeMessage: '서로를 아끼고 사랑하며 행복하게 살겠습니다.\n저희의 첫 시작을 함께 축복해 주세요.',
    templateId: 'luxury',
    parkingGuideEnabled: true,
    audioUrl: '/bgm.mp3', // 배경음악 파일 경로
    images: [
      { id: 'main', url: '/main_photo.jpg' },
      // 갤러리 이미지는 Preview 컴포넌트에서 자동으로 처리됨
    ],
    locationImages: [],
    accounts: {
      groom: [
        { name: "오동훈", bank: "신한은행", number: "110410178356" },
        { name: "오일교 (부)", bank: "국민은행", number: "62510201205986" },
        { name: "박선희 (모)", bank: "우체국", number: "10465302183931" },
      ],
      bride: [
        { name: "심정은", bank: "국민은행", number: "50160201278543" },
        { name: "심창용 (부)", bank: "국민은행", number: "58500204065137" },
        { name: "임미혜 (모)", bank: "국민은행", number: "78720204255835" },
      ]
    }
  });

  // [State] 음악 재생 여부 상태 (true: 재생 중, false: 정지)
  const [isPlaying, setIsPlaying] = useState(false);
  // [Ref] 오디오 HTML 엘리먼트 참조
  const audioRef = useRef<HTMLAudioElement | null>(null);

  /**
   * [함수] 음악 재생/정지 토글
   * - 사용자가 버튼을 클릭했을 때 호출됨
   */
  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        // 브라우저 정책상 사용자 인터랙션 없이는 자동 재생이 막힐 수 있어 catch 처리
        audioRef.current.play().catch(() => {
          console.log("자동 재생이 차단되었습니다. 사용자 클릭이 필요합니다.");
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    /* [레이아웃 설정]
       - min-h-screen: 최소 높이를 화면 전체(100vh)로 설정
       - bg-[#f0f2f5]: PC 화면에서의 배경색 (회색조)
       - flex flex-col items-center: 모바일 뷰어를 화면 중앙에 정렬
       - overflow-y-auto: 세로 스크롤 허용 (이게 없으면 스크롤 안 됨!)
    */
    <div className="min-h-screen bg-[#f0f2f5] flex flex-col items-center overflow-y-auto overflow-x-hidden">
      
      {/* 배경음악 플레이어 (화면엔 안 보임) */}
      <audio ref={audioRef} src="/bgm.mp3" loop />

      {/* [모바일 뷰어 컨테이너]
         - max-w-[450px]: 데스크탑에서도 모바일 비율 유지
         - shadow-2xl: 입체감을 주는 그림자
         - overflow-visible: 내부 팝업(라이트박스 등)이 잘리지 않게 설정
      */}
      <div className="w-full max-w-[450px] min-h-screen bg-white shadow-2xl relative overflow-visible">
        <Preview data={data} />
      </div>

      {/* [음악 컨트롤 버튼]
         - fixed bottom-6 right-6: 화면 우측 하단에 항상 고정
         - z-50: 다른 요소들보다 항상 위에 표시동후
      */}
      <button 
        onClick={toggleMusic} 
        className="fixed bottom-6 right-6 z-50 w-12 h-12 bg-white/90 rounded-full shadow-xl flex items-center justify-center text-rose-400 hover:scale-110 transition-transform"
        aria-label="Toggle Music"
      >
        {isPlaying ? <Volume2 size={24} /> : <VolumeX size={24} />}
      </button>

      {/* [Vercel Speed Insights] 성능 분석 통합 */}
      <SpeedInsights />

    </div>
  );
};

export default App;