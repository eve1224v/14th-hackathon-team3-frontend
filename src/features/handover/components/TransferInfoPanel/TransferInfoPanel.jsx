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

const normalizeName = (value) =>
  String(value || "").trim().toLowerCase();

const belongsToTeam = (member, team) => {
  if (!member || !team) {
    return false;
  }

  if (member.teamId != null && team.teamId != null) {
    return Number(member.teamId) === Number(team.teamId);
  }

  return Boolean(member.teamName && team.teamName) &&
    normalizeName(member.teamName) === normalizeName(team.teamName);
};


function TransferInfoPanel({
  initialDelivery = null,
  onChange,
  onSave,
}) {
  const calendarRef = useRef(null);
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
  ] = useState("next");

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(() => new Date());
  const [calendarMonth, setCalendarMonth] = useState(() => new Date());

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setIsCalendarOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
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
            "projectId",
          );


        if (!projectId) {
          return;
        }


        try {
          const [
            projectResponse,
            memberResponse,
          ] =
            await Promise.all([
              getProjectDetail(
                projectId,
              ),

              getProjectMembers(
                projectId,
              ),
            ]);


          if (cancelled) {
            return;
          }


          console.log(
            "인수인계 전달 프로젝트 정보:",
            projectResponse,
          );


          console.log(
            "인수인계 전달 멤버 정보:",
            memberResponse,
          );


          const teamList =
            Array.isArray(
              projectResponse
                ?.data
                ?.teamSchedules,
            )
              ? projectResponse
                  .data
                  .teamSchedules
              : [];


          const memberList =
            Array.isArray(
              memberResponse
                ?.data
                ?.members,
            )
              ? memberResponse
                  .data
                  .members
              : [];


          setTeams(
            teamList,
          );

          setMembers(
            memberList,
          );


          /* =========================
             전달 팀
          ========================= */

          const initialTeamId =
            initialDelivery
              ?.targetTeamId ??
            teamList[0]
              ?.teamId ??
            null;


          const initialTeam =
            teamList.find(
              (team) =>
                Number(
                  team.teamId,
                ) ===
                Number(
                  initialTeamId,
                ),
            ) ||
            teamList[0] ||
            null;


          const teamId =
            initialTeam
              ?.teamId ??
            null;


          const resolvedTeamName =
            initialTeam
              ?.teamName ||
            "";


          setSelectedTeamId(
            teamId,
          );

          setTeamName(
            resolvedTeamName,
          );

          setEditTeamName(
            resolvedTeamName,
          );


          /* =========================
             전달 담당자
          ========================= */

          const teamMembers =
            memberList.filter(
              (member) => belongsToTeam(member, initialTeam),
            );


          const initialMember =
            teamMembers.find(
              (member) =>
                Number(
                  member.memberId,
                ) ===
                Number(
                  initialDelivery
                    ?.recipientMemberId,
                ),
            ) ||
            teamMembers[0] ||
            null;


          const memberId =
            initialMember
              ?.memberId ??
            null;


          const resolvedManagerName =
            initialMember
              ?.name ||
            "";


          setSelectedMemberId(
            memberId,
          );

          setManagerName(
            resolvedManagerName,
          );

          setEditManagerName(
            resolvedManagerName,
          );


          if (
            initialDelivery
              ?.timingType ===
            "NEXT_SHIFT_START"
          ) {
            setTimingOption(
              "next",
            );
          }
        } catch (error) {
          console.error(
            "인수인계 전달 정보 조회 실패:",
            error,
          );
        }
      };


    fetchTransferData();


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
          (team) =>
            Number(
              team.teamId,
            ) ===
            Number(
              selectedTeamId,
            ),
        ) ||
        null,
      [
        teams,
        selectedTeamId,
      ],
    );


  const selectedMember =
    useMemo(
      () =>
        members.find(
          (member) =>
            Number(
              member.memberId,
            ) ===
            Number(
              selectedMemberId,
            ),
        ) ||
        null,
      [
        members,
        selectedMemberId,
      ],
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
        5,
      ) ||
    "09:00";


  const timezone =
    selectedTeam
      ?.timezone ||
    Intl.DateTimeFormat()
      .resolvedOptions()
      .timeZone ||
    "Asia/Seoul";

  const calendarDays = useMemo(() => {
    const year = calendarMonth.getFullYear();
    const month = calendarMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const start = new Date(year, month, 1 - firstDay.getDay());

    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(start);
      date.setDate(start.getDate() + index);
      return date;
    });
  }, [calendarMonth]);

  const formattedDate = new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric",
    weekday: "short",
    timeZone: timezone,
  }).format(selectedDate);

  const isSameDate = (left, right) =>
    left.getFullYear() === right.getFullYear() &&
    left.getMonth() === right.getMonth() &&
    left.getDate() === right.getDate();


  /* ==================================================
     현재 전달 정보
  ================================================== */

  const getDeliveryValue = useCallback(
    (
      teamId =
        selectedTeamId,

      memberId =
        selectedMemberId,
    ) => {
      return {
        targetTeamId:
          teamId
            ? Number(
                teamId,
              )
            : null,

        recipientMemberId:
          memberId
            ? Number(
                memberId,
              )
            : null,

        /*
          현재 확인된 명세 enum은
          NEXT_SHIFT_START만 사용
        */

        timingType:
          timingOption ===
          "next"
            ? "NEXT_SHIFT_START"
            : null,

        scheduledAt:
          null,

        timezone,
      };
    },
    [selectedTeamId, selectedMemberId, timingOption, timezone],
  );


  /* ==================================================
     부모에게 현재 전달 정보 전달
  ================================================== */

  useEffect(() => {
    onChange?.(
      getDeliveryValue(),
    );
  }, [
    selectedTeamId,
    selectedMemberId,
    timingOption,
    timezone,
    getDeliveryValue,
    onChange,
  ]);


  /* ==================================================
     수정 시작
  ================================================== */

  const handleEdit =
    () => {
      setEditTeamName(
        teamName,
      );

      setEditManagerName(
        managerName,
      );

      setIsEditing(
        true,
      );
    };


  /* ==================================================
     전달 정보 저장

     팀명/담당자명
     ↓
     실제 teamId/memberId 찾기
     ↓
     PUT /draft
  ================================================== */

  const handleSave =
    async () => {
      const trimmedTeamName =
        editTeamName.trim();


      const matchedTeam =
        teams.find(
          (team) =>
            String(
              team.teamName ||
                "",
            )
              .trim()
              .toLowerCase() ===
            trimmedTeamName
              .toLowerCase(),
        );


      if (!matchedTeam) {
        alert(
          "프로젝트에 등록된 팀 이름을 입력해주세요.",
        );

        return;
      }


      const matchedMember =
        members.find(
          (member) =>
            belongsToTeam(member, matchedTeam) &&
            String(
              member.name ||
                "",
            )
              .trim()
              .toLowerCase() ===
              editManagerName
                .trim()
                .toLowerCase(),
        );


      if (!matchedMember) {
        alert(
          "선택한 팀에 등록된 담당자를 입력해주세요.",
        );

        return;
      }


      if (
        timingOption ===
        "now"
      ) {
        alert(
          "지금 바로 전달의 timingType 값이 아직 확인되지 않았습니다. 현재는 다음 업무 시작 시간 전달로 테스트해주세요.",
        );

        return;
      }


      const nextDelivery = {
        targetTeamId:
          Number(
            matchedTeam.teamId,
          ),

        recipientMemberId:
          Number(
            matchedMember.memberId,
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
          true,
        );


        /*
          HandoverDashboard의
          PUT /draft 호출
        */

        await onSave?.(
          nextDelivery,
        );


        setSelectedTeamId(
          matchedTeam.teamId,
        );

        setSelectedMemberId(
          matchedMember.memberId,
        );

        setTeamName(
          matchedTeam.teamName ||
            "",
        );

        setManagerName(
          matchedMember.name ||
            "",
        );


        onChange?.(
          nextDelivery,
        );


        setIsEditing(
          false,
        );
      } catch (error) {
        console.error(
          "전달 정보 저장 실패:",
          error,
        );
      } finally {
        setIsSaving(
          false,
        );
      }
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
            isSaving
          }
          onClick={
            isEditing
              ? handleSave
              : handleEdit
          }
        >
          {isSaving
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
            {companyName}
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
              event,
            ) =>
              setEditTeamName(
                event.target.value,
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
                event,
              ) =>
                setEditManagerName(
                  event.target.value,
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
            onChange={() =>
              setTimingOption(
                "now",
              )
            }
            disabled={!isEditing}
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
                "next",
              )
            }
            disabled={!isEditing}
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
          role="button"
          tabIndex={isEditing ? 0 : -1}
          aria-disabled={!isEditing}
          onClick={() => isEditing && setIsCalendarOpen((open) => !open)}
          onKeyDown={(event) => {
            if (isEditing && (event.key === "Enter" || event.key === " ")) {
              event.preventDefault();
              setIsCalendarOpen((open) => !open);
            }
          }}
          ref={calendarRef}
        >
          <span>
            {timingOption ===
            "next"
              ? `${formattedDate} · ${workStartTime}`
              : "지금 바로 전달"}
          </span>

          <img
            src={
              calendarIcon2
            }
            alt=""
          />

          {isCalendarOpen && isEditing && (
            <div className={styles.calendar} onClick={(event) => event.stopPropagation()}>
              <div className={styles.calendarHeader}>
                <button type="button" onClick={() => setCalendarMonth((date) => new Date(date.getFullYear(), date.getMonth() - 1, 1))}>‹</button>
                <strong>{calendarMonth.getFullYear()}년 {calendarMonth.getMonth() + 1}월</strong>
                <button type="button" onClick={() => setCalendarMonth((date) => new Date(date.getFullYear(), date.getMonth() + 1, 1))}>›</button>
              </div>
              <div className={styles.calendarGrid}>
                {["일", "월", "화", "수", "목", "금", "토"].map((day) => <span key={day} className={styles.weekday}>{day}</span>)}
                {calendarDays.map((date) => (
                  <button
                    type="button"
                    key={date.toISOString()}
                    className={`${styles.calendarDay} ${date.getMonth() !== calendarMonth.getMonth() ? styles.otherMonth : ""} ${isSameDate(date, selectedDate) ? styles.selectedDay : ""}`}
                    onClick={() => {
                      setSelectedDate(date);
                      setIsCalendarOpen(false);
                    }}
                  >
                    {date.getDate()}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}


export default TransferInfoPanel;
