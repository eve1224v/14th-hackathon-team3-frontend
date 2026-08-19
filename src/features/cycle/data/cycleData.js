export const CYCLE_DATA = {
  1: {
    id: 1,
    name: "Cycle 1",
    status: "완료",
    progress: 100,
    period: "2026.06.15 ~ 2026.06.30",
    dDay: null,

    statistics: [
      {
        label: "완료된 업무",
        value: "18 / 18",
      },
      {
        label: "진행 중인 업무",
        value: "0",
      },
      {
        label: "확인 필요",
        value: "0",
      },
      {
        label: "취소된 업무",
        value: "0",
      },
    ],

    nextCycle: {
      name: "Cycle 2",
      date: "2026.07.01 (수)",
    },

    progresses: [
      {
        title: "결제 API 요구사항 정리 완료",
        description: "26.06.18    담당 · 홍길동",
        status: "완료",
        type: "complete",
      },
      {
        title: "글로벌 랜딩페이지 기획 완료",
        description: "26.06.21    담당 · 김서연",
        status: "완료",
        type: "complete",
      },
      {
        title: "회원 인증 플로우 구현 완료",
        description: "26.06.24    담당 · 김민준",
        status: "완료",
        type: "complete",
      },
      {
        title: "프로젝트 공통 UI 적용",
        description: "26.06.27    담당 · Emily Chh",
        status: "완료",
        type: "complete",
      },
      {
        title: "Cycle 1 QA 완료",
        description: "전체 검수 항목 완료",
        status: "완료",
        type: "complete",
      },
    ],

    activities: {
      today: [
        {
          id: "cycle1-today-1",
          type: "이슈 상태",
          contentType: "status",
          time: "16:40",
          userName: "김민준",
          subject: "회원 인증 플로우 구현",
          previousStatus: "진행 중",
          nextStatus: "완료",
        },
        {
          id: "cycle1-today-2",
          type: "AI 업데이트",
          contentType: "ai",
          time: "15:20",
          previousPercent: "94%",
          nextPercent: "100%",
          reasons: [
            "남아 있던 업무가 모두 완료되었습니다.",
            "최종 QA 체크리스트가 완료되었습니다.",
            "Cycle 1의 모든 필수 업무가 종료되었습니다.",
          ],
        },
        {
          id: "cycle1-today-3",
          type: "파일",
          contentType: "file",
          time: "13:15",
          userName: "김서연",
          fileName: "Cycle1_Final_QA.pdf",
          fileSize: "1.8MB",
        },
      ],

      yesterday: [
        {
          id: "cycle1-yesterday-1",
          type: "댓글",
          contentType: "comment",
          time: "17:25",
          userName: "Emily Chh",
          subject: "글로벌 랜딩페이지 기획",
          comment: "최종 디자인 시안 확인했습니다.",
        },
      ],
    },

    aiAnalysis: {
      analyzedAt: "6월 30일 18:00 (KST)",

      title:
        "Cycle 1의 모든 업무가 정상적으로 완료되었습니다.",

      description: [
        "계획된 업무가 모두 목표 일정 내 완료되었으며,",
        "미완료 또는 확인이 필요한 업무가 없습니다.",
      ],

      previousPercent: 94,
      currentPercent: 100,
    },
  },

  2: {
    id: 2,
    name: "Cycle 2",
    status: "완료",
    progress: 100,
    period: "2026.07.01 ~ 2026.07.28",
    dDay: null,

    statistics: [
      {
        label: "완료된 업무",
        value: "21 / 21",
      },
      {
        label: "진행 중인 업무",
        value: "0",
      },
      {
        label: "확인 필요",
        value: "0",
      },
      {
        label: "취소된 업무",
        value: "1",
      },
    ],

    nextCycle: {
      name: "Cycle 3",
      date: "2026.07.29 (수)",
    },

    progresses: [
      {
        title: "결제 API v3 기본 연동",
        description: "26.07.07    담당 · 홍길동",
        status: "완료",
        type: "complete",
      },
      {
        title: "국가별 캠페인 데이터 적용",
        description: "26.07.12    담당 · 김서연",
        status: "완료",
        type: "complete",
      },
      {
        title: "파트너사 API 사전 테스트",
        description: "26.07.18    담당 · 김민준",
        status: "완료",
        type: "complete",
      },
      {
        title: "앱스토어 딥링크 적용",
        description: "26.07.23    담당 · Emily Chh",
        status: "완료",
        type: "complete",
      },
      {
        title: "Cycle 2 통합 테스트",
        description: "테스트 및 검수 완료",
        status: "완료",
        type: "complete",
      },
    ],

    activities: {
      today: [
        {
          id: "cycle2-today-1",
          type: "이슈 상태",
          contentType: "status",
          time: "17:12",
          userName: "김서연",
          subject: "국가별 캠페인 데이터 적용",
          previousStatus: "진행 중",
          nextStatus: "완료",
        },
        {
          id: "cycle2-today-2",
          type: "AI 업데이트",
          contentType: "ai",
          time: "15:42",
          previousPercent: "91%",
          nextPercent: "100%",
          reasons: [
            "남아 있던 개발 업무가 모두 완료되었습니다.",
            "통합 테스트 결과가 반영되었습니다.",
            "Cycle 2 완료 조건을 모두 충족했습니다.",
          ],
        },
        {
          id: "cycle2-today-3",
          type: "댓글",
          contentType: "comment",
          time: "11:30",
          userName: "김민준",
          subject: "파트너사 API 사전 테스트",
          comment: "최종 응답 스펙까지 확인 완료했습니다.",
        },
      ],

      yesterday: [
        {
          id: "cycle2-yesterday-1",
          type: "파일",
          contentType: "file",
          time: "16:10",
          userName: "Emily Chh",
          fileName: "Cycle2_Integration_Result.pdf",
          fileSize: "2.1MB",
        },
      ],
    },

    aiAnalysis: {
      analyzedAt: "7월 28일 18:00 (KST)",

      title:
        "Cycle 2 역시 계획된 일정 내 완료되었습니다.",

      description: [
        "파트너사 연동 과정에서 일부 확인 사항이 발생했지만,",
        "최종적으로 일정에 영향을 주지 않고 모든 업무가 완료되었습니다.",
      ],

      previousPercent: 91,
      currentPercent: 100,
    },
  },

  3: {
    id: 3,
    name: "Cycle 3",
    status: "진행 중",
    progress: 78,
    period: "2026.07.29 ~ 2026.08.12 예정",
    dDay: "D-4",

    statistics: [
      {
        label: "완료된 업무",
        value: "19 / 23",
      },
      {
        label: "진행 중인 업무",
        value: "5",
      },
      {
        label: "확인 필요",
        value: "3",
      },
      {
        label: "취소된 업무",
        value: "1",
      },
    ],

    nextCycle: {
      name: "Cycle 4",
      date: "2026.08.13 (목)",
    },

    progresses: [
      {
        title: "결제 API v3 연동 개발 완료",
        description: "26.08.04    담당 · 홍길동",
        status: "완료",
        type: "complete",
      },
      {
        title: "결제 API v3 연동 개발 완료",
        description: "26.08.04    담당 · 홍길동",
        status: "완료",
        type: "complete",
      },
      {
        title: "보안 취약점 테스트 진행 중",
        description: "전체 12개 중 7개 완료",
        status: "58%",
        type: "progress",
      },
      {
        title: "파트너사 데이터 연동 확인 필요",
        description: "응답 스펙 불일치 이슈 확인 필요",
        status: "확인 필요",
        type: "check",
      },
      {
        title: "결제 오류 케이스 자동화",
        description: "테스트 환경 이슈로 지연",
        status: "지연됨",
        type: "delay",
      },
    ],

    activities: {
      today: [
        {
          id: "cycle3-today-1",
          type: "이슈 상태",
          contentType: "status",
          time: "14:32",
          userName: "김민준",
          subject: "결제 API v3 연동",
          previousStatus: "진행 중",
          nextStatus: "완료",
        },
        {
          id: "cycle3-today-2",
          type: "AI 업데이트",
          contentType: "ai",
          time: "14:32",
          previousPercent: "72%",
          nextPercent: "78%",
          reasons: [
            "완료된 업무 2개가 추가되었습니다.",
            "QA 체크리스트 업데이트가 감지되었습니다.",
            "구글드라이브 일부 페이지가 병합되었습니다.",
          ],
        },
        {
          id: "cycle3-today-3",
          type: "댓글",
          contentType: "comment",
          time: "14:32",
          userName: "Emily Chh",
          subject: "파트너사 데이터 연동 확인",
          comment: "API 키 권한 확인 후 다시 공유하겠습니다.",
        },
        {
          id: "cycle3-today-4",
          type: "파일",
          contentType: "file",
          time: "14:32",
          userName: "김서연",
          fileName: "QA_Result_v2.pdf",
          fileSize: "2.4MB",
        },
      ],

      yesterday: [
        {
          id: "cycle3-yesterday-1",
          type: "이슈 상태",
          contentType: "status",
          time: "14:32",
          userName: "김민준",
          subject: "결제 API 테스트",
          previousStatus: "진행 중",
          nextStatus: "완료",
        },
        {
          id: "cycle3-yesterday-2",
          type: "AI 업데이트",
          contentType: "ai",
          time: "14:32",
          previousPercent: "68%",
          nextPercent: "72%",
          reasons: [
            "완료된 업무가 추가되었습니다.",
            "테스트 결과가 반영되었습니다.",
            "일부 일정 지연 요소가 해소되었습니다.",
          ],
        },
      ],
    },

    aiAnalysis: {
      analyzedAt: "8월 10일 09:00 (KST)",

      title: "전반적으로 일정대로 진행 중입니다.",

      description: [
        "연동 개발은 목표 대비 10% 빠르게 진행되고 있으나,",
        "파트너사 데이터 연동 이슈 해결이 필요합니다.",
      ],

      previousPercent: 72,
      currentPercent: 78,
    },
  },
};


export const DEFAULT_CYCLE_ID = 3;


export const getCycleData = (cycleId) => {
  return (
    CYCLE_DATA[Number(cycleId)] ||
    CYCLE_DATA[DEFAULT_CYCLE_ID]
  );
};