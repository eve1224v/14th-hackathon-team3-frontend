import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const savedLanguage = localStorage.getItem("userLanguage") || "ko";
const resources = {
  ko: {
    translation: {
      common: {
        home: "홈",
        cycle: "사이클",
        issue: "이슈",
        project: "프로젝트",
        logout: "로그아웃",
        save: "저장",
        cancel: "취소",
        close: "닫기",
        saving: "저장 중...",
        saveError: "설정을 저장하지 못했습니다.",
        loadError: "설정 정보를 불러오지 못했습니다.",
        loading: "불러오는 중...",
        confirm: "확인",
        next: "다음",
        select: "선택",
      },

      settings: {
        title: "시스템 설정",
        general: "일반",
        notification: "알림",
        countryTime: "국가 및 시간",
        account: "계정",

        workspaceInfo: "워크스페이스 정보",
        workspaceName: "워크스페이스 이름",
        workspaceNameDescription: "워크스페이스 이름을 설정합니다.",

        companyName: "회사명",
        companyNameDescription: "소속 회사명을 설정합니다.",

        partnerCompany: "파트너사",
        partnerCompanyDescription: "협업 중인 파트너사를 설정합니다.",

        basicSettings: "기본 설정",
        language: "기본 언어",
        languageDescription: "서비스의 기본 언어를 설정합니다.",
      },
      notification: {
        title: "알림",
        items: "알림 항목",

        mention: "멘션 및 댓글",
        mentionDescription: "누군가 나를 멘션하거나 댓글을 남길 때",

        issue: "이슈 업데이트",
        issueDescription: "이슈가 생성, 변경, 완료되었을 때",

        deadline: "마감일 및 진행률",
        deadlineDescription: "마감일 임박 및 진행률 변경 시",

        message: "메시지",
        messageDescription: "새로운 메시지를 받았을 때",

        doNotDisturb: "방해 금지 모드",
        doNotDisturbDescription: "알림을 받지 않는 시간을 설정합니다.",
      },
      time: {
        title: "국가 및 시간",
        regionSettings: "지역 설정",

        country: "국가",
        countryDescription: "서비스에서 사용할 국가를 설정합니다.",

        timezone: "시간대",
        timezoneDescription: "현재 업무 지역의 시간대를 설정합니다.",
      },

      countries: {
        korea: "대한민국",
        usa: "미국",
        uk: "영국",
        japan: "일본",
      },
      account: {
        title: "계정",
        basicInfo: "기본 정보",

        id: "아이디",
        password: "비밀번호",
        change: "변경",

        logout: "로그아웃",
        logoutDescription: "현재 계정에서 로그아웃합니다.",

        deleteAccount: "계정 삭제",
        deleteAccountDescription:
          "계정을 삭제하면 모든 데이터가 영구적으로 삭제됩니다.",
      },
      sidebar: {
        greeting: "안녕하세요, {{name}}님",

        noWorkspace: "워크스페이스 없음",
        loginRequired: "로그인이 필요해요.",

        home: "홈",
        cycle: "사이클",
        issue: "이슈",
        project: "프로젝트",

        createIssue: "이슈 생성",
        createProject: "프로젝트 생성",

        seoul: "[KR] 서울, 대한민국",
        london: "[UK] 런던, 영국",

        active: "활동 중",
        doNotDisturb: "방해금지 모드",
        activityStatus: "활동 상태",

        profile: "프로필",

        myAccountSettings: "내 계정 설정",
        profileSettings: "프로필 설정",
        systemSettings: "시스템 설정",

        logout: "로그아웃",
        loggingOut: "로그아웃 중...",

        loginExpired: "로그인이 만료되었습니다.",
        loginExpiredAgain: "로그인이 만료되었습니다. 다시 로그인해주세요.",

        workspaceLoadError: "워크스페이스 목록을 불러오지 못했습니다.",

        activityUpdateError: "활동 상태 변경에 실패했습니다.",

        logoutError: "로그아웃 처리 중 오류가 발생했습니다.",

        noSelectedWorkspace: "선택된 워크스페이스가 없습니다.",
      },
      joinWorkspace: {
        title: "초대 코드로 입장하기",

        description: "받은 초대 코드를 입력해 주세요.",

        inviteCode: "초대 코드",

        inviteCodePlaceholder: "초대 코드를 입력해 주세요.",

        enter: "입장",
      },
      findPassword: {
        title: "비밀번호 찾기",
        emailVerification: "이메일 인증",
        getCode: "코드 받기",
        resend: "다시 받기",
        sending: "전송 중...",
        verificationCode: "인증 코드",
        verificationCodePlaceholder: "인증 코드 입력",
        verify: "인증",
        verifying: "인증 중...",

        newPassword: "새 비밀번호",
        passwordPlaceholder: "8자 이상",
        passwordConfirmPlaceholder: "새 비밀번호 확인",

        changing: "변경 중...",
        complete: "완료",

        successTitle: "비밀번호 변경 완료",
        loginWithNewPassword: "새 비밀번호로 로그인해주세요.",

        messages: {
          checkResetGuide: "비밀번호 재설정 안내를 확인해주세요.",
          passwordChanged: "비밀번호가 변경되었습니다.",
        },

        errors: {
          emailRequired: "이메일을 입력해주세요.",
          invalidEmail: "이메일 형식을 확인해주세요.",
          emailSendFailed: "이메일 발송에 실패했습니다.",
          codeRequestFailed: "인증번호 요청에 실패했습니다.",

          verificationCodeRequired: "인증 코드를 입력해주세요.",
          noResetToken: "비밀번호 재설정 토큰을 받지 못했습니다.",
          invalidInput: "입력한 정보를 확인해주세요.",
          invalidVerificationCode: "인증번호가 일치하지 않습니다.",
          expiredVerificationCode:
            "인증번호가 만료되었거나 이미 사용되었습니다.",
          verificationAttemptsExceeded:
            "인증번호 입력 가능 횟수를 초과했습니다.",
          resetRequestNotFound: "비밀번호 재설정 인증 요청을 찾을 수 없습니다.",
          verificationFailed: "인증번호 확인에 실패했습니다.",

          newPasswordRequired: "새 비밀번호를 입력해주세요.",
          passwordTooShort: "비밀번호는 8자 이상 입력해주세요.",
          passwordTooLong: "비밀번호는 72바이트 이하로 입력해주세요.",
          passwordConfirmRequired: "새 비밀번호를 다시 입력해주세요.",
          passwordMismatch: "비밀번호가 일치하지 않습니다.",
          noResetVerification:
            "비밀번호 재설정 인증 정보가 없습니다. 다시 인증해주세요.",

          invalidPassword: "입력한 비밀번호를 확인해주세요.",
          resetNotVerified:
            "비밀번호 재설정 인증이 완료되지 않았거나 이미 사용되었습니다.",
          invalidResetToken: "비밀번호 재설정 인증 정보가 올바르지 않습니다.",
          expiredResetToken:
            "비밀번호 재설정 인증 시간이 만료되었습니다. 다시 인증해주세요.",
          resetFailed: "비밀번호 변경에 실패했습니다.",
        },
      },

      message: {
        title: "Message",

        today: "오늘",
        me: "{{name}} (나)",

        viewTranslation: "번역문 보기",
        viewOriginal: "원문 보기",

        messageLabel: "메시지",
        aiTranslation: "AI 번역",
        send: "보내기",

        selectRecipient: "누구에게 메시지를 보낼까요?",
        searchPlaceholder: "이름, 회사, 팀, 직책 검색",

        all: "전체",
        company: "소속 기업",
        team: "소속 팀",
        position: "직책",

        recentChats: "최근 대화",
        recentActivity: "최근 활동",
        recommended: "추천",

        selectedCount: "{{count}}명 선택",

        completeSelection: "선택 완료",

        activeMinutesAgo: "최근 활동 {{count}}분 전",

        currentTime: "현재",
      },
      login: {
        title: "다시 만나서 반가워요.",
        description: "글로벌 협업을 계속하세요.",

        workEmail: "업무용 이메일",

        password: "비밀번호",
        passwordPlaceholder: "비밀번호 입력",

        showPassword: "비밀번호 보기",
        hidePassword: "비밀번호 숨기기",

        forgotPassword: "비밀번호를 잊으셨나요?",

        login: "로그인",
        loggingIn: "로그인 중...",

        noAccount: "아직 계정이 없으신가요?",
        signup: "회원가입",

        errors: {
          emailRequired: "이메일을 입력해주세요.",

          passwordRequired: "비밀번호를 입력해주세요.",

          noAccessToken: "로그인 토큰을 받지 못했습니다.",

          invalidInput: "이메일 또는 비밀번호를 확인해주세요.",

          unauthorized: "이메일 또는 비밀번호가 일치하지 않습니다.",

          loginFailed: "로그인에 실패했습니다.",
        },
      },

      mainHero: {
        title: "글로벌 협업, 끊김 없이 이어가보세요",

        description:
          "언어와 시간대를 넘어 인수인계·소통·프로젝트 관리를 하나의 워크스페이스에서 관리하세요.",

        createNewWorkspace: "새 워크스페이스 만들기",

        joinInvitedWorkspace: "초대받은 워크스페이스 참여하기",

        createWorkspace: "워크스페이스 만들기",
      },
      onboarding: {
        welcome: "환영합니다, {{name}}님!",

        step1: {
          title: "업무 시작 전, 기본 정보를 입력해주세요.",
          description: "함께 일할 팀이 나를 쉽게 이해할 수 있어요.",
        },

        step2: {
          title: "나의 업무 시간을 설정해주세요.",
          description:
            "서로의 근무 시간을 알고, 필요한 순간에 업무를 이어갈 수 있어요.",
        },

        step3: {
          title: "함께할 공간을 선택해주세요.",
          description:
            "새 워크스페이스를 만들거나, 초대받은 팀에 참여할 수 있어요.",
        },

        company: "소속 기업",
        companyPlaceholder: "기업 이름을 입력하세요.",

        departmentTeam: "부서/팀",
        departmentPlaceholder: "부서 이름을 입력하세요.",
        teamPlaceholder: "팀 이름을 입력하세요.",

        position: "직책",
        positionPlaceholder: "직책 이름을 입력하세요.",

        defaultLanguage: "기본 언어 설정",

        countryTimezone: "국가/시간대",
        countryPlaceholder: "국가 및 지역을 선택하세요.",

        autoHoliday: "국가 공휴일 자동 추가",

        workDays: "근무 요일",
        workTime: "근무 시작 시간/종료 시간",

        startTime: "근무 시작 시간",
        endTime: "근무 종료 시간",

        createWorkspace: "새 워크스페이스 만들기",
        joinWorkspace: "초대받은 링크로 팀에 참여하기",
      },

      weekDays: {
        sun: "일",
        mon: "월",
        tue: "화",
        wed: "수",
        thu: "목",
        fri: "금",
        sat: "토",
      },

      signup: {
        title: "글로벌 협업을 시작하세요.",
        description: "시차가 달라도 업무는 계속됩니다.",

        name: "이름",
        workEmail: "업무용 이메일",

        verified: "인증완료",
        sending: "전송중",
        verify: "인증",
        seconds: "{{count}}초",

        codePlaceholder: "인증코드를 입력하세요.",

        complete: "완료",
        checking: "확인중",

        password: "비밀번호",
        passwordPlaceholder: "8자 이상 입력",

        passwordCheck: "비밀번호 확인",
        passwordCheckPlaceholder: "비밀번호 다시 입력",

        showPassword: "비밀번호 보기",
        hidePassword: "비밀번호 숨기기",

        signup: "회원가입",

        or: "또는",

        alreadyHaveAccount: "이미 계정이 있으신가요?",

        messages: {
          codeSent: "인증번호가 이메일로 발송되었습니다.",
          emailVerified: "이메일 인증이 완료되었습니다.",
        },

        errors: {
          emailChanged: "이메일이 변경되었습니다. 다시 인증해주세요.",

          emailRequired: "이메일을 입력해주세요.",

          invalidEmail: "올바른 이메일 형식으로 입력해주세요.",

          duplicateEmail: "이미 가입된 이메일입니다.",

          tooFrequent: "인증번호 발송 후 60초 뒤에 다시 요청해주세요.",

          emailSendFailed:
            "이메일 발송에 실패했습니다. 잠시 후 다시 시도해주세요.",

          codeSendFailed: "인증번호 발송에 실패했습니다.",

          codeRequired: "인증번호를 입력해주세요.",

          codeSixDigits: "인증번호는 6자리 숫자입니다.",

          invalidVerificationInput: "이메일 또는 인증번호 형식을 확인해주세요.",

          invalidCode: "인증번호가 일치하지 않습니다.",

          expiredCode:
            "인증번호가 만료되었습니다. 인증번호를 다시 요청해주세요.",

          attemptsExceeded:
            "인증번호 입력 가능 횟수를 초과했습니다. 인증번호를 다시 요청해주세요.",

          requestNotFound:
            "해당 이메일의 인증 요청이 없습니다. 인증번호를 먼저 요청해주세요.",

          verificationFailed: "이메일 인증에 실패했습니다.",

          nameRequired: "이름을 입력해주세요.",

          workEmailRequired: "업무용 이메일을 입력해주세요.",

          emailVerificationRequired: "이메일 인증을 완료해주세요.",

          passwordRequired: "비밀번호를 입력해주세요.",

          passwordTooShort: "비밀번호는 8자 이상 입력해주세요.",

          passwordCheckRequired: "비밀번호 확인을 입력해주세요.",

          passwordMismatch: "비밀번호가 일치하지 않습니다.",
        },
      },
    },
  },

  en: {
    translation: {
      common: {
        home: "Home",
        cycle: "Cycle",
        issue: "Issue",
        project: "Project",
        logout: "Logout",
        save: "Save",
        cancel: "Cancel",
        close: "Close",
        saving: "Saving...",
        saveError: "Failed to save settings.",
        loadError: "Failed to load settings.",
        loading: "Loading...",
        confirm: "Confirm",
        next: "Next",
        select: "Select",
      },

      settings: {
        title: "System Settings",
        general: "General",
        notification: "Notifications",
        countryTime: "Country & Time",
        account: "Account",

        workspaceInfo: "Workspace Information",
        workspaceName: "Workspace Name",
        workspaceNameDescription: "Set the workspace name.",

        companyName: "Company Name",
        companyNameDescription: "Set your company name.",

        partnerCompany: "Partner Company",
        partnerCompanyDescription: "Set the companies you collaborate with.",

        basicSettings: "Basic Settings",
        language: "Default Language",
        languageDescription: "Set the default language for the service.",
      },
      notification: {
        title: "Notifications",
        items: "Notification Settings",

        mention: "Mentions & Comments",
        mentionDescription: "When someone mentions you or leaves a comment",

        issue: "Issue Updates",
        issueDescription: "When an issue is created, updated, or completed",

        deadline: "Deadlines & Progress",
        deadlineDescription:
          "When a deadline is approaching or progress changes",

        message: "Messages",
        messageDescription: "When you receive a new message",

        doNotDisturb: "Do Not Disturb",
        doNotDisturbDescription:
          "Set a time period when you don't want to receive notifications.",
      },
      time: {
        title: "Country & Time",
        regionSettings: "Region Settings",

        country: "Country",
        countryDescription: "Set the country to use for the service.",

        timezone: "Time Zone",
        timezoneDescription: "Set the time zone for your current work region.",
      },

      countries: {
        korea: "South Korea",
        usa: "United States",
        uk: "United Kingdom",
        japan: "Japan",
      },
      account: {
        title: "Account",
        basicInfo: "Basic Information",

        id: "ID",
        password: "Password",
        change: "Change",

        logout: "Logout",
        logoutDescription: "Log out of your current account.",

        deleteAccount: "Delete Account",
        deleteAccountDescription:
          "Deleting your account will permanently delete all data.",
      },
      sidebar: {
        greeting: "Hello, {{name}}",

        noWorkspace: "No workspace",
        loginRequired: "Please log in.",

        home: "Home",
        cycle: "Cycle",
        issue: "Issue",
        project: "Project",

        createIssue: "Create Issue",
        createProject: "Create Project",

        seoul: "[KR] Seoul, South Korea",
        london: "[UK] London, United Kingdom",

        active: "Active",
        doNotDisturb: "Do Not Disturb",
        activityStatus: "Activity Status",

        profile: "Profile",

        myAccountSettings: "My Account Settings",
        profileSettings: "Profile Settings",
        systemSettings: "System Settings",

        logout: "Log out",
        loggingOut: "Logging out...",

        loginExpired: "Your login session has expired.",
        loginExpiredAgain:
          "Your login session has expired. Please log in again.",

        workspaceLoadError: "Failed to load the workspace list.",

        activityUpdateError: "Failed to update activity status.",

        logoutError: "An error occurred while logging out.",

        noSelectedWorkspace: "No workspace is currently selected.",
      },
      joinWorkspace: {
        title: "Join with Invitation Code",

        description: "Enter the invitation code you received.",

        inviteCode: "Invitation Code",

        inviteCodePlaceholder: "Enter your invitation code.",

        enter: "Join",
      },
      findPassword: {
        title: "Find Password",
        emailVerification: "Email Verification",
        getCode: "Get Code",
        resend: "Resend",
        sending: "Sending...",
        verificationCode: "Verification Code",
        verificationCodePlaceholder: "Enter verification code",
        verify: "Verify",
        verifying: "Verifying...",

        newPassword: "New Password",
        passwordPlaceholder: "At least 8 characters",
        passwordConfirmPlaceholder: "Confirm new password",

        changing: "Changing...",
        complete: "Complete",

        successTitle: "Password Changed",
        loginWithNewPassword: "Please log in with your new password.",

        messages: {
          checkResetGuide: "Please check the password reset instructions.",
          passwordChanged: "Your password has been changed.",
        },

        errors: {
          emailRequired: "Please enter your email.",
          invalidEmail: "Please check the email format.",
          emailSendFailed: "Failed to send the email.",
          codeRequestFailed: "Failed to request a verification code.",

          verificationCodeRequired: "Please enter the verification code.",
          noResetToken: "The password reset token was not received.",
          invalidInput: "Please check the information you entered.",
          invalidVerificationCode: "The verification code does not match.",
          expiredVerificationCode:
            "The verification code has expired or has already been used.",
          verificationAttemptsExceeded:
            "The maximum number of verification attempts has been exceeded.",
          resetRequestNotFound:
            "The password reset verification request could not be found.",
          verificationFailed: "Failed to verify the verification code.",

          newPasswordRequired: "Please enter a new password.",
          passwordTooShort: "The password must be at least 8 characters.",
          passwordTooLong: "The password must be no more than 72 bytes.",
          passwordConfirmRequired: "Please enter the new password again.",
          passwordMismatch: "The passwords do not match.",
          noResetVerification:
            "Password reset verification information is missing. Please verify again.",

          invalidPassword: "Please check the password you entered.",
          resetNotVerified:
            "Password reset verification has not been completed or has already been used.",
          invalidResetToken:
            "The password reset verification information is invalid.",
          expiredResetToken:
            "The password reset verification has expired. Please verify again.",
          resetFailed: "Failed to change the password.",
        },
      },

      message: {
        title: "Message",

        today: "Today",
        me: "{{name}} (Me)",

        viewTranslation: "View Translation",
        viewOriginal: "View Original",

        messageLabel: "Message",
        aiTranslation: "AI Translation",
        send: "Send",

        selectRecipient: "Who would you like to message?",
        searchPlaceholder: "Search by name, company, team, or position",

        all: "All",
        company: "Company",
        team: "Team",
        position: "Position",

        recentChats: "Recent Chats",
        recentActivity: "Recent Activity",
        recommended: "Recommended",

        selectedCount: "{{count}} selected",

        completeSelection: "Complete Selection",

        activeMinutesAgo: "Active {{count}} minutes ago",

        currentTime: "Current",
      },
      login: {
        title: "Welcome back.",
        description: "Continue your global collaboration.",

        workEmail: "Work Email",

        password: "Password",
        passwordPlaceholder: "Enter your password",

        showPassword: "Show password",
        hidePassword: "Hide password",

        forgotPassword: "Forgot your password?",

        login: "Log in",
        loggingIn: "Logging in...",

        noAccount: "Don't have an account yet?",
        signup: "Sign up",

        errors: {
          emailRequired: "Please enter your email.",

          passwordRequired: "Please enter your password.",

          noAccessToken: "No login token was received.",

          invalidInput: "Please check your email or password.",

          unauthorized: "The email or password is incorrect.",

          loginFailed: "Failed to log in.",
        },
      },

      mainHero: {
        title: "Keep global collaboration moving seamlessly",

        description:
          "Manage handoffs, communication, and projects across languages and time zones in one workspace.",

        createNewWorkspace: "Create a New Workspace",

        joinInvitedWorkspace: "Join an Invited Workspace",

        createWorkspace: "Create Workspace",
      },
      onboarding: {
        welcome: "Welcome, {{name}}!",

        step1: {
          title: "Enter your basic information before getting started.",
          description:
            "Help your teammates understand who you are and what you do.",
        },

        step2: {
          title: "Set your working hours.",
          description:
            "Know each other's working hours and keep work moving when needed.",
        },

        step3: {
          title: "Choose the space you'd like to work in.",
          description:
            "Create a new workspace or join a team you've been invited to.",
        },

        company: "Company",
        companyPlaceholder: "Enter your company name.",

        departmentTeam: "Department / Team",
        departmentPlaceholder: "Enter your department name.",
        teamPlaceholder: "Enter your team name.",

        position: "Position",
        positionPlaceholder: "Enter your position.",

        defaultLanguage: "Default Language",

        countryTimezone: "Country / Time Zone",
        countryPlaceholder: "Select a country and region.",

        autoHoliday: "Automatically add national holidays",

        workDays: "Work Days",
        workTime: "Work Start / End Time",

        startTime: "Start Time",
        endTime: "End Time",

        createWorkspace: "Create a New Workspace",
        joinWorkspace: "Join a Team with an Invitation Link",
      },

      weekDays: {
        sun: "Sun",
        mon: "Mon",
        tue: "Tue",
        wed: "Wed",
        thu: "Thu",
        fri: "Fri",
        sat: "Sat",
      },

      signup: {
        title: "Start collaborating globally.",
        description: "Work keeps moving even across time zones.",

        name: "Name",
        workEmail: "Work Email",

        verified: "Verified",
        sending: "Sending",
        verify: "Verify",
        seconds: "{{count}}s",

        codePlaceholder: "Enter verification code.",

        complete: "Done",
        checking: "Checking",

        password: "Password",
        passwordPlaceholder: "At least 8 characters",

        passwordCheck: "Confirm Password",
        passwordCheckPlaceholder: "Enter your password again",

        showPassword: "Show password",
        hidePassword: "Hide password",

        signup: "Sign up",

        or: "or",

        alreadyHaveAccount: "Already have an account?",

        messages: {
          codeSent: "A verification code has been sent to your email.",
          emailVerified: "Email verification is complete.",
        },

        errors: {
          emailChanged: "Your email was changed. Please verify it again.",

          emailRequired: "Please enter your email.",

          invalidEmail: "Please enter a valid email address.",

          duplicateEmail: "This email is already registered.",

          tooFrequent:
            "Please wait 60 seconds before requesting another verification code.",

          emailSendFailed: "Failed to send the email. Please try again later.",

          codeSendFailed: "Failed to send the verification code.",

          codeRequired: "Please enter the verification code.",

          codeSixDigits: "The verification code must be 6 digits.",

          invalidVerificationInput:
            "Please check your email or verification code format.",

          invalidCode: "The verification code does not match.",

          expiredCode:
            "The verification code has expired. Please request a new one.",

          attemptsExceeded:
            "The maximum number of attempts has been exceeded. Please request a new code.",

          requestNotFound:
            "No verification request exists for this email. Please request a code first.",

          verificationFailed: "Email verification failed.",

          nameRequired: "Please enter your name.",

          workEmailRequired: "Please enter your work email.",

          emailVerificationRequired: "Please complete email verification.",

          passwordRequired: "Please enter a password.",

          passwordTooShort: "The password must be at least 8 characters.",

          passwordCheckRequired: "Please confirm your password.",

          passwordMismatch: "The passwords do not match.",
        },
      },
    },
  },

  ja: {
    translation: {
      common: {
        home: "ホーム",
        cycle: "サイクル",
        issue: "イシュー",
        project: "プロジェクト",
        logout: "ログアウト",
        save: "保存",
        cancel: "キャンセル",
        close: "閉じる",
        saving: "保存中...",
        saveError: "設定を保存できませんでした。",
        loadError: "設定情報を読み込めませんでした。",
        loading: "読み込み中...",
        confirm: "確認",
        next: "次へ",
        select: "選択",
      },

      settings: {
        title: "システム設定",
        general: "一般",
        notification: "通知",
        countryTime: "国と時間",
        account: "アカウント",

        workspaceInfo: "ワークスペース情報",
        workspaceName: "ワークスペース名",
        workspaceNameDescription: "ワークスペース名を設定します。",

        companyName: "会社名",
        companyNameDescription: "所属会社名を設定します。",

        partnerCompany: "パートナー企業",
        partnerCompanyDescription: "協業中のパートナー企業を設定します。",

        basicSettings: "基本設定",
        language: "基本言語",
        languageDescription: "サービスの基本言語を設定します。",
      },
      notification: {
        title: "通知",
        items: "通知項目",

        mention: "メンションとコメント",
        mentionDescription:
          "誰かがあなたをメンションしたり、コメントを残したとき",

        issue: "課題の更新",
        issueDescription: "課題が作成、変更、完了したとき",

        deadline: "期限と進捗",
        deadlineDescription: "期限が近づいたとき、または進捗が変更されたとき",

        message: "メッセージ",
        messageDescription: "新しいメッセージを受信したとき",

        doNotDisturb: "おやすみモード",
        doNotDisturbDescription: "通知を受け取らない時間を設定します。",
      },
      time: {
        title: "国と時間",
        regionSettings: "地域設定",

        country: "国",
        countryDescription: "サービスで使用する国を設定します。",

        timezone: "タイムゾーン",
        timezoneDescription: "現在の業務地域のタイムゾーンを設定します。",
      },

      countries: {
        korea: "韓国",
        usa: "アメリカ",
        uk: "イギリス",
        japan: "日本",
      },
      account: {
        title: "アカウント",
        basicInfo: "基本情報",

        id: "ID",
        password: "パスワード",
        change: "変更",

        logout: "ログアウト",
        logoutDescription: "現在のアカウントからログアウトします。",

        deleteAccount: "アカウント削除",
        deleteAccountDescription:
          "アカウントを削除すると、すべてのデータが完全に削除されます。",
      },
      sidebar: {
        greeting: "こんにちは、{{name}}さん",

        noWorkspace: "ワークスペースなし",
        loginRequired: "ログインが必要です。",

        home: "ホーム",
        cycle: "サイクル",
        issue: "イシュー",
        project: "プロジェクト",

        createIssue: "イシューを作成",
        createProject: "プロジェクトを作成",

        seoul: "[KR] ソウル、韓国",
        london: "[UK] ロンドン、イギリス",

        active: "活動中",
        doNotDisturb: "おやすみモード",
        activityStatus: "活動状態",

        profile: "プロフィール",

        myAccountSettings: "アカウント設定",
        profileSettings: "プロフィール設定",
        systemSettings: "システム設定",

        logout: "ログアウト",
        loggingOut: "ログアウト中...",

        loginExpired: "ログインの有効期限が切れました。",

        loginExpiredAgain:
          "ログインの有効期限が切れました。もう一度ログインしてください。",

        workspaceLoadError: "ワークスペース一覧を読み込めませんでした。",

        activityUpdateError: "活動状態を変更できませんでした。",

        logoutError: "ログアウト処理中にエラーが発生しました。",

        noSelectedWorkspace: "選択されたワークスペースがありません。",
      },
      joinWorkspace: {
        title: "招待コードで参加",

        description: "受け取った招待コードを入力してください。",

        inviteCode: "招待コード",

        inviteCodePlaceholder: "招待コードを入力してください。",

        enter: "参加",
      },
      findPassword: {
        title: "パスワードを探す",
        emailVerification: "メール認証",
        getCode: "コードを受け取る",
        resend: "再送信",
        sending: "送信中...",
        verificationCode: "認証コード",
        verificationCodePlaceholder: "認証コードを入力",
        verify: "認証",
        verifying: "認証中...",

        newPassword: "新しいパスワード",
        passwordPlaceholder: "8文字以上",
        passwordConfirmPlaceholder: "新しいパスワードを確認",

        changing: "変更中...",
        complete: "完了",

        successTitle: "パスワード変更完了",
        loginWithNewPassword: "新しいパスワードでログインしてください。",

        messages: {
          checkResetGuide: "パスワード再設定の案内を確認してください。",
          passwordChanged: "パスワードが変更されました。",
        },

        errors: {
          emailRequired: "メールアドレスを入力してください。",
          invalidEmail: "メールアドレスの形式を確認してください。",
          emailSendFailed: "メールの送信に失敗しました。",
          codeRequestFailed: "認証コードのリクエストに失敗しました。",

          verificationCodeRequired: "認証コードを入力してください。",
          noResetToken: "パスワード再設定トークンを取得できませんでした。",
          invalidInput: "入力内容を確認してください。",
          invalidVerificationCode: "認証コードが一致しません。",
          expiredVerificationCode:
            "認証コードの有効期限が切れているか、すでに使用されています。",
          verificationAttemptsExceeded:
            "認証コードの入力可能回数を超えました。",
          resetRequestNotFound:
            "パスワード再設定の認証リクエストが見つかりません。",
          verificationFailed: "認証コードの確認に失敗しました。",

          newPasswordRequired: "新しいパスワードを入力してください。",
          passwordTooShort: "パスワードは8文字以上で入力してください。",
          passwordTooLong: "パスワードは72バイト以下で入力してください。",
          passwordConfirmRequired:
            "新しいパスワードをもう一度入力してください。",
          passwordMismatch: "パスワードが一致しません。",
          noResetVerification:
            "パスワード再設定の認証情報がありません。もう一度認証してください。",

          invalidPassword: "入力したパスワードを確認してください。",
          resetNotVerified:
            "パスワード再設定の認証が完了していないか、すでに使用されています。",
          invalidResetToken: "パスワード再設定の認証情報が正しくありません。",
          expiredResetToken:
            "パスワード再設定の認証時間が終了しました。もう一度認証してください。",
          resetFailed: "パスワードの変更に失敗しました。",
        },
      },

      message: {
        title: "Message",

        today: "今日",
        me: "{{name}} (自分)",

        viewTranslation: "翻訳を見る",
        viewOriginal: "原文を見る",

        messageLabel: "メッセージ",
        aiTranslation: "AI翻訳",
        send: "送信",

        selectRecipient: "誰にメッセージを送りますか？",
        searchPlaceholder: "名前、会社、チーム、役職で検索",

        all: "すべて",
        company: "所属会社",
        team: "所属チーム",
        position: "役職",

        recentChats: "最近の会話",
        recentActivity: "最近の活動",
        recommended: "おすすめ",

        selectedCount: "{{count}}人選択",

        completeSelection: "選択完了",

        activeMinutesAgo: "{{count}}分前に活動",

        currentTime: "現在",
      },
      login: {
        title: "またお会いできて嬉しいです。",
        description: "グローバルなコラボレーションを続けましょう。",

        workEmail: "業務用メール",

        password: "パスワード",
        passwordPlaceholder: "パスワードを入力",

        showPassword: "パスワードを表示",
        hidePassword: "パスワードを非表示",

        forgotPassword: "パスワードをお忘れですか？",

        login: "ログイン",
        loggingIn: "ログイン中...",

        noAccount: "まだアカウントをお持ちでないですか？",

        signup: "会員登録",

        errors: {
          emailRequired: "メールアドレスを入力してください。",

          passwordRequired: "パスワードを入力してください。",

          noAccessToken: "ログイントークンを取得できませんでした。",

          invalidInput: "メールアドレスまたはパスワードを確認してください。",

          unauthorized: "メールアドレスまたはパスワードが一致しません。",

          loginFailed: "ログインに失敗しました。",
        },
      },

      mainHero: {
        title: "グローバルな協業を途切れることなく続けましょう",

        description:
          "言語やタイムゾーンを越えて、引き継ぎ・コミュニケーション・プロジェクト管理を一つのワークスペースで管理できます。",

        createNewWorkspace: "新しいワークスペースを作成",

        joinInvitedWorkspace: "招待されたワークスペースに参加",

        createWorkspace: "ワークスペースを作成",
      },
      onboarding: {
        welcome: "ようこそ、{{name}}さん！",

        step1: {
          title: "業務を始める前に基本情報を入力してください。",
          description: "一緒に働くチームがあなたを理解しやすくなります。",
        },

        step2: {
          title: "勤務時間を設定してください。",
          description:
            "お互いの勤務時間を把握し、必要なときに業務を引き継げます。",
        },

        step3: {
          title: "一緒に働くスペースを選択してください。",
          description:
            "新しいワークスペースを作成するか、招待されたチームに参加できます。",
        },

        company: "所属企業",
        companyPlaceholder: "企業名を入力してください。",

        departmentTeam: "部署 / チーム",
        departmentPlaceholder: "部署名を入力してください。",
        teamPlaceholder: "チーム名を入力してください。",

        position: "役職",
        positionPlaceholder: "役職名を入力してください。",

        defaultLanguage: "基本言語設定",

        countryTimezone: "国 / タイムゾーン",
        countryPlaceholder: "国と地域を選択してください。",

        autoHoliday: "国の祝日を自動追加",

        workDays: "勤務曜日",
        workTime: "勤務開始時間 / 終了時間",

        startTime: "勤務開始時間",
        endTime: "勤務終了時間",

        createWorkspace: "新しいワークスペースを作成",
        joinWorkspace: "招待リンクでチームに参加",
      },

      weekDays: {
        sun: "日",
        mon: "月",
        tue: "火",
        wed: "水",
        thu: "木",
        fri: "金",
        sat: "土",
      },

      signup: {
        title: "グローバルな協業を始めましょう。",
        description: "時差があっても業務は続きます。",

        name: "名前",
        workEmail: "業務用メール",

        verified: "認証完了",
        sending: "送信中",
        verify: "認証",
        seconds: "{{count}}秒",

        codePlaceholder: "認証コードを入力してください。",

        complete: "完了",
        checking: "確認中",

        password: "パスワード",
        passwordPlaceholder: "8文字以上",

        passwordCheck: "パスワード確認",
        passwordCheckPlaceholder: "パスワードを再入力",

        showPassword: "パスワードを表示",
        hidePassword: "パスワードを非表示",

        signup: "会員登録",

        or: "または",

        alreadyHaveAccount: "すでにアカウントをお持ちですか？",

        messages: {
          codeSent: "認証コードをメールで送信しました。",
          emailVerified: "メール認証が完了しました。",
        },

        errors: {
          emailChanged:
            "メールアドレスが変更されました。もう一度認証してください。",

          emailRequired: "メールアドレスを入力してください。",

          invalidEmail: "正しいメールアドレス形式で入力してください。",

          duplicateEmail: "すでに登録されているメールアドレスです。",

          tooFrequent:
            "認証コード送信後、60秒待ってから再度リクエストしてください。",

          emailSendFailed:
            "メール送信に失敗しました。しばらくしてから再度お試しください。",

          codeSendFailed: "認証コードの送信に失敗しました。",

          codeRequired: "認証コードを入力してください。",

          codeSixDigits: "認証コードは6桁の数字です。",

          invalidVerificationInput:
            "メールアドレスまたは認証コードの形式を確認してください。",

          invalidCode: "認証コードが一致しません。",

          expiredCode:
            "認証コードの有効期限が切れました。新しいコードをリクエストしてください。",

          attemptsExceeded:
            "認証コードの入力可能回数を超えました。新しいコードをリクエストしてください。",

          requestNotFound:
            "このメールアドレスの認証リクエストがありません。先に認証コードをリクエストしてください。",

          verificationFailed: "メール認証に失敗しました。",

          nameRequired: "名前を入力してください。",

          workEmailRequired: "業務用メールを入力してください。",

          emailVerificationRequired: "メール認証を完了してください。",

          passwordRequired: "パスワードを入力してください。",

          passwordTooShort: "パスワードは8文字以上で入力してください。",

          passwordCheckRequired: "パスワード確認を入力してください。",

          passwordMismatch: "パスワードが一致しません。",
        },
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,

  lng: savedLanguage,

  fallbackLng: "ko",

  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
