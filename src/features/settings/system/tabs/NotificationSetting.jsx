function NotificationSetting({
  notificationSettings = {},
  onChange = () => {},
  styles,
}) {
  const notificationItems = [
    {
      key: "mention",
      title: "멘션 및 댓글",
      description: "누군가 나를 멘션하거나 댓글을 남길 때",
    },
    {
      key: "issue",
      title: "이슈 업데이트",
      description: "이슈가 생성, 변경, 완료되었을 때",
    },
    {
      key: "deadline",
      title: "마감일 및 진행률",
      description: "마감일 임박 및 진행률 변경 시",
    },
    {
      key: "message",
      title: "메시지",
      description: "새로운 메시지를 받았을 때",
    },
    {
      key: "doNotDisturb",
      title: "방해 금지 모드",
      description: "알림을 받지 않는 시간을 설정합니다.",
    },
  ];

  return (
    <div className={styles.systemPage}>
      <h3>알림</h3>

      <h4>알림 항목</h4>

      <div className={styles.notificationList}>
        {notificationItems.map(({ key, title, description }) => (
          <div key={key} className={styles.notificationRow}>
            <div>
              <strong>{title}</strong>

              <p>{description}</p>
            </div>

            <label className={styles.systemToggle}>
              <input
                type="checkbox"
                checked={Boolean(notificationSettings[key])}
                onChange={() => onChange(key)}
              />

              <span />
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotificationSetting;
