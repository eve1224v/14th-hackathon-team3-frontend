import {
  useEffect,
  useState,
} from "react";

import {
  useNavigate,
  useParams,
} from "react-router-dom";

import styles from "./IssueForm.module.css";

import BackButton from "../BackButton/BackButton";

import IssueBasicInfo from "./IssueBasicInfo";
import IssueDetailSection from "./IssueDetailSection";
import IssueScheduleSection from "./IssueScheduleSection";
import IssueFileSection from "./IssueFileSection";

import {
  createIssue,
  getIssue,
  updateIssue,
} from "../../../../api/issueApi";

import {
  getCycles,
} from "../../../../api/cycleApi";

import {
  getProjectMembers,
} from "../../../../api/projectApi";


const PRIORITY_MAP = {
  low: "LOW",
  normal: "NORMAL",
  high: "HIGH",
  urgent: "URGENT",
};


const PRIORITY_REVERSE_MAP = {
  LOW: "low",
  NORMAL: "normal",
  HIGH: "high",
  URGENT: "urgent",
};


/* ==================================================
   Cycle 기간 순 정렬

   startDate
   → endDate
   → cycleId
================================================== */

const sortCyclesByPeriod = (
  cycles
) => {
  return [
    ...cycles,
  ].sort(
    (
      a,
      b
    ) => {
      const startCompare =
        String(
          a.startDate ||
            ""
        ).localeCompare(
          String(
            b.startDate ||
              ""
          )
        );


      if (
        startCompare !==
        0
      ) {
        return startCompare;
      }


      const endCompare =
        String(
          a.endDate ||
            ""
        ).localeCompare(
          String(
            b.endDate ||
              ""
          )
        );


      if (
        endCompare !==
        0
      ) {
        return endCompare;
      }


      return (
        Number(
          a.cycleId ||
            0
        ) -
        Number(
          b.cycleId ||
            0
        )
      );
    }
  );
};


const formatFileSize = (
  size
) => {
  if (
    size === null ||
    size === undefined
  ) {
    return "-";
  }


  if (
    size <
    1024
  ) {
    return `${size} B`;
  }


  if (
    size <
    1024 *
      1024
  ) {
    return `${(
      size /
      1024
    ).toFixed(
      1
    )} KB`;
  }


  return `${(
    size /
    (
      1024 *
      1024
    )
  ).toFixed(
    1
  )} MB`;
};


function IssueForm({
  mode = "create",
}) {
  const navigate =
    useNavigate();


  const {
    issueId,
  } = useParams();


  const isEdit =
    mode ===
    "edit";


  /* ==================================================
     기본 정보
  ================================================== */

  const [
    title,
    setTitle,
  ] = useState("");


  const [
    priority,
    setPriority,
  ] = useState("");


  const [
    description,
    setDescription,
  ] = useState("");


  /* ==================================================
     완료 조건
  ================================================== */

  const [
    conditions,
    setConditions,
  ] = useState([]);


  /* ==================================================
     담당자
  ================================================== */

  const [
    members,
    setMembers,
  ] = useState([]);


  const [
    memberLoading,
    setMemberLoading,
  ] = useState(false);


  const [
    assigneeOpen,
    setAssigneeOpen,
  ] = useState(false);


  const [
    assigneeName,
    setAssigneeName,
  ] = useState("");


  const [
    assigneeId,
    setAssigneeId,
  ] = useState(null);


  /* ==================================================
     일정
  ================================================== */

  const [
    dueDate,
    setDueDate,
  ] = useState("");


  /* ==================================================
     Cycle
  ================================================== */

  const [
    cycles,
    setCycles,
  ] = useState([]);


  const [
    cycleId,
    setCycleId,
  ] = useState(null);


  const [
    cycleOpen,
    setCycleOpen,
  ] = useState(false);


  const [
    cycleLoading,
    setCycleLoading,
  ] = useState(false);


  const selectedCycle =
    cycles.find(
      (
        cycleItem
      ) =>
        Number(
          cycleItem.cycleId
        ) ===
        Number(
          cycleId
        )
    );


  const cycle =
    selectedCycle
      ?.cycleLabel ||
    "";


  /* ==================================================
     파일
  ================================================== */

  const [
    files,
    setFiles,
  ] = useState([]);


  /* ==================================================
     제출 중
  ================================================== */

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);


  /* ==================================================
     프로젝트 멤버 조회

     이슈 담당자는
     워크스페이스 전체 멤버가 아니라
     현재 프로젝트 멤버 중에서 선택
  ================================================== */

  useEffect(() => {
    let cancelled =
      false;


    const fetchMembers =
      async () => {
        const projectId =
          localStorage.getItem(
            "projectId"
          );


        if (
          !projectId
        ) {
          console.warn(
            "projectId가 없습니다."
          );


          return;
        }


        try {
          setMemberLoading(
            true
          );


          const response =
            await getProjectMembers(
              projectId,
              {
                status:
                  "ACTIVE",
              }
            );


          if (
            cancelled
          ) {
            return;
          }


          console.log(
            "이슈 생성용 프로젝트 멤버 조회 성공:",
            response
          );


          const memberList =
            Array.isArray(
              response
                ?.data
                ?.members
            )
              ? response
                  .data
                  .members
              : [];


          setMembers(
            memberList
          );
        } catch (
          error
        ) {
          if (
            cancelled
          ) {
            return;
          }


          console.error(
            "이슈 생성용 프로젝트 멤버 조회 실패:",
            error
          );


          console.error(
            "서버 응답:",
            error.response
              ?.data ||
              error.data
          );


          setMembers(
            []
          );
        } finally {
          if (
            !cancelled
          ) {
            setMemberLoading(
              false
            );
          }
        }
      };


    void fetchMembers();


    return () => {
      cancelled =
        true;
    };
  }, []);


  /* ==================================================
     Cycle 조회
  ================================================== */

  useEffect(() => {
    let cancelled =
      false;


    const fetchCycles =
      async () => {
        const projectId =
          localStorage.getItem(
            "projectId"
          );


        if (
          !projectId
        ) {
          console.warn(
            "projectId가 없습니다."
          );


          return;
        }


        try {
          setCycleLoading(
            true
          );


          const response =
            await getCycles(
              projectId
            );


          if (
            cancelled
          ) {
            return;
          }


          console.log(
            "이슈 생성용 사이클 조회 성공:",
            response
          );


          const cycleList =
            Array.isArray(
              response?.data
            )
              ? response.data
              : [];


          const sortedCycles =
            sortCyclesByPeriod(
              cycleList
            );


          const cyclesWithLabel =
            sortedCycles.map(
              (
                cycleItem,
                index
              ) => ({
                ...cycleItem,

                cycleLabel:
                  `Cycle ${
                    index +
                    1
                  }`,
              })
            );


          setCycles(
            cyclesWithLabel
          );
        } catch (
          error
        ) {
          if (
            cancelled
          ) {
            return;
          }


          console.error(
            "이슈 생성용 사이클 조회 실패:",
            error
          );


          console.error(
            "서버 응답:",
            error.response
              ?.data
          );


          setCycles(
            []
          );
        } finally {
          if (
            !cancelled
          ) {
            setCycleLoading(
              false
            );
          }
        }
      };


    void fetchCycles();


    return () => {
      cancelled =
        true;
    };
  }, []);


  /* ==================================================
     수정 화면 기존 이슈 조회
  ================================================== */

  useEffect(() => {
    if (
      !isEdit ||
      !issueId
    ) {
      return;
    }


    let cancelled =
      false;


    const fetchIssue =
      async () => {
        try {
          const response =
            await getIssue(
              issueId
            );


          if (
            cancelled
          ) {
            return;
          }


          console.log(
            "수정용 이슈 조회 성공:",
            response
          );


          const issueData =
            response.data;


          setTitle(
            issueData.title ||
              ""
          );


          setPriority(
            PRIORITY_REVERSE_MAP[
              issueData.priority
            ] ||
              ""
          );


          setDescription(
            issueData.description ||
              ""
          );


          setCycleId(
            issueData.cycleId ??
              null
          );


          setAssigneeName(
            issueData.assignee
              ?.name ||
              ""
          );


          setAssigneeId(
            issueData
              .assigneeMemberId ??
              issueData
                .assignee
                ?.memberId ??
              null
          );


          setDueDate(
            issueData.dueDate ||
              ""
          );


          setConditions(
            (
              issueData.checklist ||
              []
            ).map(
              (
                item
              ) => ({
                itemId:
                  item.itemId,

                content:
                  item.content,

                isDone:
                  item.isDone,
              })
            )
          );


          setFiles(
            (
              issueData.attachments ||
              []
            ).map(
              (
                file
              ) => ({
                id:
                  file.attachmentId,

                name:
                  file.fileName,

                size:
                  formatFileSize(
                    file.fileSize
                  ),

                url:
                  file.fileUrl,

                isMock:
                  false,
              })
            )
          );
        } catch (
          error
        ) {
          console.error(
            "수정용 이슈 조회 실패:",
            error
          );


          console.error(
            "서버 응답:",
            error.response
              ?.data
          );
        }
      };


    void fetchIssue();


    return () => {
      cancelled =
        true;
    };
  }, [
    isEdit,
    issueId,
  ]);


  /* ==================================================
     담당자 선택
  ================================================== */

  const handleAssigneeSelect =
    (
      member
    ) => {
      setAssigneeName(
        member.name ||
          ""
      );


      setAssigneeId(
        member.memberId
      );


      setAssigneeOpen(
        false
      );


      console.log(
        "선택한 프로젝트 담당자:",
        member
      );
    };


  const handleAssigneeInputChange =
    (
      value
    ) => {
      setAssigneeName(
        value
      );


      setAssigneeId(
        null
      );


      setAssigneeOpen(
        true
      );
    };


  const filteredMembers =
    members.filter(
      (
        member
      ) => {
        const keyword =
          assigneeName
            .trim()
            .toLowerCase();


        if (
          !keyword
        ) {
          return true;
        }


        const name =
          String(
            member.name ||
              ""
          ).toLowerCase();


        const companyName =
          String(
            member.companyName ||
              ""
          ).toLowerCase();


        const teamName =
          String(
            member.teamName ||
              ""
          ).toLowerCase();


        return (
          name.includes(
            keyword
          ) ||
          companyName.includes(
            keyword
          ) ||
          teamName.includes(
            keyword
          )
        );
      }
    );


  /* ==================================================
     완료 조건
  ================================================== */

  const handleAddCondition =
    () => {
      setConditions(
        (
          prev
        ) => [
          ...prev,

          {
            itemId:
              null,

            content:
              "",

            isDone:
              false,
          },
        ]
      );
    };


  const handleConditionChange =
    (
      conditionIndex,
      value
    ) => {
      setConditions(
        (
          prev
        ) =>
          prev.map(
            (
              condition,
              index
            ) =>
              index ===
              conditionIndex
                ? {
                    ...condition,

                    content:
                      value,
                  }
                : condition
          )
      );
    };


  const handleRemoveCondition =
    (
      removeIndex
    ) => {
      setConditions(
        (
          prev
        ) =>
          prev.filter(
            (
              _,
              index
            ) =>
              index !==
              removeIndex
          )
      );
    };


  /* ==================================================
     Cycle 선택
  ================================================== */

  const handleCycleSelect =
    (
      selectedCycleItem
    ) => {
      if (
        !selectedCycleItem
      ) {
        setCycleId(
          null
        );


        setCycleOpen(
          false
        );


        return;
      }


      setCycleId(
        selectedCycleItem
          .cycleId
      );


      setCycleOpen(
        false
      );


      console.log(
        "선택한 사이클:",
        {
          cycleId:
            selectedCycleItem
              .cycleId,

          cycleLabel:
            selectedCycleItem
              .cycleLabel,

          originalName:
            selectedCycleItem
              .name,
        }
      );
    };


  const getCycleOptions =
    () => {
      return cycles;
    };


  /* ==================================================
     입력값 검사
  ================================================== */

  const validateForm =
    () => {
      if (
        !title.trim()
      ) {
        alert(
          "이슈 제목을 입력해주세요."
        );


        return false;
      }


      if (
        !priority
      ) {
        alert(
          "우선순위를 선택해주세요."
        );


        return false;
      }


      if (
        !description.trim()
      ) {
        alert(
          "이슈 설명을 입력해주세요."
        );


        return false;
      }


      if (
        !assigneeId
      ) {
        alert(
          "담당자를 프로젝트 멤버 목록에서 선택해주세요."
        );


        return false;
      }


      if (
        !dueDate
      ) {
        alert(
          "처리 일자를 선택해주세요."
        );


        return false;
      }


      if (
        !cycleId
      ) {
        alert(
          "Cycle을 선택해주세요."
        );


        return false;
      }


      return true;
    };


  /* ==================================================
     생성 / 수정
  ================================================== */

  const handleSubmit =
    async () => {
      if (
        isSubmitting
      ) {
        return;
      }


      if (
        !validateForm()
      ) {
        return;
      }


      const attachments =
        files
          .map(
            (
              file
            ) =>
              file.url
          )
          .filter(
            Boolean
          );


      try {
        setIsSubmitting(
          true
        );


        /* ==================================================
           수정
        ================================================== */

        if (
          isEdit
        ) {
          const requestData = {
            cycleId:
              Number(
                cycleId
              ),

            title:
              title.trim(),

            priority:
              PRIORITY_MAP[
                priority
              ],

            description:
              description.trim(),

            checklist:
              conditions
                .filter(
                  (
                    condition
                  ) =>
                    condition
                      .content
                      .trim()
                )
                .map(
                  (
                    condition
                  ) => ({
                    itemId:
                      condition.itemId,

                    content:
                      condition
                        .content
                        .trim(),

                    isDone:
                      Boolean(
                        condition.isDone
                      ),
                  })
                ),

            assigneeId:
              Number(
                assigneeId
              ),

            dueDate,

            attachments,
          };


          console.log(
            "이슈 수정 요청 데이터:",
            requestData
          );


          const response =
            await updateIssue(
              issueId,
              requestData
            );


          console.log(
            "이슈 수정 성공:",
            response
          );


          navigate(
            `/issue/${issueId}`
          );


          return;
        }


        /* ==================================================
           생성
        ================================================== */

        const requestData = {
          cycleId:
            Number(
              cycleId
            ),

          title:
            title.trim(),

          priority:
            PRIORITY_MAP[
              priority
            ],

          description:
            description.trim(),

          checklist:
            conditions
              .map(
                (
                  condition
                ) =>
                  condition
                    .content
                    .trim()
              )
              .filter(
                Boolean
              ),

          assigneeId:
            Number(
              assigneeId
            ),

          dueDate,

          attachments,
        };


        console.log(
          "이슈 생성 요청 데이터:",
          requestData
        );


        const response =
          await createIssue(
            requestData
          );


        console.log(
          "이슈 생성 성공:",
          response
        );


        /*
          API wrapper 구조에 따라
          둘 다 대응
        */

        const createdIssueId =
          response
            ?.data
            ?.issueId ??
          response
            ?.issueId;


        if (
          createdIssueId
        ) {
          navigate(
            `/issue/${createdIssueId}`
          );


          return;
        }


        /*
          생성 자체는 성공했는데
          issueId를 응답하지 않을 경우
          목록으로 이동
        */

        navigate(
          "/issue"
        );
      } catch (
        error
      ) {
        console.error(
          isEdit
            ? "이슈 수정 실패:"
            : "이슈 생성 실패:",
          error
        );


        console.error(
          "서버 응답:",
          error.response
            ?.data ||
            error.data
        );


        alert(
          error.response
            ?.data
            ?.message ||
            error.data
              ?.message ||
            (
              isEdit
                ? "이슈 수정에 실패했습니다."
                : "이슈 생성에 실패했습니다."
            )
        );
      } finally {
        setIsSubmitting(
          false
        );
      }
    };


  return (
    <main
      className={`${styles.form} ${
        isEdit
          ? styles.editForm
          : ""
      }`}
    >
      {/* ==================================================
          HEADER
      ================================================== */}

      <header
        className={`${styles.pageHeader} ${
          isEdit
            ? styles.editPageHeader
            : ""
        }`}
      >
        <div
          className={
            styles.backButtonWrap
          }
        >
          <BackButton />
        </div>


        {isEdit ? (
          <>
            <span
              className={
                styles.pageLabel
              }
            >
              이슈
            </span>


            <h1
              className={`${styles.pageTitle} ${styles.editPageTitle}`}
            >
              {
                title
              }
            </h1>


            <span
              className={
                styles.editCycleBadge
              }
            >
              {cycle ||
                "Cycle"}
            </span>
          </>
        ) : (
          <>
            <h1
              className={
                styles.pageTitle
              }
            >
              새 이슈 생성
            </h1>


            <p
              className={
                styles.pageDescription
              }
            >
              새로운 이슈를 생성하고
              팀과 함께 해결하세요.
            </p>
          </>
        )}
      </header>


      <IssueBasicInfo
        title={
          title
        }
        setTitle={
          setTitle
        }
        priority={
          priority
        }
        setPriority={
          setPriority
        }
      />


      <IssueDetailSection
        description={
          description
        }
        setDescription={
          setDescription
        }
        conditions={
          conditions
        }
        onAddCondition={
          handleAddCondition
        }
        onConditionChange={
          handleConditionChange
        }
        onRemoveCondition={
          handleRemoveCondition
        }
      />


      <IssueScheduleSection
        members={
          filteredMembers
        }
        memberLoading={
          memberLoading
        }
        assigneeName={
          assigneeName
        }
        assigneeId={
          assigneeId
        }
        assigneeOpen={
          assigneeOpen
        }
        setAssigneeOpen={
          setAssigneeOpen
        }
        onAssigneeInputChange={
          handleAssigneeInputChange
        }
        onAssigneeSelect={
          handleAssigneeSelect
        }
        dueDate={
          dueDate
        }
        setDueDate={
          setDueDate
        }
        cycle={
          cycle
        }
        cycleOpen={
          cycleOpen
        }
        setCycleOpen={
          setCycleOpen
        }
        cycleLoading={
          cycleLoading
        }
        onCycleSelect={
          handleCycleSelect
        }
        getCycleOptions={
          getCycleOptions
        }
      />


      <IssueFileSection
        files={
          files
        }
        setFiles={
          setFiles
        }
      />


      <div
        className={
          styles.actions
        }
      >
        <button
          type="button"
          className={
            styles.cancelButton
          }
          onClick={() =>
            navigate(
              -1
            )
          }
          disabled={
            isSubmitting
          }
        >
          취소
        </button>


        <button
          type="button"
          className={`${styles.submitButton} ${
            isEdit
              ? styles.saveButton
              : ""
          }`}
          onClick={
            handleSubmit
          }
          disabled={
            isSubmitting
          }
        >
          {isSubmitting
            ? "처리 중..."
            : isEdit
              ? "저장"
              : "이슈 생성"}
        </button>
      </div>
    </main>
  );
}


export default IssueForm;