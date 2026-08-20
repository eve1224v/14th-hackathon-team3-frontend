import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import styles from "./TransferInfoPanel.module.css";

import calendarIcon2 from "../../../../assets/icons/calendarIcon2.svg";

import {
  getProjectDetail,
  getProjectMembers,
} from "../../../../api/projectApi";


const normalizeName =
  (
    value
  ) =>
    String(
      value ||
        ""
    )
      .trim()
      .toLowerCase();


const belongsToTeam =
  (
    member,
    team
  ) => {
    if (
      !member ||
      !team
    ) {
      return false;
    }


    if (
      member.teamId !=
        null &&
      team.teamId !=
        null
    ) {
      return (
        Number(
          member.teamId
        ) ===
        Number(
          team.teamId
        )
      );
    }


    return (
      Boolean(
        member.teamName &&
        team.teamName
      ) &&
      normalizeName(
        member.teamName
      ) ===
        normalizeName(
          team.teamName
        )
    );
  };


const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];


const WEEKDAYS = [
  "SUN",
  "MON",
  "TUE",
  "WED",
  "THU",
  "FRI",
  "SAT",
];


function TransferInfoPanel({
  initialDelivery = null,
  onChange,
  onSave,
  isLocked = false,
}) {
  const calendarRef =
    useRef(null);


  const [
    isEditing,
    setIsEditing,
  ] = useState(false);


  const [
    isSaving,
    setIsSaving,
  ] = useState(false);


  const [
    teams,
    setTeams,
  ] = useState([]);


  const [
    members,
    setMembers,
  ] = useState([]);


  const [
    selectedTeamId,
    setSelectedTeamId,
  ] = useState(null);


  const [
    selectedMemberId,
    setSelectedMemberId,
  ] = useState(null);


  const [
    teamName,
    setTeamName,
  ] = useState("");


  const [
    managerName,
    setManagerName,
  ] = useState("");


  const [
    editTeamName,
    setEditTeamName,
  ] = useState("");


  const [
    editManagerName,
    setEditManagerName,
  ] = useState("");


  const [
    timingOption,
    setTimingOption,
  ] = useState(
    "next"
  );


  const [
    isCalendarOpen,
    setIsCalendarOpen,
  ] = useState(false);


  const [
    selectedDate,
    setSelectedDate,
  ] = useState(
    () =>
      new Date()
  );


  const [
    calendarMonth,
    setCalendarMonth,
  ] = useState(
    () =>
      new Date()
  );


  /* ==================================================
     달력 외부 클릭
  ================================================== */

  useEffect(() => {
    const handleOutsideClick =
      (
        event
      ) => {
        if (
          calendarRef.current &&
          !calendarRef.current.contains(
            event.target
          )
        ) {
          setIsCalendarOpen(
            false
          );
        }
      };


    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );


    return () =>
      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );
  }, []);


  /* ==================================================
     프로젝트 팀 / 멤버 조회
  ================================================== */

  useEffect(() => {
    let cancelled =
      false;


    const fetchTransferData =
      async () => {
        const projectId =
          localStorage.getItem(
            "projectId"
          );


        if (
          !projectId
        ) {
          return;
        }


        try {
          const [
            projectResponse,
            memberResponse,
          ] =
            await Promise.all([
              getProjectDetail(
                projectId
              ),

              getProjectMembers(
                projectId,
                {
                  status:
                    "ACTIVE",
                }
              ),
            ]);


          if (
            cancelled
          ) {
            return;
          }


          console.log(
            "인수인계 전달 프로젝트 정보:",
            projectResponse
          );


          console.log(
            "인수인계 전달 멤버 정보:",
            memberResponse
          );


          const teamList =
            Array.isArray(
              projectResponse
                ?.data
                ?.teamSchedules
            )
              ? projectResponse
                  .data
                  .teamSchedules
              : [];


          const memberList =
            Array.isArray(
              memberResponse
                ?.data
                ?.members
            )
              ? memberResponse
                  .data
                  .members
              : [];


          setTeams(
            teamList
          );


          setMembers(
            memberList
          );


          /*
            멤버가 실제로 있는 팀을
            기본값으로 우선 사용
          */

          const firstTeamWithMember =
            teamList.find(
              (
                team
              ) =>
                memberList.some(
                  (
                    member
                  ) =>
                    belongsToTeam(
                      member,
                      team
                    )
                )
            ) ||
            teamList[0] ||
            null;


          const initialTeamId =
            initialDelivery
              ?.targetTeamId ??
            firstTeamWithMember
              ?.teamId ??
            null;


          const initialTeam =
            teamList.find(
              (
                team
              ) =>
                Number(
                  team.teamId
                ) ===
                Number(
                  initialTeamId
                )
            ) ||
            firstTeamWithMember;


          const teamId =
            initialTeam
              ?.teamId ??
            null;


          setSelectedTeamId(
            teamId
          );


          setTeamName(
            initialTeam
              ?.teamName ||
              ""
          );


          setEditTeamName(
            initialTeam
              ?.teamName ||
              ""
          );


          const teamMembers =
            memberList.filter(
              (
                member
              ) =>
                belongsToTeam(
                  member,
                  initialTeam
                )
            );


          const initialMember =
            teamMembers.find(
              (
                member
              ) =>
                Number(
                  member.memberId
                ) ===
                Number(
                  initialDelivery
                    ?.recipientMemberId
                )
            ) ||
            teamMembers[0] ||
            null;


          const memberId =
            initialMember
              ?.memberId ??
            null;


          setSelectedMemberId(
            memberId
          );


          setManagerName(
            initialMember
              ?.name ||
              ""
          );


          setEditManagerName(
            initialMember
              ?.name ||
              ""
          );


          if (
            initialDelivery
              ?.timingType ===
            "NEXT_SHIFT_START"
          ) {
            setTimingOption(
              "next"
            );
          }
        } catch (
          error
        ) {
          console.error(
            "인수인계 전달 정보 조회 실패:",
            error
          );
        }
      };


    void fetchTransferData();


    return () => {
      cancelled =
        true;
    };
  }, [
    initialDelivery
      ?.targetTeamId,

    initialDelivery
      ?.recipientMemberId,

    initialDelivery
      ?.timingType,
  ]);


  const selectedTeam =
    useMemo(
      () =>
        teams.find(
          (
            team
          ) =>
            Number(
              team.teamId
            ) ===
            Number(
              selectedTeamId
            )
        ) ||
        null,

      [
        teams,
        selectedTeamId,
      ]
    );


  const selectedMember =
    useMemo(
      () =>
        members.find(
          (
            member
          ) =>
            Number(
              member.memberId
            ) ===
            Number(
              selectedMemberId
            )
        ) ||
        null,

      [
        members,
        selectedMemberId,
      ]
    );


  const companyName =
    selectedMember
      ?.companyName ||
    "기업 정보 없음";


  const workStartTime =
    selectedTeam
      ?.workStartTime
      ?.slice(
        0,
        5
      ) ||
    "09:00";


  const timezone =
    selectedTeam
      ?.timezone ||
    Intl.DateTimeFormat()
      .resolvedOptions()
      .timeZone ||
    "Asia/Seoul";


  /* ==================================================
     달력
  ================================================== */

  const calendarDays =
    useMemo(
      () => {
        const year =
          calendarMonth.getFullYear();


        const month =
          calendarMonth.getMonth();


        const firstDay =
          new Date(
            year,
            month,
            1
          );


        const start =
          new Date(
            year,
            month,
            1 -
              firstDay.getDay()
          );


        return Array.from(
          {
            length:
              42,
          },

          (
            _,
            index
          ) => {
            const date =
              new Date(
                start
              );


            date.setDate(
              start.getDate() +
                index
            );


            return date;
          }
        );
      },

      [
        calendarMonth,
      ]
    );


  const formattedDate =
    new Intl.DateTimeFormat(
      "ko-KR",
      {
        month:
          "long",

        day:
          "numeric",

        weekday:
          "short",
      }
    ).format(
      selectedDate
    );


  const isSameDate =
    (
      left,
      right
    ) =>
      left.getFullYear() ===
        right.getFullYear() &&
      left.getMonth() ===
        right.getMonth() &&
      left.getDate() ===
        right.getDate();


  /* ==================================================
     delivery 값
  ================================================== */

  const getDeliveryValue =
    useCallback(
      (
        teamId =
          selectedTeamId,

        memberId =
          selectedMemberId
      ) => ({
        targetTeamId:
          teamId
            ? Number(
                teamId
              )
            : null,

        recipientMemberId:
          memberId
            ? Number(
                memberId
              )
            : null,

        timingType:
          timingOption ===
          "next"
            ? "NEXT_SHIFT_START"
            : null,

        scheduledAt:
          null,

        timezone,
      }),

      [
        selectedTeamId,
        selectedMemberId,
        timingOption,
        timezone,
      ]
    );


  /* ==================================================
     부모로 전달

     teamId/memberId가 준비되기 전에는
     null delivery로 부모 값을 덮어쓰지 않음
  ================================================== */

  useEffect(() => {
    if (
      !selectedTeamId ||
      !selectedMemberId
    ) {
      return;
    }


    onChange?.(
      getDeliveryValue()
    );
  }, [
    selectedTeamId,
    selectedMemberId,
    timingOption,
    timezone,
    getDeliveryValue,
    onChange,
  ]);


  const handleEdit =
    () => {
      if (
        isLocked
      ) {
        return;
      }


      setEditTeamName(
        teamName
      );


      setEditManagerName(
        managerName
      );


      setIsEditing(
        true
      );
    };


  /* ==================================================
     전달 정보 저장
  ================================================== */

  const handleSave =
    async () => {
      if (
        isLocked
      ) {
        return;
      }


      const trimmedTeamName =
        editTeamName.trim();


      const trimmedManagerName =
        editManagerName.trim();


      if (
        !trimmedTeamName
      ) {
        alert(
          "팀을 입력해주세요."
        );


        return;
      }


      const matchedTeam =
        teams.find(
          (
            team
          ) =>
            normalizeName(
              team.teamName
            ) ===
            normalizeName(
              trimmedTeamName
            )
        );


      if (
        !matchedTeam
      ) {
        alert(
          "프로젝트에 등록된 팀 이름을 입력해주세요."
        );


        return;
      }


      if (
        !trimmedManagerName
      ) {
        alert(
          "담당자를 입력해주세요."
        );


        return;
      }


      const matchedMember =
        members.find(
          (
            member
          ) =>
            belongsToTeam(
              member,
              matchedTeam
            ) &&
            normalizeName(
              member.name
            ) ===
              normalizeName(
                trimmedManagerName
              )
        );


      if (
        !matchedMember
      ) {
        alert(
          "선택한 팀에 등록된 프로젝트 멤버를 입력해주세요."
        );


        return;
      }


      if (
        timingOption ===
        "now"
      ) {
        alert(
          "현재는 다음 업무 시작 시간 전달만 지원합니다."
        );


        return;
      }


      const nextDelivery = {
        targetTeamId:
          Number(
            matchedTeam.teamId
          ),

        recipientMemberId:
          Number(
            matchedMember.memberId
          ),

        timingType:
          "NEXT_SHIFT_START",

        scheduledAt:
          null,

        timezone:
          matchedTeam.timezone ||
          timezone,
      };


      try {
        setIsSaving(
          true
        );


        await onSave?.(
          nextDelivery
        );


        setSelectedTeamId(
          matchedTeam.teamId
        );


        setSelectedMemberId(
          matchedMember.memberId
        );


        setTeamName(
          matchedTeam.teamName ||
            ""
        );


        setManagerName(
          matchedMember.name ||
            ""
        );


        onChange?.(
          nextDelivery
        );


        setIsCalendarOpen(
          false
        );


        setIsEditing(
          false
        );
      } catch (
        error
      ) {
        console.error(
          "전달 정보 저장 실패:",
          error
        );


        alert(
          error.response
            ?.data
            ?.message ||
            error.data
              ?.message ||
            error.message ||
            "전달 정보 저장에 실패했습니다."
        );
      } finally {
        setIsSaving(
          false
        );
      }
    };


  const handleCalendarToggle =
    () => {
      if (
        !isEditing ||
        isLocked ||
        timingOption !==
          "next"
      ) {
        return;
      }


      setIsCalendarOpen(
        (
          open
        ) =>
          !open
      );
    };


  return (
    <section
      className={
        styles.panel
      }
    >
      <div
        className={
          styles.header
        }
      >
        <h2>
          전달 정보
        </h2>


        <button
          type="button"
          className={
            styles.editButton
          }
          disabled={
            isSaving ||
            isLocked
          }
          onClick={
            isEditing
              ? handleSave
              : handleEdit
          }
        >
          {isLocked
            ? "전달 완료"
            : isSaving
              ? "저장 중"
              : isEditing
                ? "저장"
                : "수정"}
        </button>
      </div>


      <div
        className={
          styles.targetSection
        }
      >
        <span
          className={
            styles.label
          }
        >
          전달 대상
        </span>


        <div
          className={
            styles.targetRow
          }
        >
          <strong>
            {
              companyName
            }
          </strong>


          <span
            className={
              styles.partnerBadge
            }
          >
            파트너사
          </span>
        </div>


        {isEditing ? (
          <input
            type="text"
            className={
              styles.teamEditInput
            }
            value={
              editTeamName
            }
            onChange={(
              event
            ) =>
              setEditTeamName(
                event.target.value
              )
            }
          />
        ) : (
          <p
            className={
              styles.teamName
            }
          >
            {teamName ||
              "팀 없음"}
          </p>
        )}
      </div>


      <div
        className={
          styles.managerSection
        }
      >
        <span
          className={
            styles.label
          }
        >
          담당자
        </span>


        <div
          className={
            styles.managerRow
          }
        >
          <div
            className={
              styles.avatar
            }
          />


          {isEditing ? (
            <input
              type="text"
              className={
                styles.managerEditInput
              }
              value={
                editManagerName
              }
              onChange={(
                event
              ) =>
                setEditManagerName(
                  event.target.value
                )
              }
            />
          ) : (
            <span>
              {managerName ||
                "담당자 없음"}
            </span>
          )}
        </div>
      </div>


      <div
        className={
          styles.timeSection
        }
      >
        <span
          className={
            styles.label
          }
        >
          전달 시점
        </span>


        <label
          className={
            styles.radioRow
          }
        >
          <input
            type="radio"
            name="handoverTime"
            value="now"
            checked={
              timingOption ===
              "now"
            }
            onChange={() => {
              setTimingOption(
                "now"
              );


              setIsCalendarOpen(
                false
              );
            }}
            disabled={
              !isEditing ||
              isLocked
            }
          />


          <span
            className={
              styles.customRadio
            }
          />


          <span
            className={
              styles.radioText
            }
          >
            지금 바로 전달
          </span>
        </label>


        <label
          className={
            styles.radioRow
          }
        >
          <input
            type="radio"
            name="handoverTime"
            value="next"
            checked={
              timingOption ===
              "next"
            }
            onChange={() =>
              setTimingOption(
                "next"
              )
            }
            disabled={
              !isEditing ||
              isLocked
            }
          />


          <span
            className={
              styles.customRadio
            }
          />


          <span
            className={
              styles.radioText
            }
          >
            다음 업무 시작 시간에 맞춰 전달
          </span>
        </label>


        <div
          className={
            styles.dateBox
          }
          ref={
            calendarRef
          }
        >
          <span>
            {timingOption ===
            "next"
              ? `${formattedDate} · ${workStartTime}`
              : "지금 바로 전달"}
          </span>


          <button
            type="button"
            className={
              styles.calendarButton
            }
            disabled={
              !isEditing ||
              isLocked ||
              timingOption !==
                "next"
            }
            onClick={
              handleCalendarToggle
            }
            aria-label="날짜 선택"
          >
            <img
              src={
                calendarIcon2
              }
              alt=""
            />
          </button>


          {isCalendarOpen &&
            isEditing &&
            !isLocked &&
            timingOption ===
              "next" && (
              <div
                className={
                  styles.calendar
                }
                onClick={(
                  event
                ) =>
                  event.stopPropagation()
                }
              >
                <div
                  className={
                    styles.calendarHeader
                  }
                >
                  <button
                    type="button"
                    onClick={() =>
                      setCalendarMonth(
                        (
                          date
                        ) =>
                          new Date(
                            date.getFullYear(),
                            date.getMonth() -
                              1,
                            1
                          )
                      )
                    }
                  >
                    ‹
                  </button>


                  <strong>
                    {
                      MONTH_NAMES[
                        calendarMonth.getMonth()
                      ]
                    }{" "}
                    {
                      calendarMonth.getFullYear()
                    }
                  </strong>


                  <button
                    type="button"
                    onClick={() =>
                      setCalendarMonth(
                        (
                          date
                        ) =>
                          new Date(
                            date.getFullYear(),
                            date.getMonth() +
                              1,
                            1
                          )
                      )
                    }
                  >
                    ›
                  </button>
                </div>


                <div
                  className={
                    styles.calendarDivider
                  }
                />


                <div
                  className={
                    styles.calendarGrid
                  }
                >
                  {WEEKDAYS.map(
                    (
                      day
                    ) => (
                      <span
                        key={
                          day
                        }
                        className={
                          styles.weekday
                        }
                      >
                        {
                          day
                        }
                      </span>
                    )
                  )}


                  {calendarDays.map(
                    (
                      date
                    ) => {
                      const isOtherMonth =
                        date.getMonth() !==
                        calendarMonth.getMonth();


                      const isSunday =
                        date.getDay() ===
                          0 &&
                        !isOtherMonth;


                      const isSelected =
                        isSameDate(
                          date,
                          selectedDate
                        );


                      return (
                        <button
                          type="button"
                          key={
                            date.toISOString()
                          }
                          className={[
                            styles.calendarDay,

                            isOtherMonth
                              ? styles.otherMonth
                              : "",

                            isSunday
                              ? styles.sunday
                              : "",

                            isSelected
                              ? styles.selectedDay
                              : "",
                          ]
                            .filter(
                              Boolean
                            )
                            .join(
                              " "
                            )}
                          onClick={() => {
                            setSelectedDate(
                              date
                            );


                            setIsCalendarOpen(
                              false
                            );
                          }}
                        >
                          {
                            date.getDate()
                          }
                        </button>
                      );
                    }
                  )}
                </div>
              </div>
            )}
        </div>
      </div>
    </section>
  );
}


export default TransferInfoPanel;