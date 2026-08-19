import {
  useEffect,
  useState,
} from "react";

import styles from "./WorkspaceMembers.module.css";

import chatIcon3 from "../../../../assets/icons/chatIcon3.svg";
import dropdownIcon from "../../../../assets/icons/dropdownIcon.svg";

import MessageModal from "../../../../components/MessageModal/MessageModal";

import {
  getOrganizationChart,
  getWorkspaceMembers,
  updateWorkspaceMembers,
} from "../../../../api/memberApi";


/* ==================================================
   기존 UI 역할

   담당자 / 검토자 / 승인자 / 참조자
================================================== */

const ROLE_OPTIONS = [
  "담당자",
  "검토자",
  "승인자",
  "참조자",
];


/* ==================================================
   실제 워크스페이스 권한

   OWNER는 직접 지정 불가
================================================== */

const WORKSPACE_ROLE_OPTIONS = [
  "MEMBER",
  "ADMIN",
];


function WorkspaceMembers() {
  /* ==================================================
     탭
  ================================================== */

  const [
    activeTab,
    setActiveTab,
  ] = useState("company");


  /* ==================================================
     멤버
  ================================================== */

  const [
    companyMembers,
    setCompanyMembers,
  ] = useState([]);


  const [
    partnerMembers,
    setPartnerMembers,
  ] = useState([]);


  /* ==================================================
     현재 로그인 사용자 권한
  ================================================== */

  const [
    currentUserRole,
    setCurrentUserRole,
  ] = useState(null);


  /* ==================================================
     기존 역할 드롭다운
  ================================================== */

  const [
    openRoleId,
    setOpenRoleId,
  ] = useState(null);


  /* ==================================================
     정보 수정
  ================================================== */

  const [
    editingMemberId,
    setEditingMemberId,
  ] = useState(null);


  const [
    editTeamName,
    setEditTeamName,
  ] = useState("");


  const [
    editJobTitle,
    setEditJobTitle,
  ] = useState("");


  const [
    editWorkspaceRole,
    setEditWorkspaceRole,
  ] = useState("MEMBER");


  const [
    isWorkspaceRoleOpen,
    setIsWorkspaceRoleOpen,
  ] = useState(false);


  const [
    isSaving,
    setIsSaving,
  ] = useState(false);


  /* ==================================================
     채팅
  ================================================== */

  const [
    isMessageOpen,
    setIsMessageOpen,
  ] = useState(false);


  /* ==================================================
     조회 상태
  ================================================== */

  const [
    loading,
    setLoading,
  ] = useState(true);


  const [
    errorMessage,
    setErrorMessage,
  ] = useState("");


  /*
    저장 성공 후 서버 데이터를 다시 조회하기 위한 값
  */

  const [
    reloadKey,
    setReloadKey,
  ] = useState(0);


  /* ==================================================
     조직도 + 워크스페이스 멤버 조회
  ================================================== */

  useEffect(() => {
    let cancelled = false;


    const loadMembers =
      async () => {
        await Promise.resolve();


        if (cancelled) {
          return;
        }


        const workspaceId =
          localStorage.getItem(
            "workspaceId"
          );


        const userEmail =
          localStorage.getItem(
            "userEmail"
          );


        const userName =
          localStorage.getItem(
            "userName"
          );


        const userCompany =
          localStorage.getItem(
            "userCompany"
          );


        const workspaceCompanyName =
          localStorage.getItem(
            "workspaceCompanyName"
          );


        if (!workspaceId) {
          setErrorMessage(
            "선택된 워크스페이스가 없습니다."
          );

          setLoading(false);

          return;
        }


        try {
          const [
            organizationResponse,
            workspaceMembersResponse,
          ] =
            await Promise.all([
              getOrganizationChart(
                workspaceId
              ),

              getWorkspaceMembers(
                workspaceId,
                {
                  status: "ACTIVE",
                }
              ),
            ]);


          if (cancelled) {
            return;
          }


          console.log(
            "조직도 조회 성공:",
            organizationResponse
          );


          console.log(
            "워크스페이스 멤버 조회 성공:",
            workspaceMembersResponse
          );


          /* ==================================================
             1. 조직도 데이터

             기존 코드와 동일하게
             response.data.teams 사용
          ================================================== */

          const teams =
            Array.isArray(
              organizationResponse
                ?.data
                ?.teams
            )
              ? organizationResponse
                  .data
                  .teams
              : [];


          /* ==================================================
             2. 워크스페이스 멤버 조회 데이터
          ================================================== */

          const workspaceMembers =
            Array.isArray(
              workspaceMembersResponse
                ?.data
                ?.members
            )
              ? workspaceMembersResponse
                  .data
                  .members
              : [];


          console.log(
            "조직도 teams:",
            teams
          );


          console.log(
            "워크스페이스 members:",
            workspaceMembers
          );


          /* ==================================================
             memberId 기준 Map

             조직도 memberId
                     ↕
             워크스페이스 memberId
          ================================================== */

          const workspaceMemberMap =
            new Map(
              workspaceMembers.map(
                (member) => [
                  member.memberId,
                  member,
                ]
              )
            );


          /* ==================================================
             조직도 데이터를 화면용으로 변환

             ★ 이름 / 이메일 / 기업 / 직책 / 활동상태는
               조직도 조회 데이터를 우선 사용

             ★ teamName은
               workspace member의 teamName을 우선 사용
               → 팀 수정 후 바로 반영 가능

             ★ workspaceRole만
               워크스페이스 멤버 조회에서 가져옴
          ================================================== */

          const formattedMembers =
            teams.flatMap(
              (team) =>
                (
                  team.members ||
                  []
                ).map(
                  (member) => {
                    const workspaceMember =
                      workspaceMemberMap.get(
                        member.memberId
                      );


                    const resolvedTeam =
                      workspaceMember
                        ?.teamName ||
                      member.teamName ||
                      team.teamName ||
                      "팀 미지정";


                    return {
                      id:
                        member.memberId,

                      name:
                        member.name ??
                        workspaceMember
                          ?.name ??
                        "-",

                      email:
                        member.email ??
                        workspaceMember
                          ?.email ??
                        "-",

                      company:
                        member.companyName ??
                        workspaceMember
                          ?.companyName ??
                        "-",

                      team:
                        resolvedTeam,

                      position:
                        member.jobTitle ??
                        workspaceMember
                          ?.jobTitle ??
                        "-",

                      active:
                        member.activityStatus ===
                          "ACTIVE" ||
                        workspaceMember
                          ?.status ===
                          "ACTIVE",

                      /*
                        기존 역할 드롭다운은
                        API workspace role과 별개
                      */
                      displayRole:
                        "담당자",

                      /*
                        실제 워크스페이스 권한
                      */
                      workspaceRole:
                        workspaceMember
                          ?.role ??
                        "MEMBER",

                      status:
                        workspaceMember
                          ?.status ??
                        member.activityStatus ??
                        null,

                      /*
                        아래에서 현재 사용자 판단 후
                        다시 값을 넣음
                      */
                      isMe:
                        false,
                    };
                  }
                )
            );


          /* ==================================================
             현재 로그인 사용자 찾기

             1순위: 이메일
             2순위: 이름 + 기업

             조직도 정보 기준
          ================================================== */

          let currentMember =
            formattedMembers.find(
              (member) =>
                userEmail &&
                member.email !== "-" &&
                member.email ===
                  userEmail
            );


          /*
            이메일로 못 찾았을 경우
            현재 localStorage의 userName + userCompany 사용
          */

          if (!currentMember) {
            currentMember =
              formattedMembers.find(
                (member) =>
                  userName &&
                  member.name ===
                    userName &&
                  (
                    !userCompany ||
                    member.company ===
                      userCompany
                  )
              );
          }


          console.log(
            "현재 사용자로 판별된 조직도 멤버:",
            currentMember
          );


          /*
            같은 memberId로 워크스페이스 권한 가져오기
          */

          const currentWorkspaceMember =
            currentMember
              ? workspaceMemberMap.get(
                  currentMember.id
                )
              : null;


          const detectedRole =
            currentWorkspaceMember
              ?.role ??
            currentMember
              ?.workspaceRole ??
            null;


          console.log(
            "현재 사용자 워크스페이스 권한:",
            detectedRole
          );


          setCurrentUserRole(
            detectedRole
          );


          /* ==================================================
             (나) 표시
          ================================================== */

          const membersWithMe =
            formattedMembers.map(
              (member) => ({
                ...member,

                isMe:
                  Boolean(
                    currentMember &&
                    member.id ===
                      currentMember.id
                  ),
              })
            );


          /* ==================================================
             자사 / 파트너사 분리
          ================================================== */

          const company = [];

          const partner = [];


          membersWithMe.forEach(
            (member) => {
              if (
                workspaceCompanyName &&
                member.company ===
                  workspaceCompanyName
              ) {
                company.push(
                  member
                );
              } else {
                partner.push(
                  member
                );
              }
            }
          );


          setCompanyMembers(
            company
          );


          setPartnerMembers(
            partner
          );


          setErrorMessage("");

          setLoading(false);
        } catch (error) {
          if (cancelled) {
            return;
          }


          console.error(
            "워크스페이스 멤버/조직도 조회 실패:",
            error
          );


          console.error(
            "서버 응답:",
            error.response?.data
          );


          const responseData =
            error.response?.data;


          if (
            responseData?.code ===
            "401UNAUTHORIZED"
          ) {
            setErrorMessage(
              "인증 정보가 유효하지 않습니다."
            );
          } else if (
            responseData?.code ===
            "403WORKSPACE_ACCESS_DENIED"
          ) {
            setErrorMessage(
              "워크스페이스에 접근할 권한이 없습니다."
            );
          } else if (
            responseData?.code ===
            "404WORKSPACE_NOT_FOUND"
          ) {
            setErrorMessage(
              "워크스페이스를 찾을 수 없습니다."
            );
          } else {
            setErrorMessage(
              responseData?.message ||
                "멤버 정보를 불러오지 못했습니다."
            );
          }


          setLoading(false);
        }
      };


    void loadMembers();


    return () => {
      cancelled = true;
    };
  }, [reloadKey]);


  /* ==================================================
     현재 탭 멤버
  ================================================== */

  const members =
    activeTab ===
    "company"
      ? companyMembers
      : partnerMembers;


  /* ==================================================
     멤버 수정 가능 여부

     OWNER / ADMIN만 가능
  ================================================== */

  const canManageMembers =
    currentUserRole ===
      "OWNER" ||
    currentUserRole ===
      "ADMIN";


  /* ==================================================
     기존 역할 선택

     담당자 / 검토자 / 승인자 / 참조자

     기존 UI 상태 유지
  ================================================== */

  const handleRoleSelect = (
    memberId,
    role
  ) => {
    const updateMembers =
      (prev) =>
        prev.map(
          (member) =>
            member.id ===
            memberId
              ? {
                  ...member,

                  displayRole:
                    role,
                }
              : member
        );


    if (
      activeTab ===
      "company"
    ) {
      setCompanyMembers(
        updateMembers
      );
    } else {
      setPartnerMembers(
        updateMembers
      );
    }


    setOpenRoleId(null);
  };


  /* ==================================================
     정보 수정 열기
  ================================================== */

  const handleEditOpen =
    (member) => {
      setEditingMemberId(
        member.id
      );


      setEditTeamName(
        member.team ===
          "팀 미지정"
          ? ""
          : member.team
      );


      setEditJobTitle(
        member.position ===
          "-"
          ? ""
          : member.position
      );


      if (
        member.workspaceRole ===
          "ADMIN" ||
        member.workspaceRole ===
          "MEMBER"
      ) {
        setEditWorkspaceRole(
          member.workspaceRole
        );
      } else {
        setEditWorkspaceRole(
          "MEMBER"
        );
      }


      setOpenRoleId(null);

      setIsWorkspaceRoleOpen(
        false
      );
    };


  /* ==================================================
     정보 수정 닫기
  ================================================== */

  const handleEditCancel =
    () => {
      setEditingMemberId(
        null
      );


      setEditTeamName("");

      setEditJobTitle("");

      setEditWorkspaceRole(
        "MEMBER"
      );


      setIsWorkspaceRoleOpen(
        false
      );
    };


  /* ==================================================
     실제 멤버 수정 저장

     PUT
     /api/v1/workspaces/{workspaceId}/members
  ================================================== */

  const handleEditSave =
    async (
      member
    ) => {
      const workspaceId =
        localStorage.getItem(
          "workspaceId"
        );


      if (!workspaceId) {
        console.warn(
          "workspaceId가 없습니다."
        );

        return;
      }


      const updateAction = {
        action:
          "UPDATE",

        memberId:
          member.id,
      };


      /* ==================================================
         소속 팀
      ================================================== */

      const newTeamName =
        editTeamName.trim();


      const oldTeamName =
        member.team ===
          "팀 미지정"
          ? ""
          : member.team;


      if (
        newTeamName &&
        newTeamName !==
          oldTeamName
      ) {
        updateAction.teamName =
          newTeamName;
      }


      /* ==================================================
         직책
      ================================================== */

      const newJobTitle =
        editJobTitle.trim();


      const oldJobTitle =
        member.position === "-"
          ? ""
          : member.position;


      if (
        newJobTitle &&
        newJobTitle !==
          oldJobTitle
      ) {
        updateAction.jobTitle =
          newJobTitle;
      }


      /* ==================================================
         워크스페이스 권한

         OWNER는 변경 불가
      ================================================== */

      if (
        member.workspaceRole !==
          "OWNER" &&
        editWorkspaceRole !==
          member.workspaceRole
      ) {
        updateAction.role =
          editWorkspaceRole;
      }


      /* ==================================================
         변경사항 확인
      ================================================== */

      const hasChanges =
        Object.keys(
          updateAction
        ).length > 2;


      if (!hasChanges) {
        console.log(
          "변경된 멤버 정보가 없습니다."
        );

        handleEditCancel();

        return;
      }


      console.log(
        "워크스페이스 멤버 수정 요청:",
        {
          actions: [
            updateAction,
          ],
        }
      );


      try {
        setIsSaving(
          true
        );


        const response =
          await updateWorkspaceMembers(
            workspaceId,
            [
              updateAction,
            ]
          );


        console.log(
          "워크스페이스 멤버 수정 성공:",
          response
        );


        handleEditCancel();


        /*
          서버 값 다시 조회
        */

        setLoading(true);


        setReloadKey(
          (prev) =>
            prev + 1
        );
      } catch (error) {
        console.error(
          "워크스페이스 멤버 수정 실패:",
          error
        );


        console.error(
          "서버 응답:",
          error.response?.data
        );
      } finally {
        setIsSaving(
          false
        );
      }
    };


  /* ==================================================
     워크스페이스 권한 선택
  ================================================== */

  const handleWorkspaceRoleSelect =
    (role) => {
      setEditWorkspaceRole(
        role
      );


      setIsWorkspaceRoleOpen(
        false
      );
    };


  /* ==================================================
     탭
  ================================================== */

  const handleTabChange =
    (tab) => {
      setActiveTab(
        tab
      );


      setOpenRoleId(null);


      handleEditCancel();
    };


  /* ==================================================
     채팅
  ================================================== */

  const handleChatOpen =
    () => {
      setIsMessageOpen(
        true
      );
    };


  const handleChatClose =
    () => {
      setIsMessageOpen(
        false
      );
    };


  return (
    <>
      <main
        className={
          styles.page
        }
      >
        {/* ==================================================
            제목
        ================================================== */}

        <h1
          className={
            styles.title
          }
        >
          워크스페이스 멤버
        </h1>


        {/* ==================================================
            탭
        ================================================== */}

        <div
          className={
            styles.tabs
          }
        >
          <button
            type="button"
            className={`${styles.tabButton} ${
              activeTab ===
              "company"
                ? styles.activeTab
                : ""
            }`}
            onClick={() =>
              handleTabChange(
                "company"
              )
            }
          >
            자사
          </button>


          <button
            type="button"
            className={`${styles.tabButton} ${
              activeTab ===
              "partner"
                ? styles.activeTab
                : ""
            }`}
            onClick={() =>
              handleTabChange(
                "partner"
              )
            }
          >
            파트너사
          </button>
        </div>


        {/* ==================================================
            멤버 목록
        ================================================== */}

        <div
          className={
            styles.memberList
          }
        >
          {loading && (
            <p
              className={
                styles.stateText
              }
            >
              조직도를 불러오는 중입니다.
            </p>
          )}


          {!loading &&
            errorMessage && (
              <p
                className={
                  styles.stateText
                }
              >
                {errorMessage}
              </p>
            )}


          {!loading &&
            !errorMessage &&
            members.length ===
              0 && (
              <p
                className={
                  styles.stateText
                }
              >
                등록된 멤버가 없습니다.
              </p>
            )}


          {!loading &&
            !errorMessage &&
            members.map(
              (member) => {
                const isEditing =
                  editingMemberId ===
                  member.id;


                return (
                  <article
                    key={
                      member.id
                    }
                    className={`${styles.memberCard} ${
                      isEditing
                        ? styles.memberCardEditing
                        : ""
                    }`}
                  >
                    {/* ==================================================
                        기존 카드
                    ================================================== */}

                    <div
                      className={
                        styles.memberMain
                      }
                    >
                      <div
                        className={
                          styles.avatar
                        }
                      />


                      <div
                        className={
                          styles.memberInfo
                        }
                      >
                        {/* 이름 */}

                        <div
                          className={
                            styles.nameRow
                          }
                        >
                          <strong
                            className={
                              styles.memberName
                            }
                          >
                            {
                              member.name
                            }
                          </strong>


                          {member.isMe && (
                            <span
                              className={
                                styles.meText
                              }
                            >
                              (나)
                            </span>
                          )}


                          {member.active && (
                            <div
                              className={
                                styles.activeArea
                              }
                            >
                              <span
                                className={
                                  styles.activeText
                                }
                              >
                                활동 중
                              </span>


                              <span
                                className={
                                  styles.activeDot
                                }
                              />
                            </div>
                          )}
                        </div>


                        {/* 기업 · 팀 · 직책 */}

                        <p
                          className={
                            styles.jobText
                          }
                        >
                          {
                            member.company
                          }
                          {" · "}
                          {
                            member.team
                          }
                          {" · "}
                          {
                            member.position
                          }
                        </p>


                        {/* 이메일 + 기존 역할 */}

                        <div
                          className={
                            styles.bottomRow
                          }
                        >
                          <span
                            className={
                              styles.email
                            }
                          >
                            {
                              member.email
                            }
                          </span>


                          {/* ==================================================
                              기존 역할 드롭다운
                          ================================================== */}

                          <div
                            className={
                              styles.roleDropdown
                            }
                          >
                            <button
                              type="button"
                              className={
                                styles.roleButton
                              }
                              onClick={() =>
                                setOpenRoleId(
                                  (
                                    prev
                                  ) =>
                                    prev ===
                                    member.id
                                      ? null
                                      : member.id
                                )
                              }
                            >
                              <span>
                                {
                                  member.displayRole
                                }
                              </span>


                              <img
                                src={
                                  dropdownIcon
                                }
                                alt=""
                                className={`${
                                  styles.dropdownIcon
                                } ${
                                  openRoleId ===
                                  member.id
                                    ? styles.dropdownIconOpen
                                    : ""
                                }`}
                              />
                            </button>


                            {openRoleId ===
                              member.id && (
                              <div
                                className={
                                  styles.roleMenu
                                }
                              >
                                {ROLE_OPTIONS
                                  .filter(
                                    (
                                      role
                                    ) =>
                                      role !==
                                      member.displayRole
                                  )
                                  .map(
                                    (
                                      role
                                    ) => (
                                      <button
                                        key={
                                          role
                                        }
                                        type="button"
                                        className={
                                          styles.roleOption
                                        }
                                        onClick={() =>
                                          handleRoleSelect(
                                            member.id,
                                            role
                                          )
                                        }
                                      >
                                        {
                                          role
                                        }
                                      </button>
                                    )
                                  )}
                              </div>
                            )}
                          </div>


                          {/* ==================================================
                              정보 수정 버튼

                              OWNER / ADMIN만 표시
                          ================================================== */}

                          {canManageMembers && (
                            <button
                              type="button"
                              className={
                                styles.editButton
                              }
                              onClick={() =>
                                isEditing
                                  ? handleEditCancel()
                                  : handleEditOpen(
                                      member
                                    )
                              }
                            >
                              {isEditing
                                ? "닫기"
                                : "정보 수정"}
                            </button>
                          )}
                        </div>
                      </div>


                      {/* 채팅 */}

                      <button
                        type="button"
                        className={
                          styles.chatButton
                        }
                        aria-label={`${member.name}에게 메시지 보내기`}
                        onClick={
                          handleChatOpen
                        }
                      >
                        <img
                          src={
                            chatIcon3
                          }
                          alt=""
                        />
                      </button>
                    </div>


                    {/* ==================================================
                        정보 수정 영역
                    ================================================== */}

                    {isEditing && (
                      <div
                        className={
                          styles.editArea
                        }
                      >
                        {/* 소속 팀 */}

                        <div
                          className={
                            styles.editField
                          }
                        >
                          <label>
                            소속 팀
                          </label>


                          <input
                            type="text"
                            value={
                              editTeamName
                            }
                            placeholder="팀 이름 입력"
                            onChange={(
                              event
                            ) =>
                              setEditTeamName(
                                event
                                  .target
                                  .value
                              )
                            }
                          />
                        </div>


                        {/* 직책 */}

                        <div
                          className={
                            styles.editField
                          }
                        >
                          <label>
                            직책
                          </label>


                          <input
                            type="text"
                            value={
                              editJobTitle
                            }
                            placeholder="직책 입력"
                            onChange={(
                              event
                            ) =>
                              setEditJobTitle(
                                event
                                  .target
                                  .value
                              )
                            }
                          />
                        </div>


                        {/* 워크스페이스 권한 */}

                        <div
                          className={
                            styles.editField
                          }
                        >
                          <label>
                            워크스페이스 권한
                          </label>


                          <div
                            className={
                              styles.workspaceRoleDropdown
                            }
                          >
                            <button
                              type="button"
                              className={
                                styles.workspaceRoleButton
                              }
                              disabled={
                                member.workspaceRole ===
                                "OWNER"
                              }
                              onClick={() =>
                                setIsWorkspaceRoleOpen(
                                  (
                                    prev
                                  ) =>
                                    !prev
                                )
                              }
                            >
                              <span>
                                {member.workspaceRole ===
                                "OWNER"
                                  ? "OWNER"
                                  : editWorkspaceRole}
                              </span>


                              {member.workspaceRole !==
                                "OWNER" && (
                                <img
                                  src={
                                    dropdownIcon
                                  }
                                  alt=""
                                  className={`${
                                    styles.dropdownIcon
                                  } ${
                                    isWorkspaceRoleOpen
                                      ? styles.dropdownIconOpen
                                      : ""
                                  }`}
                                />
                              )}
                            </button>


                            {isWorkspaceRoleOpen &&
                              member.workspaceRole !==
                                "OWNER" && (
                                <div
                                  className={
                                    styles.workspaceRoleMenu
                                  }
                                >
                                  {WORKSPACE_ROLE_OPTIONS.map(
                                    (
                                      role
                                    ) => (
                                      <button
                                        key={
                                          role
                                        }
                                        type="button"
                                        className={`${styles.workspaceRoleOption} ${
                                          editWorkspaceRole ===
                                          role
                                            ? styles.workspaceRoleOptionSelected
                                            : ""
                                        }`}
                                        onClick={() =>
                                          handleWorkspaceRoleSelect(
                                            role
                                          )
                                        }
                                      >
                                        {
                                          role
                                        }
                                      </button>
                                    )
                                  )}
                                </div>
                              )}
                          </div>
                        </div>


                        {/* 취소 / 저장 */}

                        <div
                          className={
                            styles.editActions
                          }
                        >
                          <button
                            type="button"
                            className={
                              styles.cancelButton
                            }
                            onClick={
                              handleEditCancel
                            }
                            disabled={
                              isSaving
                            }
                          >
                            취소
                          </button>


                          <button
                            type="button"
                            className={
                              styles.saveButton
                            }
                            onClick={() =>
                              handleEditSave(
                                member
                              )
                            }
                            disabled={
                              isSaving
                            }
                          >
                            {isSaving
                              ? "저장 중"
                              : "저장"}
                          </button>
                        </div>
                      </div>
                    )}
                  </article>
                );
              }
            )}
        </div>
      </main>


      {/* ==================================================
          기존 채팅 모달
      ================================================== */}

      {isMessageOpen && (
        <MessageModal
          onClose={
            handleChatClose
          }
        />
      )}
    </>
  );
}


export default WorkspaceMembers;