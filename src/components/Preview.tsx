import React, { useState } from 'react';
import type { InvitationData } from '../types'; 
import { Phone, MessageCircle } from 'lucide-react';
import { 
  Copy, Navigation, Bus, Car, MapPin, Youtube, 
  ChevronDown, ChevronUp, ChevronLeft, ChevronRight, Share2, Heart, X 
} from 'lucide-react';

/**
 * [컴포넌트] PetalEffect
 * - 주인님 요청사항: Google AI Studio 스타일 꽃잎 효과
 * - 기능: 화면 상단에서 꽃잎이 자연스럽게 흩날리며 떨어지는 애니메이션
 * - 주의: 절대 변경 금지 (Original Code Preserved)
 */
const PetalEffect: React.FC = () => {
  return (
    /* pointer-events-none: 꽃잎이 클릭을 방해하지 않도록 설정
       overflow-hidden: 화면 밖으로 나간 꽃잎 가리기 
       z-20: 배경보다는 위, 텍스트보다는 아래에 배치 */
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-20">
      {[...Array(20)].map((_, i) => (
        <div 
          key={i} 
          className="petal absolute opacity-0"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-20px`,
            backgroundColor: i % 2 === 0 ? '#fac9f2' : '#e9c0c9',
            width: `${Math.random() * 8 + 6}px`,
            height: `${Math.random() * 6 + 4}px`,
            borderRadius: '50% 0 50% 0',
            animation: `fall ${Math.random() * 8 + 6}s linear infinite`,
            animationDelay: `${Math.random() * 5}s`,
            boxShadow: '0 0 5px rgba(255,182,193,0.3)'
          }}
        />
      ))}
      <style>{`
        @keyframes fall {
          0% { opacity: 0; transform: translate(0, 0) rotate(0deg); }
          15% { opacity: 0.6; }
          85% { opacity: 0.6; } 
          5% { opacity: 0.6; } 
          100% { opacity: 0; transform: translate(${Math.random() * 100 - 50}px, calc(100vh - 30px)) rotate(720deg); }
        }
      `}</style>
    </div>
  );
};

/**
 * [컴포넌트] Preview
 * - 역할: 청첩장의 실제 내용을 보여주는 메인 컴포넌트
 * - 포함 기능: 메인 사진, 인사말, 갤러리(확대 기능 포함), 오시는 길, 계좌번호, 공유하기
 */
const Preview: React.FC<{ data: InvitationData, isStandalone?: boolean }> = ({ data }) => {
  // [State] 계좌번호 아코디언 열림/닫힘 상태 (null이면 모두 닫힘)
  const [openAccordion, setOpenAccordion] = useState<string | null>(null);
  
  // [State] 갤러리 확대 모드 (null이면 닫힘, 숫자면 해당 인덱스의 사진 확대)
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  /**
   * [함수] 텍스트 복사 기능
   * - 계좌번호나 링크를 클립보드에 복사하고 알림창을 띄움
   */
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('복사되었습니다: ' + text);
  };

  /**
   * [함수] 라이트박스 닫기
   * - 확대된 사진을 닫고 원래 화면으로 돌아감
   */
  const closeLightbox = () => setLightboxIndex(null);

  return (
    /* 최상위 컨테이너 
       - h-auto, overflow-visible: 브라우저 기본 스크롤 사용 (스크롤 막힘 방지) 
       - relative: 내부 절대 위치 요소들의 기준점 */
    <div className="w-full h-auto flex flex-col bg-white overflow-visible relative no-scrollbar">
      
      {/* ----------------------------------------------------------------
         [Section 1] 메인 커버 (Main Cover)
         - 꽃비 효과 + 메인 사진 + 신랑신부 이름
         ---------------------------------------------------------------- */}
      <section className="relative w-full aspect-[3/4] overflow-hidden bg-zinc-100">
        <PetalEffect /> {/* 꽃비 효과 적용 */}
        
        <img 
          src="/main_photo.jpg" 
          className="w-full h-full object-cover" 
          alt="Main"
          onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/600x800?text=Main+Photo"; }}
        />
        
        {/* 하단 그라데이션 및 텍스트 오버레이 */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex flex-col justify-end p-8 text-white text-center pb-12">
          <p className="text-3xl tracking-[0.3em] mb-3 font-light serif italic text-middle pr-41 text-rose-200">{data.date}</p>
          <h2 className="text-5xl serif font-bold font-light serif italic hangul">{data.groomName} ♥ {data.brideName}</h2>
          <p className="text-sm opacity-70 mt-2 tracking-widest uppercase hangul">{data.location}</p>
          <p className="text-sm opacity-70 mt-2 tracking-widest uppercase hangul">{data.time}</p>
        </div>
      </section>

      {/* ----------------------------------------------------------------
         [Section 2] 인사말 (Invitation Message)
         ---------------------------------------------------------------- */}
      <section className="py-16 px-8 text-center space-y-8 bg-white">
        {/* 장식용 세로선 */}
        <div className="w-px h-10 bg-rose-200 mx-auto"></div>
        <p className="whitespace-pre-wrap leading-[2.2] text-zinc-600 font-light text-[15px]">
          {data.welcomeMessage}
        </p>
        <div className="pt-4 text-zinc-800 text-sm space-y-2 font-light">
          <p>{data.groomParents} 의 아들 <span className="font-bold">{data.groomName}</span></p>
          <p>{data.brideParents} 의 딸 <span className="font-bold">{data.brideName}</span></p>
        </div>
      </section>

      {/* ----------------------------------------------------------------
         [Section 3] 갤러리 (Gallery)
         - 3열 그리드 + 클릭 시 확대(라이트박스)
         ---------------------------------------------------------------- */}
      <section className="py-24 px-4 bg-zinc-50/50">
        <div className="text-[11px] tracking-[0.4em] mb-12 text-center uppercase font-black text-stone-300">Gallery</div>
        <div className="grid grid-cols-3 gap-1">
          {/* 0번부터 21번까지 총 22장 이미지 렌더링 */}
          {[...Array(22)].map((_, i) => (
            <div 
              key={i} 
              className="aspect-square bg-stone-100 overflow-hidden cursor-pointer"
              onClick={() => setLightboxIndex(i)} // 클릭 시 해당 인덱스로 라이트박스 오픈
            >
              <img 
                src={`/Gallery ${i}.jpg`} 
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" 
                alt={`Gallery ${i}`} 
                onError={(e) => { e.currentTarget.src = `/Gallery ${i} .jpg`; }} // 파일명 공백 예외처리
              />
            </div>
          ))}
        </div>
      </section>

      {/* ----------------------------------------------------------------
         [기능] 라이트박스 (이미지 확대 모달)
         - lightboxIndex가 숫자인 경우에만 화면에 표시됨
         ---------------------------------------------------------------- */}
      {lightboxIndex !== null && (
        <div 
          className="fixed inset-0 z-[9999] bg-black/95 flex items-center justify-center p-4 animate-fadeIn"
          onClick={closeLightbox} // 배경 클릭 시 닫기
        >
          {/* 닫기 버튼 */}
          <button 
            onClick={closeLightbox}
            className="absolute top-6 right-6 text-white/80 hover:text-white"
          >
            <X size={32} />
          </button>
          
          {/* 좌측 이전 버튼 */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex(lightboxIndex === 0 ? 21 : lightboxIndex - 1);
            }}
            className="absolute left-6 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
          >
            <ChevronLeft size={48} />
          </button>
          
          {/* 확대된 이미지 */}
          <img 
            src={`/Gallery ${lightboxIndex}.jpg`}
            className="max-w-full max-h-[85vh] object-contain shadow-2xl rounded-sm"
            alt="Expanded Gallery"
            onError={(e) => { e.currentTarget.src = `/Gallery ${lightboxIndex} .jpg`; }}
            onClick={(e) => e.stopPropagation()} // 이미지 클릭 시에는 닫히지 않게 방지
          />
          
          {/* 우측 다음 버튼 */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex(lightboxIndex === 21 ? 0 : lightboxIndex + 1);
            }}
            className="absolute right-6 top-1/2 -translate-y-1/2 text-white/60 hover:text-white transition-colors"
          >
            <ChevronRight size={48} />
          </button>
        </div>
      )}

      {/* ----------------------------------------------------------------
         [Section 4] 오시는 길 (Location)
         - 지도 이미지, 내비게이션 버튼, 교통편 안내 텍스트
         ---------------------------------------------------------------- */}
      <section className="pt-16 pb-8 px-8 bg-white text-center border-t border-zinc-100">
        <h2 className="serif text-3xl font-light tracking-[0.2em] mb-12 text-stone-400 uppercase italic">Location</h2>
        
        {/* 장소 및 주소 정보 */}
        <div className="space-y-2 mb-10">
          <p className="text-[18px] font-bold text-zinc-900">{data.location} {data.locationDetail}</p>
          <p className="text-sm text-zinc-500">{data.address}</p>
          <p className="text-sm text-zinc-500">031-382-3838</p>
        </div>

        {/* 지도 이미지 */}
        <div className="w-full h-auto bg-stone-50 rounded-2xl overflow-hidden relative border border-stone-200 shadow-xl mb-12">
          <img src="/location_map.jpg" className="w-full h-auto min-h-[200px] object-cover" alt="Location Map" />
        </div>

        {/* 내비게이션 버튼 (카카오/네이버) */}
        <div className="flex justify-center gap-12 mb-20">
          <button onClick={() => window.open(`https://map.kakao.com/link/search/${data.location}`)} className="flex flex-col items-center gap-2">
            <div className="w-14 h-14 bg-[#FAE100] rounded-2xl flex items-center justify-center text-zinc-900"><Navigation size={24} fill="currentColor" /></div>
            <span className="text-[14px] font-bold text-zinc-500">카카오 지도</span>
          </button>
          <button onClick={() => window.open(`https://map.naver.com/v5/search/${data.location}`)} className="flex flex-col items-center gap-2">
            <div className="w-14 h-14 bg-[#2DB400] rounded-2xl flex items-center justify-center text-white"><Navigation size={24} fill="white" /></div>
            <span className="text-[14px] font-bold text-zinc-500">네이버 지도</span>
          </button>
        </div>

        {/* 상세 교통 안내 텍스트 */}
        <div className="text-left space-y-7 border-t border-zinc-100 pt-16 px-2">
          <div className="space-y-1">
            <p className="text-sm font-bold text-zinc-800 flex items-center gap-2"><Bus size={16} className="text-rose-400"/> 버스 안내</p>
            <p className="text-[17px] text-zinc-500 leading-relaxed pl-6">4호선 인덕원역 8번 출구<br/>  
                                                                          웨딩홀 셔틀버스 수시 운행중</p> 
            </div>
          <div className="space-y-3">

            <p className="text-sm font-bold text-zinc-800 flex items-center gap-2"><Car size={16} className="text-rose-400"/> 자가용 안내</p>
            <p className="text-[18px] text-zinc-500 leading-relaxed pl-6">빌라드지디 안양 제2주차장</p>
          </div>
<div className="space-y-3">
  {/* 주차장 안내 컨테이너 */}
  <div className="flex items-center justify-between bg-zinc-50/50 p-2 rounded-lg">
    
    {/* 1. 라벨 영역 */}
    <p className="text-sm font-bold text-zinc-800 flex items-center gap-2">
      <MapPin size={16} className="text-rose-400" />
      <span>주차장</span>
    </p>

    {/* 2. 지도 버튼 그룹 */}
    <div className="flex items-center gap-3">
      {/* 네이버 지도 버튼 (초록색) */}
      <button
        onClick={() => window.open(`https://map.naver.com/p/entry/place/2146777317`)}
        className="flex flex-col items-center gap-1 group"
      >
        <div className="w-8 h-8 bg-[#ffffff] rounded-full flex items-center justify-center shadow-sm group-active:scale-95 transition-transform">
          <span className="text-sm text-green-500 font-bold">N</span>
        </div>
        <span className="text-[10px] text-zinc-500">네이버</span>
      </button>

      {/* 티맵 버튼 (핑크색/차량 아이콘) */}
      <button
        onClick={() => window.open(`https://poi.tmobiweb.com/app/share/position?contents=dHlwZT0yJnBrZXk9MTE4NTIxNjYwMSZwb2lJZD0xMTg1MjE2NiZuYXZTZXE9MSZwb2lOYW1lPeu5jOudvOuTnOyngOuUlCDslYjslpEg7KCcMuyjvOywqOyepSZjZW50ZXJYPTQ1NzA5NTAmY2VudGVyWT0xMzQ2MzcyJnRpbWU9MjAyNuuFhCAx7JuUIDEz7J28IDIwOjUwJnRlbD0wMzEtMzgyLTM4MzgmYWRkcj3qsr3quLAg7JWI7JaR7IucIOuPmeyViOq1rCDqtIDslpHrj5kgNzkxLTEw&tailParam=%7B%7D`)}
        className="flex flex-col items-center gap-1 group"
      >
        <div className="w-8 h-8 bg-[#ffffff] rounded-full flex items-center justify-center shadow-sm group-active:scale-95 transition-transform">
          <span className="text-sm text-white">🚗</span>
        </div>
        <span className="text-[10px] text-zinc-500">티맵</span>
      </button>
    </div>
  </div>
            
            <p className="text-[18px] text-zinc-500 leading-relaxed pl-6">
              안양시 동안구 관양동 791-10<br/>
              빌라드지디 안양 제2주차장<br/>
              주차 후 셔틀버스 탑승 (5분거리)<br/><br/>
              <span className="text-[18px]  text-zinc-500 mt-1 block bg-rose-50 p-3 serif  font-light serif italic hangul rounded-lg">
                일반 하객분들은 빌라드지디 안양 <br/>
                제2주차장을 이용 부탁드립니다.</span>
            </p>
          </div>
          <div className="pt-6 text-center">
            <a href="https://www.youtube.com/watch?v=ubqXDwt6CW4" target="_blank" className="inline-flex items-center gap-3 text-[17px] font-black text-rose-500 border-b-2 border-rose-100 pb-1.5">
              주차장 오시는 길 영상 가이드 보기 <Youtube size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* ----------------------------------------------------------------
         [Section 5] 마음 전하실 곳 (Accounts)
         - 아코디언 방식으로 계좌번호 표시 및 복사 기능
         ---------------------------------------------------------------- */}
      <section className="py-4 px-10 bg-zinc-50">
        <div className="text-[11px] tracking-[0.4em] mb-12 text-center uppercase font-black text-stone-300">Gift</div>
        <div className="space-y-3">
          {['groom', 'bride'].map((side) => (
            <div key={side} className="bg-white border border-zinc-100 rounded-2xl overflow-hidden shadow-sm">
              <button onClick={() => setOpenAccordion(openAccordion === side ? null : side)} className="w-full px-8 py-6 flex justify-between items-center text-[14px] font-bold text-zinc-700">
                {side === 'groom' ? '신랑' : '신부'} 측 계좌번호
                {openAccordion === side ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </button>
              {/* 아코디언 내용 */}
              {openAccordion === side && (
                <div className="px-8 pb-8 space-y-6 border-t border-zinc-50 animate-fadeIn">
                  {(side === 'groom' ? data.accounts?.groom ?? [] : data.accounts?.bride ?? []).map((acc, i) => (
                    <div key={i} className="flex justify-between items-center py-2">
                      <div className="text-xs">
                        <div className="text-zinc-400 mb-1">{acc.bank}</div>
                        <div className="font-bold text-zinc-800 text-sm">{acc.number}</div>
                        <div className="text-zinc-500 mt-0.5">{acc.name}</div>
                      </div>
                      <button onClick={() => copyToClipboard(acc.number)} className="w-10 h-10 bg-zinc-50 rounded-lg text-zinc-400 flex items-center justify-center hover:bg-zinc-100 transition-colors">
                        <Copy size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
      {/* ★ [추가된 섹션] 연락하기 ( ) ★ */}
      <section className="pb-24 px-8">
        <div className="bg-zinc-50 rounded-2xl p-6 space-y-8 border border-zinc-100">
          <div className="text-[11px] tracking-[0.4em] text-center uppercase font-bold text-rose-300 mb-2">Contact</div>
          
          {/* 신랑측 연락처 */}
          <div className="flex items-center justify-between pb-4 border-b border-zinc-200/50">
            <span className="text-sm text-zinc-600">신랑 <span className="font-bold text-zinc-800 ml-1">{data.groomName}</span></span>
            <div className="flex gap-2">
              <a href={`tel:${data.groomPhone}`} className="w-9 h-9 rounded-full bg-white border border-rose-100 text-rose-400 flex items-center justify-center hover:bg-rose-50 transition-colors"><Phone size={16} /></a>
              <a href={`sms:${data.groomPhone}`} className="w-9 h-9 rounded-full bg-white border border-rose-100 text-rose-400 flex items-center justify-center hover:bg-rose-50 transition-colors"><MessageCircle size={16} /></a>
            </div>
          </div>

          {/* 신부측 연락처 */}
          <div className="flex items-center justify-between pt-1">
            <span className="text-sm text-zinc-600">신부 <span className="font-bold text-zinc-800 ml-1">{data.brideName}</span></span>
            <div className="flex gap-2">
              <a href={`tel:${data.bridePhone}`} className="w-9 h-9 rounded-full bg-white border border-rose-100 text-rose-400 flex items-center justify-center hover:bg-rose-50 transition-colors"><Phone size={16} /></a>
              <a href={`sms:${data.bridePhone}`} className="w-9 h-9 rounded-full bg-white border border-rose-100 text-rose-400 flex items-center justify-center hover:bg-rose-50 transition-colors"><MessageCircle size={16} /></a>
            </div>
          </div>
        </div>
      </section>
      {/* ----------------------------------------------------------------
         [Section 6] 공유하기 (Share)
         - 카카오톡 공유 (모바일 지원 시) 또는 링크 복사
         ---------------------------------------------------------------- */}
      <section className="pt-8 pb-24 px-10 text-center">
        <button 
          onClick={() => navigator.share ? navigator.share({title: `${data.groomName} ♡ ${data.brideName}`, url: window.location.href}) : copyToClipboard(window.location.href)}
          className="w-full py-5 bg-[#FAE100] text-zinc-800 rounded-2xl font-bold flex items-center justify-center gap-3 shadow-sm active:scale-95 transition-transform"
        >
          <Share2 size={18} /> 카카오톡으로 청첩장 공유
        </button>
        <div className="mt-20 opacity-25 flex flex-col items-center gap-3">
          <Heart size={16} className="text-rose-500 fill-rose-500" />
          <p className="text-[15px] font-black uppercase tracking-[0.4em]">감사합니다.<br/> 행복하게 잘 살겠습니다.<br/> 오동훈♥심정은<br/> 올림</p>
        </div>
      </section>
      
      <style>{`.serif { font-family: 'Cormorant Garamond', serif; }`}</style>
    </div>
  );
};

export default Preview;