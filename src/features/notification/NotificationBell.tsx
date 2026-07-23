import { Badge, Dropdown } from "react-bootstrap";
import { BellFill } from "react-bootstrap-icons";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { removeNotification } from "./notificationSlice";
import { useCopy } from "../theme/copy";

function NotificationBell() {
  const notifications = useAppSelector((state) => state.notification.items);
  const dispatch = useAppDispatch();
  const unreadCount = notifications.filter((n) => !n.read).length;
  const copy = useCopy();

  const handleRemove = (id: string) => {
    dispatch(removeNotification(id));
  };

  return (
    <Dropdown align="end" autoClose="outside">
      <Dropdown.Toggle
        as="button"
        bsPrefix="btn"
        className="d-flex flex-column align-items-center text-secondary bg-transparent border-0 px-2 py-0"
      >
        <span className="position-relative d-flex">
          <BellFill size={20} />
          {unreadCount > 0 && (
            <Badge
              bg="danger"
              pill
              className="position-absolute top-0 start-100 translate-middle"
              style={{ fontSize: "0.6rem" }}
            >
              {unreadCount}
            </Badge>
          )}
        </span>
        <span className="d-none d-lg-inline small">
          {copy.notifications.label}
        </span>
      </Dropdown.Toggle>

      <Dropdown.Menu style={{ minWidth: 300 }}>
        <Dropdown.Header>{copy.notifications.label}</Dropdown.Header>
        {notifications.length === 0 && (
          <Dropdown.ItemText className="text-muted small">
            {copy.notifications.empty}
          </Dropdown.ItemText>
        )}
        {notifications.map((notification) => (
          <Dropdown.Item
            key={notification.id}
            className={`notification-item d-flex align-items-start gap-2 ${
              notification.read ? "" : "fw-semibold bg-primary bg-opacity-10"
            }`}
            onClick={() => handleRemove(notification.id)}
          >
            {!notification.read && (
              <span
                className="rounded-circle bg-primary flex-shrink-0 mt-1"
                style={{ width: 8, height: 8 }}
              />
            )}
            <div>
              <div className="text-wrap">{notification.message}</div>
              <small className="text-muted">{notification.time}</small>
            </div>
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
}

export default NotificationBell;
