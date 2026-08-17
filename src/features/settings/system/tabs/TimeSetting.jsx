import { useTranslation } from "react-i18next";

/* =========================================
   지역 → 시간대
========================================= */

const REGION_TIMEZONE_MAP = {
  SEOUL: "Asia/Seoul",

  TOKYO: "Asia/Tokyo",

  NEW_YORK: "America/New_York",

  LOS_ANGELES: "America/Los_Angeles",
};

function TimeSetting({
  systemForm,
  onChange,
  styles,
  isLoading,
  errorMessage,
}) {
  const { t } = useTranslation();

  /* =========================================
     지역 변경
  ========================================= */

  const handleRegionChange = (e) => {
    const region = e.target.value;

    const timezone = REGION_TIMEZONE_MAP[region] || "";

    /*
      부모의 systemForm.region 변경
    */

    onChange({
      target: {
        name: "region",
        value: region,
      },
    });

    /*
      화면 표시용 timezone 자동 변경

      서버에는 timezone을 보내지 않음
    */

    onChange({
      target: {
        name: "timezone",
        value: timezone,
      },
    });
  };

  return (
    <div className={styles.systemPage}>
      <h3>{t("time.title")}</h3>

      <h4>{t("time.regionSettings")}</h4>

      {isLoading ? (
        <p className={styles.generalStateText}>
          업무 지역 정보를 불러오는 중입니다.
        </p>
      ) : (
        <>
          <div className={styles.systemGroup}>
            {/* =================================
                국가 / 지역
            ================================= */}

            <div className={styles.systemRow}>
              <div>
                <strong>국가/지역</strong>

                <p>업무를 진행하는 지역을 설정합니다.</p>
              </div>

              <select
                name="region"
                value={systemForm?.region || ""}
                onChange={handleRegionChange}
              >
                <option value="">지역 선택</option>

                <option value="SEOUL">서울</option>

                <option value="TOKYO">도쿄</option>

                <option value="NEW_YORK">뉴욕</option>

                <option value="LOS_ANGELES">로스앤젤레스</option>
              </select>
            </div>

            {/* =================================
                시간대
            ================================= */}

            <div className={styles.systemRow}>
              <div>
                <strong>시간대</strong>

                <p>선택한 지역에 따라 자동으로 설정됩니다.</p>
              </div>

              <input
                type="text"
                value={systemForm?.timezone || ""}
                placeholder="지역을 선택해주세요."
                readOnly
              />
            </div>
          </div>

          {errorMessage && (
            <p className={styles.generalErrorText}>{errorMessage}</p>
          )}
        </>
      )}
    </div>
  );
}

export default TimeSetting;
