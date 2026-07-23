import { Button, Modal } from "react-bootstrap";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { setBrandTheme } from "./themeSlice";
import { brandThemes, themeConfigs } from "./themeConfig";
import type { BrandTheme } from "./themeConfig";

type ThemePickerProps = {
  show: boolean;
  onClose: () => void;
};

function ThemePicker({ show, onClose }: ThemePickerProps) {
  const dispatch = useAppDispatch();
  const current = useAppSelector((state) => state.theme.brandTheme);

  const handleSelect = (theme: BrandTheme) => {
    dispatch(setBrandTheme(theme));
    onClose();
  };

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title className="h6">
          Hai trovato l'easter egg! Scegli la tua identità segreta
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="d-flex flex-column gap-2">
          {brandThemes.map((key) => {
            const config = themeConfigs[key];
            const Logo = config.logo;
            return (
              <Button
                key={key}
                variant={current === key ? "primary" : "outline-secondary"}
                className="d-flex align-items-center gap-2 text-start"
                onClick={() => handleSelect(key)}
              >
                <span
                  className="rounded-circle d-flex align-items-center justify-content-center text-white flex-shrink-0"
                  style={{
                    width: 28,
                    height: 28,
                    backgroundColor: config.swatch,
                  }}
                >
                  <Logo size={16} />
                </span>
                {config.label}
              </Button>
            );
          })}
        </div>
      </Modal.Body>
    </Modal>
  );
}

export default ThemePicker;
