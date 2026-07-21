import { InfoCircle } from "react-bootstrap-icons";

export type NewsItem = {
  title: string;
  meta: string;
};

const defaultNews: NewsItem[] = [
  { title: "Titolo notizia di esempio 1", meta: "3h fa · 120 lettori" },
  { title: "Titolo notizia di esempio 2", meta: "5h fa · 87 lettori" },
  { title: "Titolo notizia di esempio 3", meta: "1g fa · 340 lettori" },
];

type NewsPlaceholderProps = {
  news?: NewsItem[];
};

function NewsPlaceholder({ news = defaultNews }: NewsPlaceholderProps) {
  return (
    <div className="bg-white rounded-2 border p-3">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <span className="fw-bold small">LinkedIn Notizie</span>
        <InfoCircle size={14} className="text-secondary" />
      </div>

      <ul className="list-unstyled mb-0">
        {news.map((item) => (
          <li key={item.title} className="mb-2">
            <div className="small">{item.title}</div>
            <div className="text-secondary" style={{ fontSize: "0.75rem" }}>
              {item.meta}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default NewsPlaceholder;
