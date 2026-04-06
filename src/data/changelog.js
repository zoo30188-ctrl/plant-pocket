/**
 * Plant Pocket Patch Notes & Version History
 */

export const CURRENT_VERSION = "v1.1.2";

export const CHANGELOGS = [
  {
    version: "v1.1.2",
    date: "2026-04-06",
    title: "🔧 긴급 핫픽스 (Hotfix)",
    changes: [
      "초기화 스크립트 연결 누락으로 인한 앱 터치 먹통 현상 긴급 롤백 처리"
    ]
  },
  {
    version: "v1.1.1",
    date: "2026-04-06",
    title: "🔧 UI 텍스트 및 PWA 최적화 (Hotfix)",
    changes: [
      "펀치(Punch) 안내 문구 간소화 및 카메라/앨범 다중 선택 메뉴 표시 오류 수정",
      "비행기 모드 환경에서 앱 최초 구동 불가 버그(PWA 캐싱) 해결"
    ]
  },
  {
    version: "v1.1.0",
    date: "2026-04-06",
    title: "🚀 더 넓고 화려해진 스펙판!",
    changes: [
      "배관 규격 대폭 확장 (대구경 36인치까지 추가, XXS 추가)",
      "고압 플랜지 규격 보강 (Class 600#, 900# 추가)",
      "플랜지 볼팅 순서 시각화 이미지(SVG 방식) 렌더링 적용",
      "버전 뱃지 탭 시 패치노트 다시보기 지원 및 온보딩 가이드 추가"
    ]
  },
  {
    version: "v1.0.0",
    date: "2026-04-04",
    title: "최초 런칭",
    changes: [
      "배관/플랜지 규격 조회 탑재",
      "오프라인 펀치 스냅 & 기록 기능 탑재",
      "압력/온도 변환기 탑재"
    ]
  }
];
