import {
  useEffect,
  useState,
} from "react";

import {
  useLocation,
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
  updateIssueStatus,
} from "../../../../api/issueApi";

import {
  getCycles,
} from "../../../../api/cycleApi";

import {
  getProjectMembers,
} from "../../../../api/projectApi";


const DEFAULT_CONDITIONS = [
  {
    itemId: null,
    content:
      "결제 API 요구사항 확정",
    isDone: false,
  },
  {
    itemId: null,
    content:
      "결제 API 요구사항 확정",
    isDone: false,
  },
  {
    itemId: null,
    content:
      "결제 API 요구사항 확정",
    isDone: false,
  },
  {
    itemId: null,
    content:
      "결제 API 요구사항 확정",
    isDone: false,
  },
];


const PRIORITY_MAP = {
  low:
    "LOW",

  normal:
    "NORMAL",

  high:
    "HIGH",

  urgent:
    "URGENT",
};


const PRIORITY_REVERSE_MAP = {
  LOW:
    "low",

  NORMAL:
    "normal",

  HIGH:
    "high",

  URGENT:
    "urgent",
};


const formatFileSize =
  (
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
      1024 * 1024
    ) {
      return `${(
        size / 1024
      ).toFixed(
        1
      )} KB`;
    }


    return `${(
      size /
      (1024 * 1024)
    ).toFixed(
      1
    )} MB`;
  };


function IssueForm({
  mode = "create",
}) {
  const navigate =
    useNavigate();


  const location =
    useLocation();


  const {
    issueId,
  } = useParams();


  const isEdit =
    mode ===
    "edit";


  /* =========================
      생성 시작 상태

      생성 페이지를
      직접 들어온 경우에는 TODO
  ========================= */

  const initialStatus =
    location.state
      ?.initialStatus ||
    "TODO";


  /* =========================
      기본 정보
  ========================= */

  const [
    title,
    setTitle,
  ] = useState(
    "앱 출시 전 프로모션 랜딩페이지 최종 연동 및 콘텐츠 검수"
  );


  const [
    priority,
    setPriority,
  ] = useState(
    isEdit
      ? "normal"
      : ""
  );


  const [
    description,
    setDescription,
  ] = useState(
    `글로벌 커머스 앱 리뉴얼 출시와 함께 공개될 프로모션 랜딩페이지의 최종 연동 및 콘텐츠 검수가 필요합니다.

현재 디자인팀에서 랜딩페이지 최종 시안을 전달했으며, 프론트엔드 구현도 대부분 완료된 상태입니다.
다만 마케팅팀에서 전달한 국가별 캠페인 카피와 실제 구현된 문구 일부가 일치하지 않고,
CTA 버튼 클릭 시 앱 설치 페이지로 연결되는 딥링크도 일부 환경에서 정상적으로 동작하지 않는 문제가 확인되었습니다.

출시 일정에 맞추기 위해 한국·영국 버전의 캠페인 문구를 최종 확정하고, 랜딩페이지에 반영된 텍스트 및 이미지 에셋을 검수해야 합니다. 또한 모바일 환경에서 CTA 버튼과 앱스토어 연결이 정상적으로 작동하는지 개발팀과 함께 확인해주세요.

수정 사항이 모두 반영되면 마케팅팀의 최종 승인을 받은 뒤 프로덕션 환경에 배포합니다.`
  );


  /* =========================
      완료 조건
  ========================= */

  const [
    conditions,
    setConditions,
  ] = useState(
    DEFAULT_CONDITIONS
  );


  /* =========================
      담당자
  ========================= */

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


  /* =========================
      일정
  ========================= */

  const [
    dueDate,
    setDueDate,
  ] = useState(
    "2026-08-06"
  );


  /* =========================
      Cycle
  ========================= */

  const [
    cycles,
    setCycles,
  ] = useState([]);


  const [
    cycle,
    setCycle,
  ] = useState("");


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


  /* =========================
      파일

      더미 데이터 없음
  ========================= */

  const [
    files,
    setFiles,
  ] = useState([]);


  /* ==================================================
     프로젝트 멤버 조회
  ================================================== */

  useEffect(() => {
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
              projectId
            );


          console.log(
            "프로젝트 멤버 조회 성공:",
            response
          );


          const memberList =
            Array.isArray(
              response?.data
                ?.members
            )
              ? response.data
                  .members
              : [];


          setMembers(
            memberList
          );
        } catch (
          error
        ) {
          console.error(
            "프로젝트 멤버 조회 실패:",
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
          setMemberLoading(
            false
          );
        }
      };


    fetchMembers();
  }, []);


  /* ==================================================
     Cycle 조회
  ================================================== */

  useEffect(() => {
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


          setCycles(
            cycleList
          );
        } catch (
          error
        ) {
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
          setCycleLoading(
            false
          );
        }
      };


    fetchCycles();
  }, []);


  /* ==================================================
     수정용 이슈 조회
  ================================================== */

  useEffect(() => {
    if (
      !isEdit ||
      !issueId
    ) {
      return;
    }


    const fetchIssue =
      async () => {
        try {
          const response =
            await getIssue(
              issueId
            );


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
            ] || ""
          );


          setDescription(
            issueData.description ||
              ""
          );


          setCycle(
            issueData.cycleName ||
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
              issueData.assignee
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


    fetchIssue();
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


  /* ==================================================
     담당자 검색
  ================================================== */

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
          (
            member.name ||
            ""
          ).toLowerCase();


        const companyName =
          (
            member.companyName ||
            ""
          ).toLowerCase();


        const teamName =
          (
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
      selectedCycle
    ) => {
      if (
        !selectedCycle
      ) {
        setCycle(
          ""
        );

        setCycleId(
          null
        );

        setCycleOpen(
          false
        );


        return;
      }


      setCycle(
        selectedCycle.name
      );


      setCycleId(
        selectedCycle.cycleId
      );


      setCycleOpen(
        false
      );


      console.log(
        "선택한 사이클:",
        selectedCycle
      );
    };


  const getCycleOptions =
    () => {
      return cycles;
    };


  /* ==================================================
     생성 / 수정
  ================================================== */

  const handleSubmit =
    async () => {
      if (
        !title.trim()
      ) {
        console.warn(
          "제목을 입력해주세요."
        );

        return;
      }


      if (
        !priority
      ) {
        console.warn(
          "우선순위를 선택해주세요."
        );

        return;
      }


      if (
        !description.trim()
      ) {
        console.warn(
          "설명을 입력해주세요."
        );

        return;
      }


      if (
        !cycleId
      ) {
        console.warn(
          "사이클을 선택해주세요."
        );

        return;
      }


      /* =========================
          담당자 ID 결정
      ========================= */

      const matchedMember =
        members.find(
          (
            member
          ) =>
            member.name ===
            assigneeName
        );


      const resolvedAssigneeId =
        assigneeId ??
        matchedMember
          ?.memberId ??
        null;


      if (
        !resolvedAssigneeId
      ) {
        console.warn(
          "담당자를 프로젝트 멤버 목록에서 확인할 수 없습니다."
        );

        return;
      }


      console.log(
        "최종 담당자 ID:",
        resolvedAssigneeId
      );


      /* =========================
          첨부파일
      ========================= */

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


      /* =========================
          수정
      ========================= */

      if (
        isEdit
      ) {
        const requestData = {
          cycleId,

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
                  condition.content
                    .trim()
              )
              .map(
                (
                  condition
                ) => ({
                  itemId:
                    condition.itemId,

                  content:
                    condition.content
                      .trim(),

                  isDone:
                    condition.isDone,
                })
              ),

          assigneeId:
            resolvedAssigneeId,

          dueDate,

          attachments,
        };


        console.log(
          "이슈 수정 요청 데이터:",
          requestData
        );


        try {
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
        } catch (
          error
        ) {
          console.error(
            "이슈 수정 실패:",
            error
          );


          console.error(
            "서버 응답:",
            error.response
              ?.data ||
              error.data
          );
        }


        return;
      }


      /* =========================
          생성
      ========================= */

      const requestData = {
        cycleId,

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
                condition.content
                  .trim()
            )
            .filter(
              Boolean
            ),

        assigneeId:
          resolvedAssigneeId,

        dueDate,

        attachments,
      };


      console.log(
        "이슈 생성 요청 데이터:",
        requestData
      );


      console.log(
        "생성 후 적용할 상태:",
        initialStatus
      );


      try {
        /* =========================
            1. 이슈 생성

            생성 직후 기본 상태는
            TODO
        ========================= */

        const response =
          await createIssue(
            requestData
          );


        console.log(
          "이슈 생성 성공:",
          response
        );


        const createdIssueId =
          response?.data
            ?.issueId;


        if (
          !createdIssueId
        ) {
          console.warn(
            "생성된 issueId가 없습니다."
          );

          return;
        }


        /* =========================
            2. TODO가 아닌 컬럼에서
               생성한 경우 상태 변경
        ========================= */

        if (
          initialStatus !==
          "TODO"
        ) {
          try {
            const statusResponse =
              await updateIssueStatus(
                createdIssueId,
                {
                  status:
                    initialStatus,
                }
              );


            console.log(
              "생성 이슈 상태 변경 성공:",
              statusResponse
            );


            console.log(
              "변경 상태:",
              initialStatus
            );
          } catch (
            statusError
          ) {
            console.error(
              "생성 이슈 상태 변경 실패:",
              statusError
            );


            console.error(
              "상태 변경 서버 응답:",
              statusError.response
                ?.data
            );


            /*
              이슈 생성 자체는 이미 성공했으므로
              상세 페이지로 이동

              상태 전환이 허용되지 않는 경우
              서버 응답을 콘솔에서 확인
            */
          }
        }


        /* =========================
            3. 생성된 이슈 상세 이동
        ========================= */

        navigate(
          `/issue/${createdIssueId}`
        );
      } catch (
        error
      ) {
        console.error(
          "이슈 생성 실패:",
          error
        );


        console.error(
          "서버 응답:",
          error.response
            ?.data ||
            error.data
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
      {/* =========================
          상단
      ========================= */}

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
              {title}
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


      {/* =========================
          하단
      ========================= */}

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
        >
          {isEdit
            ? "저장"
            : "이슈 생성"}
        </button>
      </div>
    </main>
  );
}


export default IssueForm;