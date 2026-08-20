import {
  useEffect,
  useState,
} from "react";

import styles from "./WorkspaceMembers.module.css";

import chatIcon3 from "../../../../assets/icons/chatIcon3.svg";

import MessageModal from "../../../../components/MessageModal/MessageModal";

import {
  getOrganizationChart,
  getWorkspaceMembers,
} from "../../../../api/memberApi";


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
     채팅
  ================================================== */

  const [
    isMessageOpen,
    setIsMessageOpen,
  ] = useState(false);


  const [
    selectedMember,
    setSelectedMember,
  ] = useState(null);


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


  /* ==================================================
     조직도 + 워크스페이스 멤버 조회
  ================================================== */

  useEffect(() => {
    let cancelled =
      false;


    const loadMembers =
      async () => {
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


          setLoading(
            false
          );


          return;
        }


        try {
          setLoading(
            true
          );


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
                  status:
                    "ACTIVE",
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
             조직도 데이터
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
             워크스페이스 멤버 데이터
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


          /* ==================================================
             memberId 기준 Map

             조직도 응답에 없는 값 보완
          ================================================== */

          const workspaceMemberMap =
            new Map(
              workspaceMembers.map(
                (
                  member
                ) => [
                  member.memberId,
                  member,
                ]
              )
            );


          /* ==================================================
             조직도 화면 데이터
          ================================================== */

          const formattedMembers =
            teams.flatMap(
              (
                team
              ) =>
                (
                  team.members ||
                  []
                ).map(
                  (
                    member
                  ) => {
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

                      /*
                        화면에는 이메일 표시 안 함.

                        현재 사용자 판별용으로만 유지
                      */
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

                      isMe:
                        false,
                    };
                  }
                )
            );


          /* ==================================================
             현재 로그인 사용자 찾기

             1순위 이메일
             2순위 이름 + 기업
          ================================================== */

          let currentMember =
            formattedMembers.find(
              (
                member
              ) =>
                Boolean(
                  userEmail
                ) &&
                member.email !==
                  "-" &&
                member.email ===
                  userEmail
            );


          if (!currentMember) {
            currentMember =
              formattedMembers.find(
                (
                  member
                ) =>
                  Boolean(
                    userName
                  ) &&
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


          /* ==================================================
             (나) 표시
          ================================================== */

          const membersWithMe =
            formattedMembers.map(
              (
                member
              ) => ({
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

          const company =
            [];


          const partner =
            [];


          membersWithMe.forEach(
            (
              member
            ) => {
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


          setErrorMessage(
            ""
          );
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
              responseData
                ?.message ||
                "멤버 정보를 불러오지 못했습니다."
            );
          }
        } finally {
          if (!cancelled) {
            setLoading(
              false
            );
          }
        }
      };


    void loadMembers();


    return () => {
      cancelled =
        true;
    };
  }, []);


  /* ==================================================
     현재 탭 멤버
  ================================================== */

  const members =
    activeTab ===
    "company"
      ? companyMembers
      : partnerMembers;


  /* ==================================================
     탭 변경
  ================================================== */

  const handleTabChange =
    (
      tab
    ) => {
      setActiveTab(
        tab
      );
    };


  /* ==================================================
     채팅
  ================================================== */

  const handleChatOpen =
    (
      member
    ) => {
      setSelectedMember(
        member
      );


      setIsMessageOpen(
        true
      );
    };


  const handleChatClose =
    () => {
      setIsMessageOpen(
        false
      );


      setSelectedMember(
        null
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
                {
                  errorMessage
                }
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
              (
                member
              ) => (
                <article
                  key={
                    member.id
                  }
                  className={
                    styles.memberCard
                  }
                >
                  <div
                    className={
                      styles.memberMain
                    }
                  >
                    {/* =========================
                        프로필 이미지
                    ========================= */}

                    <div
                      className={
                        styles.avatar
                      }
                    />


                    {/* =========================
                        멤버 정보
                    ========================= */}

                    <div
                      className={
                        styles.memberInfo
                      }
                    >
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


                      {/* =========================
                          기업 · 팀 · 직책
                      ========================= */}

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
                    </div>


                    {/* =========================
                        채팅
                    ========================= */}

                    <button
                      type="button"
                      className={
                        styles.chatButton
                      }
                      aria-label={`${member.name}에게 메시지 보내기`}
                      onClick={() =>
                        handleChatOpen(
                          member
                        )
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
                </article>
              )
            )}
        </div>
      </main>


      {/* ==================================================
          채팅 모달
      ================================================== */}

      {isMessageOpen && (
        <MessageModal
          member={
            selectedMember
          }
          onClose={
            handleChatClose
          }
        />
      )}
    </>
  );
}


export default WorkspaceMembers;