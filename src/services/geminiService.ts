// 파일 경로: src/services/geminiService.ts

// 1. App.tsx에서 사용하는 AI 축사 생성 함수
export const generateInvitationMessage = async ({
  groom,
  bride,
  style
}: {
  groom: string;
  bride: string;
  style: string;
}): Promise<string> => {
  console.log(`Generating message for ${groom} & ${bride} with style ${style}`);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`${groom} 군과 ${bride} 양의 아름다운 시작에 초대합니다.\n(AI 기능은 배포 후 설정됩니다)`);
    }, 1000);
  });
};

// 2. Preview.tsx에서 사용하는 지도 검색 함수
export const searchLocationOnMaps = async (location: string): Promise<string> => {
    console.log(`Searching location: ${location}`);
    return `https://map.naver.com/v5/search/${encodeURIComponent(location)}`;
};